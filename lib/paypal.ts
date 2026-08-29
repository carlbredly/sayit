/**
 * External donation link (Zelle QR URL by default).
 * Never mark a donation COMPLETED without a confirmed payment or an admin action.
 */
import { DEFAULT_DONATION_URL } from "@/lib/constants";

function isTikTokUrl(value: string) {
  try {
    const host = new URL(value).hostname.replace(/^www\./, "").toLowerCase();
    return host === "tiktok.com" || host.endsWith(".tiktok.com");
  } catch {
    return /tiktok\.com/i.test(value);
  }
}

export function getPaypalDonationUrl(override?: string | null) {
  const candidate = (override || process.env.PAYPAL_DONATION_URL || "").trim();
  if (candidate && !isTikTokUrl(candidate)) return candidate;
  return DEFAULT_DONATION_URL;
}
