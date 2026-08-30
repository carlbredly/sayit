import { z } from "zod";
import { DEFAULT_MAX_DEDICATION_LENGTH } from "@/lib/constants";
import { COUNTRIES } from "@/lib/countries";

const countryIso = z
  .string()
  .refine((value) => COUNTRIES.some((c) => c.iso === value), "Choisis un pays.");

export function dedicationFormSchema(maxLength = DEFAULT_MAX_DEDICATION_LENGTH) {
  return z
    .object({
      isAnonymous: z.boolean(),
      senderName: z.string().trim().max(80).optional().or(z.literal("")),
      recipientName: z
        .string()
        .trim()
        .min(1, "Dis-nous pour qui c'est.")
        .max(80, "Ce nom est un peu trop long."),
      countryIso: countryIso,
      whatsappNational: z
        .string()
        .trim()
        .min(4, "Entre un numéro WhatsApp.")
        .max(20),
      message: z
        .string()
        .trim()
        .min(8, "Écris une dédicace.")
        .max(maxLength, `Reste sous ${maxLength} caractères.`),
      website: z.string().optional(),
      turnstileToken: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.isAnonymous && !data.senderName?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["senderName"],
          message: "Ajoute ton nom, ou reste anonyme.",
        });
      }
    });
}

export type DedicationFormInput = z.infer<ReturnType<typeof dedicationFormSchema>>;

export const adminNotesSchema = z.object({
  notes: z.string().max(2000).optional().or(z.literal("")),
});

const optionalHttpUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^https?:\/\/\S+$/i.test(value),
    "Entre une URL qui commence par http:// ou https://."
  );

export const settingsSchema = z.object({
  showName: z.string().trim().min(1, "Le nom de l'émission est requis.").max(80),
  tiktokUrl: optionalHttpUrl,
  paypalDonationUrl: optionalHttpUrl,
  showTime: z
    .string()
    .trim()
    .transform((value) => {
      const match = value.match(/^(\d{1,2}):(\d{2})/);
      if (!match) return value;
      return `${match[1].padStart(2, "0")}:${match[2]}`;
    })
    .refine((value) => /^\d{2}:\d{2}$/.test(value), "Utilise HH:MM."),
  timezone: z.string().trim().min(1).max(64),
  showDurationMinutes: z.coerce.number().int().min(15).max(480),
  whatsappMessageTemplate: z.string().max(4000),
  maxDedicationLength: z.coerce.number().int().min(80).max(4000),
  donationMessage: z.string().trim().max(1000).optional().or(z.literal("")),
  retentionDays: z.coerce.number().int().min(7).max(3650),
  showStatusOverride: z.enum(["auto", "live", "off"]),
});

export const createAdminUserSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email("Entre un e-mail valide."),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Entre un e-mail valide."),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères."),
});

export const adminDedicationEditSchema = z.object({
  senderName: z.string().trim().max(80).optional().or(z.literal("")),
  isAnonymous: z.boolean(),
  recipientName: z
    .string()
    .trim()
    .min(1, "Dis-nous pour qui c'est.")
    .max(80),
  recipientWhatsapp: z.string().trim().min(8).max(32),
  dedicationMessage: z.string().trim().min(8).max(4000),
});

export const donationUpdateSchema = z.object({
  dedicationId: z.string().uuid(),
  donationStatus: z.enum([
    "NOT_OFFERED",
    "OFFERED",
    "PENDING",
    "COMPLETED",
    "FAILED",
    "CANCELLED",
  ]),
  donationAmount: z.string().optional(),
  donationTransactionId: z.string().max(128).optional(),
});
