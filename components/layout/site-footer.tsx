import Link from "next/link";
import { Heart } from "lucide-react";

export function SiteFooter({
  showName,
  tiktokUrl,
}: {
  showName: string;
  tiktokUrl: string;
}) {
  return (
    <footer className="border-t border-border/80 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2 font-display font-semibold">
            <Heart className="size-4 text-primary" aria-hidden />
            {showName}
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Heartfelt dedications, read live every Saturday.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/live" className="hover:text-foreground">
            Live
          </Link>
          <Link href="/faq" className="hover:text-foreground">
            FAQ
          </Link>
          <a href={tiktokUrl} target="_blank" rel="noreferrer" className="hover:text-foreground">
            TikTok
          </a>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
