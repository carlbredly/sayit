import { DedicationFiltersGate } from "@/components/admin/dedication-filters-gate";
import { DedicationTable } from "@/components/admin/dedication-table";
import { getAdminDedications } from "@/app/actions/admin";
import { serializeDedication } from "@/lib/serialize";

export default async function AdminDedicationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    donation?: string;
    from?: string;
    to?: string;
    liveDate?: string;
  }>;
}) {
  const filters = await searchParams;
  const rows = await getAdminDedications(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dedications</h1>
        <p className="text-sm text-muted-foreground">Review, approve, and prepare the show.</p>
      </div>
      <DedicationFiltersGate />
      <DedicationTable rows={rows.map(serializeDedication)} />
    </div>
  );
}
