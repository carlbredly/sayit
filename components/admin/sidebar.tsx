"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Clapperboard,
  Heart,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/dedications", label: "Dédicaces", icon: Heart },
  { href: "/admin/live", label: "File live", icon: ListOrdered },
  { href: "/admin/live/mode", label: "Mode live", icon: Clapperboard },
  { href: "/admin/donations", label: "Dons", icon: Wallet },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/settings", label: "Réglages", icon: Settings },
];

export function AdminSidebar({
  showName,
}: {
  showName: string;
  isOwner?: boolean;
}) {
  const pathname = usePathname();
  const items = NAV;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5 font-display font-semibold">
        <Heart className="size-4 text-primary" />
        {showName}
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction} className="border-t border-border p-3">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" type="submit">
          <LogOut className="size-4" />
          Déconnexion
        </Button>
      </form>
    </aside>
  );
}

export function AdminMobileNav({
  showName,
}: {
  showName: string;
  isOwner?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = NAV;
  const current =
    items.find((item) =>
      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
    )?.label || "Admin";

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md lg:hidden">
      <div className="flex h-14 items-center justify-between gap-3 px-3">
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">{showName}</p>
          <p className="truncate text-xs text-muted-foreground">{current}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Ouvrir le menu admin"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="bg-background p-5">
          <SheetTitle>Menu admin</SheetTitle>
          <nav className="mt-6 flex flex-col gap-1">
            {items.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form action={logoutAction} className="mt-6 border-t border-border pt-4">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" type="submit">
              <LogOut className="size-4" />
              Déconnexion
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
