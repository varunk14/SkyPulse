"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, GitCompare } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { useState } from "react";
import { CompareModal } from "./CompareModal";

export function CompareBar() {
  const { compareFlights, removeFromCompare, clearCompare } = useSearchStore();
  const [showModal, setShowModal] = useState(false);

  if (compareFlights.length === 0) return null;

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 sm:bottom-6 left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 max-w-4xl mx-auto"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Selected flights preview */}
          <div className="flex items-center gap-2 flex-1 overflow-x-auto">
            {compareFlights.map((flight) => (
              <div
                key={flight.id}
                className="relative bg-gray-100 dark:bg-gray-700 rounded-lg px-2 sm:px-3 py-2 pr-6 sm:pr-8 shrink-0"
              >
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                  {flight.itineraries[0].segments[0].carrierCode} · €{flight.price.grandTotal}
                </span>
                <button
                  onClick={() => removeFromCompare(flight.id)}
                  className="absolute top-1 right-1 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                  aria-label="Remove from compare"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: 3 - compareFlights.length }).map((_, i) => (
              <div
                key={i}
                className="w-20 sm:w-24 h-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-400 text-xs shrink-0"
              >
                +
              </div>
            ))}
          </div>

          {/* Compare button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            disabled={compareFlights.length < 2}
            className={`
              px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shrink-0
              ${compareFlights.length >= 2
                ? "bg-brand-500 text-white hover:bg-brand-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            <GitCompare className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Compare ({compareFlights.length})</span>
          </motion.button>

          {/* Clear button */}
          <button
            onClick={clearCompare}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 shrink-0"
            aria-label="Clear all comparisons"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </motion.div>

      <CompareModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
