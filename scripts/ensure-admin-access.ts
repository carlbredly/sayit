import { config } from "dotenv";

console.log("Applying admin access columns...");

config({ path: ".env" });
config({ path: ".env.local", override: true });

import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is missing in .env.local");
  }

  const sql = neon(url);

  await sql`
    ALTER TABLE admins
    ADD COLUMN IF NOT EXISTS is_owner boolean NOT NULL DEFAULT false
  `;
  await sql`
    ALTER TABLE admins
    ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true
  `;

  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  if (email) {
    await sql`
      UPDATE admins
      SET is_owner = true, is_active = true
      WHERE lower(email) = ${email}
    `;
  }

  const owners = await sql`
    SELECT id FROM admins WHERE is_owner = true LIMIT 1
  `;
  if (owners.length === 0) {
    await sql`
      UPDATE admins
      SET is_owner = true, is_active = true
      WHERE id = (SELECT id FROM admins ORDER BY created_at ASC LIMIT 1)
    `;
  }

  const rows = await sql`
    SELECT email, is_owner, is_active FROM admins ORDER BY created_at ASC
  `;
  console.log("Admin access columns ready.");
  console.log(rows);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
