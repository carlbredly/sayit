import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DedicationCard } from "@/components/dedication/dedication-card";
import { getSettings } from "@/lib/settings";
import { getPublicDedication } from "@/app/actions/dedications";
import { isValidPublicId } from "@/lib/public-id";
import { formatDateTime } from "@/lib/timezone";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_COPY: Record<string, string> = {
  Reçue: "On a bien reçu ton message. Garde un œil sur le live TikTok du samedi.",
  Sélectionnée: "Cette dédicace a été choisie pour l'émission.",
  Contacté: "Le destinataire a été joint pour la surprise en live.",
  "Lue en live": "Cette dédicace a été lue pendant le live.",
  Terminée: "Cette dédicace a été présentée en live.",
  "Non retenue": "Celle-ci n'a pas passé au live. Merci de l'avoir envoyée.",
  Archivée: "Cette dédicace a été archivée.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ public_id: string }>;
}): Promise<Metadata> {
  const { public_id } = await params;
  const publicId = public_id.toUpperCase();
  const valid = isValidPublicId(publicId);

  return {
    title: valid ? `Dédicace ${publicId}` : "Dédicace",
    description: "Confirmation de ta dédicace.",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
    openGraph: {
      title: valid ? `Dédicace ${publicId}` : "Dédicace",
      description: "Confirmation de ta dédicace.",
    },
    twitter: {
      card: "summary",
      title: valid ? `Dédicace ${publicId}` : "Dédicace",
      description: "Confirmation de ta dédicace.",
    },
  };
}

export default async function DedicationPublicPage({
  params,
}: {
  params: Promise<{ public_id: string }>;
}) {
  const { public_id } = await params;
  const publicId = public_id.toUpperCase();
  if (!isValidPublicId(publicId)) notFound();

  const [settings, dedication] = await Promise.all([
    getSettings(),
    getPublicDedication(publicId),
  ]);
  if (!dedication) notFound();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader showName={settings.showName} />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12 sm:px-6">
        <p className="text-sm text-muted-foreground">Ta dédicace</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Dédicace {dedication.publicId}
        </h1>

        <div className="mt-8 rounded-2xl border border-border bg-card px-5 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Statut</p>
          <p className="mt-2 font-display text-2xl font-semibold">{dedication.status}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {STATUS_COPY[dedication.status] || "On a bien reçu ton message."}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Envoyée {formatDateTime(dedication.submittedAt, settings.timezone)}
          </p>
        </div>

        <div className="mt-8">
          <DedicationCard from={dedication.from} to={dedication.to} message={dedication.message} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/live" className={cn(buttonVariants(), "h-11")}>
            Voir le live
          </Link>
          <Link href="/dedicate" className={cn(buttonVariants({ variant: "outline" }), "h-11")}>
            En envoyer une autre
          </Link>
        </div>
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
