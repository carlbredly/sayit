"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import type { SerializedDedication } from "@/lib/serialize";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/timezone";
import {
  DONATION_STATUS_LABEL,
  type DedicationStatus,
  type DonationStatus,
} from "@/lib/constants";
import {
  completeDedication,
  deleteDedications,
  markContacted,
  markReadLive,
  rejectDedication,
  updateDedicationStatus,
} from "@/app/actions/admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DedicationTable({ rows }: { rows: SerializedDedication[] }) {
  const [pending, start] = useTransition();
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const visibleIds = useMemo(() => rows.map((row) => row.id), [rows]);
  const selectedVisible = selected.filter((id) => visibleIds.includes(id));
  const allVisibleSelected =
    visibleIds.length > 0 && selectedVisible.length === visibleIds.length;

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((value) => value !== id);
    });
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? visibleIds : []);
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
        Aucune dédicace ne correspond à tes filtres.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={allVisibleSelected}
            onChange={(event) => toggleAll(event.target.checked)}
            aria-label="Tout sélectionner"
          />
          {selectedVisible.length > 0
            ? `${selectedVisible.length} sélectionnée(s)`
            : "Tout sélectionner"}
        </label>
        <Button
          variant="destructive"
          disabled={pending || selectedVisible.length === 0}
          onClick={() => setConfirmDelete(true)}
        >
          Supprimer
        </Button>
      </div>

    <div className="space-y-2 lg:hidden">
      {rows.map((row) => (
        <div key={row.id} className="rounded-2xl border border-border bg-card p-3">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-primary"
              checked={selected.includes(row.id)}
              onChange={(event) => toggleOne(row.id, event.target.checked)}
              aria-label={`Sélectionner ${row.publicId}`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{row.recipientName}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {row.isAnonymous ? "Anonyme" : row.senderName} · {row.publicId}
                  </p>
                </div>
                <StatusBadge status={row.status as DedicationStatus} />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {row.dedicationMessage}
              </p>
              <Link
                href={`/admin/dedications/${row.id}`}
                className={cn(buttonVariants({ variant: "outline" }), "mt-3 h-9 w-full")}
              >
                Ouvrir
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="hidden overflow-x-auto rounded-2xl border border-border lg:block">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead className="bg-muted/40 text-muted-foreground">
          <tr>
            <th className="w-10 px-3 py-3">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={allVisibleSelected}
                onChange={(event) => toggleAll(event.target.checked)}
                aria-label="Tout sélectionner"
              />
            </th>
            <th className="px-3 py-3 font-medium">Statut</th>
            <th className="px-3 py-3 font-medium">Expéditeur</th>
            <th className="px-3 py-3 font-medium">Destinataire</th>
            <th className="px-3 py-3 font-medium">WhatsApp</th>
            <th className="px-3 py-3 font-medium">Dédicace</th>
            <th className="px-3 py-3 font-medium">Envoyée</th>
            <th className="px-3 py-3 font-medium">Don</th>
            <th className="px-3 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-border align-top">
              <td className="px-3 py-3">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-primary"
                  checked={selected.includes(row.id)}
                  onChange={(event) => toggleOne(row.id, event.target.checked)}
                  aria-label={`Sélectionner ${row.publicId}`}
                />
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={row.status as DedicationStatus} />
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{row.publicId}</p>
              </td>
              <td className="px-3 py-3">{row.isAnonymous ? "Anonyme" : row.senderName}</td>
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
                  : DONATION_STATUS_LABEL[row.donationStatus as DonationStatus] ||
                    row.donationStatus}
              </td>
              <td className="px-3 py-3">
                <div className="flex flex-wrap gap-1">
                  <Link
                    href={`/admin/dedications/${row.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "xs" }))}
                  >
                    Voir
                  </Link>
                  <Link
                    href={`/admin/dedications/${row.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "xs" }))}
                  >
                    Modifier
                  </Link>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={pending}
                    onClick={() => start(() => updateDedicationStatus(row.id, "APPROVED"))}
                  >
                    Approuver
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={pending}
                    onClick={() => start(() => markContacted(row.id))}
                  >
                    Contacté
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={pending}
                    onClick={() => start(() => markReadLive(row.id))}
                  >
                    Lu en live
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={pending}
                    onClick={() => start(() => completeDedication(row.id))}
                  >
                    Terminer
                  </Button>
                  <Button
                    size="xs"
                    variant="destructive"
                    disabled={pending}
                    onClick={() => start(() => rejectDedication(row.id))}
                  >
                    Refuser
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={pending}
                    onClick={() => start(() => updateDedicationStatus(row.id, "ARCHIVED"))}
                  >
                    Archiver
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Supprimer {selectedVisible.length} dédicace(s) ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive. Les messages, numéros WhatsApp et
              notes seront effacés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const result = await deleteDedications(selectedVisible);
                  if (!result.ok) {
                    toast.error(result.error);
                    return;
                  }
                  toast.success(`${result.deleted} dédicace(s) supprimée(s).`);
                  setSelected([]);
                  setConfirmDelete(false);
                })
              }
            >
              {pending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
