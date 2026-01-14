'use client';

import { memo, useMemo, useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useSearchStore } from '@/store/searchStore';

export const StopsFilter = memo(function StopsFilter() {
  // Use selectors to subscribe only to needed parts of the store
  const flights = useSearchStore((state) => state.flights);
  const stopsFilter = useSearchStore((state) => state.filters.stops);
  const setFilters = useSearchStore((state) => state.setFilters);

  // Count flights by stops
  const stopsCounts = useMemo(() => {
    const counts = { 0: 0, 1: 0, 2: 0 };
    flights.forEach((flight) => {
      const stops = flight.itineraries[0].segments.length - 1;
      const category = stops >= 2 ? 2 : stops;
      counts[category as keyof typeof counts]++;
    });
    return counts;
  }, [flights]);

  const handleChange = useCallback((stops: number, checked: boolean) => {
    setFilters((prevFilters) => {
      const currentStops = prevFilters.stops;
      const newStops = checked
        ? [...currentStops, stops]
        : currentStops.filter((s) => s !== stops);
      return { stops: newStops };
    });
  }, [setFilters]);

  const options = useMemo(() => [
    { value: 0, label: 'Nonstop', count: stopsCounts[0] },
    { value: 1, label: '1 Stop', count: stopsCounts[1] },
    { value: 2, label: '2+ Stops', count: stopsCounts[2] },
  ], [stopsCounts]);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 text-sm">Stops</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`stops-${option.value}`}
                checked={stopsFilter.includes(option.value)}
                onCheckedChange={(checked) => handleChange(option.value, checked as boolean)}
                disabled={option.count === 0}
              />
              <Label
                htmlFor={`stops-${option.value}`}
                className={`text-sm cursor-pointer ${option.count === 0 ? 'text-gray-400' : 'text-gray-700'}`}
              >
                {option.label}
              </Label>
            </div>
            <span className="text-xs text-gray-500">{option.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
