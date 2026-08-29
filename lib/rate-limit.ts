import { createHash } from "crypto";
import { and, gt, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { rateLimits } from "@/drizzle/schema";
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MINUTES } from "@/lib/constants";

export function hashIp(ip: string) {
  const secret = process.env.AUTH_SECRET || process.env.ADMIN_SECRET || "dev";
  return createHash("sha256").update(`${ip}:${secret}`).digest("hex");
}

export function getClientIp(headersList: Headers) {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return headersList.get("x-real-ip") || "unknown";
}

export async function assertRateLimit(key: string, max = RATE_LIMIT_MAX) {
  if (!isDatabaseConfigured()) {
    return { ok: true as const };
  }

  const db = getDb();
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000
  );

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(rateLimits)
    .where(and(eq(rateLimits.key, key), gt(rateLimits.createdAt, windowStart)));

  if ((row?.count ?? 0) >= max) {
    return {
      ok: false as const,
      error: "Attends un peu avant d'envoyer une autre dédicace.",
    };
  }

  await db.insert(rateLimits).values({ key });
  return { ok: true as const };
}

export async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!secret || !siteKey) {
    return { ok: true as const };
  }

  if (!token) {
    return { ok: false as const, error: "Termine la vérification." };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
    }
  );

  const data = (await res.json()) as { success?: boolean };
  if (!data.success) {
    return { ok: false as const, error: "La vérification a échoué. Réessaie." };
  }

  return { ok: true as const };
}
