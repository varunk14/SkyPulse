import { Skeleton } from '@/components/ui/skeleton';

export function FlightCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Airline logo */}
          <Skeleton className="h-12 w-12 rounded-lg" />
          
          {/* Flight info */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        
        {/* Price */}
        <div className="text-right space-y-2">
          <Skeleton className="h-8 w-24 ml-auto" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      </div>
      
      {/* Timeline */}
      <div className="mt-6 flex items-center gap-4">
        <Skeleton className="h-16 w-16" />
        <Skeleton className="h-2 flex-1" />
        <Skeleton className="h-16 w-16" />
      </div>
    </div>
  );
}

export function FlightResultsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <FlightCardSkeleton key={i} />
      ))}
    </div>
  );
}
