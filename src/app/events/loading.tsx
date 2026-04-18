import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Skeleton className="w-40 h-9 mb-2" />
      <Skeleton className="w-80 h-5 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden">
            <Skeleton className="h-48" />
            <div className="p-5 space-y-3">
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-1/2 h-4" />
              <Skeleton className="w-2/3 h-4" />
              <Skeleton className="w-1/3 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
