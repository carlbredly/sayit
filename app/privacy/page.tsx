import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How we collect, use, and protect dedication data.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader showName={settings.showName} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Privacy</h1>
        <div className="mt-8 space-y-6 text-muted-foreground">
          <p>
            {settings.showName} is a dedication platform. We collect only what we
            need to deliver a live surprise.
          </p>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">What we collect</h2>
            <p className="mt-2">
              Sender name (optional), recipient name, recipient WhatsApp number,
              dedication message, and technical data used to prevent spam
              (hashed IP). Optional donation details if you choose to give.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Why we need a WhatsApp number
            </h2>
            <p className="mt-2">
              The host contacts the recipient during the TikTok Live. That is the
              only purpose. Recipient numbers are never shown on public pages,
              URLs, or share cards.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Who can see it</h2>
            <p className="mt-2">
              Authenticated hosts and admins can see full dedication details,
              including phone numbers and private notes. The public cannot.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Donations</h2>
            <p className="mt-2">
              Donations are optional and processed through Zelle. We do not store
              your payment details.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Retention</h2>
            <p className="mt-2">
              Dedications may be archived after the live. Admins can permanently
              delete a dedication, which also removes the recipient&apos;s contact
              information.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">Deletion requests</h2>
            <p className="mt-2">
              If you want a dedication removed, contact the host with your
              Dedication ID. We will delete the record, including sensitive
              recipient information.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
