import { and, inArray, lt, sql } from "drizzle-orm";
import { dedications } from "@/drizzle/schema";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { getSettings } from "@/lib/settings";

const ARCHIVABLE = ["COMPLETED", "REJECTED", "READ_LIVE"] as const;

export async function runRetentionPolicy(retentionDays?: number) {
  if (!isDatabaseConfigured()) {
    return { ok: false as const, error: "Database is not configured.", archived: 0 };
  }

  const settings = await getSettings();
  const days = retentionDays ?? settings.retentionDays;
  const cutoff = new Date(Date.now() - days * 86_400_000);
  const db = getDb();

  const archived = await db
    .update(dedications)
    .set({
      status: "ARCHIVED",
      updatedAt: new Date(),
    })
    .where(
      and(
        lt(dedications.submittedAt, cutoff),
        inArray(dedications.status, [...ARCHIVABLE])
      )
    )
    .returning({ id: dedications.id });

  return { ok: true as const, archived: archived.length };
}

export async function countExpiringDedications() {
  if (!isDatabaseConfigured()) return 0;
  const settings = await getSettings();
  const cutoff = new Date(Date.now() - settings.retentionDays * 86_400_000);
  const db = getDb();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(dedications)
    .where(
      and(
        lt(dedications.submittedAt, cutoff),
        inArray(dedications.status, [...ARCHIVABLE])
      )
    );
  return row?.count ?? 0;
}
