'use client';

import { memo, useMemo, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { useSearchStore } from '@/store/searchStore';
import { parseDuration, formatDuration } from '@/lib/formatters';

export const DurationFilter = memo(function DurationFilter() {
  // Use selectors to subscribe only to needed parts of the store
  const flights = useSearchStore((state) => state.flights);
  const duration = useSearchStore((state) => state.filters.duration);
  const setFilters = useSearchStore((state) => state.setFilters);

  // Get max duration from flights
  const maxDuration = useMemo(() => {
    if (flights.length === 0) return 1440; // 24 hours default
    const durations = flights.map((f) => parseDuration(f.itineraries[0].duration));
    return Math.max(...durations);
  }, [flights]);

  const handleDurationChange = useCallback((value: number[]) => {
    setFilters({ duration: value[0] });
  }, [setFilters]);

  const sliderValue = useMemo(() => [duration], [duration]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm">Max Duration</h3>
        <span className="text-sm text-brand-600 font-medium">
          {formatDuration(duration)}
        </span>
      </div>

      <Slider
        min={60}
        max={maxDuration}
        step={30}
        value={sliderValue}
        onValueChange={handleDurationChange}
      />

      <div className="flex justify-between text-xs text-gray-500">
        <span>1h</span>
        <span>{formatDuration(maxDuration)}</span>
      </div>
    </div>
  );
});
