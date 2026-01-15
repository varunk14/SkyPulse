'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlightCard } from './FlightCard';
import { SortDropdown, type SortOption } from './SortDropdown';
import { FlightResultsSkeleton } from '@/components/shared/FlightCardSkeleton';
import { ShareButton } from '@/components/shared/ShareButton';
import { useSearchStore } from '@/store/searchStore';
import { useRecentSearches, RecentSearch } from '@/hooks/useRecentSearches';
import { parseDuration } from '@/lib/formatters';
import { parseISO } from 'date-fns';
import { AlertCircle, SearchX, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { announce } from '@/lib/a11y';

// Animation variants for staggered flight cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const }
  },
  exit: { 
    opacity: 0, 
    x: -50,
    transition: { duration: 0.2 }
  }
};

export function FlightList() {
  const { flights, isLoading, error, airlinesDictionary, filters, resetFilters, setSearchParams } = useSearchStore();
  const { searches } = useRecentSearches();
  const [sortBy, setSortBy] = useState<SortOption>('price_asc');

  // Apply filters and sorting
  const processedFlights = useMemo(() => {
    let result = [...flights];

    // Apply filters
    result = result.filter((flight) => {
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
    });

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal);
        case 'price_desc':
          return parseFloat(b.price.grandTotal) - parseFloat(a.price.grandTotal);
        case 'duration_asc':
          return parseDuration(a.itineraries[0].duration) - parseDuration(b.itineraries[0].duration);
        case 'departure_asc':
          return parseISO(a.itineraries[0].segments[0].departure.at).getTime() -
                 parseISO(b.itineraries[0].segments[0].departure.at).getTime();
        case 'departure_desc':
          return parseISO(b.itineraries[0].segments[0].departure.at).getTime() -
                 parseISO(a.itineraries[0].segments[0].departure.at).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [flights, filters, sortBy]);

  // Find cheapest and fastest
  const cheapestId = useMemo(() => {
    if (processedFlights.length === 0) return null;
    return processedFlights.reduce((min, flight) =>
      parseFloat(flight.price.grandTotal) < parseFloat(min.price.grandTotal) ? flight : min
    ).id;
  }, [processedFlights]);

  const fastestId = useMemo(() => {
    if (processedFlights.length === 0) return null;
    return processedFlights.reduce((min, flight) =>
      parseDuration(flight.itineraries[0].duration) < parseDuration(min.itineraries[0].duration) ? flight : min
    ).id;
  }, [processedFlights]);

  // Announce results to screen readers
  useEffect(() => {
    if (!isLoading && processedFlights.length > 0) {
      announce(`${processedFlights.length} flight${processedFlights.length !== 1 ? 's' : ''} found`);
    } else if (!isLoading && flights.length > 0 && processedFlights.length === 0) {
      announce('No flights match your current filters');
    }
  }, [processedFlights.length, isLoading, flights.length]);

  // Loading state
  if (isLoading) {
    return <FlightResultsSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center" role="alert" aria-live="assertive">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-red-900 mb-2">Search Failed</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
          Try Again
        </Button>
      </div>
    );
  }

  // Handle recent search selection
  const handleRecentSelect = async (search: RecentSearch) => {
    try {
      const [originRes, destRes] = await Promise.all([
        fetch(`/api/airports/search?keyword=${encodeURIComponent(search.from.code)}`),
        fetch(`/api/airports/search?keyword=${encodeURIComponent(search.to.code)}`)
      ]);

      const originData = await originRes.json();
      const destData = await destRes.json();

      // Find exact match by IATA code
      const originAirport = originData.data?.find((a: any) => a.iataCode === search.from.code);
      const destAirport = destData.data?.find((a: any) => a.iataCode === search.to.code);

      if (originAirport && destAirport) {
        setSearchParams({
          origin: originAirport,
          destination: destAirport,
        });
      }
    } catch (error) {
      console.error('Failed to load airports from recent search:', error);
    }
  };

  // Empty state (no search yet)
  if (flights.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center" role="status">
        <div className="h-20 w-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6">
          <Plane className="h-10 w-10 text-brand-600" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Ready to Explore?
        </h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Enter your travel details above to discover amazing flight deals from hundreds of airlines
        </p>
        {searches.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Your recent searches</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {searches.map((search) => (
                <button
                  key={search.id}
                  onClick={() => handleRecentSelect(search)}
                  className="px-3 py-2 bg-white rounded-full border hover:border-brand-500 hover:bg-brand-50 transition-all text-sm"
                >
                  {search.from.code} → {search.to.code}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // No results after filtering
  if (processedFlights.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center" role="status" aria-live="polite">
        <SearchX className="h-12 w-12 text-amber-600 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-amber-900 mb-2">No Matching Flights</h2>
        <p className="text-amber-700 mb-4">
          Try adjusting your filters to see more results
        </p>
        <Button 
          variant="outline" 
          className="border-amber-300 text-amber-700 hover:bg-amber-100"
          onClick={resetFilters}
        >
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="region" aria-label="Flight search results">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900" aria-live="polite">
            {processedFlights.length} flight{processedFlights.length !== 1 ? 's' : ''} found
          </h2>
          <p className="text-sm text-gray-500">
            Prices include taxes and fees
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Flight Cards with staggered animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
        role="list"
      >
        <AnimatePresence mode="popLayout">
          {processedFlights.map((flight, index) => (
            <motion.div
              key={flight.id}
              variants={cardVariants}
              exit="exit"
              layout
            >
              <FlightCard
                flight={flight}
                airlineNames={airlinesDictionary}
                isCheapest={flight.id === cheapestId}
                isFastest={flight.id === fastestId}
                rank={index + 1}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
