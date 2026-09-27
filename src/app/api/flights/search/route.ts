import { NextRequest, NextResponse } from 'next/server';
import { amadeusClient, AmadeusError } from '@/lib/amadeus';

/** YYYY-MM-DD, which is the only format Amadeus accepts for travel dates. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const IATA_CODE = /^[A-Z]{3}$/;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const origin = searchParams.get('origin')?.toUpperCase();
  const destination = searchParams.get('destination')?.toUpperCase();
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate');
  const adults = parseInt(searchParams.get('adults') || '1');
  const children = parseInt(searchParams.get('children') || '0');
  const infants = parseInt(searchParams.get('infants') || '0');
  const cabinClass = searchParams.get('cabinClass');
  const useMock = searchParams.get('useMock') === 'true';

  // Validate before calling out, so a bad query returns a usable message
  // instead of a generic upstream rejection.
  const problems: string[] = [];
  if (!origin || !destination || !departureDate) {
    problems.push('origin, destination and departureDate are required');
  }
  if (origin && !IATA_CODE.test(origin)) {
    problems.push(`origin "${origin}" must be a 3-letter IATA code`);
  }
  if (destination && !IATA_CODE.test(destination)) {
    problems.push(`destination "${destination}" must be a 3-letter IATA code`);
  }
  if (origin && destination && origin === destination) {
    problems.push('origin and destination must be different');
  }
  if (departureDate && !ISO_DATE.test(departureDate)) {
    problems.push('departureDate must be in YYYY-MM-DD format');
  }
  if (returnDate && !ISO_DATE.test(returnDate)) {
    problems.push('returnDate must be in YYYY-MM-DD format');
  }
  if (departureDate && returnDate && returnDate < departureDate) {
    problems.push('returnDate cannot be before departureDate');
  }

  if (problems.length > 0) {
    return NextResponse.json(
      { error: problems.join('. '), code: 'INVALID_REQUEST' },
      { status: 400 }
    );
  }

  const query = {
    originLocationCode: origin!,
    destinationLocationCode: destination!,
    departureDate: departureDate!,
    returnDate: returnDate || undefined,
    adults,
    children: children || undefined,
    infants: infants || undefined,
    travelClass: cabinClass || undefined,
    max: 100,
  };

  // Upstream problems that are about reaching Amadeus at all, rather than about
  // this particular query. For these we serve the bundled dataset so the product
  // still works end to end, and label the response as demo data.
  const FALLBACK_CODES = new Set(['NETWORK_ERROR', 'AUTH_FAILED', 'NOT_CONFIGURED', 'UPSTREAM_ERROR']);

  try {
    let data: any;
    let degradedReason: string | null = null;
    let source: 'mock' | 'amadeus' = useMock ? 'mock' : 'amadeus';

    if (useMock) {
      data = await amadeusClient.searchFlights(query, true);
    } else {
      try {
        data = await amadeusClient.searchFlights(query, false);
      } catch (err: any) {
        if (err instanceof AmadeusError && FALLBACK_CODES.has(err.code)) {
          console.warn(
            `[flights/search] Live API unavailable (${err.code}), serving demo data. ${err.message}`
          );
          data = await amadeusClient.searchFlights(query, true);
          source = 'mock';
          degradedReason = err.message;
        } else {
          throw err;
        }
      }
    }

    const offers = data?.data ?? [];

    // An empty result set is a valid answer, not a failure. Say so explicitly
    // so the UI can show "no flights on this route" rather than an error.
    return NextResponse.json({
      ...data,
      data: offers,
      meta: {
        ...(data?.meta ?? {}),
        count: offers.length,
        empty: offers.length === 0,
        source,
        degraded: Boolean(degradedReason),
        reason: degradedReason,
      },
    });
  } catch (error: any) {
    if (error instanceof AmadeusError) {
      // Log the full upstream body server-side; return the useful parts to the client.
      console.error('[flights/search] Amadeus failure', {
        status: error.status,
        code: error.code,
        message: error.message,
        upstream: error.upstream,
      });

      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          hint: error.hint,
          upstreamStatus: error.status,
        },
        // An upstream auth or config problem is ours, not the caller's, so it
        // surfaces as 502/503 rather than pretending the request was malformed.
        { status: error.status === 400 ? 400 : error.status === 429 ? 429 : 502 }
      );
    }

    console.error('[flights/search] Unexpected failure', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to search flights',
        code: 'UNEXPECTED',
      },
      { status: 500 }
    );
  }
}
