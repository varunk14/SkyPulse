import { Skeleton } from "@/components/ui/skeleton";

export function FlightCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Airline Info Skeleton */}
        <div className="flex items-center gap-3 lg:w-40 shrink-0">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Flight Timeline Skeleton */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {/* Departure */}
            <div className="text-center shrink-0 space-y-2">
              <Skeleton className="h-6 w-16 mx-auto" />
              <Skeleton className="h-4 w-12 mx-auto" />
            </div>

            {/* Duration */}
            <div className="flex-1 px-2 space-y-2">
              <Skeleton className="h-3 w-20 mx-auto" />
              <Skeleton className="h-0.5 w-full" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>

            {/* Arrival */}
            <div className="text-center shrink-0 space-y-2">
              <Skeleton className="h-6 w-16 mx-auto" />
              <Skeleton className="h-4 w-12 mx-auto" />
            </div>
          </div>
        </div>

        {/* Price Skeleton */}
        <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 lg:w-36 shrink-0">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

export function FlightListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <FlightCardSkeleton key={i} />
      ))}
    </div>
  );
}
