'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSearchStore } from '@/store/searchStore';
import { CURRENCY_SYMBOLS, CURRENCY_NAMES, Currency } from '@/lib/currency';
import { cn } from '@/lib/utils';

const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'SGD', 'JPY', 'CAD', 'AUD'];

export function CurrencySelector() {
  const [open, setOpen] = useState(false);
  const { selectedCurrency, setSelectedCurrency } = useSearchStore();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 sm:h-10 px-2 sm:px-3 gap-1 sm:gap-2 bg-white hover:bg-gray-50 border-gray-200"
        >
          <span className="font-semibold">{CURRENCY_SYMBOLS[selectedCurrency]}</span>
          <span className="text-gray-600 hidden sm:inline">{selectedCurrency}</span>
          <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:inline" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-1">
          {CURRENCIES.map((currency) => (
            <button
              key={currency}
              onClick={() => {
                setSelectedCurrency(currency);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                selectedCurrency === currency
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold w-6">{CURRENCY_SYMBOLS[currency]}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{currency}</span>
                  <span className="text-xs text-gray-500">{CURRENCY_NAMES[currency]}</span>
                </div>
              </div>
              {selectedCurrency === currency && (
                <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
