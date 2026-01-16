'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/store/bookingStore';
import { useSearchStore } from '@/store/searchStore';
import { BookingSuccessModal } from '@/components/BookingSuccessModal';
import { formatDate } from '@/lib/formatters';
import { formatPrice } from '@/lib/currency';
import { FlightSegment } from '@/types';

interface ReviewStepProps {
  onComplete?: () => void;
}

export function ReviewStep({ onComplete }: ReviewStepProps) {
  const { selectedFlight, passengers, contactInfo, paymentInfo, resetBooking } = useBookingStore();
  const { selectedCurrency } = useSearchStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const details = {
      bookingReference: 'SP' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      origin: selectedFlight?.itineraries[0].segments[0].departure.iataCode || 'JFK',
      destination: selectedFlight?.itineraries[0].segments[selectedFlight?.itineraries[0].segments.length - 1].arrival.iataCode || 'LHR',
      departureDate: selectedFlight ? formatDate(selectedFlight.itineraries[0].segments[0].departure.at) : 'TBD',
      totalPrice: selectedFlight ? formatPrice(parseFloat(selectedFlight.price.grandTotal), selectedCurrency) : '$0'
    };
    
    setBookingDetails(details);
    setIsProcessing(false);
    setShowSuccess(true);
    
    // Notify parent that booking is complete
    if (onComplete) {
      onComplete();
    }
  };

  const totalPrice = selectedFlight ? parseFloat(selectedFlight.price.grandTotal) : 0;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Review Your Booking</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please review all details before confirming
          </p>
        </div>

        {/* Flight Summary */}
        <div className="border rounded-xl p-6 space-y-4">
          <h4 className="font-semibold">Flight Details</h4>
          {selectedFlight && (
            <>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Route</span>
                  <span className="font-medium">
                    {selectedFlight.itineraries[0].segments[0].departure.iataCode} → {' '}
                    {selectedFlight.itineraries[0].segments[selectedFlight.itineraries[0].segments.length - 1].arrival.iataCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departure</span>
                  <span className="font-medium">
                    {formatDate(selectedFlight.itineraries[0].segments[0].departure.at)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Passengers Summary */}
        <div className="border rounded-xl p-6 space-y-4">
          <h4 className="font-semibold">Passengers ({passengers.length})</h4>
          <div className="space-y-2">
            {passengers.map((p, i) => (
              <div key={p.id} className="text-sm flex justify-between">
                <span>{p.title}. {p.firstName} {p.lastName}</span>
                <span className="text-gray-600">{p.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Summary */}
        {contactInfo && (
          <div className="border rounded-xl p-6 space-y-4">
            <h4 className="font-semibold">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span>{contactInfo.countryCode} {contactInfo.phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Summary */}
        {paymentInfo && (
          <div className="border rounded-xl p-6 space-y-4">
            <h4 className="font-semibold">Payment Method</h4>
            <div className="text-sm">
              <span className="text-gray-600">Card ending in </span>
              <span className="font-medium">{paymentInfo.cardNumber.slice(-4)}</span>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="border-2 border-brand-200 rounded-xl p-6 bg-brand-50 dark:bg-brand-900/20">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-3xl font-bold text-brand-600">
              {selectedFlight ? formatPrice(totalPrice, selectedCurrency) : '$0'}
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirmBooking}
          disabled={isProcessing}
          size="lg"
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Check className="mr-2 h-5 w-5" />
              Confirm & Pay {selectedFlight ? formatPrice(totalPrice, selectedCurrency) : '$0'}
            </>
          )}
        </Button>

        <p className="text-xs text-center text-gray-500">
          By confirming, you agree to our terms and conditions
        </p>
      </div>

      <BookingSuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          resetBooking();
        }}
        bookingDetails={bookingDetails}
      />
    </>
  );
}
