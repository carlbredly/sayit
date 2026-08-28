/**
 * External donation link (Zelle QR URL by default).
 * Never mark a donation COMPLETED without a confirmed payment or an admin action.
 */
import { DEFAULT_DONATION_URL } from "@/lib/constants";

export function getPaypalDonationUrl(override?: string | null) {
  return override || process.env.PAYPAL_DONATION_URL || DEFAULT_DONATION_URL;
}
