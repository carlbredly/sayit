import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-16">
      <Skeleton className="mx-auto h-10 w-64" />
      <Skeleton className="mx-auto h-5 w-48" />
      <Skeleton className="aspect-video w-full rounded-[2rem]" />
      <Skeleton className="mx-auto h-12 w-48" />
    </div>
  );
}
