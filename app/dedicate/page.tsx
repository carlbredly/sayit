import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DedicationForm } from "@/components/dedication/dedication-form";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Envoyer une dédicace",
  description: "Dis-nous pour qui c'est. On la lira en live.",
  alternates: { canonical: "/dedicate" },
};

export default async function DedicatePage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader showName={settings.showName} />
      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-16">
        <DedicationForm
          maxLength={settings.maxDedicationLength}
          turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        />
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
