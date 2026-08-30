"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SerializedDedication } from "@/lib/serialize";
import type { DedicationStatus, DonationStatus } from "@/lib/constants";
import { DONATION_STATUS_LABEL } from "@/lib/constants";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/timezone";
import { fillWhatsAppTemplate } from "@/lib/whatsapp";
import { WhatsAppContactButton } from "@/components/admin/whatsapp-contact-button";
import { DedicationEditForm } from "@/components/admin/dedication-edit-form";
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

  const message = fillWhatsAppTemplate(whatsappTemplate, { showName });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <article className="rounded-3xl border border-border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-sm text-muted-foreground">{dedication.publicId}</p>
          <StatusBadge status={dedication.status as DedicationStatus} />
        </div>
        <dl className="mt-6 space-y-5">
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Expéditeur</dt>
            <dd className="mt-1 text-lg">
              {dedication.isAnonymous ? "Anonyme" : dedication.senderName}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Destinataire</dt>
            <dd className="mt-1 font-serif text-2xl italic text-primary sm:text-3xl">
              {dedication.recipientName}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">WhatsApp</dt>
            <dd className="mt-1 font-mono">{dedication.recipientWhatsapp}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Dédicace</dt>
            <dd className="mt-2 whitespace-pre-wrap text-lg leading-relaxed">
              {dedication.dedicationMessage}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Envoyée</dt>
            <dd className="mt-1">{formatDateTime(dedication.submittedAt)}</dd>
          </div>
        </dl>
      </article>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-medium">Actions</h2>
          <div className="mt-4 flex flex-col gap-2">
            <WhatsAppContactButton
              dedicationId={dedication.id}
              phone={dedication.recipientWhatsapp}
              message={message}
              alreadyContacted={
                dedication.status === "CONTACTED" || Boolean(dedication.contactedAt)
              }
            />
            <Button variant="outline" disabled={pending} onClick={() => start(() => markContacted(dedication.id))}>
              Marquer contacté
            </Button>
            <Button variant="outline" disabled={pending} onClick={() => start(() => updateDedicationStatus(dedication.id, "APPROVED"))}>
              Approuver
            </Button>
            <Button variant="outline" disabled={pending} onClick={() => start(() => markReadLive(dedication.id))}>
              Marquer lu en live
            </Button>
            <Button variant="outline" disabled={pending} onClick={() => start(() => completeDedication(dedication.id))}>
              Terminer
            </Button>
            <Button variant="destructive" disabled={pending} onClick={() => start(() => rejectDedication(dedication.id))}>
              Refuser
            </Button>
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => start(() => updateDedicationStatus(dedication.id, "ARCHIVED"))}
            >
              Archiver
            </Button>
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => start(() => setFeatured(dedication.id, !dedication.featured))}
            >
              {dedication.featured ? "Retirer de l'accueil" : "Mettre en avant"}
            </Button>
          </div>
        </div>

        <DedicationEditForm dedication={dedication} />

        <div className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-medium">Notes internes</h2>
          <Textarea className="mt-3 min-h-28" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button
            className="mt-3"
            variant="outline"
            disabled={pending}
            onClick={() => start(() => updateAdminNotes(dedication.id, notes))}
          >
            Enregistrer les notes
          </Button>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5">
          <h2 className="font-medium">Don</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {DONATION_STATUS_LABEL[dedication.donationStatus as DonationStatus] ||
              dedication.donationStatus}
          </p>
          <Label htmlFor="amount" className="mt-4">
            Montant
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
            Marquer le don comme confirmé
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
          Supprimer définitivement
        </Button>
      </aside>
    </div>
  );
}
