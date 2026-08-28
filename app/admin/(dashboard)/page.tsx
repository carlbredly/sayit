import { Heart, Megaphone, Phone, Radio, Wallet, ListOrdered } from "lucide-react";
import { getAdminStats, getAdminDedications } from "@/app/actions/admin";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime } from "@/lib/timezone";
import type { DedicationStatus } from "@/lib/constants";
import Link from "next/link";

export default async function AdminHomePage() {
  const [stats, recent] = await Promise.all([
    getAdminStats(),
    getAdminDedications(),
  ]);

  const cards = [
    { label: "Total Dedications", value: stats.total, icon: Heart },
    { label: "New", value: stats.newCount, icon: Megaphone },
    { label: "Contacted", value: stats.contacted, icon: Phone },
    { label: "Read Live", value: stats.readLive, icon: Radio },
    { label: "Donations", value: `$${stats.donations.toFixed(0)}`, icon: Wallet },
    { label: "Today's Queue", value: stats.queue, icon: ListOrdered },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Saturday show at a glance.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <card.icon className="size-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold">{card.value}</p>
          </div>
        ))}
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
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
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
