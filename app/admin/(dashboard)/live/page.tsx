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
          <h1 className="font-display text-2xl font-semibold">Live Queue</h1>
          <p className="text-sm text-muted-foreground">
            Drag to set the order. Open host mode when you go live.
          </p>
        </div>
        <Link href="/admin/live/mode" className={cn(buttonVariants(), "h-11 px-5")}>
          Open Live Mode
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
