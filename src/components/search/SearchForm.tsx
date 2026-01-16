'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AirportSelect } from './AirportSelect';
import { DatePicker } from './DatePicker';
import { PassengerSelect } from './PassengerSelect';
import { useSearchStore } from '@/store/searchStore';
import { useRecentSearches, RecentSearch } from '@/hooks/useRecentSearches';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

interface SearchFormProps {
  originInputRef?: React.RefObject<HTMLButtonElement | null>;
}

export function SearchForm({ originInputRef }: SearchFormProps) {
  const { searchParams, setSearchParams, setFlights, setIsLoading, setError, setAirlinesDictionary, setHasSearched } = useSearchStore();
  const { addSearch } = useRecentSearches();
  const [isSearching, setIsSearching] = useState(false);

  const swapAirports = () => {
    setSearchParams({
      origin: searchParams.destination,
      destination: searchParams.origin,
    });
  };

  const performSearch = async (origin: any, destination: any, departureDate?: Date | null) => {
    const dateToUse = departureDate || searchParams.departureDate;
    
    // Validation
    if (!origin || !destination || !dateToUse) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSearching(true);
    setIsLoading(true);
    setError(null);
    setHasSearched(true); // Mark that a search has been attempted

    try {
      const params = new URLSearchParams({
        origin: origin.iataCode,
        destination: destination.iataCode,
        departureDate: format(dateToUse, 'yyyy-MM-dd'),
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
      
      // Save to recent searches
      if (origin && destination && dateToUse) {
        addSearch({
          from: { code: origin.iataCode, city: origin.cityName },
          to: { code: destination.iataCode, city: destination.cityName },
          date: format(dateToUse, "MMM dd"),
        });
      }
      
      // Update URL with search parameters
      const url = new URL(window.location.href);
      url.searchParams.set("from", origin.iataCode);
      url.searchParams.set("to", destination.iataCode);
      url.searchParams.set("departure", format(dateToUse, 'yyyy-MM-dd'));
      
      if (searchParams.returnDate && searchParams.tripType === 'roundTrip') {
        url.searchParams.set("return", format(searchParams.returnDate, 'yyyy-MM-dd'));
      } else {
        url.searchParams.delete("return");
      }
      
      url.searchParams.set("passengers", String(searchParams.passengers?.adults || 1));
      
      if (searchParams.passengers.children > 0) {
        url.searchParams.set("children", String(searchParams.passengers.children));
      } else {
        url.searchParams.delete("children");
      }
      
      if (searchParams.passengers.infants > 0) {
        url.searchParams.set("infants", String(searchParams.passengers.infants));
      } else {
        url.searchParams.delete("infants");
      }
      
      url.searchParams.set("class", searchParams.cabinClass || "ECONOMY");
      url.searchParams.set("tripType", searchParams.tripType || "roundTrip");
      
      window.history.replaceState({}, "", url.toString());
    } catch (error: any) {
      setError(error.message);
      setFlights([]);
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  const handleRecentSelect = async (search: RecentSearch) => {
    // Find airports by IATA code
    try {
      const useMock = typeof window !== 'undefined' && localStorage.getItem('useMockData') === 'true';
      const [originRes, destRes] = await Promise.all([
        fetch(`/api/airports/search?keyword=${encodeURIComponent(search.from.code)}&useMock=${useMock}`),
        fetch(`/api/airports/search?keyword=${encodeURIComponent(search.to.code)}&useMock=${useMock}`)
      ]);

      const originData = await originRes.json();
      const destData = await destRes.json();

      // Find exact match by IATA code
      const originAirport = originData.data?.find((a: any) => a.iataCode === search.from.code);
      const destAirport = destData.data?.find((a: any) => a.iataCode === search.to.code);

      if (originAirport && destAirport) {
        // Set search parameters
        setSearchParams({
          origin: originAirport,
          destination: destAirport,
        });
        
        // Trigger search automatically with the new airports
        await performSearch(originAirport, destAirport, searchParams.departureDate);
      }
    } catch (error) {
      console.error('Failed to load airports from recent search:', error);
    }
  };

  const updateURLWithSearch = () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("from", searchParams.origin.iataCode);
    url.searchParams.set("to", searchParams.destination.iataCode);
    url.searchParams.set("departure", format(searchParams.departureDate, 'yyyy-MM-dd'));
    
    if (searchParams.returnDate && searchParams.tripType === 'roundTrip') {
      url.searchParams.set("return", format(searchParams.returnDate, 'yyyy-MM-dd'));
    } else {
      url.searchParams.delete("return");
    }
    
    url.searchParams.set("passengers", String(searchParams.passengers?.adults || 1));
    
    if (searchParams.passengers.children > 0) {
      url.searchParams.set("children", String(searchParams.passengers.children));
    } else {
      url.searchParams.delete("children");
    }
    
    if (searchParams.passengers.infants > 0) {
      url.searchParams.set("infants", String(searchParams.passengers.infants));
    } else {
      url.searchParams.delete("infants");
    }
    
    url.searchParams.set("class", searchParams.cabinClass || "ECONOMY");
    url.searchParams.set("tripType", searchParams.tripType || "roundTrip");
    
    window.history.replaceState({}, "", url.toString());
  };

  const handleSearch = async () => {
    // Validate required fields
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      setError('Please select origin, destination, and departure date');
      return;
    }
    
    // Check if origin and destination are the same
    if (searchParams.origin.iataCode === searchParams.destination.iataCode) {
      setError('Origin and destination cannot be the same');
      return;
    }
    
    // Validate return date for round trip
    if (searchParams.tripType === 'roundTrip' && !searchParams.returnDate) {
      setError('Please select return date for round trip');
      return;
    }
    
    await performSearch(searchParams.origin, searchParams.destination, searchParams.departureDate);
  };

  const tripTypes = [
    { value: 'roundTrip', label: 'Round trip' },
    { value: 'oneWay', label: 'One way' },
  ];

  const cabinClasses = [
    { value: 'ECONOMY', label: 'Economy' },
    { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'FIRST', label: 'First' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      {/* Trip Type & Cabin Class */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex rounded-lg bg-gray-100 p-1">
          {tripTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSearchParams({ tripType: type.value as any })}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                searchParams.tripType === type.value
                  ? "bg-white text-brand-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
        
        <label className="sr-only" htmlFor="cabin-class-select">Cabin Class</label>
        <select
          id="cabin-class-select"
          value={searchParams.cabinClass}
          onChange={(e) => setSearchParams({ cabinClass: e.target.value as any })}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-brand-500"
          aria-label="Select cabin class"
        >
          {cabinClasses.map((cabin) => (
            <option key={cabin.value} value={cabin.value}>
              {cabin.label}
            </option>
          ))}
        </select>
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Origin - full width mobile, grid on desktop */}
        <div className="sm:col-span-1 lg:col-span-3">
          <AirportSelect
            ref={originInputRef}
            value={searchParams.origin}
            onChange={(airport) => {
              setSearchParams({ origin: airport });
              setError(null); // Clear any previous errors
              setHasSearched(false); // Reset search flag when user modifies
            }}
            placeholder="Where from?"
            icon="departure"
            showRecentSearches={true}
            onRecentSelect={handleRecentSelect}
          />
        </div>

        {/* Swap Button - ONLY show on desktop */}
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
          <motion.div whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-white border-gray-200 hover:bg-gray-50 hover:border-brand-300 transition-all"
              onClick={swapAirports}
              aria-label="Swap departure and arrival airports"
            >
              <ArrowLeftRight className="h-4 w-4 text-gray-600" aria-hidden="true" />
            </Button>
          </motion.div>
        </div>

        {/* Destination */}
        <div className="sm:col-span-1 lg:col-span-3">
          <AirportSelect
            value={searchParams.destination}
            onChange={(airport) => {
              setSearchParams({ destination: airport });
              setError(null); // Clear any previous errors
              setHasSearched(false); // Reset search flag when user modifies
            }}
            placeholder="Where to?"
            icon="arrival"
          />
        </div>

        {/* Dates - side by side on tablet+, stack on mobile */}
        {/* Departure Date */}
        <div className="sm:col-span-1 lg:col-span-2">
          <DatePicker
            value={searchParams.departureDate}
            onChange={(date) => {
              setSearchParams({ departureDate: date });
              setError(null); // Clear any previous errors
              setHasSearched(false); // Reset search flag when user modifies
              // Auto-set return date if round trip and return date is before departure
              if (date && searchParams.tripType === 'roundTrip') {
                if (!searchParams.returnDate || searchParams.returnDate < date) {
                  setSearchParams({ returnDate: addDays(date, 7) });
                }
              }
            }}
            placeholder="Departure"
            minDate={new Date()}
            required={true}
          />
        </div>

        {/* Return Date */}
        <div className="sm:col-span-1 lg:col-span-2">
          <DatePicker
            value={searchParams.returnDate}
            onChange={(date) => {
              setSearchParams({ returnDate: date });
              setError(null); // Clear any previous errors
              setHasSearched(false); // Reset search flag when user modifies
            }}
            placeholder="Return"
            minDate={searchParams.departureDate || new Date()}
            disabled={searchParams.tripType === 'oneWay'}
            required={searchParams.tripType === 'roundTrip'}
          />
        </div>

        {/* Passengers - Full width on mobile, inline on desktop */}
        <div className="sm:col-span-2 lg:hidden">
          <PassengerSelect
            value={searchParams.passengers}
            onChange={(passengers) => setSearchParams({ passengers })}
          />
        </div>
      </div>

      {/* Bottom Row: Passengers + Search Button - responsive */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-4">
        <div className="hidden lg:block sm:w-auto">
          <PassengerSelect
            value={searchParams.passengers}
            onChange={(passengers) => setSearchParams({ passengers })}
          />
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:flex-1 sm:min-w-[200px]"
        >
          <Button
            onClick={handleSearch}
            disabled={
              isSearching || 
              !searchParams.origin || 
              !searchParams.destination || 
              !searchParams.departureDate ||
              (searchParams.tripType === 'roundTrip' && !searchParams.returnDate)
            }
            className={cn(
              "w-full h-12 sm:h-14",
              "bg-brand-600 hover:bg-brand-700 text-white",
              "font-semibold text-base",
              "transition-all duration-200",
              "shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/30",
              // Add disabled styles
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-600 disabled:shadow-none"
            )}
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Search Flights
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
