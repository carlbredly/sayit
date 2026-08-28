"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SerializedDedication } from "@/lib/serialize";
import type { DedicationStatus, DonationStatus } from "@/lib/constants";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/timezone";
import { toWhatsAppLink, fillWhatsAppTemplate } from "@/lib/whatsapp";
import {
  completeDedication,
  deleteDedication,
  markContacted,
  markReadLive,
  rejectDedication,
  setFeatured,
  updateAdminNotes,
  updateDedicationStatus,
  updateDonation,
} from "@/app/actions/admin";

export function DedicationDetail({
  dedication,
  showName,
  whatsappTemplate,
}: {
  dedication: SerializedDedication;
  showName: string;
  whatsappTemplate: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(dedication.adminNotes || "");
  const [amount, setAmount] = useState(dedication.donationAmount || "");
  const [pending, start] = useTransition();

  const message = fillWhatsAppTemplate(whatsappTemplate, showName);
  const wa = toWhatsAppLink(dedication.recipientWhatsapp, message);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <article className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-sm text-muted-foreground">{dedication.publicId}</p>
          <StatusBadge status={dedication.status as DedicationStatus} />
        </div>
        <dl className="mt-6 space-y-5">
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Sender</dt>
            <dd className="mt-1 text-lg">
              {dedication.isAnonymous ? "Anonymous" : dedication.senderName}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recipient</dt>
            <dd className="mt-1 font-serif text-3xl italic text-primary">
              {dedication.recipientName}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">WhatsApp</dt>
            <dd className="mt-1 font-mono">{dedication.recipientWhatsapp}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Dedication</dt>
            <dd className="mt-2 whitespace-pre-wrap text-lg leading-relaxed">
              {dedication.dedicationMessage}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Submitted</dt>
            <dd className="mt-1">{formatDateTime(dedication.submittedAt)}</dd>
          </div>
        </dl>
      </article>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-medium">Actions</h2>
          <div className="mt-4 flex flex-col gap-2">
            <a href={wa} target="_blank" rel="noreferrer">
              <Button className="h-11 w-full">Contact on WhatsApp</Button>
            </a>
            <Button variant="outline" disabled={pending} onClick={() => start(() => markContacted(dedication.id))}>
              Mark Contacted
            </Button>
            <Button variant="outline" disabled={pending} onClick={() => start(() => updateDedicationStatus(dedication.id, "APPROVED"))}>
              Approve
            </Button>
            <Button variant="outline" disabled={pending} onClick={() => start(() => markReadLive(dedication.id))}>
              Mark Read Live
            </Button>
            <Button variant="outline" disabled={pending} onClick={() => start(() => completeDedication(dedication.id))}>
              Complete
            </Button>
            <Button variant="destructive" disabled={pending} onClick={() => start(() => rejectDedication(dedication.id))}>
              Reject
            </Button>
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => start(() => updateDedicationStatus(dedication.id, "ARCHIVED"))}
            >
              Archive
            </Button>
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => start(() => setFeatured(dedication.id, !dedication.featured))}
            >
              {dedication.featured ? "Unfeature" : "Feature on site"}
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-medium">Internal notes</h2>
          <Textarea className="mt-3 min-h-28" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button
            className="mt-3"
            variant="outline"
            disabled={pending}
            onClick={() => start(() => updateAdminNotes(dedication.id, notes))}
          >
            Save notes
          </Button>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-medium">Donation</h2>
          <p className="mt-1 text-sm text-muted-foreground">{dedication.donationStatus}</p>
          <Label htmlFor="amount" className="mt-4">
            Amount
          </Label>
          <Input id="amount" className="mt-2 h-10" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Button
            className="mt-3"
            variant="outline"
            disabled={pending}
            onClick={() =>
              start(() =>
                updateDonation(
                  dedication.id,
                  "COMPLETED" as DonationStatus,
                  String(amount),
                  dedication.donationTransactionId || undefined
                )
              )
            }
          >
            Mark donation completed
          </Button>
        </div>

        <Button
          variant="destructive"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await deleteDedication(dedication.id);
              router.push("/admin/dedications");
            })
          }
        >
          Delete permanently
        </Button>
      </aside>
    </div>
  );
}
