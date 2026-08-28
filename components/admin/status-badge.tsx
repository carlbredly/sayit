import { ADMIN_STATUS_LABEL, type DedicationStatus } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STYLES: Record<DedicationStatus, string> = {
  NEW: "border-primary/30 bg-primary/15 text-primary",
  APPROVED: "border-secondary/30 bg-secondary/15 text-violet-300",
  CONTACTED: "border-sky-500/30 bg-sky-500/15 text-sky-300",
  READ_LIVE: "border-success/30 bg-success/15 text-success",
  COMPLETED: "border-success/30 bg-success/10 text-success",
  REJECTED: "border-destructive/30 bg-destructive/15 text-destructive",
  ARCHIVED: "border-border bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: DedicationStatus }) {
  return (
    <Badge variant="outline" className={cn("uppercase tracking-wide", STYLES[status])}>
      {ADMIN_STATUS_LABEL[status]}
    </Badge>
  );
}
