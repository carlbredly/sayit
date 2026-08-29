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
          const result = await updateSettingsAction(form);
          if (result.ok) toast.success("Settings saved.");
          else toast.error(result.error);
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="showName">Show name</Label>
        <Input id="showName" className="h-11" value={form.showName} onChange={(e) => update("showName", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tiktokUrl">TikTok URL</Label>
        <Input id="tiktokUrl" className="h-11" value={form.tiktokUrl} onChange={(e) => update("tiktokUrl", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="paypalDonationUrl">Donation URL (Zelle)</Label>
        <Input
          id="paypalDonationUrl"
          className="h-11"
          value={form.paypalDonationUrl}
          onChange={(e) => update("paypalDonationUrl", e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="showTime">Saturday show time</Label>
          <Input id="showTime" className="h-11" value={form.showTime} onChange={(e) => update("showTime", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input id="timezone" className="h-11" value={form.timezone} onChange={(e) => update("timezone", e.target.value)} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duration">Show duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            className="h-11"
            value={form.showDurationMinutes}
            onChange={(e) => update("showDurationMinutes", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max">Max dedication length</Label>
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
        <Label htmlFor="status">Show status</Label>
        <select
          id="status"
          className="h-11 w-full rounded-lg border border-input bg-input/30 px-3"
          value={form.showStatusOverride}
          onChange={(e) => update("showStatusOverride", e.target.value as AppSettings["showStatusOverride"])}
        >
          <option value="auto">Auto from schedule</option>
          <option value="live">Force live</option>
          <option value="off">Force off-air</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="wa">WhatsApp message template</Label>
        <Textarea
          id="wa"
          className="min-h-36 whitespace-pre-wrap"
          value={form.whatsappMessageTemplate}
          onChange={(e) => update("whatsappMessageTemplate", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Pre-filled when you click Contact on WhatsApp. Use {"{showName}"} for the
          show name. Leave empty to open WhatsApp without a message.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="donation">Donation message</Label>
        <Textarea
          id="donation"
          className="min-h-24"
          value={form.donationMessage}
          onChange={(e) => update("donationMessage", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="retention">Retention (days)</Label>
        <Input
          id="retention"
          type="number"
          className="h-11"
          value={form.retentionDays}
          onChange={(e) => update("retentionDays", Number(e.target.value))}
        />
        <p className="text-xs text-muted-foreground">
          Completed, read-live, and rejected dedications older than this are archived.
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const result = await archiveExpiredDedications();
              if (result.ok) toast.success(`Archived ${result.archived} dedication(s).`);
              else toast.error(result.error);
            })
          }
        >
          Archive expired dedications
        </Button>
      </div>
      <Button type="submit" className="h-11" disabled={pending}>
        {pending ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
