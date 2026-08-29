"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { SerializedDedication } from "@/lib/serialize";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/timezone";
import type { DedicationStatus } from "@/lib/constants";
import {
  completeDedication,
  markContacted,
  markReadLive,
  rejectDedication,
  updateDedicationStatus,
} from "@/app/actions/admin";

export function DedicationTable({ rows }: { rows: SerializedDedication[] }) {
  const [pending, start] = useTransition();

  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
        No dedications match your filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-3 py-3 font-medium">Status</th>
            <th className="px-3 py-3 font-medium">Sender</th>
            <th className="px-3 py-3 font-medium">Recipient</th>
            <th className="px-3 py-3 font-medium">WhatsApp</th>
            <th className="px-3 py-3 font-medium">Dedication</th>
            <th className="px-3 py-3 font-medium">Submitted</th>
            <th className="px-3 py-3 font-medium">Donation</th>
            <th className="px-3 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-border align-top">
              <td className="px-3 py-3">
                <StatusBadge status={row.status as DedicationStatus} />
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{row.publicId}</p>
              </td>
              <td className="px-3 py-3">{row.isAnonymous ? "Anonymous" : row.senderName}</td>
              <td className="px-3 py-3">{row.recipientName}</td>
              <td className="px-3 py-3 font-mono text-xs">{row.recipientWhatsapp}</td>
              <td className="max-w-[220px] px-3 py-3 text-muted-foreground">
                {row.dedicationMessage.slice(0, 80)}
                {row.dedicationMessage.length > 80 ? "…" : ""}
              </td>
              <td className="px-3 py-3 text-muted-foreground">
                {formatDateTime(row.submittedAt)}
              </td>
              <td className="px-3 py-3">
                {row.donationStatus === "COMPLETED"
                  ? `$${Number(row.donationAmount || 0).toFixed(0)}`
                  : row.donationStatus}
              </td>
              <td className="px-3 py-3">
                <div className="flex flex-wrap gap-1">
                  <Link
                    href={`/admin/dedications/${row.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "xs" }))}
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/dedications/${row.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "xs" }))}
                  >
                    Edit
                  </Link>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={pending}
                    onClick={() => start(() => updateDedicationStatus(row.id, "APPROVED"))}
                  >
                    Approve
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={pending}
                    onClick={() => start(() => markContacted(row.id))}
                  >
                    Contacted
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={pending}
                    onClick={() => start(() => markReadLive(row.id))}
                  >
                    Read live
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={pending}
                    onClick={() => start(() => completeDedication(row.id))}
                  >
                    Complete
                  </Button>
                  <Button
                    size="xs"
                    variant="destructive"
                    disabled={pending}
                    onClick={() => start(() => rejectDedication(row.id))}
                  >
                    Reject
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={pending}
                    onClick={() => start(() => updateDedicationStatus(row.id, "ARCHIVED"))}
                  >
                    Archive
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
