import { parsePhoneNumberFromString } from "libphonenumber-js";

export function normalizeWhatsApp(countryDial: string, nationalNumber: string) {
  const digits = nationalNumber.replace(/[^\d]/g, "");
  const dial = countryDial.replace(/[^\d]/g, "");
  return parsePhoneNumberFromString(`+${dial}${digits}`);
}

export function validateWhatsApp(countryDial: string, nationalNumber: string) {
  const parsed = normalizeWhatsApp(countryDial, nationalNumber);
  if (!parsed || !parsed.isValid()) {
    return { ok: false as const, error: "Numéro WhatsApp invalide." };
  }
  return { ok: true as const, e164: parsed.number };
}

export function toWhatsAppDigits(e164: string) {
  return e164.replace(/[^\d]/g, "");
}

export function toWhatsAppLink(e164: string, message?: string) {
  const digits = toWhatsAppDigits(e164);
  const base = `https://wa.me/${digits}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function fillWhatsAppTemplate(
  template: string,
  values: { showName: string; showTime?: string }
) {
  return template
    .replaceAll("{showName}", values.showName)
    .replaceAll("{showTime}", values.showTime || "10 h, heure de New York");
}
