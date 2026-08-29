"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-4xl font-semibold">Un problème est survenu.</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Réessaie. Si ça continue, reviens dans un moment.
      </p>
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={reset} className={cn(buttonVariants(), "h-12 px-6")}>
          Réessayer
        </button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "h-12 px-6")}>
          Accueil
        </Link>
      </div>
    </div>
  );
}
