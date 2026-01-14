'use client';

import { useState } from 'react';
import { Users, Plus, Minus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerSelectProps {
  value: PassengerCounts;
  onChange: (counts: PassengerCounts) => void;
}

export function PassengerSelect({ value, onChange }: PassengerSelectProps) {
  const [open, setOpen] = useState(false);
  
  const total = value.adults + value.children + value.infants;

  const updateCount = (type: keyof PassengerCounts, delta: number) => {
    const newValue = { ...value };
    newValue[type] = Math.max(type === 'adults' ? 1 : 0, newValue[type] + delta);
    
    // Infants cannot exceed adults
    if (type === 'adults' && newValue.infants > newValue.adults) {
      newValue.infants = newValue.adults;
    }
    
    // Max 9 passengers total
    const newTotal = newValue.adults + newValue.children + newValue.infants;
    if (newTotal <= 9) {
      onChange(newValue);
    }
  };

  const travelerSummary = [
    `${value.adults} Adult${value.adults !== 1 ? 's' : ''}`,
    value.children > 0 ? `${value.children} Child${value.children !== 1 ? 'ren' : ''}` : null,
    value.infants > 0 ? `${value.infants} Infant${value.infants !== 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(', ');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label={`${total} ${total === 1 ? 'Traveler' : 'Travelers'}: ${travelerSummary}`}
          aria-expanded={open}
          className={cn(
            "w-full justify-start text-left font-normal h-14 px-4",
            "bg-white hover:bg-gray-50 border-gray-200",
            "transition-all duration-200"
          )}
        >
          <Users className="mr-3 h-5 w-5 text-brand-600" aria-hidden="true" />
          <div className="flex flex-col items-start">
            <span className="font-semibold text-gray-900">
              {total} {total === 1 ? 'Traveler' : 'Travelers'}
            </span>
            <span className="text-xs text-gray-500">
              {value.adults} Adult{value.adults !== 1 ? 's' : ''}
              {value.children > 0 && `, ${value.children} Child${value.children !== 1 ? 'ren' : ''}`}
              {value.infants > 0 && `, ${value.infants} Infant${value.infants !== 1 ? 's' : ''}`}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <PassengerCounter
            label="Adults"
            description="12 years and older"
            value={value.adults}
            min={1}
            max={9 - value.children - value.infants}
            onChange={(v) => updateCount('adults', v - value.adults)}
          />
          <PassengerCounter
            label="Children"
            description="2-11 years"
            value={value.children}
            min={0}
            max={9 - value.adults - value.infants}
            onChange={(v) => updateCount('children', v - value.children)}
          />
          <PassengerCounter
            label="Infants"
            description="Under 2, on lap"
            value={value.infants}
            min={0}
            max={Math.min(value.adults, 9 - value.adults - value.children)}
            onChange={(v) => updateCount('infants', v - value.infants)}
          />
        </div>
        <Button
          className="w-full mt-4 bg-brand-600 hover:bg-brand-700"
          onClick={() => setOpen(false)}
        >
          Done
        </Button>
      </PopoverContent>
    </Popover>
  );
}

interface PassengerCounterProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function PassengerCounter({ label, description, value, min, max, onChange }: PassengerCounterProps) {
  return (
    <div className="flex items-center justify-between" role="group" aria-labelledby={`${label.toLowerCase()}-label`}>
      <div>
        <p id={`${label.toLowerCase()}-label`} className="font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </Button>
        <span className="w-6 text-center font-semibold" aria-live="polite" aria-atomic="true">{value}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
