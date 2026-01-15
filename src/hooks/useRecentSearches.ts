"use client";

import { useState, useEffect } from "react";

export interface RecentSearch {
  id: string;
  from: { code: string; city: string };
  to: { code: string; city: string };
  date: string;
  timestamp: number;
}

const STORAGE_KEY = "skypulse-recent-searches";
const MAX_SEARCHES = 5;

export function useRecentSearches() {
  const [searches, setSearches] = useState<RecentSearch[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSearches(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse recent searches from localStorage:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Add a new search
  const addSearch = (search: Omit<RecentSearch, "id" | "timestamp">) => {
    const newSearch: RecentSearch = {
      ...search,
      id: `${search.from.code}-${search.to.code}-${Date.now()}`,
      timestamp: Date.now(),
    };

    setSearches((prev) => {
      // Remove duplicate routes
      const filtered = prev.filter(
        (s) => !(s.from.code === search.from.code && s.to.code === search.to.code)
      );
      
      // Add new search at the beginning, keep max 5
      const updated = [newSearch, ...filtered].slice(0, MAX_SEARCHES);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      return updated;
    });
  };

  // Clear all searches
  const clearSearches = () => {
    setSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { searches, addSearch, clearSearches };
}
