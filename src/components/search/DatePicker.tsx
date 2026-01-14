'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder: string;
  minDate?: Date;
  disabled?: boolean;
}

export function DatePicker({ value, onChange, placeholder, minDate, disabled }: DatePickerProps) {
  const ariaLabel = value 
    ? `${placeholder} date: ${format(value, 'EEEE, MMMM d, yyyy')}` 
    : `Select ${placeholder.toLowerCase()} date`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn(
            "w-full justify-start text-left font-normal h-14 px-4",
            "bg-white hover:bg-gray-50 border-gray-200",
            "transition-all duration-200",
            !value && "text-gray-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-brand-600" aria-hidden="true" />
          <div className="flex flex-col items-start">
            {value ? (
              <>
                <span className="font-semibold text-gray-900">
                  {format(value, 'EEE, MMM d')}
                </span>
                <span className="text-xs text-gray-500">
                  {format(value, 'yyyy')}
                </span>
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={(date) => onChange(date || null)}
          disabled={(date) => minDate ? date < minDate : date < new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
