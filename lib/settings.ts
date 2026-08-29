import { eq } from "drizzle-orm";
import { settings } from "@/drizzle/schema";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import {
  DEFAULT_DONATION_MESSAGE,
  DEFAULT_MAX_DEDICATION_LENGTH,
  DEFAULT_RETENTION_DAYS,
  DEFAULT_SHOW_DURATION_MINUTES,
  DEFAULT_SHOW_NAME,
  DEFAULT_SHOW_TIME,
  DEFAULT_TIMEZONE,
  DEFAULT_WHATSAPP_TEMPLATE,
} from "@/lib/constants";
import { getPaypalDonationUrl } from "@/lib/paypal";

export type AppSettings = {
  showName: string;
  tiktokUrl: string;
  paypalDonationUrl: string;
  showTime: string;
  timezone: string;
  showDurationMinutes: number;
  whatsappMessageTemplate: string;
  maxDedicationLength: number;
  donationMessage: string;
  retentionDays: number;
  showStatusOverride: "auto" | "live" | "off";
};

export function envSettings(): AppSettings {
  return {
    showName: DEFAULT_SHOW_NAME,
    tiktokUrl: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://www.tiktok.com",
    paypalDonationUrl: getPaypalDonationUrl(),
    showTime: DEFAULT_SHOW_TIME,
    timezone: DEFAULT_TIMEZONE,
    showDurationMinutes: DEFAULT_SHOW_DURATION_MINUTES,
    whatsappMessageTemplate: DEFAULT_WHATSAPP_TEMPLATE,
    maxDedicationLength: DEFAULT_MAX_DEDICATION_LENGTH,
    donationMessage: DEFAULT_DONATION_MESSAGE,
    retentionDays: DEFAULT_RETENTION_DAYS,
    showStatusOverride: "auto",
  };
}

function normalizeOverride(value: string | null | undefined): AppSettings["showStatusOverride"] {
  if (value === "live" || value === "off" || value === "auto") return value;
  return "auto";
}

function localizeStoredCopy(
  value: string | null | undefined,
  fallback: string,
  keepEmpty = false
) {
  if (value == null) return fallback;
  if (!value.trim()) return keepEmpty ? value : fallback;
  if (
    /if you enjoyed|optional donation|we'd love to surprise|we'll be live saturday|hey! ❤️ this is/i.test(
      value
    )
  ) {
    return fallback;
  }
  return value;
}

export async function getSettings(): Promise<AppSettings> {
  const fallback = envSettings();
  if (!isDatabaseConfigured()) return fallback;

  try {
    const db = getDb();
    const [row] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
    if (!row) return fallback;

    return {
      showName: row.showName || fallback.showName,
      tiktokUrl: row.tiktokUrl || fallback.tiktokUrl,
      paypalDonationUrl: getPaypalDonationUrl(row.paypalDonationUrl),
      showTime: row.showTime || fallback.showTime,
      timezone: row.timezone || fallback.timezone,
      showDurationMinutes: row.showDurationMinutes || fallback.showDurationMinutes,
      whatsappMessageTemplate: localizeStoredCopy(
        row.whatsappMessageTemplate,
        fallback.whatsappMessageTemplate,
        true
      ),
      maxDedicationLength: row.maxDedicationLength || fallback.maxDedicationLength,
      donationMessage: localizeStoredCopy(row.donationMessage, fallback.donationMessage),
      retentionDays: row.retentionDays || fallback.retentionDays,
      showStatusOverride: normalizeOverride(row.showStatusOverride),
    };
  } catch {
    return fallback;
  }
}

export function toPublicSettings(settingsValue: AppSettings) {
  return {
    showName: settingsValue.showName,
    tiktokUrl: settingsValue.tiktokUrl,
    showTime: settingsValue.showTime,
    timezone: settingsValue.timezone,
    showDurationMinutes: settingsValue.showDurationMinutes,
    maxDedicationLength: settingsValue.maxDedicationLength,
    donationMessage: settingsValue.donationMessage,
    showStatusOverride: settingsValue.showStatusOverride,
  };
}

export type PublicSettings = ReturnType<typeof toPublicSettings>;
