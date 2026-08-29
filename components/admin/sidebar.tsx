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
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dedications", label: "Dedications", icon: Heart },
  { href: "/admin/live", label: "Live Queue", icon: ListOrdered },
  { href: "/admin/live/mode", label: "Live Mode", icon: Clapperboard },
  { href: "/admin/donations", label: "Donations", icon: Wallet },
  { href: "/admin/users", label: "Users", icon: Users, ownerOnly: true },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({
  showName,
  isOwner = false,
}: {
  showName: string;
  isOwner?: boolean;
}) {
  const pathname = usePathname();
  const items = NAV.filter((item) => !item.ownerOnly || isOwner);

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
          Logout
        </Button>
      </form>
    </aside>
  );
}

export function AdminMobileNav({
  showName,
  isOwner = false,
}: {
  showName: string;
  isOwner?: boolean;
}) {
  const pathname = usePathname();
  const items = NAV.filter((item) => !item.ownerOnly || isOwner);

  return (
    <div className="border-b border-border lg:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <p className="font-display font-semibold">{showName}</p>
        <form action={logoutAction}>
          <Button variant="ghost" size="sm" type="submit">
            Logout
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
