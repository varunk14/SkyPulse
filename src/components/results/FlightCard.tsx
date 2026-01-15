'use client';

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plane, Clock, Briefcase, Check, Plus } from 'lucide-react';
import { FlightOffer } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearchStore } from '@/store/searchStore';
import {
  formatTime,
  formatIsoDuration,
  formatPrice,
  getStopsCount,
  getStopsLabel,
  getAirlineLogo,
  isNextDay,
} from '@/lib/formatters';

// Badge pop animation variant
const badgeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 500, damping: 15, delay: 0.3 }
  }
};

interface FlightCardProps {
  flight: FlightOffer;
  airlineNames: Record<string, string>;
  isCheapest?: boolean;
  isFastest?: boolean;
  rank?: number;
}

export const FlightCard = memo(function FlightCard({ 
  flight, 
  airlineNames, 
  isCheapest, 
  isFastest,
}: FlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { compareFlights, addToCompare, removeFromCompare } = useSearchStore();
  const isInCompare = compareFlights.some((f) => f.id === flight.id);
  
  const outbound = flight.itineraries[0];
  const returnFlight = flight.itineraries[1];
  const price = parseFloat(flight.price.grandTotal);
  const currency = flight.price.currency;
  const mainCarrier = flight.validatingAirlineCodes[0];
  const airlineName = airlineNames[mainCarrier] || mainCarrier;

  return (
    <motion.div
      whileHover={{ 
        scale: 1.015, 
        boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.995 }}
      className={cn(
        "relative bg-white rounded-xl border transition-colors duration-200",
        "hover:border-brand-200",
        isExpanded ? "border-brand-300 shadow-md" : "border-gray-100 shadow-sm"
      )}
      role="article"
      aria-label={`Flight by ${airlineName} for ${formatPrice(price, currency)}`}
    >
      {/* Compare Checkbox Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          isInCompare ? removeFromCompare(flight.id) : addToCompare(flight);
        }}
        className={cn(
          "absolute top-2 right-2 p-1.5 rounded-lg border transition-all z-10",
          isInCompare 
            ? "bg-brand-500 border-brand-500 text-white" 
            : "bg-white border-gray-200 hover:border-brand-500 hover:bg-brand-50 text-gray-400 hover:text-brand-500"
        )}
        title={isInCompare ? "Remove from compare" : "Add to compare"}
        aria-label={isInCompare ? "Remove from compare" : "Add to compare"}
      >
        {isInCompare ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      </button>

      {/* Main Content */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Airline Info */}
          <div className="flex items-center gap-3 lg:w-40 shrink-0">
            <img
              src={getAirlineLogo(mainCarrier)}
              alt={airlineName}
              className="h-10 w-10 rounded-lg object-contain bg-gray-50 p-1"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center';
                fallback.innerHTML = `<span class="text-xs font-bold text-gray-500">${mainCarrier}</span>`;
                target.parentElement?.appendChild(fallback);
              }}
            />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{airlineName}</p>
              <p className="text-xs text-gray-500">{mainCarrier}</p>
            </div>
          </div>

          {/* Flight Timeline - Outbound */}
          <div className="flex-1">
            <FlightTimeline
              itinerary={outbound}
            />
            
            {/* Return Flight */}
            {returnFlight && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <FlightTimeline
                  itinerary={returnFlight}
                  isReturn
                />
              </div>
            )}
          </div>

          {/* Price & Actions */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 lg:w-36 shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {isCheapest && (
                <motion.div
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
                    Best price
                  </Badge>
                </motion.div>
              )}
              {isFastest && (
                <motion.div
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">
                    Fastest
                  </Badge>
                </motion.div>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 font-mono">
                {formatPrice(price, currency)}
              </p>
              <p className="text-xs text-gray-500">per person</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expand Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full px-6 py-3 border-t border-gray-100",
          "flex items-center justify-center gap-2",
          "text-sm font-medium text-gray-600 hover:text-brand-600",
          "bg-gray-50/50 hover:bg-gray-50 transition-colors"
        )}
      >
        {isExpanded ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Hide details
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            Flight details
          </>
        )}
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-100">
              <FlightDetails
                flight={flight}
                airlineNames={airlineNames}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// Flight Timeline Sub-component
interface FlightTimelineProps {
  itinerary: FlightOffer['itineraries'][0];
  isReturn?: boolean;
}

function FlightTimeline({ itinerary }: FlightTimelineProps) {
  const segments = itinerary.segments;
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const stops = getStopsCount(segments);
  const stopsLabel = getStopsLabel(stops);
  const nextDay = isNextDay(firstSegment.departure.at, lastSegment.arrival.at);

  // Get layover airports for display
  const layoverAirports = stops > 0 
    ? segments.slice(0, -1).map(s => s.arrival.iataCode).join(', ')
    : null;

  return (
    <div className="flex items-center gap-4">
      {/* Departure */}
      <div className="text-center shrink-0">
        <p className="text-xl font-bold text-gray-900">
          {formatTime(firstSegment.departure.at)}
        </p>
        <p className="text-sm font-medium text-gray-600">
          {firstSegment.departure.iataCode}
        </p>
      </div>

      {/* Duration & Stops */}
      <div className="flex-1 px-2">
        <div className="flex items-center gap-2 justify-center mb-1">
          <Clock className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs font-medium text-gray-500">
            {formatIsoDuration(itinerary.duration)}
          </span>
        </div>
        <div className="relative">
          <div className="h-0.5 bg-gray-200 rounded-full" />
          {stops > 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(stops, 2) }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 w-2 rounded-full bg-gray-400 border-2 border-white"
                  />
                ))}
              </div>
            </div>
          )}
          <Plane className="absolute -right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-brand-600" />
        </div>
        <p className={cn(
          "text-xs text-center mt-1",
          stops === 0 ? "text-emerald-600 font-medium" : "text-gray-500"
        )}>
          {stopsLabel}
          {layoverAirports && (
            <span className="text-gray-400"> · {layoverAirports}</span>
          )}
        </p>
      </div>

      {/* Arrival */}
      <div className="text-center shrink-0">
        <p className="text-xl font-bold text-gray-900">
          {formatTime(lastSegment.arrival.at)}
          {nextDay && (
            <sup className="text-xs text-coral-500 ml-0.5">+1</sup>
          )}
        </p>
        <p className="text-sm font-medium text-gray-600">
          {lastSegment.arrival.iataCode}
        </p>
      </div>
    </div>
  );
}

// Flight Details Sub-component
interface FlightDetailsProps {
  flight: FlightOffer;
  airlineNames: Record<string, string>;
}

function FlightDetails({ flight, airlineNames }: FlightDetailsProps) {
  return (
    <div className="pt-4 space-y-6">
      {flight.itineraries.map((itinerary, itinIndex) => (
        <div key={itinIndex}>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Plane className={cn(
              "h-4 w-4",
              itinIndex === 0 ? "text-brand-600" : "text-brand-600 rotate-180"
            )} aria-hidden="true" />
            {itinIndex === 0 ? 'Outbound' : 'Return'} Flight
          </h4>
          
          <div className="space-y-3">
            {itinerary.segments.map((segment, segIndex) => (
              <div
                key={segIndex}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <img
                  src={getAirlineLogo(segment.carrierCode)}
                  alt={airlineNames[segment.carrierCode] || segment.carrierCode}
                  className="h-8 w-8 rounded object-contain bg-white p-0.5"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      {airlineNames[segment.carrierCode] || segment.carrierCode}{' '}
                      <span className="text-gray-500 font-normal">
                        {segment.carrierCode}{segment.number}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatIsoDuration(segment.duration)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div>
                      <span className="font-semibold">{formatTime(segment.departure.at)}</span>
                      <span className="text-gray-500 ml-1">{segment.departure.iataCode}</span>
                      {segment.departure.terminal && (
                        <span className="text-gray-400 text-xs ml-1">T{segment.departure.terminal}</span>
                      )}
                    </div>
                    <span className="text-gray-400" aria-hidden="true">→</span>
                    <div>
                      <span className="font-semibold">{formatTime(segment.arrival.at)}</span>
                      <span className="text-gray-500 ml-1">{segment.arrival.iataCode}</span>
                      {segment.arrival.terminal && (
                        <span className="text-gray-400 text-xs ml-1">T{segment.arrival.terminal}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Aircraft: {segment.aircraft.code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Booking Info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" aria-hidden="true" />
            <span>{flight.numberOfBookableSeats} seats left</span>
          </div>
        </div>
        <Button className="bg-brand-600 hover:bg-brand-700 text-white">
          Select Flight
        </Button>
      </div>
    </div>
  );
}
