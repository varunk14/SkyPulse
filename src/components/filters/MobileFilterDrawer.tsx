'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import { FilterPanel } from './FilterPanel';
import { useSearchStore } from '@/store/searchStore';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileFilterDrawer() {
  const [open, setOpen] = useState(false);
  const { flights } = useSearchStore();

  return (
    <>
      {/* Trigger button - ONLY shows on mobile */}
      <Button 
        onClick={() => setOpen(true)}
        variant="outline" 
        className="lg:hidden w-full h-12 gap-2 sticky top-16 z-10 bg-white"
      >
        <SlidersHorizontal className="h-5 w-5" />
        <span className="font-semibold">Filters & Sort</span>
        <span className="ml-auto text-xs text-gray-500 bg-brand-50 px-2 py-1 rounded-full">
          {flights.length} flights
        </span>
      </Button>

      {/* Drawer - ONLY on mobile */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Filter content - scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <FilterPanel />
              </div>

              {/* Apply button */}
              <div className="border-t px-6 py-4">
                <Button 
                  onClick={() => setOpen(false)}
                  className="w-full h-12 text-base font-semibold"
                >
                  Show {flights.length} Results
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
