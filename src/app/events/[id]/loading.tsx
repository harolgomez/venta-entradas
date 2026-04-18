import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Skeleton className="w-32 h-5 mb-6" />
      <Skeleton className="h-48 sm:h-64 rounded-xl mb-6" />
      <Skeleton className="w-2/3 h-10 mb-2" />
      <Skeleton className="w-1/3 h-6 mb-4" />
      <div className="flex gap-4 mb-8">
        <Skeleton className="w-40 h-5" />
        <Skeleton className="w-48 h-5" />
      </div>
      <Skeleton className="w-48 h-7 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
