import Link from "next/link";
import { HostMode } from "@/components/admin/host-mode";
import { getLiveQueue } from "@/app/actions/admin";
import { getSettings } from "@/lib/settings";
import { serializeDedication } from "@/lib/serialize";

export default async function HostModePage() {
  const [queue, settings] = await Promise.all([getLiveQueue(), getSettings()]);

  return (
    <div>
      <div className="absolute right-4 top-4 z-10">
        <Link href="/admin/live" className="text-sm text-muted-foreground hover:text-foreground">
          Exit host mode
        </Link>
      </div>
      <HostMode
        items={queue.map(serializeDedication)}
        showName={settings.showName}
        whatsappTemplate={settings.whatsappMessageTemplate}
      />
    </div>
  );
}
