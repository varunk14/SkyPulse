interface PricePrediction {
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: 'high' | 'medium' | 'low';
  recommendation: string;
  reason: string;
  bestTimeToBook: string;
  estimatedChange: number; // percentage
}

export function predictPriceTrend(
  departureDate: string,
  currentPrice: number,
  searchParams: {
    origin: string;
    destination: string;
    isRoundTrip: boolean;
  }
): PricePrediction {
  const departure = new Date(departureDate);
  const today = new Date();
  const daysUntilDeparture = Math.floor((departure.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Price prediction algorithm based on common patterns
  let trend: PricePrediction['trend'] = 'stable';
  let confidence: PricePrediction['confidence'] = 'medium';
  let recommendation = '';
  let reason = '';
  let bestTimeToBook = '';
  let estimatedChange = 0;

  // Very close to departure (< 7 days)
  if (daysUntilDeparture < 7) {
    trend = 'increasing';
    confidence = 'high';
    estimatedChange = 15 + Math.random() * 10;
    recommendation = 'Book now! Prices are rising fast';
    reason = 'Last-minute bookings typically see 15-25% price increases';
    bestTimeToBook = 'Immediately - seats are filling up';
  }
  // Sweet spot (2-8 weeks before)
  else if (daysUntilDeparture >= 14 && daysUntilDeparture <= 56) {
    trend = 'stable';
    confidence = 'high';
    estimatedChange = -2 + Math.random() * 4;
    recommendation = 'Good time to book';
    reason = 'Prices are in the optimal booking window';
    bestTimeToBook = 'Within the next 3 days';
  }
  // Too early (> 8 weeks)
  else if (daysUntilDeparture > 56) {
    trend = 'decreasing';
    confidence = 'medium';
    estimatedChange = -(5 + Math.random() * 10);
    recommendation = 'Wait to book';
    reason = 'Prices may drop as departure approaches the optimal booking window';
    bestTimeToBook = `In ${Math.floor((daysUntilDeparture - 42) / 7)} weeks`;
  }
  // Near sweet spot (7-14 days before)
  else {
    trend = 'increasing';
    confidence = 'medium';
    estimatedChange = 8 + Math.random() * 7;
    recommendation = 'Book soon';
    reason = 'Prices typically rise in the 1-2 weeks before departure';
    bestTimeToBook = 'Within 2-3 days';
  }

  // Add route-specific factors (optional enhancements)
  const isInternational = searchParams.origin.substring(0, 1) !== searchParams.destination.substring(0, 1);
  if (isInternational && daysUntilDeparture < 14) {
    estimatedChange += 5;
    confidence = 'high';
  }

  return {
    trend,
    confidence,
    recommendation,
    reason,
    bestTimeToBook,
    estimatedChange: Math.round(estimatedChange * 10) / 10
  };
}
