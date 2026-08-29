import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getSettings } from "@/lib/settings";
import { FAQ_ITEMS } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Réponses sur les dédicaces, la confidentialité, le live et les dons.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader showName={settings.showName} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight">FAQ</h1>
        <p className="mt-3 text-muted-foreground">
          Réponses courtes. Si tu as encore une question, viens au live et pose-la là.
        </p>
        <Accordion className="mt-10">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="py-4 text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <SiteFooter showName={settings.showName} tiktokUrl={settings.tiktokUrl} />
    </div>
  );
}
