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
  NEW: "Reçue",
  APPROVED: "Sélectionnée",
  CONTACTED: "Contacté",
  READ_LIVE: "Lue en live",
  COMPLETED: "Terminée",
  REJECTED: "Non retenue",
  ARCHIVED: "Archivée",
};

export const ADMIN_STATUS_LABEL: Record<DedicationStatus, string> = {
  NEW: "Nouvelle",
  APPROVED: "Approuvée",
  CONTACTED: "Contacté",
  READ_LIVE: "Lue en live",
  COMPLETED: "Terminée",
  REJECTED: "Refusée",
  ARCHIVED: "Archivée",
};

export const DONATION_STATUS_LABEL: Record<DonationStatus, string> = {
  NOT_OFFERED: "Non proposée",
  OFFERED: "Proposée",
  PENDING: "En attente",
  COMPLETED: "Confirmé",
  FAILED: "Échoué",
  CANCELLED: "Annulé",
};

export const DEFAULT_SHOW_NAME = "Say It";
export const DEFAULT_TIMEZONE = "America/New_York";
export const DEFAULT_SHOW_TIME = "10:00";
export const DEFAULT_SHOW_DURATION_MINUTES = 90;
export const DEFAULT_MAX_DEDICATION_LENGTH = 1000;
export const DEFAULT_RETENTION_DAYS = 90;

export const DEFAULT_WHATSAPP_TEMPLATE = `Salut ! ❤️ Ici {showName}.

Quelqu'un t'a envoyé une dédicace et on aimerait te surprendre pendant notre live TikTok.

On sera en live samedi à 10 h, heure de New York.`;

export const DEFAULT_DONATION_MESSAGE =
  "Si tu as aimé envoyer ce message, tu peux soutenir l'émission avec un don optionnel.";

export const DEFAULT_DONATION_URL =
  "https://zellepay.com/qr/8036ce78-68f7-43c3-8833-2a40e4f93798";

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MINUTES = 60;
