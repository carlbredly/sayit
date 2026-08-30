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
      label: "Total des dédicaces",
      value: stats.total,
      icon: BookCheck,
      iconClass: "bg-success/15 text-success shadow-[0_0_18px_rgba(34,197,94,0.35)]",
    },
    {
      label: "Nouvelles",
      value: stats.newCount,
      icon: Clock3,
      iconClass: "bg-secondary/15 text-secondary shadow-[0_0_18px_rgba(139,92,246,0.35)]",
    },
    {
      label: "Contactés",
      value: stats.contacted,
      icon: Phone,
      iconClass: "bg-success/15 text-success shadow-[0_0_18px_rgba(34,197,94,0.35)]",
    },
    {
      label: "Lues en live",
      value: stats.readLive,
      icon: Mic,
      iconClass: "bg-secondary/15 text-secondary shadow-[0_0_18px_rgba(139,92,246,0.35)]",
    },
    {
      label: "Dons",
      value: `$${Number(stats.donations).toLocaleString("fr-FR", { maximumFractionDigits: 0 })}`,
      icon: Heart,
      iconClass: "bg-primary/15 text-primary shadow-[0_0_18px_rgba(255,59,129,0.4)]",
    },
    {
      label: "File du jour",
      value: stats.queue,
      icon: ClipboardCheck,
      iconClass: "bg-amber-500/15 text-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.35)]",
    },
  ];

  return (
    <div className="min-w-0 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">L&apos;émission du samedi en un coup d&apos;œil.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className="flex min-h-[5.5rem] min-w-0 items-start justify-between gap-2 rounded-2xl border border-border bg-card p-3 sm:min-h-[6.75rem] sm:p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-[11px] text-muted-foreground sm:text-sm">{card.label}</p>
                <p className="mt-1.5 font-display text-xl font-semibold tabular-nums tracking-tight sm:mt-2 sm:text-2xl xl:text-3xl">
                  {card.value}
                </p>
              </div>
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full sm:size-9 xl:size-11",
                  card.iconClass
                )}
              >
                <card.icon className="size-3.5 sm:size-4 xl:size-5" />
              </div>
            </div>
          ))}
      </div>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Dédicaces récentes</h2>
          <Link href="/admin/dedications" className="text-sm text-primary hover:underline">
            Tout voir
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            Pas encore de dédicaces ❤️
          </p>
        ) : (
          <div className="space-y-2 md:hidden">
            {recent.slice(0, 8).map((row) => (
              <Link
                key={row.id}
                href={`/admin/dedications/${row.id}`}
                className="block rounded-2xl border border-border bg-card p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium">{row.recipientName}</p>
                  <StatusBadge status={row.status as DedicationStatus} />
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {row.isAnonymous ? "Anonyme" : row.senderName}
                </p>
              </Link>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-2xl border border-border md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 font-medium">Statut</th>
                  <th className="px-3 py-3 font-medium">Expéditeur</th>
                  <th className="px-3 py-3 font-medium">Destinataire</th>
                  <th className="px-3 py-3 font-medium">Envoyée</th>
                </tr>
              </thead>
              <tbody>
                {recent.slice(0, 8).map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="px-3 py-3">
                      <StatusBadge status={row.status as DedicationStatus} />
                    </td>
                    <td className="px-3 py-3">
                      {row.isAnonymous ? "Anonyme" : row.senderName}
                    </td>
                    <td className="px-3 py-3">
                      <Link href={`/admin/dedications/${row.id}`} className="hover:text-primary">
                        {row.recipientName}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
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
