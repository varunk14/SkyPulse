'use client';

import { memo, useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useSearchStore } from '@/store/searchStore';
import { formatPrice, convertPrice, convertToUSD } from '@/lib/currency';

export const PriceRangeFilter = memo(function PriceRangeFilter() {
  // Use selectors to subscribe only to needed parts of the store
  const flights = useSearchStore((state) => state.flights);
  const priceRangeFilter = useSearchStore((state) => state.filters.priceRange);
  const setFilters = useSearchStore((state) => state.setFilters);
  const selectedCurrency = useSearchStore((state) => state.selectedCurrency);
  
  const isInitializedRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Get price range from flights
  const priceRange = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 10000 };
    const prices = flights.map((f) => parseFloat(f.price.grandTotal));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [flights]);

  // Local state for smooth slider - initialize from filters
  const [localRange, setLocalRange] = useState<[number, number]>(priceRangeFilter);

  // Sync local state with store filters when they change externally (e.g., reset)
  useEffect(() => {
    // Only sync when values actually changed and are different from local
    if (priceRangeFilter[0] !== localRange[0] || priceRangeFilter[1] !== localRange[1]) {
      setLocalRange(priceRangeFilter);
    }
  }, [priceRangeFilter[0], priceRangeFilter[1]]);

  // Reset local range when flights change (new search)
  useEffect(() => {
    if (flights.length > 0) {
      setLocalRange([priceRange.min, priceRange.max]);
      isInitializedRef.current = false;
    }
  }, [flights.length, priceRange.min, priceRange.max]);

  // Debounced update to store
  const updateStore = useCallback((range: [number, number]) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setFilters({ priceRange: range });
    }, 150);
  }, [setFilters]);

  // Handle slider change
  const handleSliderChange = useCallback((value: number[]) => {
    const newRange = value as [number, number];
    setLocalRange(newRange);
    isInitializedRef.current = true;
    updateStore(newRange);
  }, [updateStore]);

  // Handle min input change
  const handleMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || priceRange.min;
    setLocalRange((prev) => {
      const newRange: [number, number] = [value, prev[1]];
      updateStore(newRange);
      return newRange;
    });
  }, [priceRange.min, updateStore]);

  // Handle max input change
  const handleMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || priceRange.max;
    setLocalRange((prev) => {
      const newRange: [number, number] = [prev[0], value];
      updateStore(newRange);
      return newRange;
    });
  }, [priceRange.max, updateStore]);

  // Price histogram data
  const histogram = useMemo(() => {
    const buckets = 20;
    const bucketSize = (priceRange.max - priceRange.min) / buckets;
    if (bucketSize === 0) return new Array(buckets).fill(0);
    
    const counts = new Array(buckets).fill(0);
    
    flights.forEach((flight) => {
      const price = parseFloat(flight.price.grandTotal);
      const bucket = Math.min(
        Math.floor((price - priceRange.min) / bucketSize),
        buckets - 1
      );
      counts[bucket]++;
    });
    
    const maxCount = Math.max(...counts);
    return counts.map((count) => (maxCount > 0 ? (count / maxCount) * 100 : 0));
  }, [flights, priceRange]);

  // Convert prices for display (prices are stored in USD, convert for display)
  const displayMin = useMemo(() => Math.round(convertPrice(localRange[0], selectedCurrency)), [localRange[0], selectedCurrency]);
  const displayMax = useMemo(() => Math.round(convertPrice(localRange[1], selectedCurrency)), [localRange[1], selectedCurrency]);

  const formattedRange = useMemo(() => 
    `${formatPrice(localRange[0], selectedCurrency)} – ${formatPrice(localRange[1], selectedCurrency)}`,
    [localRange, selectedCurrency]
  );

  if (flights.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 text-sm">Price Range</h3>
      
      {/* Histogram */}
      <div className="h-12 flex items-end gap-0.5 pointer-events-none">
        {histogram.map((height, i) => {
          const bucketStart = priceRange.min + (i * (priceRange.max - priceRange.min) / 20);
          const bucketEnd = bucketStart + (priceRange.max - priceRange.min) / 20;
          const isInRange = bucketStart >= localRange[0] && bucketEnd <= localRange[1];
          
          return (
            <div
              key={i}
              className={`flex-1 rounded-t transition-colors ${
                isInRange ? 'bg-brand-500' : 'bg-gray-200'
              }`}
              style={{ height: `${Math.max(height, 4)}%` }}
            />
          );
        })}
      </div>

      {/* Slider */}
      <Slider
        min={priceRange.min}
        max={priceRange.max}
        step={10}
        value={localRange}
        onValueChange={handleSliderChange}
        className="relative z-10 -mt-2"
      />

      {/* Input fields - show converted values for display but store USD values */}
      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1">
          <Input
            type="number"
            value={displayMin}
            onChange={(e) => {
              const value = parseInt(e.target.value) || Math.round(convertPrice(priceRange.min, selectedCurrency));
              // Convert back to USD for storage
              const usdValue = convertToUSD(value, selectedCurrency);
              setLocalRange((prev) => {
                const newRange: [number, number] = [usdValue, prev[1]];
                updateStore(newRange);
                return newRange;
              });
            }}
            className="text-sm h-9"
            min={Math.round(convertPrice(priceRange.min, selectedCurrency))}
            max={displayMax}
          />
        </div>
        <span className="text-gray-400">–</span>
        <div className="flex-1">
          <Input
            type="number"
            value={displayMax}
            onChange={(e) => {
              const value = parseInt(e.target.value) || Math.round(convertPrice(priceRange.max, selectedCurrency));
              // Convert back to USD for storage
              const usdValue = convertToUSD(value, selectedCurrency);
              setLocalRange((prev) => {
                const newRange: [number, number] = [prev[0], usdValue];
                updateStore(newRange);
                return newRange;
              });
            }}
            className="text-sm h-9"
            min={displayMin}
            max={Math.round(convertPrice(priceRange.max, selectedCurrency))}
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">
        {formattedRange}
      </p>
    </div>
  );
});
