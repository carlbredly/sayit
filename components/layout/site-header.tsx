"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#schedule", label: "Schedule" },
  { href: "/live", label: "Live" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader({ showName }: { showName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Heart className="size-4 fill-current" aria-hidden />
          </span>
          {showName}
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dedicate"
            className={cn(buttonVariants(), "hidden h-10 px-4 md:inline-flex")}
          >
            Send a Dedication
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="bg-background">
          <SheetTitle>Menu</SheetTitle>
          <div className="mt-8 flex flex-col gap-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dedicate"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants(), "mt-4 h-12")}
            >
              Send a Dedication
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
