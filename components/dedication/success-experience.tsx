"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, Heart } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { recordDonationIntent } from "@/app/actions/dedications";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function SuccessExperience({
  publicId,
  donationMessage,
  tiktokUrl,
}: {
  publicId: string;
  donationMessage: string;
  tiktokUrl: string;
}) {
  const [phase, setPhase] = useState<"success" | "done">("success");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (publicId.startsWith("DED-") && publicId !== "DED-XXXXX") {
      void recordDonationIntent(publicId, "OFFERED");
    }
  }, [publicId]);

  async function copyId() {
    await navigator.clipboard.writeText(publicId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  if (phase === "done") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Heart className="mx-auto size-10 text-primary" />
        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">
          À samedi ❤️
        </h1>
        <p className="mt-3 text-muted-foreground">
          Garde un œil sur le live. Ta dédicace pourrait être la prochaine surprise.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("tiktok_cta_clicked")}
            className={cn(buttonVariants(), "h-12 px-6")}
          >
            Nous voir en live
          </a>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "h-12 px-6")}>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary glow-pink">
        <Check className="size-8" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">
        Ta dédicace est en route. ❤️
        </h1>
        <p className="mt-4 text-muted-foreground">
          On a bien reçu ton message. Garde un œil sur notre live TikTok du samedi —
          ta dédicace pourrait être la prochaine surprise.
        </p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Identifiant de dédicace
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <p className="font-mono text-xl tracking-wide">{publicId}</p>
          <Button variant="ghost" size="icon" onClick={copyId} aria-label="Copier l'identifiant">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Garde cet identifiant précieusement.</p>
        {publicId !== "DED-XXXXX" ? (
          <Link
            href={`/dedication/${publicId}`}
            className="mt-3 inline-block text-sm text-primary hover:underline"
          >
            Voir la confirmation
          </Link>
        ) : null}
      </div>

      <div className="mt-10 rounded-[2rem] border border-primary/20 bg-primary/10 px-6 py-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Envie de soutenir l&apos;émission ? ❤️
        </h2>
        <p className="mt-3 text-muted-foreground">{donationMessage}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Entièrement optionnel. Ta dédicace est déjà enregistrée.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href="https://zellepay.com/qr/8036ce78-68f7-43c3-8833-2a40e4f93798"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track("donation_cta_clicked");
              void recordDonationIntent(publicId, "PENDING");
            }}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-[#6D1ED4] px-6 font-semibold text-white"
          >
            Soutenir l&apos;émission
          </a>
          <Button variant="ghost" className="h-12" onClick={() => setPhase("done")}>
            Plus tard
          </Button>
        </div>
      </div>
    </div>
  );
}
