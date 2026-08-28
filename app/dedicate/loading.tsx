import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-4 px-4 py-16">
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
