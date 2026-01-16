export const mockAirports = [
  // US Airports
  { iataCode: 'JFK', name: 'John F. Kennedy International Airport', cityName: 'New York', countryCode: 'US', countryName: 'United States' },
  { iataCode: 'LAX', name: 'Los Angeles International Airport', cityName: 'Los Angeles', countryCode: 'US', countryName: 'United States' },
  { iataCode: 'ORD', name: "O'Hare International Airport", cityName: 'Chicago', countryCode: 'US', countryName: 'United States' },
  { iataCode: 'MIA', name: 'Miami International Airport', cityName: 'Miami', countryCode: 'US', countryName: 'United States' },
  { iataCode: 'SFO', name: 'San Francisco International Airport', cityName: 'San Francisco', countryCode: 'US', countryName: 'United States' },
  { iataCode: 'SEA', name: 'Seattle-Tacoma International Airport', cityName: 'Seattle', countryCode: 'US', countryName: 'United States' },
  { iataCode: 'BOS', name: 'Logan International Airport', cityName: 'Boston', countryCode: 'US', countryName: 'United States' },
  { iataCode: 'DFW', name: 'Dallas/Fort Worth International Airport', cityName: 'Dallas', countryCode: 'US', countryName: 'United States' },
  { iataCode: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', cityName: 'Atlanta', countryCode: 'US', countryName: 'United States' },
  { iataCode: 'DEN', name: 'Denver International Airport', cityName: 'Denver', countryCode: 'US', countryName: 'United States' },
  
  // European Airports
  { iataCode: 'LHR', name: 'Heathrow Airport', cityName: 'London', countryCode: 'GB', countryName: 'United Kingdom' },
  { iataCode: 'CDG', name: 'Charles de Gaulle Airport', cityName: 'Paris', countryCode: 'FR', countryName: 'France' },
  { iataCode: 'AMS', name: 'Amsterdam Airport Schiphol', cityName: 'Amsterdam', countryCode: 'NL', countryName: 'Netherlands' },
  { iataCode: 'FRA', name: 'Frankfurt Airport', cityName: 'Frankfurt', countryCode: 'DE', countryName: 'Germany' },
  { iataCode: 'MAD', name: 'Adolfo Suárez Madrid-Barajas Airport', cityName: 'Madrid', countryCode: 'ES', countryName: 'Spain' },
  { iataCode: 'BCN', name: 'Barcelona-El Prat Airport', cityName: 'Barcelona', countryCode: 'ES', countryName: 'Spain' },
  { iataCode: 'FCO', name: 'Leonardo da Vinci-Fiumicino Airport', cityName: 'Rome', countryCode: 'IT', countryName: 'Italy' },
  { iataCode: 'MUC', name: 'Munich Airport', cityName: 'Munich', countryCode: 'DE', countryName: 'Germany' },
  { iataCode: 'ZRH', name: 'Zurich Airport', cityName: 'Zurich', countryCode: 'CH', countryName: 'Switzerland' },
  { iataCode: 'VIE', name: 'Vienna International Airport', cityName: 'Vienna', countryCode: 'AT', countryName: 'Austria' },
  
  // Asian Airports
  { iataCode: 'DXB', name: 'Dubai International Airport', cityName: 'Dubai', countryCode: 'AE', countryName: 'United Arab Emirates' },
  { iataCode: 'SIN', name: 'Singapore Changi Airport', cityName: 'Singapore', countryCode: 'SG', countryName: 'Singapore' },
  { iataCode: 'HKG', name: 'Hong Kong International Airport', cityName: 'Hong Kong', countryCode: 'HK', countryName: 'Hong Kong' },
  { iataCode: 'NRT', name: 'Narita International Airport', cityName: 'Tokyo', countryCode: 'JP', countryName: 'Japan' },
  { iataCode: 'ICN', name: 'Incheon International Airport', cityName: 'Seoul', countryCode: 'KR', countryName: 'South Korea' },
  { iataCode: 'BKK', name: 'Suvarnabhumi Airport', cityName: 'Bangkok', countryCode: 'TH', countryName: 'Thailand' },
  { iataCode: 'DEL', name: 'Indira Gandhi International Airport', cityName: 'Delhi', countryCode: 'IN', countryName: 'India' },
  { iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', cityName: 'Mumbai', countryCode: 'IN', countryName: 'India' },
  { iataCode: 'PEK', name: 'Beijing Capital International Airport', cityName: 'Beijing', countryCode: 'CN', countryName: 'China' },
  { iataCode: 'PVG', name: 'Shanghai Pudong International Airport', cityName: 'Shanghai', countryCode: 'CN', countryName: 'China' },
  
  // Other regions
  { iataCode: 'SYD', name: 'Sydney Kingsford Smith Airport', cityName: 'Sydney', countryCode: 'AU', countryName: 'Australia' },
  { iataCode: 'MEL', name: 'Melbourne Airport', cityName: 'Melbourne', countryCode: 'AU', countryName: 'Australia' },
  { iataCode: 'YYZ', name: 'Toronto Pearson International Airport', cityName: 'Toronto', countryCode: 'CA', countryName: 'Canada' },
  { iataCode: 'YVR', name: 'Vancouver International Airport', cityName: 'Vancouver', countryCode: 'CA', countryName: 'Canada' },
  { iataCode: 'GRU', name: 'São Paulo/Guarulhos International Airport', cityName: 'São Paulo', countryCode: 'BR', countryName: 'Brazil' },
];

export function searchMockAirports(keyword: string) {
  const lowerKeyword = keyword.toLowerCase();
  return mockAirports.filter(
    airport =>
      airport.iataCode.toLowerCase().includes(lowerKeyword) ||
      airport.name.toLowerCase().includes(lowerKeyword) ||
      airport.cityName.toLowerCase().includes(lowerKeyword) ||
      airport.countryName.toLowerCase().includes(lowerKeyword)
  );
}
