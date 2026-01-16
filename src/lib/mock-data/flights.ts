interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  cabinClass?: string;
}

const airlines = [
  { code: 'AA', name: 'American Airlines' },
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'BA', name: 'British Airways' },
  { code: 'LH', name: 'Lufthansa' },
  { code: 'AF', name: 'Air France' },
  { code: 'EK', name: 'Emirates' },
  { code: 'SQ', name: 'Singapore Airlines' },
  { code: 'QR', name: 'Qatar Airways' },
];

function generateRandomFlight(params: FlightSearchParams, index: number) {
  const airline = airlines[Math.floor(Math.random() * airlines.length)];
  const stops = Math.random() > 0.6 ? 0 : Math.random() > 0.5 ? 1 : 2;
  const basePrice = 200 + Math.random() * 800;
  const duration = 180 + Math.random() * 600; // 3-13 hours
  
  return {
    type: 'flight-offer',
    id: `flight-${index}`,
    source: 'MOCK',
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: !params.returnDate,
    lastTicketingDate: params.departureDate,
    numberOfBookableSeats: Math.floor(Math.random() * 9) + 1,
    itineraries: [
      {
        duration: `PT${Math.floor(duration / 60)}H${Math.floor(duration % 60)}M`,
        segments: generateSegments(params.origin, params.destination, params.departureDate, stops, airline, duration)
      },
      ...(params.returnDate ? [{
        duration: `PT${Math.floor(duration / 60)}H${Math.floor(duration % 60)}M`,
        segments: generateSegments(params.destination, params.origin, params.returnDate, stops, airline, duration)
      }] : [])
    ],
    price: {
      currency: 'USD',
      total: (basePrice * (stops + 1) * 0.8).toFixed(2),
      base: (basePrice * (stops + 1) * 0.7).toFixed(2),
      fees: [{ amount: '0.00', type: 'SUPPLIER' }],
      grandTotal: (basePrice * (stops + 1) * 0.8).toFixed(2)
    },
    pricingOptions: {
      fareType: ['PUBLISHED'],
      includedCheckedBagsOnly: true
    },
    validatingAirlineCodes: [airline.code],
    travelerPricings: Array(params.adults).fill(null).map((_, i) => ({
      travelerId: `${i + 1}`,
      fareOption: 'STANDARD',
      travelerType: 'ADULT',
      price: {
        currency: 'USD',
        total: (basePrice * (stops + 1) * 0.8 / params.adults).toFixed(2),
        base: (basePrice * (stops + 1) * 0.7 / params.adults).toFixed(2)
      },
      fareDetailsBySegment: []
    }))
  };
}

function generateSegments(origin: string, destination: string, date: string, stops: number, airline: any, totalDuration: number) {
  const segments = [];
  const layoverAirports = ['ORD', 'DFW', 'ATL', 'LHR', 'CDG', 'AMS', 'DXB'];
  
  let currentOrigin = origin;
  const segmentDuration = totalDuration / (stops + 1);
  
  for (let i = 0; i <= stops; i++) {
    const isLastSegment = i === stops;
    const currentDestination = isLastSegment ? destination : layoverAirports[Math.floor(Math.random() * layoverAirports.length)];
    
    const departureTime = new Date(date);
    departureTime.setHours(6 + i * 4, Math.random() * 60);
    
    const arrivalTime = new Date(departureTime);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + segmentDuration);
    
    segments.push({
      departure: {
        iataCode: currentOrigin,
        at: departureTime.toISOString()
      },
      arrival: {
        iataCode: currentDestination,
        at: arrivalTime.toISOString()
      },
      carrierCode: airline.code,
      number: Math.floor(100 + Math.random() * 9000).toString(),
      aircraft: { code: '320' },
      operating: { carrierCode: airline.code },
      duration: `PT${Math.floor(segmentDuration / 60)}H${Math.floor(segmentDuration % 60)}M`,
      id: `segment-${i + 1}`,
      numberOfStops: 0,
      blacklistedInEU: false
    });
    
    currentOrigin = currentDestination;
  }
  
  return segments;
}

export function generateMockFlights(params: FlightSearchParams) {
  const numFlights = 20 + Math.floor(Math.random() * 30);
  const flights = [];
  
  for (let i = 0; i < numFlights; i++) {
    flights.push(generateRandomFlight(params, i));
  }
  
  return {
    meta: {
      count: flights.length,
      links: {
        self: 'https://mock-api.com/v2/shopping/flight-offers'
      }
    },
    data: flights,
    dictionaries: {
      locations: {},
      aircraft: { '320': 'Airbus A320' },
      currencies: { USD: 'US Dollar' },
      carriers: Object.fromEntries(airlines.map(a => [a.code, a.name]))
    }
  };
}
