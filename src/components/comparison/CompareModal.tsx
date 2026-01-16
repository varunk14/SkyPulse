"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Plane, Clock, DollarSign } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { useBookingStore } from "@/store/bookingStore";
import { parseDuration, formatTime, getStopsCount } from "@/lib/formatters";
import { formatPrice } from "@/lib/currency";
import { BookingWizard } from "@/components/booking/BookingWizard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CompareModal({ isOpen, onClose }: Props) {
  const { compareFlights, clearCompare, removeFromCompare, selectedCurrency } = useSearchStore();
  const { setSelectedFlight } = useBookingStore();
  const [showWizard, setShowWizard] = useState(false);
  const flightCount = compareFlights.length;

  // Dynamic grid columns based on flight count (for desktop only)
  const gridClass = flightCount === 2 
    ? "grid grid-cols-[150px_1fr_1fr] sm:grid-cols-[200px_1fr_1fr] gap-2 sm:gap-4 min-w-[500px]"
    : flightCount === 3
    ? "grid grid-cols-[150px_1fr_1fr_1fr] sm:grid-cols-[200px_1fr_1fr_1fr] gap-2 sm:gap-4 min-w-[600px]"
    : "grid grid-cols-[150px_1fr] sm:grid-cols-[200px_1fr] gap-2 sm:gap-4 min-w-[400px]";

  // Find best values
  const prices = compareFlights.map((f) => parseFloat(f.price.grandTotal));
  const bestPrice = Math.min(...prices);
  
  const durations = compareFlights.map((f) => {
    return parseDuration(f.itineraries[0].duration);
  });
  const bestDuration = Math.min(...durations);

  const getStops = (flight: typeof compareFlights[0]) => {
    return getStopsCount(flight.itineraries[0].segments);
  };
  const stops = compareFlights.map(getStops);
  const bestStops = Math.min(...stops);

  const handleSelectFlight = (flight: typeof compareFlights[0]) => {
    // Set the selected flight in the booking store
    setSelectedFlight(flight);
    // Open the booking wizard
    setShowWizard(true);
  };

  const handleWizardClose = () => {
    setShowWizard(false);
    // Clear compare selections and close modal when wizard closes
    clearCompare();
    onClose();
  };

  // Helper to get flight index for best value checks
  const getFlightIndex = (flight: typeof compareFlights[0]) => {
    return compareFlights.findIndex(f => f.id === flight.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal - responsive width */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] lg:w-full lg:max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
          >
            {/* Header - responsive padding */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b px-4 lg:px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-base lg:text-xl font-bold">Compare Flights</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                aria-label="Close comparison modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content area - scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-65px)]">
              {/* ===== MOBILE LAYOUT (hidden on lg+) ===== */}
              <div className="lg:hidden">
                <div className="flex flex-col divide-y">
                  {compareFlights.map((flight) => {
                    const flightIndex = getFlightIndex(flight);
                    const durationMinutes = durations[flightIndex];
                    const hours = Math.floor(durationMinutes / 60);
                    const minutes = durationMinutes % 60;
                    const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                    const flightStops = stops[flightIndex];
                    const lastSegment = flight.itineraries[0].segments.at(-1);
                    const isBestPrice = prices[flightIndex] === bestPrice;
                    const isBestDuration = durations[flightIndex] === bestDuration;
                    const isBestStops = stops[flightIndex] === bestStops;
                    
                    return (
                      <div key={flight.id} className="w-full p-4">
                        <div className="space-y-4">
                          {/* Airline header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-lg">
                                {flight.itineraries[0].segments[0].carrierCode}
                              </div>
                              <div>
                                <p className="font-semibold text-base">
                                  {flight.itineraries[0].segments[0].carrierCode}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {flight.itineraries[0].segments[0].departure.iataCode} → {flight.itineraries[0].segments.at(-1)?.arrival.iataCode}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCompare(flight.id)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                              aria-label="Remove from comparison"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Price - prominent */}
                          <div className={`rounded-xl p-4 text-center ${
                            isBestPrice 
                              ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 ring-2 ring-green-500" 
                              : "bg-gradient-to-br from-brand-50 to-coral-50 dark:from-brand-900/20 dark:to-coral-900/20"
                          }`}>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">💰 Total Price</p>
                            <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                              {formatPrice(parseFloat(flight.price.grandTotal), selectedCurrency)}
                            </p>
                            {isBestPrice && (
                              <span className="inline-block mt-1 text-xs text-green-600 font-medium">✓ Best Price</span>
                            )}
                            <p className="text-xs text-gray-500 mt-1">per person</p>
                          </div>

                          {/* Details grid - 2 columns on mobile */}
                          <div className="grid grid-cols-2 gap-3">
                            {/* Duration */}
                            <div className={`bg-white dark:bg-gray-800 border rounded-lg p-3 ${
                              isBestDuration ? "ring-2 ring-green-500" : ""
                            }`}>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                <Clock className="h-4 w-4" />
                                <span className="text-xs font-medium">Duration</span>
                              </div>
                              <p className="text-base font-bold">{durationText}</p>
                              {isBestDuration && (
                                <span className="text-xs text-green-600 font-medium">✓ Fastest</span>
                              )}
                            </div>

                            {/* Stops */}
                            <div className={`bg-white dark:bg-gray-800 border rounded-lg p-3 ${
                              isBestStops ? "ring-2 ring-green-500" : ""
                            }`}>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                                <Plane className="h-4 w-4" />
                                <span className="text-xs font-medium">Stops</span>
                              </div>
                              <p className={`text-base font-bold ${flightStops === 0 ? "text-green-600" : ""}`}>
                                {flightStops === 0 ? "Nonstop" : `${flightStops} stop${flightStops > 1 ? "s" : ""}`}
                              </p>
                              {isBestStops && (
                                <span className="text-xs text-green-600 font-medium">✓ Best</span>
                              )}
                            </div>

                            {/* Departure */}
                            <div className="bg-white dark:bg-gray-800 border rounded-lg p-3">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Departure</p>
                              <p className="text-lg font-bold">
                                {formatTime(flight.itineraries[0].segments[0].departure.at)}
                              </p>
                            </div>

                            {/* Arrival */}
                            <div className="bg-white dark:bg-gray-800 border rounded-lg p-3">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Arrival</p>
                              <p className="text-lg font-bold">
                                {lastSegment ? formatTime(lastSegment.arrival.at) : ""}
                              </p>
                            </div>
                          </div>

                          {/* Select button - full width */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectFlight(flight)}
                            className="w-full h-12 text-base font-semibold rounded-xl transition-colors bg-brand-500 hover:bg-brand-600 text-white"
                          >
                            Select Flight
                          </motion.button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Hint to add more flights if less than 3 */}
                {compareFlights.length < 3 && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 text-center border-t">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ✨ You can compare up to 3 flights
                    </p>
                  </div>
                )}
              </div>

              {/* ===== DESKTOP LAYOUT (hidden below lg) - Original Grid ===== */}
              <div className="hidden lg:block p-4 sm:p-6 overflow-x-auto">
                <div className="space-y-4">
                  {/* Header Row - Flight Names */}
                  <div className={gridClass}>
                    <div></div>
                    {compareFlights.map((flight) => (
                      <div key={flight.id} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="font-bold text-lg">
                          {flight.itineraries[0].segments[0].carrierCode}
                        </div>
                        <div className="text-sm text-gray-500">
                          {flight.itineraries[0].segments[0].departure.iataCode} → {flight.itineraries[0].segments.at(-1)?.arrival.iataCode}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Row */}
                  <div className={gridClass}>
                    <div className="flex items-center font-medium text-gray-600 dark:text-gray-300">
                      <DollarSign className="h-4 w-4 mr-2" /> Price
                    </div>
                    {compareFlights.map((flight, i) => (
                      <div
                        key={flight.id}
                        className={`text-center p-4 rounded-xl ${
                          prices[i] === bestPrice ? "bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500" : "bg-gray-50 dark:bg-gray-700"
                        }`}
                      >
                        <span className="text-xl font-bold">{formatPrice(parseFloat(flight.price.grandTotal), selectedCurrency)}</span>
                        {prices[i] === bestPrice && (
                          <span className="ml-2 text-green-600 text-sm font-medium">Best</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Duration Row */}
                  <div className={gridClass}>
                    <div className="flex items-center font-medium text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-2" /> Duration
                    </div>
                    {compareFlights.map((flight, i) => {
                      const durationMinutes = durations[i];
                      const hours = Math.floor(durationMinutes / 60);
                      const minutes = durationMinutes % 60;
                      const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                      
                      return (
                        <div
                          key={flight.id}
                          className={`text-center p-4 rounded-xl ${
                            durations[i] === bestDuration ? "bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500" : "bg-gray-50 dark:bg-gray-700"
                          }`}
                        >
                          <span className="text-xl font-semibold">{durationText}</span>
                          {durations[i] === bestDuration && (
                            <span className="ml-2 text-green-600 text-sm font-medium">Fastest</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Stops Row */}
                  <div className={gridClass}>
                    <div className="flex items-center font-medium text-gray-600 dark:text-gray-300">
                      <Plane className="h-4 w-4 mr-2" /> Stops
                    </div>
                    {compareFlights.map((flight, i) => (
                      <div
                        key={flight.id}
                        className={`text-center p-4 rounded-xl ${
                          stops[i] === bestStops ? "bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500" : "bg-gray-50 dark:bg-gray-700"
                        }`}
                      >
                        <span className="text-xl font-semibold">
                          {stops[i] === 0 ? "Nonstop" : `${stops[i]} stop${stops[i] > 1 ? "s" : ""}`}
                        </span>
                        {stops[i] === bestStops && (
                          <span className="ml-2 text-green-600 text-sm font-medium">Best</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Departure Time Row */}
                  <div className={gridClass}>
                    <div className="flex items-center font-medium text-gray-600 dark:text-gray-300">
                      Departure
                    </div>
                    {compareFlights.map((flight) => (
                      <div key={flight.id} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <span className="text-xl font-semibold">
                          {formatTime(flight.itineraries[0].segments[0].departure.at)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Arrival Time Row */}
                  <div className={gridClass}>
                    <div className="flex items-center font-medium text-gray-600 dark:text-gray-300">
                      Arrival
                    </div>
                    {compareFlights.map((flight) => {
                      const lastSegment = flight.itineraries[0].segments.at(-1);
                      return (
                        <div key={flight.id} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <span className="text-xl font-semibold">
                            {lastSegment ? formatTime(lastSegment.arrival.at) : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Select Winner Row */}
                  <div className={gridClass}>
                    <div></div>
                    {compareFlights.map((flight) => (
                      <motion.button
                        key={flight.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="py-3 font-semibold rounded-xl transition-colors bg-brand-500 hover:bg-brand-600 text-white"
                        onClick={() => handleSelectFlight(flight)}
                      >
                        Select Flight
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booking Wizard */}
          <BookingWizard
            isOpen={showWizard}
            onClose={handleWizardClose}
          />
        </>
      )}
    </AnimatePresence>
  );
}
