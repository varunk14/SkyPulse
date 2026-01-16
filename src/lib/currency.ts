export const EXCHANGE_RATES = {
  USD: 1.00,      // US Dollar (base)
  EUR: 0.86,      // Euro
  GBP: 0.747,     // British Pound
  INR: 90.08,     // Indian Rupee
  AED: 3.673,     // UAE Dirham
  SGD: 1.28,      // Singapore Dollar
  JPY: 157.00,    // Japanese Yen
  CAD: 1.43,      // Canadian Dollar
  AUD: 1.59,      // Australian Dollar
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  AED: 'د.إ',
  SGD: 'S$',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
};

export const CURRENCY_NAMES = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  INR: 'Indian Rupee',
  AED: 'UAE Dirham',
  SGD: 'Singapore Dollar',
  JPY: 'Japanese Yen',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
};

export type Currency = keyof typeof EXCHANGE_RATES;

export function convertPrice(priceInUSD: number, targetCurrency: Currency): number {
  return priceInUSD * EXCHANGE_RATES[targetCurrency];
}

export function convertToUSD(priceInCurrency: number, fromCurrency: Currency): number {
  return priceInCurrency / EXCHANGE_RATES[fromCurrency];
}

export function formatPrice(priceInUSD: number, currency: Currency): string {
  const converted = convertPrice(priceInUSD, currency);
  const symbol = CURRENCY_SYMBOLS[currency];
  
  // Format with proper decimals
  if (currency === 'JPY' || currency === 'INR') {
    // No decimals for Yen and Rupee
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }
  
  return `${symbol}${converted.toFixed(2)}`;
}
