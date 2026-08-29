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
  Received: "We've got your message. Keep an eye on Saturday's TikTok Live.",
  Selected: "This dedication was chosen for the show.",
  Contacted: "The recipient has been reached for the live surprise.",
  "Read live": "This dedication was read during the live.",
  Completed: "This dedication was featured on the live.",
  "Not featured": "This one didn't make the live. Thank you for sending it.",
  Archived: "This dedication has been archived.",
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
    title: valid ? `Dedication ${publicId}` : "Dedication",
    description: "Confirmation for your dedication.",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
    openGraph: {
      title: valid ? `Dedication ${publicId}` : "Dedication",
      description: "Confirmation for your dedication.",
    },
    twitter: {
      card: "summary",
      title: valid ? `Dedication ${publicId}` : "Dedication",
      description: "Confirmation for your dedication.",
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
        <p className="text-sm text-muted-foreground">Your dedication</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Dedication {dedication.publicId}
        </h1>

        <div className="mt-8 rounded-2xl border border-border bg-card px-5 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Status</p>
          <p className="mt-2 font-display text-2xl font-semibold">{dedication.status}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {STATUS_COPY[dedication.status] || "We've received your message."}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Submitted {formatDateTime(dedication.submittedAt, settings.timezone)}
          </p>
        </div>

        <div className="mt-8">
          <DedicationCard from={dedication.from} to={dedication.to} message={dedication.message} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/live" className={cn(buttonVariants(), "h-11")}>
            Watch the live
          </Link>
          <Link href="/dedicate" className={cn(buttonVariants({ variant: "outline" }), "h-11")}>
            Send another
          </Link>
        </div>
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
