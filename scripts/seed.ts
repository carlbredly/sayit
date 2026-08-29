import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { admins, settings } from "../drizzle/schema";
import { DEFAULT_WHATSAPP_TEMPLATE, DEFAULT_DONATION_MESSAGE, DEFAULT_DONATION_URL } from "../lib/constants";

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required to seed the database.");
  }

  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local before seeding.");
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const db = drizzle(neon(url));
  const passwordHash = await bcrypt.hash(password, 12);

  const [existing] = await db
    .select({ id: admins.id })
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(admins)
      .set({ passwordHash, name: "Host", isOwner: true, isActive: true })
      .where(eq(admins.email, email));
    console.log(`Updated admin password for ${email}`);
  } else {
    await db.insert(admins).values({
      email,
      passwordHash,
      name: "Host",
      isOwner: true,
      isActive: true,
    });
    console.log(`Created admin ${email}`);
  }

  await db
    .insert(settings)
    .values({
      id: 1,
      showName: "Say It",
      tiktokUrl: process.env.NEXT_PUBLIC_TIKTOK_URL || null,
      paypalDonationUrl:
        process.env.PAYPAL_DONATION_URL || DEFAULT_DONATION_URL,
      showTime: "10:00",
      timezone: "America/New_York",
      showDurationMinutes: 90,
      whatsappMessageTemplate: DEFAULT_WHATSAPP_TEMPLATE,
      maxDedicationLength: 1000,
      donationMessage: DEFAULT_DONATION_MESSAGE,
      retentionDays: 90,
      showStatusOverride: "auto",
    })
    .onConflictDoNothing();

  console.log("Settings row ensured.");
  console.log("Seed complete.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
