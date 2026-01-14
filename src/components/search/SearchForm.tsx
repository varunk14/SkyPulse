'use client';

import { useState } from 'react';
import { ArrowLeftRight, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AirportSelect } from './AirportSelect';
import { DatePicker } from './DatePicker';
import { PassengerSelect } from './PassengerSelect';
import { useSearchStore } from '@/store/searchStore';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

export function SearchForm() {
  const { searchParams, setSearchParams, setFlights, setIsLoading, setError, setAirlinesDictionary } = useSearchStore();
  const [isSearching, setIsSearching] = useState(false);

  const swapAirports = () => {
    setSearchParams({
      origin: searchParams.destination,
      destination: searchParams.origin,
    });
  };

  const handleSearch = async () => {
    // Validation
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSearching(true);
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
      setIsSearching(false);
      setIsLoading(false);
    }
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
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Origin */}
        <div className="lg:col-span-3">
          <AirportSelect
            value={searchParams.origin}
            onChange={(airport) => setSearchParams({ origin: airport })}
            placeholder="Where from?"
            icon="departure"
          />
        </div>

        {/* Swap Button */}
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 bg-white border-gray-200 hover:bg-gray-50 hover:border-brand-300 transition-all"
            onClick={swapAirports}
            aria-label="Swap departure and arrival airports"
          >
            <ArrowLeftRight className="h-4 w-4 text-gray-600" aria-hidden="true" />
          </Button>
        </div>

        {/* Destination */}
        <div className="lg:col-span-3">
          <AirportSelect
            value={searchParams.destination}
            onChange={(airport) => setSearchParams({ destination: airport })}
            placeholder="Where to?"
            icon="arrival"
          />
        </div>

        {/* Departure Date */}
        <div className="lg:col-span-2">
          <DatePicker
            value={searchParams.departureDate}
            onChange={(date) => {
              setSearchParams({ departureDate: date });
              // Auto-set return date if round trip and return date is before departure
              if (date && searchParams.tripType === 'roundTrip') {
                if (!searchParams.returnDate || searchParams.returnDate < date) {
                  setSearchParams({ returnDate: addDays(date, 7) });
                }
              }
            }}
            placeholder="Departure"
            minDate={new Date()}
          />
        </div>

        {/* Return Date */}
        <div className="lg:col-span-2">
          <DatePicker
            value={searchParams.returnDate}
            onChange={(date) => setSearchParams({ returnDate: date })}
            placeholder="Return"
            minDate={searchParams.departureDate || new Date()}
            disabled={searchParams.tripType === 'oneWay'}
          />
        </div>

        {/* Passengers - Full width on mobile, inline on desktop */}
        <div className="lg:hidden">
          <PassengerSelect
            value={searchParams.passengers}
            onChange={(passengers) => setSearchParams({ passengers })}
          />
        </div>
      </div>

      {/* Bottom Row: Passengers + Search Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4">
        <div className="hidden lg:block">
          <PassengerSelect
            value={searchParams.passengers}
            onChange={(passengers) => setSearchParams({ passengers })}
          />
        </div>

        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className={cn(
            "flex-1 sm:flex-none sm:min-w-[200px] h-14",
            "bg-brand-600 hover:bg-brand-700 text-white",
            "font-semibold text-base",
            "transition-all duration-200",
            "shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/30"
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
      </div>
    </div>
  );
}
