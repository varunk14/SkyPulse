import { FlightOffer } from '@/types';

// Mock flight data for testing
export const mockFlights: FlightOffer[] = [
  {
    id: '1',
    source: 'GDS',
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: '2026-02-15',
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: 'PT7H30M',
        segments: [
          {
            departure: {
              iataCode: 'JFK',
              terminal: '1',
              at: '2026-02-15T08:00:00',
            },
            arrival: {
              iataCode: 'LHR',
              terminal: '5',
              at: '2026-02-15T20:30:00',
            },
            carrierCode: 'BA',
            number: '178',
            aircraft: { code: '777' },
            duration: 'PT7H30M',
            numberOfStops: 0,
          },
        ],
      },
      {
        duration: 'PT8H15M',
        segments: [
          {
            departure: {
              iataCode: 'LHR',
              terminal: '5',
              at: '2026-02-22T10:00:00',
            },
            arrival: {
              iataCode: 'JFK',
              terminal: '7',
              at: '2026-02-22T13:15:00',
            },
            carrierCode: 'BA',
            number: '177',
            aircraft: { code: '777' },
            duration: 'PT8H15M',
            numberOfStops: 0,
          },
        ],
      },
    ],
    price: {
      currency: 'USD',
      total: '589.00',
      base: '489.00',
      grandTotal: '589.00',
    },
    validatingAirlineCodes: ['BA'],
    travelerPricings: [],
  },
  {
    id: '2',
    source: 'GDS',
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: '2026-02-15',
    numberOfBookableSeats: 4,
    itineraries: [
      {
        duration: 'PT10H45M',
        segments: [
          {
            departure: {
              iataCode: 'JFK',
              terminal: '4',
              at: '2026-02-15T14:30:00',
            },
            arrival: {
              iataCode: 'CDG',
              terminal: '2E',
              at: '2026-02-15T22:15:00',
            },
            carrierCode: 'AF',
            number: '11',
            aircraft: { code: 'A380' },
            duration: 'PT7H45M',
            numberOfStops: 0,
          },
          {
            departure: {
              iataCode: 'CDG',
              terminal: '2F',
              at: '2026-02-16T00:00:00',
            },
            arrival: {
              iataCode: 'LHR',
              terminal: '4',
              at: '2026-02-16T01:15:00',
            },
            carrierCode: 'AF',
            number: '1680',
            aircraft: { code: 'A320' },
            duration: 'PT1H15M',
            numberOfStops: 0,
          },
        ],
      },
      {
        duration: 'PT9H30M',
        segments: [
          {
            departure: {
              iataCode: 'LHR',
              terminal: '4',
              at: '2026-02-22T11:00:00',
            },
            arrival: {
              iataCode: 'CDG',
              terminal: '2F',
              at: '2026-02-22T13:15:00',
            },
            carrierCode: 'AF',
            number: '1681',
            aircraft: { code: 'A320' },
            duration: 'PT1H15M',
            numberOfStops: 0,
          },
          {
            departure: {
              iataCode: 'CDG',
              terminal: '2E',
              at: '2026-02-22T15:30:00',
            },
            arrival: {
              iataCode: 'JFK',
              terminal: '1',
              at: '2026-02-22T18:30:00',
            },
            carrierCode: 'AF',
            number: '10',
            aircraft: { code: 'A380' },
            duration: 'PT9H00M',
            numberOfStops: 0,
          },
        ],
      },
    ],
    price: {
      currency: 'USD',
      total: '445.00',
      base: '355.00',
      grandTotal: '445.00',
    },
    validatingAirlineCodes: ['AF'],
    travelerPricings: [],
  },
  {
    id: '3',
    source: 'GDS',
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: '2026-02-15',
    numberOfBookableSeats: 7,
    itineraries: [
      {
        duration: 'PT6H55M',
        segments: [
          {
            departure: {
              iataCode: 'JFK',
              terminal: '7',
              at: '2026-02-15T19:00:00',
            },
            arrival: {
              iataCode: 'LHR',
              terminal: '3',
              at: '2026-02-16T06:55:00',
            },
            carrierCode: 'VS',
            number: '10',
            aircraft: { code: 'A350' },
            duration: 'PT6H55M',
            numberOfStops: 0,
          },
        ],
      },
      {
        duration: 'PT8H00M',
        segments: [
          {
            departure: {
              iataCode: 'LHR',
              terminal: '3',
              at: '2026-02-22T09:30:00',
            },
            arrival: {
              iataCode: 'JFK',
              terminal: '4',
              at: '2026-02-22T12:30:00',
            },
            carrierCode: 'VS',
            number: '9',
            aircraft: { code: 'A350' },
            duration: 'PT8H00M',
            numberOfStops: 0,
          },
        ],
      },
    ],
    price: {
      currency: 'USD',
      total: '699.00',
      base: '599.00',
      grandTotal: '699.00',
    },
    validatingAirlineCodes: ['VS'],
    travelerPricings: [],
  },
  {
    id: '4',
    source: 'GDS',
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: '2026-02-15',
    numberOfBookableSeats: 2,
    itineraries: [
      {
        duration: 'PT12H30M',
        segments: [
          {
            departure: {
              iataCode: 'JFK',
              terminal: '1',
              at: '2026-02-15T06:00:00',
            },
            arrival: {
              iataCode: 'FRA',
              terminal: '1',
              at: '2026-02-15T19:30:00',
            },
            carrierCode: 'LH',
            number: '405',
            aircraft: { code: 'A380' },
            duration: 'PT8H30M',
            numberOfStops: 0,
          },
          {
            departure: {
              iataCode: 'FRA',
              terminal: '1',
              at: '2026-02-15T21:00:00',
            },
            arrival: {
              iataCode: 'LHR',
              terminal: '2',
              at: '2026-02-15T21:30:00',
            },
            carrierCode: 'LH',
            number: '920',
            aircraft: { code: 'A320' },
            duration: 'PT1H30M',
            numberOfStops: 0,
          },
        ],
      },
      {
        duration: 'PT11H45M',
        segments: [
          {
            departure: {
              iataCode: 'LHR',
              terminal: '2',
              at: '2026-02-22T08:00:00',
            },
            arrival: {
              iataCode: 'FRA',
              terminal: '1',
              at: '2026-02-22T10:45:00',
            },
            carrierCode: 'LH',
            number: '921',
            aircraft: { code: 'A320' },
            duration: 'PT1H45M',
            numberOfStops: 0,
          },
          {
            departure: {
              iataCode: 'FRA',
              terminal: '1',
              at: '2026-02-22T13:00:00',
            },
            arrival: {
              iataCode: 'JFK',
              terminal: '1',
              at: '2026-02-22T16:45:00',
            },
            carrierCode: 'LH',
            number: '404',
            aircraft: { code: 'A380' },
            duration: 'PT8H45M',
            numberOfStops: 0,
          },
        ],
      },
    ],
    price: {
      currency: 'USD',
      total: '512.00',
      base: '412.00',
      grandTotal: '512.00',
    },
    validatingAirlineCodes: ['LH'],
    travelerPricings: [],
  },
  {
    id: '5',
    source: 'GDS',
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: '2026-02-15',
    numberOfBookableSeats: 6,
    itineraries: [
      {
        duration: 'PT7H00M',
        segments: [
          {
            departure: {
              iataCode: 'JFK',
              terminal: '8',
              at: '2026-02-15T22:00:00',
            },
            arrival: {
              iataCode: 'LHR',
              terminal: '3',
              at: '2026-02-16T10:00:00',
            },
            carrierCode: 'AA',
            number: '100',
            aircraft: { code: '777' },
            duration: 'PT7H00M',
            numberOfStops: 0,
          },
        ],
      },
      {
        duration: 'PT8H30M',
        segments: [
          {
            departure: {
              iataCode: 'LHR',
              terminal: '3',
              at: '2026-02-22T16:00:00',
            },
            arrival: {
              iataCode: 'JFK',
              terminal: '8',
              at: '2026-02-22T19:30:00',
            },
            carrierCode: 'AA',
            number: '101',
            aircraft: { code: '777' },
            duration: 'PT8H30M',
            numberOfStops: 0,
          },
        ],
      },
    ],
    price: {
      currency: 'USD',
      total: '625.00',
      base: '525.00',
      grandTotal: '625.00',
    },
    validatingAirlineCodes: ['AA'],
    travelerPricings: [],
  },
];

export const mockAirlinesDictionary: Record<string, string> = {
  BA: 'British Airways',
  AF: 'Air France',
  VS: 'Virgin Atlantic',
  LH: 'Lufthansa',
  AA: 'American Airlines',
  UA: 'United Airlines',
  DL: 'Delta Air Lines',
  KL: 'KLM Royal Dutch Airlines',
  IB: 'Iberia',
  EK: 'Emirates',
};
