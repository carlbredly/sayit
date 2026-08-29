import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-4 px-4 py-16">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-56 w-full rounded-[1.75rem]" />
    </div>
  );
}
