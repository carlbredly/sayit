import Link from "next/link";
import { LiveQueueList } from "@/components/admin/live-queue";
import { getLiveQueue } from "@/app/actions/admin";
import { getSettings } from "@/lib/settings";
import { serializeDedication } from "@/lib/serialize";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function LiveQueuePage() {
  const [queue, settings] = await Promise.all([getLiveQueue(), getSettings()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">File live</h1>
          <p className="text-sm text-muted-foreground">
            Glisse pour définir l&apos;ordre. Ouvre le mode hôte au moment du live.
          </p>
        </div>
        <Link href="/admin/live/mode" className={cn(buttonVariants(), "h-11 px-5")}>
          Ouvrir le mode live
        </Link>
      </div>
      <LiveQueueList
        items={queue.map(serializeDedication)}
        showName={settings.showName}
        whatsappTemplate={settings.whatsappMessageTemplate}
      />
    </div>
  );
}
