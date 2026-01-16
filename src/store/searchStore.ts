import { create } from 'zustand';
import { SearchParams, FilterState, FlightOffer } from '@/types';
import { parseDuration } from '@/lib/formatters';
import { Currency } from '@/lib/currency';

interface SearchStore {
  // Search params
  searchParams: SearchParams;
  setSearchParams: (params: Partial<SearchParams>) => void;
  
  // Results
  flights: FlightOffer[];
  setFlights: (flights: FlightOffer[]) => void;
  
  // Filters - supports both object and callback style
  filters: FilterState;
  setFilters: (filters: Partial<FilterState> | ((prev: FilterState) => Partial<FilterState>)) => void;
  resetFilters: () => void;
  
  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  hasSearched: boolean;
  setHasSearched: (value: boolean) => void;
  
  // Airlines dictionary (from API response)
  airlinesDictionary: Record<string, string>;
  setAirlinesDictionary: (dict: Record<string, string>) => void;
  
  // Comparison state
  compareFlights: FlightOffer[];
  addToCompare: (flight: FlightOffer) => void;
  removeFromCompare: (flightId: string) => void;
  clearCompare: () => void;
  
  // Currency
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
}

const defaultSearchParams: SearchParams = {
  origin: null,
  destination: null,
  departureDate: null,
  returnDate: null,
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  cabinClass: 'ECONOMY',
  tripType: 'roundTrip',
};

const defaultFilters: FilterState = {
  stops: [],
  priceRange: [0, 10000],
  airlines: [],
  departureTime: [0, 24],
  arrivalTime: [0, 24],
  duration: 1440, // 24 hours in minutes
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  // Search params
  searchParams: defaultSearchParams,
  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),

  // Results
  flights: [],
  setFlights: (flights) => {
    // Calculate dynamic ranges from flights
    if (flights.length > 0) {
      const prices = flights.map((f) => parseFloat(f.price.grandTotal));
      const durations = flights.map((f) => parseDuration(f.itineraries[0].duration));
      
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      const maxDuration = Math.max(...durations);

      set({
        flights,
        filters: {
          stops: [],
          priceRange: [minPrice, maxPrice],
          airlines: [],
          departureTime: [0, 24],
          arrivalTime: [0, 24],
          duration: maxDuration,
        },
      });
    } else {
      set({ flights, filters: defaultFilters });
    }
  },

  // Filters - supports both object and callback style for flexibility
  filters: defaultFilters,
  setFilters: (filtersOrCallback) =>
    set((state) => {
      const newFilters = typeof filtersOrCallback === 'function'
        ? filtersOrCallback(state.filters)
        : filtersOrCallback;
      return {
        filters: { ...state.filters, ...newFilters },
      };
    }),
  resetFilters: () => {
    const { flights } = get();
    if (flights.length > 0) {
      const prices = flights.map((f) => parseFloat(f.price.grandTotal));
      const durations = flights.map((f) => parseDuration(f.itineraries[0].duration));
      
      set({
        filters: {
          stops: [],
          priceRange: [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))],
          airlines: [],
          departureTime: [0, 24],
          arrivalTime: [0, 24],
          duration: Math.max(...durations),
        },
      });
    } else {
      set({ filters: defaultFilters });
    }
  },

  // UI state
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
  hasSearched: false,
  setHasSearched: (value) => set({ hasSearched: value }),

  // Airlines dictionary
  airlinesDictionary: {},
  setAirlinesDictionary: (airlinesDictionary) => set({ airlinesDictionary }),

  // Comparison state
  compareFlights: [],
  addToCompare: (flight) => {
    set((state) => {
      if (state.compareFlights.length >= 3) return state; // Max 3
      if (state.compareFlights.find((f) => f.id === flight.id)) return state; // No duplicates
      return { compareFlights: [...state.compareFlights, flight] };
    });
  },
  removeFromCompare: (flightId) => {
    set((state) => ({
      compareFlights: state.compareFlights.filter((f) => f.id !== flightId),
    }));
  },
  clearCompare: () => set({ compareFlights: [] }),
  
  // Currency
  selectedCurrency: 'USD' as Currency,
  setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
}));
