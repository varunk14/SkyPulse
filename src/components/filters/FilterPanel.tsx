'use client';

import { memo, useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { parseDuration } from '@/lib/formatters';
import { parseISO } from 'date-fns';

// Animation variants for desktop filter panel
const panelVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" as const }
  }
};

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
  const flights = useSearchStore((state) => state.flights);
  const filters = useSearchStore((state) => state.filters);
  const resetFilters = useSearchStore((state) => state.resetFilters);
  
  const [isOpen, setIsOpen] = useState(false);

  // Count active filters
  const activeFilterCount = useMemo(() => 
    (filters.stops.length > 0 ? 1 : 0) +
    (filters.airlines.length > 0 ? 1 : 0) +
    (filters.departureTime[0] > 0 || filters.departureTime[1] < 24 ? 1 : 0) +
    (filters.duration < 1440 ? 1 : 0),
    [filters.stops.length, filters.airlines.length, filters.departureTime, filters.duration]
  );

  // Calculate filtered flights count in real-time (same logic as FlightList)
  const filteredFlightsCount = useMemo(() => {
    return flights.filter((flight) => {
      const price = parseFloat(flight.price.grandTotal);
      const outbound = flight.itineraries[0];
      const stops = outbound.segments.length - 1;
      const duration = parseDuration(outbound.duration);
      const departureHour = parseISO(outbound.segments[0].departure.at).getHours();
      const mainCarrier = flight.validatingAirlineCodes[0];

      // Stops filter
      if (filters.stops.length > 0) {
        const stopCategory = stops >= 2 ? 2 : stops;
        if (!filters.stops.includes(stopCategory)) return false;
      }

      // Price filter
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;

      // Airlines filter
      if (filters.airlines.length > 0 && !filters.airlines.includes(mainCarrier)) return false;

      // Departure time filter
      if (departureHour < filters.departureTime[0] || departureHour > filters.departureTime[1]) return false;

      // Duration filter
      if (duration > filters.duration) return false;

      return true;
    }).length;
  }, [flights, filters]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const handleCloseSheet = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Desktop: Sidebar */}
      <motion.div 
        className="hidden lg:block"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={`bg-white rounded-xl border border-gray-100 ${className}`}>
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Badge variant="secondary" className="text-xs">
                    {activeFilterCount}
                  </Badge>
                </motion.span>
              )}
            </h2>
            {activeFilterCount > 0 && (
              <motion.button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear all
              </motion.button>
            )}
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-200px)] p-5">
            <FilterContent />
          </div>
        </div>
      </motion.div>
      
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
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="h-full flex flex-col"
          >
            <SheetHeader className="p-5 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </SheetTitle>
                {activeFilterCount > 0 && (
                  <motion.button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear all
                  </motion.button>
                )}
              </div>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-140px)]">
              <div className="p-5">
                <FilterContent />
              </div>
            </ScrollArea>
            <div className="p-5 border-t bg-gray-50">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="w-full bg-brand-600 hover:bg-brand-700"
                  onClick={handleCloseSheet}
                >
                  Show {filteredFlightsCount} result{filteredFlightsCount !== 1 ? 's' : ''}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </SheetContent>
      </Sheet>
    </>
  );
});
