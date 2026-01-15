'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchForm } from '@/components/search/SearchForm';
import { SearchSummary } from '@/components/search/SearchSummary';
import { FlightList } from '@/components/results/FlightList';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { PriceGraph } from '@/components/graph/PriceGraph';
import { KeyboardShortcutsModal } from '@/components/shared/KeyboardShortcutsModal';
import { CompareBar } from '@/components/comparison/CompareBar';
import { useSearchStore } from '@/store/searchStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { cn } from '@/lib/utils';
import { Airport } from '@/types';
import { parseISO } from 'date-fns';

export default function Home() {
  const { flights, searchParams, setSearchParams } = useSearchStore();
  const hasResults = flights.length > 0;
  const hasSearched = searchParams.origin && searchParams.destination;
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [urlParamsLoaded, setUrlParamsLoaded] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const originInputRef = useRef<HTMLButtonElement | null>(null);

  // Load search parameters from URL on mount - only for shared links
  useEffect(() => {
    if (urlParamsLoaded) return;

    const params = new URLSearchParams(window.location.search);
    const isShared = params.get("shared") === "true";
    
    // Check if user has already visited this session (refresh detection)
    const hasVisited = sessionStorage.getItem("skypulse-visited");

    // Only fill form if:
    // 1. URL has "shared=true" flag (it's a shared link)
    // 2. User hasn't visited yet this session (not a refresh)
    if (isShared && !hasVisited) {
      const from = params.get("from");
      const to = params.get("to");
      const departure = params.get("departure");
      const returnDate = params.get("return");
      const passengers = params.get("passengers");
      const children = params.get("children");
      const infants = params.get("infants");
      const cabinClass = params.get("class");
      const tripType = params.get("tripType");

      if (from && to && departure) {
        // Fetch airports by IATA code
        const loadAirportsFromURL = async () => {
          try {
            const [originRes, destRes] = await Promise.all([
              fetch(`/api/airports/search?keyword=${encodeURIComponent(from)}`),
              fetch(`/api/airports/search?keyword=${encodeURIComponent(to)}`)
            ]);

            const originData = await originRes.json();
            const destData = await destRes.json();

            // Find exact match by IATA code
            const originAirport = originData.data?.find((a: Airport) => a.iataCode === from);
            const destAirport = destData.data?.find((a: Airport) => a.iataCode === to);

            if (originAirport && destAirport) {
              const departureDate = parseISO(departure);
              const returnDateObj = returnDate ? parseISO(returnDate) : null;

              setSearchParams({
                origin: originAirport,
                destination: destAirport,
                departureDate: departureDate,
                returnDate: returnDateObj,
                passengers: {
                  adults: passengers ? parseInt(passengers) : 1,
                  children: children ? parseInt(children) : 0,
                  infants: infants ? parseInt(infants) : 0,
                },
                cabinClass: (cabinClass as any) || 'ECONOMY',
                tripType: (tripType as any) || 'roundTrip',
              });
            }
          } catch (error) {
            console.error('Failed to load airports from URL:', error);
          }
        };

        loadAirportsFromURL();
      }
    }

    // Mark as visited for this session (prevents filling on refresh)
    sessionStorage.setItem("skypulse-visited", "true");

    // Clear URL params after reading (keeps URL clean)
    if (window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }

    setUrlParamsLoaded(true);
  }, [urlParamsLoaded, setSearchParams]);

  // Collapse search form when results come in
  useEffect(() => {
    if (hasResults) {
      setIsSearchExpanded(false);
    }
  }, [hasResults]);

  // Keyboard shortcuts (only active on devices with physical keyboards)
  // Note: Shortcuts automatically detect if device has physical keyboard
  useKeyboardShortcuts([
    {
      key: "/",
      action: () => {
        if (originInputRef.current) {
          originInputRef.current.click();
        }
      },
    },
    {
      key: "Escape",
      action: () => {
        setShowShortcuts(false);
        (document.activeElement as HTMLElement)?.blur();
      },
    },
    {
      key: "?",
      shift: true,
      action: () => setShowShortcuts(true),
    },
    {
      key: "f",
      action: () => {
        if (hasResults) {
          // Toggle filter panel on mobile (click the filter button)
          // Look for the Sheet trigger button that contains "Filters"
          const filterButtons = Array.from(document.querySelectorAll('button'));
          const filterButton = filterButtons.find(btn => {
            const text = btn.textContent || '';
            return text.includes('Filters') && btn.closest('[class*="lg:hidden"]');
          });
          if (filterButton instanceof HTMLElement) {
            filterButton.click();
          }
        }
      },
    },
    {
      key: "s",
      action: () => {
        if (hasResults) {
          const url = new URL(window.location.href);
          url.searchParams.set("shared", "true");
          navigator.clipboard.writeText(url.toString()).then(() => {
            // Show brief feedback (you could add a toast here)
            console.log("URL copied to clipboard");
          });
        }
      },
    },
    {
      key: "k",
      meta: true,
      action: () => {
        if (originInputRef.current) {
          originInputRef.current.click();
        }
      },
    },
  ]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-50/30 flex flex-col"
    >
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="SkyPulse Logo" 
              className="h-10 w-10 rounded-lg object-contain"
            />
            <span className="font-bold text-xl text-gray-900">SkyPulse</span>
          </div>
          <button
            onClick={() => setShowShortcuts(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            title="Keyboard shortcuts (Shift+?)"
            aria-label="Show keyboard shortcuts"
          >
            <span className="text-sm font-mono font-semibold">?</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section id="main-content" className="w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Hero - Only show when no results */}
          <AnimatePresence>
            {!hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                  Find Your Perfect{' '}
                  <span className="bg-gradient-to-r from-brand-600 to-coral-500 bg-clip-text text-transparent">
                    Flight
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
                  Compare prices from hundreds of airlines and travel sites
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Section */}
          <div className="mb-6 relative" style={{ zIndex: 100 }}>
            {hasResults && !isSearchExpanded ? (
              /* Collapsed Summary */
              <SearchSummary 
                onEdit={() => setIsSearchExpanded(true)}
                className="animate-fade-in"
              />
            ) : (
              /* Full Search Form */
              <div className={cn(
                "transition-all duration-300",
                hasResults ? "animate-slide-down" : ""
              )}>
                <SearchForm originInputRef={originInputRef} />
              </div>
            )}
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {hasResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
                style={{ zIndex: 1 }}
              >
                {/* Price Graph */}
                <div className="mb-6">
                  <PriceGraph />
                </div>

                {/* Filter + Results Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Mobile Filter Button */}
                  <motion.div 
                    className="lg:hidden flex gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FilterPanel />
                  </motion.div>

                  {/* Desktop Sidebar */}
                  <aside className="hidden lg:block w-72 shrink-0" aria-label="Flight filters">
                    <div className="sticky top-24">
                      <FilterPanel />
                    </div>
                  </aside>

                  {/* Results */}
                  <div className="flex-1 min-w-0">
                    <FlightList />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Initial Empty State */}
          {!hasResults && (
            <div className="mt-8">
              <FlightList />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100 bg-white/50 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SkyPulse. Flight data provided by Amadeus.</p>
          <nav aria-label="Footer navigation">
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded">Privacy</a>
              <a href="#" className="hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded">Terms</a>
              <a href="#" className="hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded">Contact</a>
            </div>
          </nav>
        </div>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Compare Bar */}
      <CompareBar />
    </motion.main>
  );
}
