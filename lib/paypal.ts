/**
 * External donation link (Zelle QR URL by default).
 * Never mark a donation COMPLETED without a confirmed payment or an admin action.
 */
import { DEFAULT_DONATION_URL } from "@/lib/constants";

function hostnameOf(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function isTikTokUrl(value: string) {
  const host = hostnameOf(value);
  if (host === "tiktok.com" || host.endsWith(".tiktok.com")) return true;
  return /tiktok\.com/i.test(value);
}

function isPaymentUrl(value: string) {
  if (!value) return false;
  if (isTikTokUrl(value)) return false;
  const host = hostnameOf(value);
  if (!host) return false;
  return (
    host === "zellepay.com" ||
    host.endsWith(".zellepay.com") ||
    host === "paypal.com" ||
    host.endsWith(".paypal.com") ||
    host === "paypal.me" ||
    host === "venmo.com" ||
    host === "cash.app"
  );
}

export function getPaypalDonationUrl(override?: string | null) {
  const tiktok = (process.env.NEXT_PUBLIC_TIKTOK_URL || "").trim();
  const candidates = [override, process.env.PAYPAL_DONATION_URL, DEFAULT_DONATION_URL];

  for (const raw of candidates) {
    const candidate = (raw || "").trim();
    if (!candidate) continue;
    if (tiktok && candidate === tiktok) continue;
    if (isPaymentUrl(candidate)) return candidate;
  }

  return DEFAULT_DONATION_URL;
}
