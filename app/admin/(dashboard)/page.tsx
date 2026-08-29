import {
  BookCheck,
  ClipboardCheck,
  Clock3,
  Heart,
  Mic,
  Phone,
} from "lucide-react";
import { getAdminStats, getAdminDedications } from "@/app/actions/admin";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime } from "@/lib/timezone";
import type { DedicationStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminHomePage() {
  const [stats, recent] = await Promise.all([
    getAdminStats(),
    getAdminDedications(),
  ]);

  const cards = [
    {
      label: "Total Dedications",
      value: stats.total,
      icon: BookCheck,
      iconClass: "bg-success/15 text-success shadow-[0_0_18px_rgba(34,197,94,0.35)]",
    },
    {
      label: "New",
      value: stats.newCount,
      icon: Clock3,
      iconClass: "bg-secondary/15 text-secondary shadow-[0_0_18px_rgba(139,92,246,0.35)]",
    },
    {
      label: "Contacted",
      value: stats.contacted,
      icon: Phone,
      iconClass: "bg-success/15 text-success shadow-[0_0_18px_rgba(34,197,94,0.35)]",
    },
    {
      label: "Read Live",
      value: stats.readLive,
      icon: Mic,
      iconClass: "bg-secondary/15 text-secondary shadow-[0_0_18px_rgba(139,92,246,0.35)]",
    },
    {
      label: "Donations",
      value: `$${Number(stats.donations).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      icon: Heart,
      iconClass: "bg-primary/15 text-primary shadow-[0_0_18px_rgba(255,59,129,0.4)]",
    },
    {
      label: "Today's Queue",
      value: stats.queue,
      icon: ClipboardCheck,
      iconClass: "bg-amber-500/15 text-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.35)]",
    },
  ];

  return (
    <div className="min-w-0 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Saturday show at a glance.</p>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-[64rem] gap-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="flex min-h-[6.75rem] min-w-0 flex-1 items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground sm:text-sm">{card.label}</p>
                <p className="mt-2 font-display text-2xl font-semibold tabular-nums tracking-tight xl:text-3xl">
                  {card.value}
                </p>
              </div>
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full xl:size-11",
                  card.iconClass
                )}
              >
                <card.icon className="size-4 xl:size-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent dedications</h2>
          <Link href="/admin/dedications" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            No new dedications yet ❤️
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Sender</th>
                  <th className="px-3 py-3 font-medium">Recipient</th>
                  <th className="hidden px-3 py-3 font-medium md:table-cell">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recent.slice(0, 8).map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="px-3 py-3">
                      <StatusBadge status={row.status as DedicationStatus} />
                    </td>
                    <td className="px-3 py-3">
                      {row.isAnonymous ? "Anonymous" : row.senderName}
                    </td>
                    <td className="px-3 py-3">
                      <Link href={`/admin/dedications/${row.id}`} className="hover:text-primary">
                        {row.recipientName}
                      </Link>
                    </td>
                    <td className="hidden px-3 py-3 text-muted-foreground md:table-cell">
                      {formatDateTime(row.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
