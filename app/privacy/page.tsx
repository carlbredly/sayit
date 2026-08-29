import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Comment nous collectons, utilisons et protégeons les données des dédicaces.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader showName={settings.showName} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Confidentialité</h1>
        <div className="mt-8 space-y-6 text-muted-foreground">
          <p>
            {settings.showName} est une plateforme de dédicaces. On ne collecte que ce
            qu&apos;il faut pour livrer une surprise en live.
          </p>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Ce que l&apos;on collecte</h2>
            <p className="mt-2">
              Nom de l&apos;expéditeur (optionnel), nom du destinataire, numéro WhatsApp
              du destinataire, message de dédicace, et des données techniques pour
              limiter le spam (IP hachée). Détails de don optionnels si tu choisis
              de donner.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Pourquoi un numéro WhatsApp
            </h2>
            <p className="mt-2">
              L&apos;hôte contacte le destinataire pendant le live TikTok. C&apos;est le
              seul usage. Les numéros ne sont jamais affichés sur les pages
              publiques, les URLs ou les cartes de partage.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Qui peut voir</h2>
            <p className="mt-2">
              Les hôtes et admins authentifiés voient les détails complets, y
              compris les numéros et les notes internes. Le public ne les voit pas.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Dons</h2>
            <p className="mt-2">
              Les dons sont optionnels et passent par Zelle. On ne stocke pas tes
              informations de paiement.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Conservation</h2>
            <p className="mt-2">
              Les dédicaces peuvent être archivées après le live. Les admins
              peuvent supprimer définitivement une dédicace, ce qui retire aussi
              les coordonnées du destinataire.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Demandes de suppression</h2>
            <p className="mt-2">
              Si tu veux retirer une dédicace, contacte l&apos;hôte avec ton identifiant
              de dédicace. On supprimera l&apos;enregistrement, y compris les
              informations sensibles du destinataire.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
