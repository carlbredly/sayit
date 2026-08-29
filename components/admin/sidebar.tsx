"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clapperboard,
  Heart,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  const items = NAV;

  return (
    <div className="border-b border-border lg:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <p className="font-display font-semibold">{showName}</p>
        <form action={logoutAction}>
          <Button variant="ghost" size="sm" type="submit">
            Déconnexion
          </Button>
        </form>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
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
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs",
                active ? "bg-primary/15 text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
