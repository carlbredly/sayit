import { Heart } from "lucide-react";

export function DedicationCard({
  from,
  to,
  message,
}: {
  from: string;
  to: string;
  message: string;
}) {
  return (
    <article className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.04] p-7 backdrop-blur-xl sm:p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-secondary/20 blur-3xl"
      />
      <Heart
        aria-hidden
        className="absolute top-6 right-6 size-5 text-primary/80"
        strokeWidth={1.5}
      />

      <div className="relative grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
            De
          </p>
          <p className="mt-1.5 font-display text-lg font-medium text-white">{from}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
            Pour
          </p>
          <p className="mt-1.5 font-serif text-2xl italic text-primary">{to}</p>
        </div>
      </div>

      <div className="relative my-6 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />

      <p className="relative text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
        Dédicace
      </p>
      <blockquote className="relative mt-3 font-serif text-xl leading-relaxed text-white/90 sm:text-[1.35rem]">
        <span aria-hidden className="mr-1 text-3xl leading-none text-primary/70">
          “
        </span>
        <span className="whitespace-pre-wrap">{message}</span>
        <span aria-hidden className="ml-1 text-3xl leading-none text-primary/70">
          ”
        </span>
      </blockquote>
    </article>
  );
}
