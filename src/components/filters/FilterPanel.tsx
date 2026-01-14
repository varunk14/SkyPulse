'use client';

import { memo, useMemo, useCallback, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StopsFilter } from './StopsFilter';
import { PriceRangeFilter } from './PriceRangeFilter';
import { AirlineFilter } from './AirlineFilter';
import { TimeFilter } from './TimeFilter';
import { DurationFilter } from './DurationFilter';
import { useSearchStore } from '@/store/searchStore';
import { Badge } from '@/components/ui/badge';

// Memoized filter content to prevent unnecessary re-renders
const FilterContent = memo(function FilterContent() {
  return (
    <div className="space-y-6">
      <StopsFilter />
      <Separator />
      <PriceRangeFilter />
      <Separator />
      <AirlineFilter />
      <Separator />
      <TimeFilter />
      <Separator />
      <DurationFilter />
    </div>
  );
});

interface FilterPanelProps {
  className?: string;
}

export const FilterPanel = memo(function FilterPanel({ className }: FilterPanelProps) {
  // Use selectors to subscribe only to specific parts of the store
  const stopsLength = useSearchStore((state) => state.filters.stops.length);
  const airlinesLength = useSearchStore((state) => state.filters.airlines.length);
  const departureTime = useSearchStore((state) => state.filters.departureTime);
  const duration = useSearchStore((state) => state.filters.duration);
  const flightsCount = useSearchStore((state) => state.flights.length);
  const resetFilters = useSearchStore((state) => state.resetFilters);
  
  const [isOpen, setIsOpen] = useState(false);

  // Count active filters using memoized selectors
  const activeFilterCount = useMemo(() => 
    (stopsLength > 0 ? 1 : 0) +
    (airlinesLength > 0 ? 1 : 0) +
    (departureTime[0] > 0 || departureTime[1] < 24 ? 1 : 0) +
    (duration < 1440 ? 1 : 0),
    [stopsLength, airlinesLength, departureTime, duration]
  );

  const handleResetFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const handleCloseSheet = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Desktop: Sidebar */}
      <div className="hidden lg:block">
        <div className={`bg-white rounded-xl border border-gray-100 ${className}`}>
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </h2>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-200px)] p-5">
            <FilterContent />
          </div>
        </div>
      </div>
      
      {/* Mobile: Sheet trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-[400px] p-0">
          <SheetHeader className="p-5 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </SheetTitle>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="p-5">
              <FilterContent />
            </div>
          </ScrollArea>
          <div className="p-5 border-t bg-gray-50">
            <Button 
              className="w-full bg-brand-600 hover:bg-brand-700"
              onClick={handleCloseSheet}
            >
              Show {flightsCount} results
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
});
