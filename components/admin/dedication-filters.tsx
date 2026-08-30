"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEDICATION_STATUSES, DONATION_STATUSES, ADMIN_STATUS_LABEL, DONATION_STATUS_LABEL } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DedicationFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const extraActive = Boolean(
    params.get("status") ||
      params.get("donation") ||
      params.get("from") ||
      params.get("to") ||
      params.get("liveDate")
  );
  const [open, setOpen] = useState(extraActive);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/admin/dedications?${next.toString()}`);
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        update("q", String(data.get("q") || ""));
      }}
    >
      <div className="flex gap-2">
        <Input
          name="q"
          defaultValue={params.get("q") || ""}
          placeholder="Rechercher un nom ou un DED-ID"
          className="h-10 flex-1"
        />
        <Button type="button" variant="outline" className="h-10 shrink-0 lg:hidden" onClick={() => setOpen((v) => !v)}>
          Filtres
        </Button>
      </div>
      <div className={open ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" : "hidden lg:grid lg:grid-cols-3 lg:gap-3 xl:grid-cols-5"}>
        <select
          className="h-10 rounded-lg border border-input bg-input/30 px-3 text-sm"
          defaultValue={params.get("status") || ""}
          onChange={(e) => update("status", e.target.value)}
        >
          <option value="">Tous les statuts</option>
          {DEDICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {ADMIN_STATUS_LABEL[status]}
            </option>
          ))}
        </select>
        <select
          className="h-10 rounded-lg border border-input bg-input/30 px-3 text-sm"
          defaultValue={params.get("donation") || ""}
          onChange={(e) => update("donation", e.target.value)}
        >
          <option value="">Tous les dons</option>
          {DONATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {DONATION_STATUS_LABEL[status]}
            </option>
          ))}
        </select>
        <Input
          type="date"
          defaultValue={params.get("from") || ""}
          onChange={(e) => update("from", e.target.value)}
          className="h-10"
          aria-label="Date de début"
        />
        <Input
          type="date"
          defaultValue={params.get("to") || ""}
          onChange={(e) => update("to", e.target.value)}
          className="h-10"
          aria-label="Date de fin"
        />
        <Input
          type="date"
          defaultValue={params.get("liveDate") || ""}
          onChange={(e) => update("liveDate", e.target.value)}
          className="h-10"
          aria-label="Date du live"
        />
      </div>
    </form>
  );
}
