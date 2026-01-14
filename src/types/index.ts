// Airport types
export interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
  countryName: string;
}

// Search parameters
export interface SearchParams {
  origin: Airport | null;
  destination: Airport | null;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  tripType: 'roundTrip' | 'oneWay';
}

// Flight offer types
export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  carrierName?: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string;
  numberOfStops: number;
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightPrice {
  currency: string;
  total: string;
  base: string;
  grandTotal: string;
}

export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: FlightItinerary[];
  price: FlightPrice;
  validatingAirlineCodes: string[];
  travelerPricings: any[];
}

// Filter types
export interface FilterState {
  stops: number[];         // [0, 1, 2] for nonstop, 1 stop, 2+ stops
  priceRange: [number, number];
  airlines: string[];
  departureTime: [number, number]; // hours 0-24
  arrivalTime: [number, number];
  duration: number;        // max duration in minutes
}

// Price graph data
export interface PriceDataPoint {
  date: string;
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
  flightCount: number;
}
