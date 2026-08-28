"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DEDICATION_STATUSES, DONATION_STATUSES } from "@/lib/constants";
import { Input } from "@/components/ui/input";

export function DedicationFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/admin/dedications?${next.toString()}`);
  }

  return (
    <form
      className="grid gap-3 md:grid-cols-5"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        update("q", String(data.get("q") || ""));
      }}
    >
      <Input
        name="q"
        defaultValue={params.get("q") || ""}
        placeholder="Search name or DED-ID"
        className="h-10 md:col-span-2"
      />
      <select
        className="h-10 rounded-lg border border-input bg-input/30 px-3 text-sm"
        defaultValue={params.get("status") || ""}
        onChange={(e) => update("status", e.target.value)}
      >
        <option value="">All statuses</option>
        {DEDICATION_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <select
        className="h-10 rounded-lg border border-input bg-input/30 px-3 text-sm"
        defaultValue={params.get("donation") || ""}
        onChange={(e) => update("donation", e.target.value)}
      >
        <option value="">All donations</option>
        {DONATION_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <Input
        type="date"
        defaultValue={params.get("from") || ""}
        onChange={(e) => update("from", e.target.value)}
        className="h-10"
        aria-label="From date"
      />
      <Input
        type="date"
        defaultValue={params.get("liveDate") || ""}
        onChange={(e) => update("liveDate", e.target.value)}
        className="h-10 md:col-span-2"
        aria-label="Live date"
      />
    </form>
  );
}
