import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DedicationCard } from "@/components/dedication/dedication-card";
import { getSettings } from "@/lib/settings";
import { getPublicDedication } from "@/app/actions/dedications";
import { isValidPublicId } from "@/lib/public-id";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dedication status",
  robots: { index: false, follow: false },
};

export default async function DedicationPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const publicId = id.toUpperCase();
  if (!isValidPublicId(publicId)) notFound();

  const settings = await getSettings();
  const dedication = await getPublicDedication(publicId);
  if (!dedication) notFound();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader showName={settings.showName} />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-12 sm:px-6">
        <p className="text-sm text-muted-foreground">Dedication {dedication.publicId}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Status: {dedication.status}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This page never shows the recipient&apos;s WhatsApp number or private notes.
        </p>
        <div className="mt-8">
          <DedicationCard from={dedication.from} to={dedication.to} message={dedication.message} />
        </div>
        <Link href="/live" className={cn(buttonVariants({ variant: "outline" }), "mt-8 h-11")}>
          Watch the live
        </Link>
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
