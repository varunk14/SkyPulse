'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Plane, MapPin, Loader2 } from 'lucide-react';
import { Airport } from '@/types';
import { cn } from '@/lib/utils';

interface AirportSelectProps {
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  placeholder: string;
  icon?: 'departure' | 'arrival';
}

export const AirportSelect = React.forwardRef<HTMLButtonElement, AirportSelectProps>(
  ({ value, onChange, placeholder, icon = 'departure' }, ref) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    if (query.length < 2) {
      setAirports([]);
      return;
    }

    // Debounce the API call
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const useMock = typeof window !== 'undefined' && localStorage.getItem('useMockData') === 'true';
        const response = await fetch(`/api/airports/search?keyword=${encodeURIComponent(query)}&useMock=${useMock}`);
        const data = await response.json();
        setAirports(data.data || []);
      } catch (error) {
        console.error('Failed to search airports:', error);
        setAirports([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const IconComponent = icon === 'departure' ? Plane : MapPin;

  const ariaLabel = value 
    ? `${icon === 'departure' ? 'Departure' : 'Arrival'} airport: ${value.cityName}, ${value.iataCode}` 
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className={cn(
            "w-full justify-start text-left font-normal h-14 px-4 relative",
            "bg-white hover:bg-gray-50 border-gray-200",
            "transition-all duration-200",
            !value && "text-gray-500"
          )}
        >
          <IconComponent 
            className={cn(
              "mr-3 h-5 w-5 shrink-0",
              icon === 'departure' ? "text-brand-600 -rotate-45" : "text-coral-500"
            )}
            aria-hidden="true"
          />
          <div className="flex flex-col items-start overflow-hidden flex-1">
            {value ? (
              <>
                <span className="font-semibold text-gray-900 truncate">
                  {value.iataCode}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {value.cityName}, {value.countryName}
                </span>
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          {icon === 'departure' && !value && (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-400 font-mono">
              /
            </kbd>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="start" sideOffset={4} collisionPadding={8}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search cities or airports..."
            value={query}
            onValueChange={setQuery}
            className="h-12"
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
              </div>
            )}
            {!isLoading && query.length >= 2 && airports.length === 0 && (
              <CommandEmpty>No airports found.</CommandEmpty>
            )}
            {!isLoading && airports.length > 0 && (
              <CommandGroup heading="Airports">
                {airports.map((airport, index) => (
                  <CommandItem
                    key={`${airport.iataCode}-${index}`}
                    value={`${airport.iataCode}-${airport.name}`}
                    onSelect={() => {
                      onChange(airport);
                      setOpen(false);
                      setQuery('');
                    }}
                    className="flex items-center gap-3 py-3 cursor-pointer"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-mono font-bold text-sm">
                      {airport.iataCode}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{airport.cityName}</span>
                      <span className="text-xs text-gray-500">{airport.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

AirportSelect.displayName = "AirportSelect";
