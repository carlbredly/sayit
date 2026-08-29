import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Conditions",
  description: "Conditions pour envoyer et diffuser des dédicaces en live.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader showName={settings.showName} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Conditions</h1>
        <div className="mt-8 space-y-6 text-muted-foreground">
          <p>
            En envoyant une dédicace à {settings.showName}, tu acceptes ces
            conditions.
          </p>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Ton message</h2>
            <p className="mt-2">
              Tu confirmes avoir le droit d&apos;envoyer ce message, et qu&apos;il n&apos;est
              ni abusif, ni illégal, ni destiné à harceler. On peut refuser toute
              dédicace à notre discrétion.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Le live</h2>
            <p className="mt-2">
              Envoyer une dédicace ne garantit pas qu&apos;elle sera lue en live.
              L&apos;horaire, l&apos;ordre et la sélection sont décidés par l&apos;hôte.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              Tu comprends qu&apos;on tentera de joindre le destinataire sur
              WhatsApp dans le cadre de la surprise en live.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Dons</h2>
            <p className="mt-2">
              Les dons optionnels soutiennent l&apos;émission. Ce n&apos;est pas un
              paiement pour une lecture garantie en live.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
