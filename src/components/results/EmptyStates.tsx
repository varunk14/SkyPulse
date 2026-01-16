'use client';

import { Plane, Search, Frown, Wifi, AlertCircle, Filter } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

export function NoResultsFound({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="No flights found"
      description="We couldn't find any flights matching your search criteria. Try adjusting your dates, destinations, or filters."
    >
      {onClearFilters && (
        <Button onClick={onClearFilters} variant="outline" size="lg">
          <Filter className="mr-2 h-4 w-4" />
          Clear all filters
        </Button>
      )}
    </EmptyState>
  );
}

export function NoFlightsAfterFilter({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <EmptyState
      icon={Filter}
      title="No flights match your filters"
      description="Try removing some filters to see more results. You can always refine your search later."
      actionLabel="Clear filters"
      onAction={onClearFilters}
    />
  );
}

export function SearchToBegin() {
  return (
    <EmptyState
      icon={Plane}
      title="Ready to Explore?"
      description="Enter your travel details above to discover amazing flight deals from hundreds of airlines around the world."
    />
  );
}

export function NetworkError({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon={Wifi}
      title="Connection Problem"
      description="We're having trouble connecting to our servers. Please check your internet connection and try again."
      actionLabel="Try again"
      onAction={onRetry}
    />
  );
}

export function GenericError({ error, onRetry }: { error?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Oops! Something went wrong"
      description={error || "We encountered an unexpected error. Our team has been notified and we're working on a fix."}
    >
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="lg">
          Try again
        </Button>
      )}
    </EmptyState>
  );
}

export function NoComparisons() {
  return (
    <EmptyState
      icon={Plane}
      title="No flights selected"
      description="Click the + button on up to 3 flights to compare prices, durations, and features side by side."
    />
  );
}
