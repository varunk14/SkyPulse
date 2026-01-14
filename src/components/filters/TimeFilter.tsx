'use client';

import { memo, useCallback, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { useSearchStore } from '@/store/searchStore';
import { Sun, Sunrise, Sunset, Moon } from 'lucide-react';

const timeBlocks = [
  { start: 0, end: 6, label: 'Night', icon: Moon },
  { start: 6, end: 12, label: 'Morning', icon: Sunrise },
  { start: 12, end: 18, label: 'Afternoon', icon: Sun },
  { start: 18, end: 24, label: 'Evening', icon: Sunset },
] as const;

const formatTime = (hour: number) => {
  if (hour === 0 || hour === 24) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  if (hour < 12) return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
};

export const TimeFilter = memo(function TimeFilter() {
  // Use selectors to subscribe only to needed parts of the store
  const departureTime = useSearchStore((state) => state.filters.departureTime);
  const setFilters = useSearchStore((state) => state.setFilters);

  const handleTimeBlockClick = useCallback((blockStart: number, blockEnd: number) => {
    setFilters((prevFilters) => {
      const isActive = prevFilters.departureTime[0] <= blockStart && 
                       prevFilters.departureTime[1] >= blockEnd;
      const isExactMatch = prevFilters.departureTime[0] === blockStart && 
                           prevFilters.departureTime[1] === blockEnd;
      
      if (isActive && isExactMatch) {
        // Reset to full range
        return { departureTime: [0, 24] as [number, number] };
      }
      return { departureTime: [blockStart, blockEnd] as [number, number] };
    });
  }, [setFilters]);

  const handleSliderChange = useCallback((value: number[]) => {
    setFilters({ departureTime: value as [number, number] });
  }, [setFilters]);

  const formattedTimeRange = useMemo(() => 
    `${formatTime(departureTime[0])} – ${formatTime(departureTime[1])}`,
    [departureTime]
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 text-sm">Departure Time</h3>

      {/* Time blocks quick select */}
      <div className="grid grid-cols-4 gap-1">
        {timeBlocks.map((block) => {
          const Icon = block.icon;
          const isActive = departureTime[0] <= block.start && 
                          departureTime[1] >= block.end;
          
          return (
            <button
              key={block.label}
              type="button"
              onClick={() => handleTimeBlockClick(block.start, block.end)}
              className={`flex flex-col items-center p-2 rounded-lg border cursor-pointer transition-all ${
                isActive
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="text-xs">{block.label}</span>
            </button>
          );
        })}
      </div>

      {/* Range slider */}
      <Slider
        min={0}
        max={24}
        step={1}
        value={departureTime}
        onValueChange={handleSliderChange}
      />

      <p className="text-xs text-gray-500 text-center">
        {formattedTimeRange}
      </p>
    </div>
  );
});
