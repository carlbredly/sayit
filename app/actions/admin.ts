"use server";

import { revalidatePath } from "next/cache";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { dedications, settings } from "@/drizzle/schema";
import { getDb } from "@/lib/db";
import {
  DEDICATION_STATUSES,
  DONATION_STATUSES,
  type DedicationStatus,
  type DonationStatus,
} from "@/lib/constants";
import { sanitizeText } from "@/lib/sanitize";
import { settingsSchema } from "@/lib/validation";
import { getSettings } from "@/lib/settings";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getAdminStats() {
  await requireAdmin();
  const db = getDb();

  const [counts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      newCount: sql<number>`count(*) filter (where ${dedications.status} = 'NEW')::int`,
      contacted: sql<number>`count(*) filter (where ${dedications.status} = 'CONTACTED')::int`,
      readLive: sql<number>`count(*) filter (where ${dedications.status} in ('READ_LIVE', 'COMPLETED'))::int`,
      donations: sql<number>`coalesce(sum(${dedications.donationAmount}) filter (where ${dedications.donationStatus} = 'COMPLETED'), 0)`,
      queue: sql<number>`count(*) filter (where ${dedications.status} in ('APPROVED', 'CONTACTED') and ${dedications.queueOrder} is not null)::int`,
    })
    .from(dedications);

  return {
    total: counts?.total ?? 0,
    newCount: counts?.newCount ?? 0,
    contacted: counts?.contacted ?? 0,
    readLive: counts?.readLive ?? 0,
    donations: Number(counts?.donations ?? 0),
    queue: counts?.queue ?? 0,
  };
}

export type DedicationFilters = {
  q?: string;
  status?: string;
  donation?: string;
  from?: string;
  to?: string;
  liveDate?: string;
};

export async function getAdminDedications(filters: DedicationFilters = {}) {
  await requireAdmin();
  const db = getDb();

  const conditions = [];

  if (filters.q?.trim()) {
    const query = `%${filters.q.trim()}%`;
    conditions.push(
      or(
        ilike(dedications.publicId, query),
        ilike(dedications.senderName, query),
        ilike(dedications.recipientName, query)
      )
    );
  }

  if (
    filters.status &&
    DEDICATION_STATUSES.includes(filters.status as DedicationStatus)
  ) {
    conditions.push(eq(dedications.status, filters.status as DedicationStatus));
  }

  if (
    filters.donation &&
    DONATION_STATUSES.includes(filters.donation as DonationStatus)
  ) {
    conditions.push(
      eq(dedications.donationStatus, filters.donation as DonationStatus)
    );
  }

  if (filters.from) {
    conditions.push(sql`${dedications.submittedAt} >= ${filters.from}`);
  }
  if (filters.to) {
    conditions.push(sql`${dedications.submittedAt} < ${filters.to}::date + 1`);
  }
  if (filters.liveDate) {
    conditions.push(sql`${dedications.liveDate}::date = ${filters.liveDate}::date`);
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select()
    .from(dedications)
    .where(where)
    .orderBy(desc(dedications.submittedAt))
    .limit(200);

  return rows;
}

export async function getAdminDedication(id: string) {
  await requireAdmin();
  const db = getDb();
  const [row] = await db
    .select()
    .from(dedications)
    .where(eq(dedications.id, id))
    .limit(1);
  return row ?? null;
}

async function nextQueueOrder() {
  const db = getDb();
  const [row] = await db
    .select({
      max: sql<number>`coalesce(max(${dedications.queueOrder}), 0)::int`,
    })
    .from(dedications);
  return (row?.max ?? 0) + 1;
}

export async function updateDedicationStatus(id: string, status: DedicationStatus) {
  await requireAdmin();
  const db = getDb();
  const now = new Date();
  const patch: Partial<typeof dedications.$inferInsert> = {
    status,
    updatedAt: now,
  };

  if (status === "CONTACTED") {
    patch.contactedAt = now;
  }
  if (status === "READ_LIVE" || status === "COMPLETED") {
    patch.readAt = now;
  }
  if (status === "APPROVED") {
    const [current] = await db
      .select({ queueOrder: dedications.queueOrder })
      .from(dedications)
      .where(eq(dedications.id, id))
      .limit(1);
    if (current && current.queueOrder == null) {
      patch.queueOrder = await nextQueueOrder();
    }
  }

  await db.update(dedications).set(patch).where(eq(dedications.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/dedications");
  revalidatePath("/admin/live");
  revalidatePath(`/admin/dedications/${id}`);
}

export async function markContacted(id: string) {
  return updateDedicationStatus(id, "CONTACTED");
}

export async function markReadLive(id: string) {
  return updateDedicationStatus(id, "READ_LIVE");
}

export async function completeDedication(id: string) {
  return updateDedicationStatus(id, "COMPLETED");
}

export async function rejectDedication(id: string) {
  return updateDedicationStatus(id, "REJECTED");
}

export async function updateAdminNotes(id: string, notes: string) {
  await requireAdmin();
  const db = getDb();
  await db
    .update(dedications)
    .set({
      adminNotes: sanitizeText(notes, 2000) || null,
      updatedAt: new Date(),
    })
    .where(eq(dedications.id, id));
  revalidatePath(`/admin/dedications/${id}`);
}

export async function updateDedicationFields(
  id: string,
  fields: {
    senderName?: string;
    isAnonymous?: boolean;
    recipientName?: string;
    recipientWhatsapp?: string;
    dedicationMessage?: string;
  }
) {
  await requireAdmin();
  const db = getDb();
  await db
    .update(dedications)
    .set({
      ...fields,
      updatedAt: new Date(),
    })
    .where(eq(dedications.id, id));
  revalidatePath("/admin/dedications");
  revalidatePath(`/admin/dedications/${id}`);
}

export async function deleteDedication(id: string) {
  await requireAdmin();
  const db = getDb();
  await db.delete(dedications).where(eq(dedications.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/dedications");
  revalidatePath("/admin/live");
}

export async function getLiveQueue() {
  await requireAdmin();
  const db = getDb();
  return db
    .select()
    .from(dedications)
    .where(
      or(
        eq(dedications.status, "APPROVED"),
        eq(dedications.status, "CONTACTED")
      )
    )
    .orderBy(asc(dedications.queueOrder), asc(dedications.submittedAt));
}

export async function reorderLiveQueue(ids: string[]) {
  await requireAdmin();
  const db = getDb();
  await Promise.all(
    ids.map((id, index) =>
      db
        .update(dedications)
        .set({ queueOrder: index + 1, updatedAt: new Date() })
        .where(eq(dedications.id, id))
    )
  );
  revalidatePath("/admin/live");
}

export async function setFeatured(id: string, featured: boolean) {
  await requireAdmin();
  const db = getDb();
  if (featured) {
    await db.update(dedications).set({ featured: false });
  }
  await db
    .update(dedications)
    .set({ featured, updatedAt: new Date() })
    .where(eq(dedications.id, id));
  revalidatePath("/");
  revalidatePath("/live");
  revalidatePath(`/admin/dedications/${id}`);
}

export async function updateDonation(
  id: string,
  donationStatus: DonationStatus,
  amount?: string,
  transactionId?: string
) {
  await requireAdmin();
  const db = getDb();
  await db
    .update(dedications)
    .set({
      donationStatus,
      donationAmount: amount || null,
      donationTransactionId: transactionId || null,
      donatedAt: donationStatus === "COMPLETED" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(dedications.id, id));
  revalidatePath("/admin/donations");
  revalidatePath(`/admin/dedications/${id}`);
}

export async function getDonations() {
  await requireAdmin();
  const db = getDb();
  return db
    .select()
    .from(dedications)
    .where(
      or(
        eq(dedications.donationStatus, "COMPLETED"),
        eq(dedications.donationStatus, "PENDING"),
        eq(dedications.donationStatus, "OFFERED")
      )
    )
    .orderBy(desc(dedications.submittedAt))
    .limit(200);
}

export async function updateSettingsAction(input: unknown) {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Please check the settings and try again." };
  }

  const db = getDb();
  const data = parsed.data;
  await db
    .insert(settings)
    .values({
      id: 1,
      showName: data.showName,
      tiktokUrl: data.tiktokUrl || null,
      paypalDonationUrl: data.paypalDonationUrl || null,
      showTime: data.showTime,
      timezone: data.timezone,
      showDurationMinutes: data.showDurationMinutes,
      whatsappMessageTemplate: data.whatsappMessageTemplate,
      maxDedicationLength: data.maxDedicationLength,
      donationMessage: data.donationMessage || null,
      retentionDays: data.retentionDays,
      showStatusOverride: data.showStatusOverride,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.id,
      set: {
        showName: data.showName,
        tiktokUrl: data.tiktokUrl || null,
        paypalDonationUrl: data.paypalDonationUrl || null,
        showTime: data.showTime,
        timezone: data.timezone,
        showDurationMinutes: data.showDurationMinutes,
        whatsappMessageTemplate: data.whatsappMessageTemplate,
        maxDedicationLength: data.maxDedicationLength,
        donationMessage: data.donationMessage || null,
        retentionDays: data.retentionDays,
        showStatusOverride: data.showStatusOverride,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/");
  revalidatePath("/live");
  revalidatePath("/admin/settings");
  return { ok: true as const };
}

export async function getAdminSettings() {
  await requireAdmin();
  return getSettings();
}
