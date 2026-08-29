"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { SerializedDedication } from "@/lib/serialize";
import { updateDedicationFields } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function DedicationEditForm({
  dedication,
}: {
  dedication: SerializedDedication;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [form, setForm] = useState({
    isAnonymous: dedication.isAnonymous,
    senderName: dedication.senderName || "",
    recipientName: dedication.recipientName,
    recipientWhatsapp: dedication.recipientWhatsapp,
    dedicationMessage: dedication.dedicationMessage,
  });

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium">Edit dedication</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Edit"}
        </Button>
      </div>
      {open ? (
        <form
          className="mt-4 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            start(async () => {
              const result = await updateDedicationFields(dedication.id, form);
              if (result.ok) {
                toast.success("Dedication updated.");
                setOpen(false);
              } else {
                toast.error(result.error);
              }
            });
          }}
        >
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isAnonymous}
              onChange={(e) => setForm((prev) => ({ ...prev, isAnonymous: e.target.checked }))}
            />
            Keep sender anonymous
          </label>
          {!form.isAnonymous ? (
            <div className="space-y-2">
              <Label htmlFor="edit-sender">Sender name</Label>
              <Input
                id="edit-sender"
                className="h-10"
                value={form.senderName}
                onChange={(e) => setForm((prev) => ({ ...prev, senderName: e.target.value }))}
              />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="edit-recipient">Recipient name</Label>
            <Input
              id="edit-recipient"
              className="h-10"
              value={form.recipientName}
              onChange={(e) => setForm((prev) => ({ ...prev, recipientName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-wa">WhatsApp (E.164)</Label>
            <Input
              id="edit-wa"
              className="h-10 font-mono"
              value={form.recipientWhatsapp}
              onChange={(e) => setForm((prev) => ({ ...prev, recipientWhatsapp: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-message">Dedication</Label>
            <Textarea
              id="edit-message"
              className="min-h-32"
              value={form.dedicationMessage}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dedicationMessage: e.target.value }))
              }
            />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
