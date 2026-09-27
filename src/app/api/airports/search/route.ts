import { NextRequest, NextResponse } from 'next/server';
import { amadeusClient, AmadeusError } from '@/lib/amadeus';
import { searchMockAirports } from '@/lib/mock-data/airports';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword');
  const useMock = searchParams.get('useMock') === 'true';

  if (!keyword || keyword.length < 2) {
    return NextResponse.json({ data: [] });
  }

  const normalise = (items: any[]) =>
    items.map((item: any) => ({
      iataCode: item.iataCode,
      name: item.name,
      cityName: item.address?.cityName || item.cityName || item.name,
      countryCode: item.address?.countryCode || item.countryCode,
      countryName: item.address?.countryName || item.countryName,
    }));

  try {
    const data = await amadeusClient.searchAirports(keyword, useMock);
    return NextResponse.json({ data: normalise(data.data ?? []) });
  } catch (error: any) {
    const isAmadeus = error instanceof AmadeusError;

    console.error('[airports/search] Lookup failed', {
      keyword,
      status: isAmadeus ? error.status : undefined,
      code: isAmadeus ? error.code : 'UNEXPECTED',
      message: error?.message,
      upstream: isAmadeus ? error.upstream : undefined,
    });

    // Autocomplete must never block someone from typing a destination. Fall back
    // to the bundled airport list and tell the client the results are degraded,
    // rather than returning a 500 that empties the dropdown.
    return NextResponse.json({
      data: normalise(searchMockAirports(keyword)),
      degraded: true,
      code: isAmadeus ? error.code : 'UNEXPECTED',
      error: error?.message || 'Airport lookup failed',
      hint: isAmadeus
        ? error.hint
        : 'Showing offline airport list. Live lookup is unavailable.',
    });
  }
}
