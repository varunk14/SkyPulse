import { NextRequest, NextResponse } from 'next/server';
import { amadeusClient } from '@/lib/amadeus';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword');
  const useMock = searchParams.get('useMock') === 'true';

  if (!keyword || keyword.length < 2) {
    return NextResponse.json({ data: [] });
  }

  try {
    const data = await amadeusClient.searchAirports(keyword, useMock);
    
    // Transform the response to a cleaner format
    const airports = data.data?.map((item: any) => ({
      iataCode: item.iataCode,
      name: item.name,
      cityName: item.address?.cityName || item.cityName || item.name,
      countryCode: item.address?.countryCode || item.countryCode,
      countryName: item.address?.countryName || item.countryName,
    })) || [];

    return NextResponse.json({ data: airports });
  } catch (error) {
    console.error('Airport search error:', error);
    return NextResponse.json(
      { error: 'Failed to search airports' },
      { status: 500 }
    );
  }
}
