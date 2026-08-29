"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { dedications } from "@/drizzle/schema";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { generatePublicId, isValidPublicId } from "@/lib/public-id";
import { getSettings } from "@/lib/settings";
import { sanitizeName, sanitizeText, isHoneypotFilled } from "@/lib/sanitize";
import { dedicationFormSchema } from "@/lib/validation";
import { getCountry } from "@/lib/countries";
import { validateWhatsApp } from "@/lib/whatsapp";
import { assertRateLimit, getClientIp, hashIp, verifyTurnstile } from "@/lib/rate-limit";
import { getNextShowStart } from "@/lib/timezone";
import { PUBLIC_STATUS_LABEL, type DedicationStatus } from "@/lib/constants";

export type CreateDedicationResult =
  | { ok: true; publicId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function createDedication(
  input: unknown
): Promise<CreateDedicationResult> {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      error: "L'émission n'accepte pas encore les dédicaces. Réessaie bientôt.",
    };
  }

  const settings = await getSettings();
  const parsed = dedicationFormSchema(settings.maxDedicationLength).safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      error: "Vérifie le formulaire et réessaie.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  if (isHoneypotFilled(data.website)) {
    return { ok: true, publicId: "DED-XXXXX" };
  }

  const headerList = await headers();
  const ip = getClientIp(headerList);
  const turnstile = await verifyTurnstile(data.turnstileToken, ip);
  if (!turnstile.ok) {
    return { ok: false, error: turnstile.error };
  }

  const limited = await assertRateLimit(`dedication:${hashIp(ip)}`);
  if (!limited.ok) {
    return { ok: false, error: limited.error };
  }

  const country = getCountry(data.countryIso);
  const phone = validateWhatsApp(country.dial, data.whatsappNational);
  if (!phone.ok) {
    return {
      ok: false,
      error: phone.error,
      fieldErrors: { whatsappNational: phone.error },
    };
  }

  const message = sanitizeText(data.message, settings.maxDedicationLength);
  const recipientName = sanitizeName(data.recipientName);
  const senderName = data.isAnonymous
    ? null
    : sanitizeName(data.senderName || "");

  if (!recipientName || !message) {
    return { ok: false, error: "Écris une dédicace." };
  }

  const liveDate = getNextShowStart(new Date(), {
    timezone: settings.timezone,
    showTime: settings.showTime,
    durationMinutes: settings.showDurationMinutes,
  });

  const db = getDb();
  let publicId = generatePublicId();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await db.insert(dedications).values({
        publicId,
        senderName,
        isAnonymous: data.isAnonymous || !senderName,
        recipientName,
        recipientWhatsapp: phone.e164,
        dedicationMessage: message,
        status: "NEW",
        donationStatus: "NOT_OFFERED",
        liveDate,
        submitterIpHash: hashIp(ip),
      });

      return { ok: true, publicId };
    } catch (error) {
      const detail = error instanceof Error ? error.message : "";
      const isCollision =
        /public_id|unique/i.test(detail);
      if (!isCollision) {
        console.error("Échec de l'enregistrement de la dédicace.");
        return {
          ok: false,
          error: "Ta dédicace n'a pas pu être envoyée. Réessaie.",
        };
      }
      publicId = generatePublicId();
    }
  }

  return {
    ok: false,
    error: "Ta dédicace n'a pas pu être envoyée. Réessaie.",
  };
}

export async function recordDonationIntent(
  publicId: string,
  intent: "OFFERED" | "PENDING"
) {
  if (!isDatabaseConfigured() || !isValidPublicId(publicId)) {
    return { ok: false as const };
  }

  const db = getDb();
  const [row] = await db
    .select({
      id: dedications.id,
      donationStatus: dedications.donationStatus,
    })
    .from(dedications)
    .where(eq(dedications.publicId, publicId.toUpperCase()))
    .limit(1);

  if (!row) return { ok: false as const };

  if (row.donationStatus === "COMPLETED" || row.donationStatus === "FAILED") {
    return { ok: true as const };
  }

  await db
    .update(dedications)
    .set({
      donationStatus: intent,
      updatedAt: new Date(),
    })
    .where(eq(dedications.id, row.id));

  revalidatePath("/admin/donations");
  revalidatePath("/admin");

  return { ok: true as const };
}

export async function getPublicDedication(publicId: string) {
  if (!isDatabaseConfigured()) return null;
  if (!isValidPublicId(publicId)) return null;

  try {
    const db = getDb();
    const [row] = await db
      .select({
        publicId: dedications.publicId,
        senderName: dedications.senderName,
        isAnonymous: dedications.isAnonymous,
        recipientName: dedications.recipientName,
        dedicationMessage: dedications.dedicationMessage,
        status: dedications.status,
        submittedAt: dedications.submittedAt,
      })
      .from(dedications)
      .where(and(eq(dedications.publicId, publicId.toUpperCase())))
      .limit(1);

    if (!row) return null;

    return {
      publicId: row.publicId,
      from: row.isAnonymous ? "Anonyme" : row.senderName || "Anonyme",
      to: row.recipientName,
      message: row.dedicationMessage,
      status: PUBLIC_STATUS_LABEL[row.status as DedicationStatus] || "Reçue",
      submittedAt: row.submittedAt.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function getFeaturedDedication() {
  if (!isDatabaseConfigured()) return null;

  try {
    const db = getDb();
    const [row] = await db
      .select({
        recipientName: dedications.recipientName,
        dedicationMessage: dedications.dedicationMessage,
        isAnonymous: dedications.isAnonymous,
        senderName: dedications.senderName,
      })
      .from(dedications)
      .where(eq(dedications.featured, true))
      .limit(1);

    if (!row) return null;

    return {
      to: row.recipientName,
      from: row.isAnonymous ? "Anonyme" : row.senderName || "Anonyme",
      message: row.dedicationMessage,
    };
  } catch {
    return null;
  }
}
