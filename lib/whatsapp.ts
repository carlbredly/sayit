import { parsePhoneNumberFromString } from "libphonenumber-js";

export function normalizeWhatsApp(countryDial: string, nationalNumber: string) {
  const digits = nationalNumber.replace(/[^\d]/g, "");
  const dial = countryDial.replace(/[^\d]/g, "");
  return parsePhoneNumberFromString(`+${dial}${digits}`);
}

export function validateWhatsApp(countryDial: string, nationalNumber: string) {
  const parsed = normalizeWhatsApp(countryDial, nationalNumber);
  if (!parsed || !parsed.isValid()) {
    return { ok: false as const, error: "Invalid WhatsApp number." };
  }
  return { ok: true as const, e164: parsed.number };
}

export function toWhatsAppLink(e164: string, message: string) {
  const digits = e164.replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}

export function fillWhatsAppTemplate(template: string, showName: string) {
  return template.replaceAll("{showName}", showName);
}
