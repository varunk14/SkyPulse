'use client';

import { useSearchStore } from '@/store/searchStore';
import { format } from 'date-fns';
import { Plane, Calendar, Users, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchSummaryProps {
  onEdit: () => void;
  className?: string;
}

export function SearchSummary({ onEdit, className }: SearchSummaryProps) {
  const { searchParams } = useSearchStore();

  if (!searchParams.origin || !searchParams.destination) {
    return null;
  }

  const totalPassengers = 
    searchParams.passengers.adults + 
    searchParams.passengers.children + 
    searchParams.passengers.infants;

  return (
    <div 
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-4 shadow-sm",
        className
      )}
      role="region"
      aria-label="Search summary"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-hidden">
          {/* Route */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900">{searchParams.origin.iataCode}</span>
              <Plane className="h-3.5 w-3.5 text-brand-600 -rotate-45" aria-hidden="true" />
              <span className="font-bold text-gray-900">{searchParams.destination.iataCode}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 hidden sm:block" aria-hidden="true" />

          {/* Dates */}
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {searchParams.departureDate && format(searchParams.departureDate, 'MMM d')}
              {searchParams.returnDate && searchParams.tripType === 'roundTrip' && (
                <> – {format(searchParams.returnDate, 'MMM d')}</>
              )}
            </span>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 hidden md:block" aria-hidden="true" />

          {/* Passengers */}
          <div className="hidden md:flex items-center gap-1.5 text-sm text-gray-600">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{totalPassengers} traveler{totalPassengers !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Edit Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-brand-600 hover:text-brand-700 hover:bg-brand-50 shrink-0"
          aria-label="Edit search"
        >
          Edit
          <ChevronDown className="h-4 w-4 ml-1" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
