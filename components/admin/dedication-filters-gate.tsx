"use client";

import { Suspense } from "react";
import { DedicationFilters } from "@/components/admin/dedication-filters";

export function DedicationFiltersGate() {
  return (
    <Suspense fallback={<div className="h-10 rounded-lg bg-muted" />}>
      <DedicationFilters />
    </Suspense>
  );
}
