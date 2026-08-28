import { randomBytes } from "crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generatePublicId() {
  const bytes = randomBytes(5);
  let suffix = "";
  for (const byte of bytes) {
    suffix += ALPHABET[byte % ALPHABET.length];
  }
  return `DED-${suffix}`;
}

export function isValidPublicId(value: string) {
  return /^DED-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}$/.test(value);
}
