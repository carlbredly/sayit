export const DEDICATION_STATUSES = [
  "NEW",
  "APPROVED",
  "CONTACTED",
  "READ_LIVE",
  "COMPLETED",
  "REJECTED",
  "ARCHIVED",
] as const;

export type DedicationStatus = (typeof DEDICATION_STATUSES)[number];

export const DONATION_STATUSES = [
  "NOT_OFFERED",
  "OFFERED",
  "PENDING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
] as const;

export type DonationStatus = (typeof DONATION_STATUSES)[number];

export const PUBLIC_STATUS_LABEL: Record<DedicationStatus, string> = {
  NEW: "Received",
  APPROVED: "Selected",
  CONTACTED: "Contacted",
  READ_LIVE: "Read live",
  COMPLETED: "Completed",
  REJECTED: "Not featured",
  ARCHIVED: "Archived",
};

export const ADMIN_STATUS_LABEL: Record<DedicationStatus, string> = {
  NEW: "New",
  APPROVED: "Approved",
  CONTACTED: "Contacted",
  READ_LIVE: "Read live",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
};

export const DEFAULT_SHOW_NAME = "Say It";
export const DEFAULT_TIMEZONE = "America/New_York";
export const DEFAULT_SHOW_TIME = "10:00";
export const DEFAULT_SHOW_DURATION_MINUTES = 90;
export const DEFAULT_MAX_DEDICATION_LENGTH = 1000;
export const DEFAULT_RETENTION_DAYS = 90;

export const DEFAULT_WHATSAPP_TEMPLATE = `Hi! ❤️ This is {showName}.

Someone has sent you a special dedication and we'd love to surprise you during our TikTok Live.

We'll be going live Saturday at 10:00 AM New York time.`;

export const DEFAULT_DONATION_MESSAGE =
  "If you enjoyed sending this special message, you can support the show with an optional donation.";

export const DEFAULT_DONATION_URL =
  "https://zellepay.com/qr/8036ce78-68f7-43c3-8833-2a40e4f93798";

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MINUTES = 60;
