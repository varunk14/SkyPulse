"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Plane, Clock, DollarSign, Loader2 } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { parseDuration, formatPrice, formatTime, getStopsCount, formatDate } from "@/lib/formatters";
import { BookingSuccessModal } from "@/components/BookingSuccessModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CompareModal({ isOpen, onClose }: Props) {
  const { compareFlights } = useSearchStore();
  const flightCount = compareFlights.length;

  // Dynamic grid columns based on flight count
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

  const [bookingFlightId, setBookingFlightId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<any>(null);

  const handleSelectFlight = async (flight: typeof compareFlights[0]) => {
    // Show loading state
    setBookingFlightId(flight.id);
    
    // Simulate booking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Prepare booking details
    const outbound = flight.itineraries[0];
    const bookingDetails = {
      bookingReference: 'SP' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      origin: outbound.segments[0].departure.iataCode,
      destination: outbound.segments[outbound.segments.length - 1].arrival.iataCode,
      departureDate: formatDate(outbound.segments[0].departure.at),
      totalPrice: formatPrice(flight.price.grandTotal, flight.price.currency)
    };
    
    setBookingFlightId(null);
    setSelectedBookingDetails(bookingDetails);
    setShowSuccessModal(true);
    // Don't close comparison modal yet - let user see the confetti!
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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] sm:w-full max-w-4xl max-h-[90vh] overflow-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold">Compare Flights</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                aria-label="Close comparison modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Comparison Table */}
            <div className="p-4 sm:p-6 overflow-x-auto">
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
                      <span className="text-xl font-bold">{formatPrice(flight.price.grandTotal, flight.price.currency)}</span>
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
                      whileHover={{ scale: bookingFlightId === flight.id ? 1 : 1.02 }}
                      whileTap={{ scale: bookingFlightId === flight.id ? 1 : 0.98 }}
                      disabled={bookingFlightId === flight.id}
                      className={`py-3 font-semibold rounded-xl transition-colors ${
                        bookingFlightId === flight.id
                          ? "bg-brand-400 text-white cursor-wait"
                          : "bg-brand-500 hover:bg-brand-600 text-white"
                      }`}
                      onClick={() => handleSelectFlight(flight)}
                    >
                      {bookingFlightId === flight.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        'Select Flight'
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booking Success Modal */}
          <BookingSuccessModal
            isOpen={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              setSelectedBookingDetails(null);
              onClose(); // Now close the comparison modal too
            }}
            bookingDetails={selectedBookingDetails}
          />
        </>
      )}
    </AnimatePresence>
  );
}
