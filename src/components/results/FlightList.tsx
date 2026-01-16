'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlightCard } from './FlightCard';
import { SortDropdown, type SortOption } from './SortDropdown';
import { FlightListSkeleton } from './FlightCardSkeleton';
import { ShareButton } from '@/components/shared/ShareButton';
import { useSearchStore } from '@/store/searchStore';
import { useRecentSearches, RecentSearch } from '@/hooks/useRecentSearches';
import { parseDuration } from '@/lib/formatters';
import { parseISO, format } from 'date-fns';
import { announce } from '@/lib/a11y';
import { 
  NoResultsFound, 
  SearchToBegin, 
  NoFlightsAfterFilter,
  NetworkError,
  GenericError
} from './EmptyStates';
import { getErrorMessage } from '@/lib/errorMessages';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const { flights, isLoading, error, airlinesDictionary, filters, resetFilters, setSearchParams, searchParams, setFlights, setIsLoading, setError, setAirlinesDictionary, hasSearched, setHasSearched } = useSearchStore();
  const { searches } = useRecentSearches();
  const [sortBy, setSortBy] = useState<SortOption>('price_asc');

  // Retry search function
  const handleRetrySearch = async () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        origin: searchParams.origin.iataCode,
        destination: searchParams.destination.iataCode,
        departureDate: format(searchParams.departureDate, 'yyyy-MM-dd'),
        adults: searchParams.passengers.adults.toString(),
      });

      if (searchParams.returnDate && searchParams.tripType === 'roundTrip') {
        params.append('returnDate', format(searchParams.returnDate, 'yyyy-MM-dd'));
      }
      if (searchParams.passengers.children > 0) {
        params.append('children', searchParams.passengers.children.toString());
      }
      if (searchParams.passengers.infants > 0) {
        params.append('infants', searchParams.passengers.infants.toString());
      }
      if (searchParams.cabinClass !== 'ECONOMY') {
        params.append('cabinClass', searchParams.cabinClass);
      }

      const useMock = typeof window !== 'undefined' && localStorage.getItem('useMockData') === 'true';
      params.append('useMock', String(useMock));

      const response = await fetch(`/api/flights/search?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setFlights(data.data || []);
      setAirlinesDictionary(data.dictionaries?.carriers || {});
    } catch (error: any) {
      setError(error.message);
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Loading state
  if (isLoading) {
    return <FlightListSkeleton count={8} />;
  }

  // Error state - only show AFTER a failed search attempt (not while filling form)
  if (error && flights.length === 0 && !isLoading) {
    const errorMsg = getErrorMessage({ message: error });
    const isNetworkError = error.toLowerCase().includes('network') || 
                          error.toLowerCase().includes('fetch') ||
                          error.toLowerCase().includes('connection');

    if (isNetworkError) {
      return <NetworkError onRetry={handleRetrySearch} />;
    }

    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Unable to find flights
        </h3>
        <p className="text-gray-600 mb-6">{errorMsg.description || error}</p>
        <Button 
          onClick={() => setError(null)} 
          variant="outline"
        >
          Modify Search
        </Button>
      </div>
    );
  }
  
  // Show "Ready to Explore" ONLY when no search has been done
  if (!hasSearched && flights.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-50 to-coral-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Explore?</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Enter your travel details above to discover amazing flight deals from airlines around the world.
        </p>
        {searches.length > 0 && (
          <div className="mt-8">
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

  // No results from API search - only show when hasSearched is true
  if (hasSearched && flights.length === 0 && !isLoading && !error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No flights found
        </h3>
        <p className="text-gray-600 mb-6">
          We couldn't find any flights matching your search criteria.<br/>
          Try adjusting your dates, destinations, or filters.
        </p>
        <Button 
          onClick={() => {
            setError(null);
            setHasSearched(false);
            resetFilters();
          }} 
          variant="outline"
          className="mx-auto"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Clear all filters
        </Button>
      </div>
    );
  }

  // No results after filtering
  if (processedFlights.length === 0 && flights.length > 0) {
    return <NoFlightsAfterFilter onClearFilters={resetFilters} />;
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
