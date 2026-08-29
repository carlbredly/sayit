"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { admins } from "@/drizzle/schema";
import { getDb } from "@/lib/db";
import { requireOwner } from "@/lib/admin-guard";
import { createAdminUserSchema } from "@/lib/validation";
import { sanitizeName } from "@/lib/sanitize";

export type PublicAdminUser = {
  id: string;
  email: string;
  name: string | null;
  isOwner: boolean;
  isActive: boolean;
  createdAt: string;
};

function toPublic(row: typeof admins.$inferSelect): PublicAdminUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    isOwner: row.isOwner,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listAdminUsers() {
  const { admin: me } = await requireOwner();
  const db = getDb();
  const rows = await db.select().from(admins).orderBy(asc(admins.createdAt));
  return { meId: me.id, users: rows.map(toPublic) };
}

export async function createAdminUser(input: unknown) {
  await requireOwner();
  const parsed = createAdminUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Vérifie le nom, l'e-mail et le mot de passe." };
  }

  const email = parsed.data.email.toLowerCase();
  const db = getDb();
  const [existing] = await db
    .select({ id: admins.id })
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);
  if (existing) {
    return { ok: false as const, error: "Cet e-mail est déjà utilisé." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await db.insert(admins).values({
    email,
    passwordHash,
    name: sanitizeName(parsed.data.name) || "Hôte",
    isOwner: false,
    isActive: true,
  });

  revalidatePath("/admin/users");
  return { ok: true as const };
}

export async function setAdminAccess(id: string, isActive: boolean) {
  const { admin: me } = await requireOwner();
  if (id === me.id) {
    return { ok: false as const, error: "Tu ne peux pas modifier ton propre accès." };
  }

  const db = getDb();
  const [target] = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
  if (!target) {
    return { ok: false as const, error: "Utilisateur introuvable." };
  }
  if (target.isOwner) {
    return { ok: false as const, error: "Le compte propriétaire ne peut pas être désactivé." };
  }

  await db
    .update(admins)
    .set({ isActive })
    .where(eq(admins.id, id));

  revalidatePath("/admin/users");
  return { ok: true as const };
}
