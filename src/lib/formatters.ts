import { format, parseISO } from 'date-fns';

/**
 * Parse ISO duration (e.g., "PT2H30M") to minutes
 */
export function parseDuration(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  return hours * 60 + minutes;
}

/**
 * Format minutes to human-readable duration
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format ISO duration string to human-readable
 */
export function formatIsoDuration(isoDuration: string): string {
  return formatDuration(parseDuration(isoDuration));
}

/**
 * Format time from ISO datetime
 */
export function formatTime(isoDateTime: string): string {
  return format(parseISO(isoDateTime), 'HH:mm');
}

/**
 * Format date from ISO datetime
 */
export function formatDate(isoDateTime: string): string {
  return format(parseISO(isoDateTime), 'EEE, MMM d');
}

/**
 * Format price with currency
 */
export function formatPrice(amount: string | number, currency: string = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Calculate number of stops from segments
 */
export function getStopsCount(segments: unknown[]): number {
  return segments.length - 1;
}

/**
 * Get stops label text
 */
export function getStopsLabel(stops: number): string {
  if (stops === 0) return 'Nonstop';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
}

/**
 * Calculate if arrival is next day
 */
export function isNextDay(departureTime: string, arrivalTime: string): boolean {
  const dep = parseISO(departureTime);
  const arr = parseISO(arrivalTime);
  return arr.getDate() !== dep.getDate();
}

/**
 * Get airline logo URL (using a free API)
 */
export function getAirlineLogo(carrierCode: string): string {
  return `https://pics.avs.io/60/60/${carrierCode}.png`;
}
