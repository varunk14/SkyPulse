'use client';

import { memo, useMemo, useState, useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useSearchStore } from '@/store/searchStore';
import { getAirlineLogo } from '@/lib/formatters';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const AirlineFilter = memo(function AirlineFilter() {
  // Use selectors to subscribe only to needed parts of the store
  const flights = useSearchStore((state) => state.flights);
  const airlinesFilter = useSearchStore((state) => state.filters.airlines);
  const airlinesDictionary = useSearchStore((state) => state.airlinesDictionary);
  const setFilters = useSearchStore((state) => state.setFilters);
  
  const [expanded, setExpanded] = useState(false);

  // Get unique airlines with counts
  const airlines = useMemo(() => {
    const counts: Record<string, number> = {};
    flights.forEach((flight) => {
      const carrier = flight.validatingAirlineCodes[0];
      counts[carrier] = (counts[carrier] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([code, count]) => ({
        code,
        name: airlinesDictionary[code] || code,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [flights, airlinesDictionary]);

  const handleChange = useCallback((code: string, checked: boolean) => {
    setFilters((prevFilters) => {
      const currentAirlines = prevFilters.airlines;
      
      if (currentAirlines.length === 0) {
        // If no filter active (all airlines shown), clicking to uncheck one means:
        // "Show all EXCEPT this one" = add all other airlines to filter
        if (!checked) {
          // Get all airline codes except the one being unchecked
          const allAirlineCodes = flights.map(f => f.validatingAirlineCodes[0]);
          const uniqueCodes = [...new Set(allAirlineCodes)];
          return { airlines: uniqueCodes.filter(c => c !== code) };
        }
        // If checking (shouldn't happen when all shown, but handle it)
        return { airlines: [] };
      }
      
      // Normal case: filter is active
      if (checked) {
        // Adding airline back to filter
        return { airlines: [...currentAirlines, code] };
      } else {
        // Removing airline from filter
        const newAirlines = currentAirlines.filter((c) => c !== code);
        // If removing last one, reset to show all
        return { airlines: newAirlines };
      }
    });
  }, [setFilters, flights]);

  const selectAll = useCallback(() => {
    setFilters({ airlines: [] });
  }, [setFilters]);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const displayedAirlines = expanded ? airlines : airlines.slice(0, 5);
  const hasMore = airlines.length > 5;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm">Airlines</h3>
        {airlinesFilter.length > 0 && (
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        {displayedAirlines.map((airline) => (
          <div key={airline.code} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`airline-${airline.code}`}
                checked={airlinesFilter.length === 0 || airlinesFilter.includes(airline.code)}
                onCheckedChange={(checked) => handleChange(airline.code, checked as boolean)}
              />
              <img
                src={getAirlineLogo(airline.code)}
                alt={airline.name}
                className="h-5 w-5 rounded object-contain"
              />
              <Label
                htmlFor={`airline-${airline.code}`}
                className="text-sm text-gray-700 cursor-pointer truncate max-w-[120px]"
              >
                {airline.name}
              </Label>
            </div>
            <span className="text-xs text-gray-500">{airline.count}</span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={toggleExpanded}
          className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              Show {airlines.length - 5} more
            </>
          )}
        </button>
      )}
    </div>
  );
});
