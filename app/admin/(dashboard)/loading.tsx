import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-[64rem] gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[6.75rem] min-w-0 flex-1 rounded-2xl" />
          ))}
        </div>
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
