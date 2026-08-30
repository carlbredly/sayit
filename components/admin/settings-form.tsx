"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { AppSettings } from "@/lib/settings";
import { updateSettingsAction, archiveExpiredDedications } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SettingsForm({ initial }: { initial: AppSettings }) {
  const [form, setForm] = useState(initial);
  const [pending, start] = useTransition();

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      className="max-w-2xl space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        start(async () => {
          try {
            const result = await updateSettingsAction(form);
            if (result.ok) toast.success("Réglages enregistrés.");
            else toast.error(result.error);
          } catch {
            toast.error("Ta session a peut-être expiré. Recharge et réessaie.");
          }
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="showName">Nom de l&apos;émission</Label>
        <Input id="showName" className="h-11" value={form.showName} onChange={(e) => update("showName", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tiktokUrl">URL TikTok</Label>
        <Input id="tiktokUrl" className="h-11" value={form.tiktokUrl} onChange={(e) => update("tiktokUrl", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="paypalDonationUrl">URL de don (Zelle)</Label>
        <Input
          id="paypalDonationUrl"
          className="h-11"
          value={form.paypalDonationUrl}
          onChange={(e) => update("paypalDonationUrl", e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="showTime">Heure du live samedi</Label>
          <Input id="showTime" className="h-11" value={form.showTime} onChange={(e) => update("showTime", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Fuseau horaire</Label>
          <Input id="timezone" className="h-11" value={form.timezone} onChange={(e) => update("timezone", e.target.value)} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duration">Durée de l&apos;émission (minutes)</Label>
          <Input
            id="duration"
            type="number"
            className="h-11"
            value={form.showDurationMinutes}
            onChange={(e) => update("showDurationMinutes", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max">Longueur max. de dédicace</Label>
          <Input
            id="max"
            type="number"
            className="h-11"
            value={form.maxDedicationLength}
            onChange={(e) => update("maxDedicationLength", Number(e.target.value))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Statut de l&apos;émission</Label>
        <select
          id="status"
          className="h-11 w-full rounded-lg border border-input bg-input/30 px-3"
          value={form.showStatusOverride}
          onChange={(e) => update("showStatusOverride", e.target.value as AppSettings["showStatusOverride"])}
        >
          <option value="auto">Auto selon l&apos;horaire</option>
          <option value="live">Forcer en live</option>
          <option value="off">Forcer hors antenne</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="wa">Modèle de message WhatsApp</Label>
        <Textarea
          id="wa"
          className="min-h-36 whitespace-pre-wrap"
          value={form.whatsappMessageTemplate}
          onChange={(e) => update("whatsappMessageTemplate", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Prérempli quand tu cliques sur Contacter via WhatsApp. Utilise {"{showName}"} pour le
          nom de l&apos;émission. Laisse vide pour ouvrir WhatsApp sans message.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="donation">Message de don</Label>
        <Textarea
          id="donation"
          className="min-h-24"
          value={form.donationMessage}
          onChange={(e) => update("donationMessage", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="retention">Conservation (jours)</Label>
        <Input
          id="retention"
          type="number"
          className="h-11"
          value={form.retentionDays}
          onChange={(e) => update("retentionDays", Number(e.target.value))}
        />
        <p className="text-xs text-muted-foreground">
          Les dédicaces terminées, lues en live ou refusées plus anciennes que ça sont archivées.
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const result = await archiveExpiredDedications();
              if (result.ok) toast.success(`${result.archived} dédicace(s) archivée(s).`);
              else toast.error(result.error);
            })
          }
        >
          Archiver les dédicaces expirées
        </Button>
      </div>
      <Button type="submit" className="h-11" disabled={pending}>
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
