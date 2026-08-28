import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-4xl font-semibold">This page isn&apos;t here.</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The dedication you&apos;re looking for may have moved, or the link is incomplete.
      </p>
      <Link href="/" className={cn(buttonVariants(), "mt-8 h-12 px-6")}>
        Back home
      </Link>
    </div>
  );
}
