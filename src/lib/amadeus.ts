import { searchMockAirports } from './mock-data/airports';
import { generateMockFlights } from './mock-data/flights';

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

class AmadeusClient {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private baseUrl = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';

  async getToken(): Promise<string> {
    // Return cached token if valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch(`${this.baseUrl}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_API_KEY!,
        client_secret: process.env.AMADEUS_API_SECRET!,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Amadeus API');
    }

    const data: TokenResponse = await response.json();
    this.accessToken = data.access_token;
    // Set expiry 1 minute before actual expiry for safety
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
    
    return this.accessToken;
  }

  async searchAirports(keyword: string, useMock: boolean = false): Promise<any> {
    if (useMock) {
      console.log('🎭 Using MOCK airport data for:', keyword);
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      const mockResults = searchMockAirports(keyword);
      // Return in the same format as the API (wrapped in data array)
      return { data: mockResults };
    }
    
    const token = await this.getToken();
    
    const params = new URLSearchParams({
      keyword: keyword,
      subType: 'AIRPORT,CITY',
      'page[limit]': '10',
    });

    const response = await fetch(
      `${this.baseUrl}/v1/reference-data/locations?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search airports');
    }

    return response.json();
  }

  async searchFlights(params: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    children?: number;
    infants?: number;
    travelClass?: string;
    nonStop?: boolean;
    max?: number;
  }, useMock: boolean = false): Promise<any> {
    if (useMock) {
      console.log('🎭 Using MOCK flight data for:', params);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      return generateMockFlights({
        origin: params.originLocationCode,
        destination: params.destinationLocationCode,
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        adults: params.adults,
        cabinClass: params.travelClass,
      });
    }
    
    const token = await this.getToken();

    const searchParams: any = {
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
      max: (params.max || 50).toString(),
    };

    if (params.returnDate) {
      searchParams.returnDate = params.returnDate;
    }
    if (params.children) {
      searchParams.children = params.children.toString();
    }
    if (params.infants) {
      searchParams.infants = params.infants.toString();
    }
    if (params.travelClass) {
      searchParams.travelClass = params.travelClass;
    }
    if (params.nonStop !== undefined) {
      searchParams.nonStop = params.nonStop.toString();
    }

    const queryString = new URLSearchParams(searchParams).toString();
    
    const response = await fetch(
      `${this.baseUrl}/v2/shopping/flight-offers?${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.detail || 'Failed to search flights');
    }

    return response.json();
  }
}

export const amadeusClient = new AmadeusClient();
