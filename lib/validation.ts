import { z } from "zod";
import { DEFAULT_MAX_DEDICATION_LENGTH } from "@/lib/constants";
import { COUNTRIES } from "@/lib/countries";

const countryIso = z
  .string()
  .refine((value) => COUNTRIES.some((c) => c.iso === value), "Choose a country.");

export function dedicationFormSchema(maxLength = DEFAULT_MAX_DEDICATION_LENGTH) {
  return z
    .object({
      isAnonymous: z.boolean(),
      senderName: z.string().trim().max(80).optional().or(z.literal("")),
      recipientName: z
        .string()
        .trim()
        .min(1, "Tell us who it's for.")
        .max(80, "That name is a little too long."),
      countryIso: countryIso,
      whatsappNational: z
        .string()
        .trim()
        .min(4, "Enter a WhatsApp number.")
        .max(20),
      message: z
        .string()
        .trim()
        .min(8, "Please write a dedication.")
        .max(maxLength, `Keep it under ${maxLength} characters.`),
      website: z.string().optional(),
      turnstileToken: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.isAnonymous && !data.senderName?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["senderName"],
          message: "Add your name, or stay anonymous.",
        });
      }
    });
}

export type DedicationFormInput = z.infer<ReturnType<typeof dedicationFormSchema>>;

export const adminNotesSchema = z.object({
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export const settingsSchema = z.object({
  showName: z.string().trim().min(1).max(80),
  tiktokUrl: z.string().trim().url().or(z.literal("")),
  paypalDonationUrl: z.string().trim().url().or(z.literal("")),
  showTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM."),
  timezone: z.string().min(1).max(64),
  showDurationMinutes: z.coerce.number().int().min(15).max(480),
  whatsappMessageTemplate: z.string().trim().min(10).max(1000),
  maxDedicationLength: z.coerce.number().int().min(80).max(4000),
  donationMessage: z.string().trim().max(500).optional().or(z.literal("")),
  retentionDays: z.coerce.number().int().min(7).max(3650),
  showStatusOverride: z.enum(["auto", "live", "off"]),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
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
