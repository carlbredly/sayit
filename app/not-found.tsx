import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-4xl font-semibold">Cette page n&apos;existe pas.</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        La dédicace que tu cherches a peut-être été déplacée, ou le lien est incomplet.
      </p>
      <Link href="/" className={cn(buttonVariants(), "mt-8 h-12 px-6")}>
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
