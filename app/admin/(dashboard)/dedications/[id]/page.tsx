import { notFound } from "next/navigation";
import { DedicationDetail } from "@/components/admin/dedication-detail";
import { getAdminDedication } from "@/app/actions/admin";
import { getSettings } from "@/lib/settings";
import { serializeDedication } from "@/lib/serialize";

export default async function DedicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [dedication, settings] = await Promise.all([
    getAdminDedication(id),
    getSettings(),
  ]);
  if (!dedication) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Dedication</h1>
      <DedicationDetail
        dedication={serializeDedication(dedication)}
        showName={settings.showName}
        whatsappTemplate={settings.whatsappMessageTemplate}
      />
    </div>
  );
}
