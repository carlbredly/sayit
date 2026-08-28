import { Heart, PencilLine, Send } from "lucide-react";
import { FadeIn } from "@/components/motion";

const STEPS = [
  {
    n: "01",
    title: "Write",
    body: "Write something from your heart.",
    icon: PencilLine,
  },
  {
    n: "02",
    title: "Send",
    body: "Tell us who it's for and their WhatsApp number.",
    icon: Send,
  },
  {
    n: "03",
    title: "Surprise",
    body: "We'll contact them and read your dedication live on TikTok.",
    icon: Heart,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden px-4 pt-12 pb-20 sm:px-6 sm:pt-10">
      <div className="relative mx-auto max-w-5xl">
        <FadeIn>
          <h2 className="flex items-center justify-center gap-3 text-center font-display text-3xl font-semibold sm:text-4xl">
            How It Works
            <Heart className="size-6 text-primary" strokeWidth={1.75} />
          </h2>
        </FadeIn>

        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute top-10 right-[16%] left-[16%] hidden h-px bg-white/10 md:block"
          />
          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map((item) => (
              <FadeIn key={item.n}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex size-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md">
                    <item.icon className="size-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="mt-6 font-display text-2xl font-semibold text-primary">{item.n}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-white/60">
                    {item.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
