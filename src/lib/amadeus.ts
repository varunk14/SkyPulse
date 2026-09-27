import { searchMockAirports } from './mock-data/airports';
import { generateMockFlights } from './mock-data/flights';

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

/**
 * Error carrying the upstream Amadeus status and body so callers can tell a dead
 * API key apart from a rate limit, a bad request or an outage.
 */
export class AmadeusError extends Error {
  status: number;
  code: string;
  hint: string;
  upstream?: unknown;

  constructor(opts: {
    message: string;
    status: number;
    code: string;
    hint: string;
    upstream?: unknown;
  }) {
    super(opts.message);
    this.name = 'AmadeusError';
    this.status = opts.status;
    this.code = opts.code;
    this.hint = opts.hint;
    this.upstream = opts.upstream;
  }
}

/** Read an error body without throwing when it is empty or not JSON. */
async function readBody(response: Response): Promise<any> {
  const text = await response.text().catch(() => '');
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text.slice(0, 500) };
  }
}

/** Pull the most useful message Amadeus gives us, whichever shape it used. */
function upstreamDetail(body: any): string | null {
  if (!body) return null;
  const first = body.errors?.[0];
  if (first) {
    return first.detail || first.title || first.code || null;
  }
  return body.error_description || body.error || body.message || null;
}

function classify(status: number, body: any): { code: string; hint: string } {
  const detail = upstreamDetail(body) || '';

  if (status === 401 || status === 403) {
    return {
      code: 'AUTH_FAILED',
      hint:
        'Amadeus rejected the credentials. Self-service test keys are revoked after inactivity. ' +
        'Regenerate them at developers.amadeus.com and update AMADEUS_API_KEY and AMADEUS_API_SECRET ' +
        'in .env.local and in the deployment environment.',
    };
  }
  if (status === 429) {
    return {
      code: 'RATE_LIMITED',
      hint: 'Amadeus rate limit or quota reached. Wait and retry, or switch on Mock Data mode.',
    };
  }
  if (status === 400) {
    return {
      code: 'BAD_REQUEST',
      hint: `Amadeus rejected the query parameters. ${detail}`.trim(),
    };
  }
  if (status >= 500) {
    return {
      code: 'UPSTREAM_ERROR',
      hint: 'Amadeus is returning a server error. This is upstream, not the app. Retry shortly.',
    };
  }
  return { code: 'UNKNOWN', hint: detail || 'Unrecognised response from Amadeus.' };
}

class AmadeusClient {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private baseUrl = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';

  /** True when both credentials are present, so callers can fall back to mock data. */
  isConfigured(): boolean {
    return Boolean(process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET);
  }

  private assertConfigured(): void {
    if (!this.isConfigured()) {
      throw new AmadeusError({
        message: 'Amadeus credentials are not configured',
        status: 503,
        code: 'NOT_CONFIGURED',
        hint:
          'AMADEUS_API_KEY and AMADEUS_API_SECRET are missing from the environment. ' +
          'Set them in .env.local for local runs and in the hosting provider for deployments, ' +
          'or enable Mock Data mode in the UI.',
      });
    }
  }

  async getToken(forceRefresh = false): Promise<string> {
    this.assertConfigured();

    if (!forceRefresh && this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/v1/security/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.AMADEUS_API_KEY!,
          client_secret: process.env.AMADEUS_API_SECRET!,
        }),
      });
    } catch (err: any) {
      throw new AmadeusError({
        message: `Could not reach Amadeus at ${this.baseUrl}`,
        status: 502,
        code: 'NETWORK_ERROR',
        hint: 'DNS or network failure reaching the Amadeus host. Check connectivity and AMADEUS_BASE_URL.',
        upstream: err?.message,
      });
    }

    if (!response.ok) {
      const body = await readBody(response);
      const { code, hint } = classify(response.status, body);
      throw new AmadeusError({
        message: upstreamDetail(body) || `Amadeus authentication failed (HTTP ${response.status})`,
        status: response.status,
        code: code === 'UNKNOWN' ? 'AUTH_FAILED' : code,
        hint,
        upstream: body,
      });
    }

    const data: TokenResponse = await response.json();
    this.accessToken = data.access_token;
    // Expire a minute early so a request never races the token running out.
    this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000;
    return this.accessToken;
  }

  /**
   * GET against Amadeus with the bearer token, retrying once on 401 in case the
   * cached token was revoked server-side before its stated expiry.
   */
  private async authedGet(path: string, query: URLSearchParams): Promise<any> {
    const send = async (token: string) => {
      try {
        return await fetch(`${this.baseUrl}${path}?${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err: any) {
        throw new AmadeusError({
          message: `Could not reach Amadeus at ${this.baseUrl}`,
          status: 502,
          code: 'NETWORK_ERROR',
          hint: 'Network failure reaching the Amadeus host. Check connectivity and AMADEUS_BASE_URL.',
          upstream: err?.message,
        });
      }
    };

    let response = await send(await this.getToken());

    if (response.status === 401) {
      this.accessToken = null;
      this.tokenExpiry = 0;
      response = await send(await this.getToken(true));
    }

    if (!response.ok) {
      const body = await readBody(response);
      const { code, hint } = classify(response.status, body);
      throw new AmadeusError({
        message: upstreamDetail(body) || `Amadeus request failed (HTTP ${response.status})`,
        status: response.status,
        code,
        hint,
        upstream: body,
      });
    }

    return response.json();
  }

  async searchAirports(keyword: string, useMock: boolean = false): Promise<any> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { data: searchMockAirports(keyword) };
    }

    return this.authedGet(
      '/v1/reference-data/locations',
      new URLSearchParams({
        keyword,
        subType: 'AIRPORT,CITY',
        'page[limit]': '10',
      })
    );
  }

  async searchFlights(
    params: {
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
    },
    useMock: boolean = false
  ): Promise<any> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return generateMockFlights({
        origin: params.originLocationCode,
        destination: params.destinationLocationCode,
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        adults: params.adults,
        cabinClass: params.travelClass,
      });
    }

    const searchParams = new URLSearchParams({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
      max: (params.max || 50).toString(),
    });

    if (params.returnDate) searchParams.set('returnDate', params.returnDate);
    if (params.children) searchParams.set('children', params.children.toString());
    if (params.infants) searchParams.set('infants', params.infants.toString());
    if (params.travelClass) searchParams.set('travelClass', params.travelClass);
    if (params.nonStop !== undefined) searchParams.set('nonStop', params.nonStop.toString());

    return this.authedGet('/v2/shopping/flight-offers', searchParams);
  }
}

export const amadeusClient = new AmadeusClient();
