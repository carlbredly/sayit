import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-16 text-center">
      <Skeleton className="mx-auto size-16 rounded-full" />
      <Skeleton className="mx-auto h-10 w-72" />
      <Skeleton className="h-28 w-full rounded-2xl" />
    </div>
  );
}
