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
  paypalUrl,
  donationMessage,
  tiktokUrl,
}: {
  publicId: string;
  paypalUrl: string;
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
          See you Saturday ❤️
        </h1>
        <p className="mt-3 text-muted-foreground">
          Keep an eye on the live. Your dedication could be the next surprise.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("tiktok_cta_clicked")}
            className={cn(buttonVariants(), "h-12 px-6")}
          >
            Watch Us Live
          </a>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "h-12 px-6")}>
            Back home
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
        Your dedication is on its way. ❤️
      </h1>
      <p className="mt-4 text-muted-foreground">
        We&apos;ve received your message. Keep an eye on our Saturday TikTok Live —
        your dedication could be the next surprise.
      </p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Dedication ID
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <p className="font-mono text-xl tracking-wide">{publicId}</p>
          <Button variant="ghost" size="icon" onClick={copyId} aria-label="Copy dedication ID">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Save this ID for your records.</p>
        {publicId !== "DED-XXXXX" ? (
          <Link
            href={`/dedication/${publicId}`}
            className="mt-3 inline-block text-sm text-primary hover:underline"
          >
            View confirmation
          </Link>
        ) : null}
      </div>

      <div className="mt-10 rounded-[2rem] border border-primary/20 bg-primary/10 px-6 py-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Want to support the show? ❤️
        </h2>
        <p className="mt-3 text-muted-foreground">{donationMessage}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Completely optional. Your dedication is already saved.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {paypalUrl ? (
            <a
              href={paypalUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                track("donation_cta_clicked");
                void recordDonationIntent(publicId, "PENDING");
                setPhase("done");
              }}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#6D1ED4] px-6 font-semibold text-white"
            >
              Support the Show
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">Donations aren&apos;t configured yet.</p>
          )}
          <Button variant="ghost" className="h-12" onClick={() => setPhase("done")}>
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
}
