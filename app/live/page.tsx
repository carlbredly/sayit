import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { TrackedExternalLink } from "@/components/analytics/tracked-link";
import { HowItWorks } from "@/components/home/how-it-works";
import { Countdown } from "@/components/live/countdown";
import { DedicationCard } from "@/components/dedication/dedication-card";
import { buttonVariants } from "@/components/ui/button";
import { getSettings } from "@/lib/settings";
import { getFeaturedDedication } from "@/app/actions/dedications";
import { formatShowTimeLabel } from "@/lib/timezone";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Watch Us Live",
  description: "Join us live every Saturday for heartfelt TikTok dedications.",
  alternates: { canonical: "/live" },
};

export default async function LivePage() {
  const settings = await getSettings();
  const featured = await getFeaturedDedication();
  const timeLabel = formatShowTimeLabel(settings.showTime, settings.timezone);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader showName={settings.showName} />
      <main className="flex-1 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Join us LIVE ❤️
          </h1>
          <p className="mt-3 text-muted-foreground">
            Every Saturday · {timeLabel}
          </p>
          <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-[2rem] border border-border bg-card">
            <div className="flex aspect-video items-center justify-center bg-muted/40">
              <p className="text-sm text-muted-foreground">TikTok Live</p>
            </div>
          </div>
          <TrackedExternalLink
            href={settings.tiktokUrl}
            event="tiktok_cta_clicked"
            className={cn(buttonVariants(), "mt-8 h-12 px-8")}
          >
            Watch Us Live on TikTok
          </TrackedExternalLink>
          <div className="mx-auto mt-12 flex justify-center">
            <Countdown
              timezone={settings.timezone}
              showTime={settings.showTime}
              durationMinutes={settings.showDurationMinutes}
              override={settings.showStatusOverride}
            />
          </div>
        </div>

        <section className="mx-auto mt-16 grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold">How the show works</h2>
            <p className="mt-4 text-muted-foreground">
              Viewers send dedications. During the live, the host reaches the
              recipient on WhatsApp and reads the message out loud. A private
              feeling, said in public, in the best way.
            </p>
            <Link href="/dedicate" className={cn(buttonVariants({ variant: "outline" }), "mt-6 h-11 px-5")}>
              Send a Dedication
            </Link>
          </div>
          {featured ? (
            <div>
              <h2 className="mb-4 font-display text-2xl font-semibold">Latest featured</h2>
              <DedicationCard from={featured.from} to={featured.to} message={featured.message} />
            </div>
          ) : (
            <DedicationCard
              from="Anonymous"
              to="You"
              message="Your dedication could be next. Write it. We'll say it live."
            />
          )}
        </section>
        <HowItWorks />
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
