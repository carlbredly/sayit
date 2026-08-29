import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Countdown, ShowStatusBadge } from "@/components/live/countdown";
import { FadeIn } from "@/components/motion";
import { HowItWorks } from "@/components/home/how-it-works";
import { PrimaryCta } from "@/components/home/primary-cta";
import { DedicationCard } from "@/components/dedication/dedication-card";
import { TrackedExternalLink } from "@/components/analytics/tracked-link";
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
                Chaque samedi · {timeLabel}
              </p>
              <h1 className="mt-4 max-w-xl text-balance font-display text-4xl font-semibold tracking-tight sm:text-6xl">
                Say It.
                <br className="md:hidden" />{" "}
                On le lira en live.{" "}
                <span className="text-primary glow-text">❤️</span>
              </h1>
              <p className="mt-5 w-[80%] max-w-lg text-lg text-muted-foreground">
                Envoie une dédicace à quelqu&apos;un de spécial et on la surprendra
                pendant notre live TikTok du samedi.
              </p>
              <div className="mt-8 flex w-[80%] max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center md:w-auto md:max-w-none md:justify-start">
                <PrimaryCta href="/dedicate">Envoyer une dédicace</PrimaryCta>
                <Link
                  href="/live"
                  className={cn(buttonVariants({ variant: "outline" }), "h-12 w-full px-6 text-base sm:w-auto")}
                >
                  Nous voir en live
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
            <h2 className="font-display text-3xl font-semibold">Prêt à le dire ?</h2>
            <p className="mt-3 text-muted-foreground">
              Dis-nous pour qui c&apos;est. On s&apos;occupe du reste.
            </p>
            <Link href="/dedicate" className={cn(buttonVariants(), "mt-6 h-12 px-8")}>
              Envoyer une dédicace
            </Link>
          </FadeIn>
        </section>

        <section id="schedule" className="px-4 py-16 sm:px-6">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <ShowStatusBadge
              timezone={settings.timezone}
              showTime={settings.showTime}
              durationMinutes={settings.showDurationMinutes}
              override={settings.showStatusOverride}
            />
            <h2 className="mt-4 font-display text-3xl font-semibold">Horaires du live</h2>
            <p className="mt-3 text-muted-foreground">
              Chaque samedi · {timeLabel}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              On passe en live sur TikTok. Envoie une dédicace avant le show — on
              pourrait surprendre quelqu&apos;un que tu aimes.
            </p>
          </FadeIn>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-semibold">Pourquoi envoyer une dédicace</h2>
            <ul className="mt-6 space-y-4 text-muted-foreground">
              <li>Parce que certains mots pèsent plus fort quand ils sont dits à voix haute.</li>
              <li>Parce qu&apos;une surprise en live, ce n&apos;est pas un simple texto.</li>
              <li>Parce que tu peux rester anonyme — ou leur dire que c&apos;était toi.</li>
            </ul>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-xl">
            <h2 className="mb-6 text-center font-display text-3xl font-semibold">
              Exemple de dédicace
            </h2>
            <DedicationCard
              from={featured?.from || "Anonyme"}
              to={featured?.to || "Sarah"}
              message={
                featured?.message ||
                "Tu comptes plus pour moi que les mots ne peuvent le dire. J'avais juste besoin que tu l'entendes."
              }
            />
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 text-center">
            <h2 className="font-display text-3xl font-semibold">Rejoins-nous EN LIVE ❤️</h2>
            <p className="mt-3 text-muted-foreground">
              Chaque samedi · {timeLabel}
            </p>
            <TrackedExternalLink
              href={settings.tiktokUrl}
              event="tiktok_cta_clicked"
              className={cn(buttonVariants(), "mt-6 h-12 px-8")}
            >
              Nous voir en live sur TikTok
            </TrackedExternalLink>
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
                Voir toutes les questions
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
