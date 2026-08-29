import { asc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { admins } from "@/drizzle/schema";
import { getDb, isDatabaseConfigured } from "@/lib/db";

export async function getAdminById(id: string) {
  if (!isDatabaseConfigured()) return null;
  const db = getDb();
  const [row] = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
  return row ?? null;
}

export async function ensureOwnerExists() {
  if (!isDatabaseConfigured()) return;
  const db = getDb();
  const [owner] = await db
    .select({ id: admins.id })
    .from(admins)
    .where(eq(admins.isOwner, true))
    .limit(1);
  if (owner) return;

  const seedEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
  if (seedEmail) {
    const updated = await db
      .update(admins)
      .set({ isOwner: true, isActive: true })
      .where(eq(admins.email, seedEmail))
      .returning({ id: admins.id });
    if (updated[0]) return;
  }

  const [first] = await db
    .select({ id: admins.id })
    .from(admins)
    .orderBy(asc(admins.createdAt))
    .limit(1);
  if (first) {
    await db
      .update(admins)
      .set({ isOwner: true, isActive: true })
      .where(eq(admins.id, first.id));
  }
}

export async function requireActiveAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const admin = await getAdminById(session.user.id);
  if (!admin || !admin.isActive) {
    throw new Error("Unauthorized");
  }
  return { session, admin };
}

export async function requireOwner() {
  const result = await requireActiveAdmin();
  if (!result.admin.isOwner) {
    throw new Error("Unauthorized");
  }
  return result;
}
