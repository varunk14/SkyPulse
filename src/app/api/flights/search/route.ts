import { NextRequest, NextResponse } from 'next/server';
import { amadeusClient } from '@/lib/amadeus';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate');
  const adults = parseInt(searchParams.get('adults') || '1');
  const children = parseInt(searchParams.get('children') || '0');
  const infants = parseInt(searchParams.get('infants') || '0');
  const cabinClass = searchParams.get('cabinClass');
  const useMock = searchParams.get('useMock') === 'true';

  if (!origin || !destination || !departureDate) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const data = await amadeusClient.searchFlights({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      returnDate: returnDate || undefined,
      adults,
      children: children || undefined,
      infants: infants || undefined,
      travelClass: cabinClass || undefined,
      max: 100,
    }, useMock);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Flight search error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search flights' },
      { status: 500 }
    );
  }
}
