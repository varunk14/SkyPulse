"use client";

import { useRecentSearches, RecentSearch } from "@/hooks/useRecentSearches";
import { Clock, X, Plane } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface Props {
  onSelect: (search: RecentSearch) => void;
  isVisible: boolean;
}

export function RecentSearches({ onSelect, isVisible }: Props) {
  const { searches, clearSearches } = useRecentSearches();

  if (!isVisible || searches.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking inside
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Searches
        </span>
        <button
          onClick={clearSearches}
          className="text-xs text-gray-500 hover:text-red-500 transition-colors"
        >
          Clear all
        </button>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {searches.map((search) => (
          <motion.button
            key={search.id}
            onClick={() => onSelect(search)}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            whileHover={{ x: 4 }}
          >
            <Plane className="h-4 w-4 text-brand-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 dark:text-white">
                {search.from.code} → {search.to.code}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {search.from.city} to {search.to.city} · {search.date}
              </div>
            </div>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(search.timestamp, { addSuffix: true })}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
