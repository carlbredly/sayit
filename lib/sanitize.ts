export function sanitizeText(input: string, maxLength: number) {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeName(input: string, maxLength = 80) {
  return sanitizeText(input, maxLength).replace(/\s+/g, " ");
}

export function isHoneypotFilled(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}
