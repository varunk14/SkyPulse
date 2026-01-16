'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Clock, Zap } from 'lucide-react';
import { predictPriceTrend } from '@/lib/pricePredictor';
import { Badge } from '@/components/ui/badge';

interface PricePredictionBannerProps {
  departureDate: string;
  averagePrice: number;
  searchParams: {
    origin: string;
    destination: string;
    isRoundTrip: boolean;
  };
}

export function PricePredictionBanner({ 
  departureDate, 
  averagePrice, 
  searchParams 
}: PricePredictionBannerProps) {
  const prediction = predictPriceTrend(departureDate, averagePrice, searchParams);

  // Color schemes based on trend
  const styles = {
    increasing: {
      bg: 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
      iconComponent: TrendingUp
    },
    decreasing: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      iconComponent: TrendingDown
    },
    stable: {
      bg: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      iconComponent: Minus
    }
  };

  const style = styles[prediction.trend];
  const IconComponent = style.iconComponent;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${style.bg} ${style.border} border rounded-xl p-4 sm:p-6 shadow-sm mb-6`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center ${style.border} border`}>
          <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${style.icon}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {prediction.recommendation}
            </h3>
            <Badge variant="secondary" className={`${style.badge} text-xs hidden sm:inline-flex`}>
              {prediction.confidence} confidence
            </Badge>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            {prediction.reason}
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
            {/* Price change estimate */}
            <div className="flex items-center gap-1.5">
              {prediction.trend === 'increasing' ? (
                <TrendingUp className={`h-4 w-4 ${style.icon}`} />
              ) : prediction.trend === 'decreasing' ? (
                <TrendingDown className={`h-4 w-4 ${style.icon}`} />
              ) : (
                <Minus className={`h-4 w-4 ${style.icon}`} />
              )}
              <span className="font-medium text-gray-900 dark:text-white">
                {prediction.estimatedChange > 0 ? '+' : ''}{prediction.estimatedChange}% expected
              </span>
            </div>

            {/* Best time to book */}
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Best time: {prediction.bestTimeToBook}
              </span>
            </div>

            {/* Urgency indicator */}
            {prediction.trend === 'increasing' && prediction.confidence === 'high' && (
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  Act fast!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile confidence badge */}
      <Badge variant="secondary" className={`${style.badge} text-xs mt-3 sm:hidden`}>
        {prediction.confidence} confidence
      </Badge>
    </motion.div>
  );
}
