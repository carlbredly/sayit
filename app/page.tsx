import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Countdown } from "@/components/live/countdown";
import { FadeIn } from "@/components/motion";
import { HowItWorks } from "@/components/home/how-it-works";
import { PrimaryCta } from "@/components/home/primary-cta";
import { DedicationCard } from "@/components/dedication/dedication-card";
import { buttonVariants } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getSettings } from "@/lib/settings";
import { getFeaturedDedication } from "@/app/actions/dedications";
import { formatShowTimeLabel } from "@/lib/timezone";
import { cn } from "@/lib/utils";
import { FAQ_ITEMS } from "@/lib/faq";

export default async function HomePage() {
  const settings = await getSettings();
  const featured = await getFeaturedDedication();
  const timeLabel = formatShowTimeLabel(settings.showTime, settings.timezone);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader showName={settings.showName} />
      <main className="flex-1">
        <section className="relative overflow-hidden px-4 pb-0 pt-6 sm:px-6 sm:pt-10">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-8 size-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          />
          <div className="mx-auto w-full max-w-6xl">
            <FadeIn className="flex flex-col items-center text-center md:items-start md:text-left">
              <p className="text-sm font-medium tracking-wide text-primary">
                Every Saturday · {timeLabel}
              </p>
              <h1 className="mt-4 max-w-xl text-balance font-display text-4xl font-semibold tracking-tight sm:text-6xl">
                Say It.
                <br className="md:hidden" />{" "}
                We&apos;ll Read It Live.{" "}
                <span className="text-primary glow-text">❤️</span>
              </h1>
              <p className="mt-5 w-[80%] max-w-lg text-lg text-muted-foreground">
                Send a dedication to someone special and let us surprise them
                during our Saturday TikTok Live.
              </p>
              <div className="mt-8 flex w-[80%] max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center md:w-auto md:max-w-none md:justify-start">
                <PrimaryCta href="/dedicate">Send a Dedication</PrimaryCta>
                <Link
                  href="/live"
                  className={cn(buttonVariants({ variant: "outline" }), "h-12 w-full px-6 text-base sm:w-auto")}
                >
                  Watch Us Live
                </Link>
              </div>
              <Countdown
                className="mt-8 mx-auto md:mx-0"
                timezone={settings.timezone}
                showTime={settings.showTime}
                durationMinutes={settings.showDurationMinutes}
                override={settings.showStatusOverride}
              />
            </FadeIn>
          </div>
        </section>

        <HowItWorks />

        <section className="px-4 py-8 sm:px-6">
          <FadeIn className="mx-auto max-w-4xl rounded-[2rem] border border-primary/20 bg-primary/10 px-6 py-10 text-center">
            <h2 className="font-display text-3xl font-semibold">Ready to say it?</h2>
            <p className="mt-3 text-muted-foreground">
              Tell us who it&apos;s for. We&apos;ll take it from there.
            </p>
            <Link href="/dedicate" className={cn(buttonVariants(), "mt-6 h-12 px-8")}>
              Send a Dedication
            </Link>
          </FadeIn>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold">Why send a dedication</h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                <li>Because some words feel bigger when they&apos;re said out loud.</li>
                <li>Because a surprise on live hits differently than a private text.</li>
                <li>Because you can stay anonymous — or let them know it was you.</li>
              </ul>
            </div>
            <DedicationCard
              from={featured?.from || "Anonymous"}
              to={featured?.to || "Sarah"}
              message={
                featured?.message ||
                "You mean more to me than words can explain. I just needed you to hear it."
              }
            />
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 text-center">
            <h2 className="font-display text-3xl font-semibold">Join us LIVE ❤️</h2>
            <p className="mt-3 text-muted-foreground">
              Every Saturday · {timeLabel}
            </p>
            <Link href="/live" className={cn(buttonVariants(), "mt-6 h-12 px-8")}>
              Watch Us Live
            </Link>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-3xl font-semibold">FAQ</h2>
            <Accordion className="mt-8">
              {FAQ_ITEMS.slice(0, 5).map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="py-4 text-base">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="mt-6 text-center">
              <Link href="/faq" className="text-sm text-primary hover:underline">
                See all questions
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
