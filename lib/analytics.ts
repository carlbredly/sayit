export type AnalyticsEvent =
  | "page_view"
  | "dedication_form_started"
  | "dedication_submitted"
  | "donation_cta_clicked"
  | "tiktok_cta_clicked";

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;

  const payload = { event, ...props };
  window.dispatchEvent(new CustomEvent("sayit:analytics", { detail: payload }));

  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
}
