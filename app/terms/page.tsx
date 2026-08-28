import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for submitting and featuring live dedications.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader showName={settings.showName} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Terms</h1>
        <div className="mt-8 space-y-6 text-muted-foreground">
          <p>
            By submitting a dedication to {settings.showName}, you agree to these
            terms.
          </p>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Your message</h2>
            <p className="mt-2">
              You confirm you have the right to send the message and that it is
              not abusive, illegal, or intended to harass. We may reject any
              dedication at our discretion.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">The live show</h2>
            <p className="mt-2">
              Submitting a dedication does not guarantee it will be read live.
              Show time, order, and selection are decided by the host.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              You understand we will attempt to contact the recipient on
              WhatsApp for the purpose of the live surprise.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Donations</h2>
            <p className="mt-2">
              Optional donations support the show. They are not payment for a
              guaranteed live reading.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
