'use client';

import { useState, useEffect, useCallback } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBookingStore } from '@/store/bookingStore';

interface PaymentStepProps {
  onComplete?: () => void;
}

export function PaymentStep({ onComplete }: PaymentStepProps) {
  const { paymentInfo, setPaymentInfo, markStepComplete } = useBookingStore();
  
  const [cardNumber, setCardNumber] = useState(paymentInfo?.cardNumber || '');
  const [cardHolder, setCardHolder] = useState(paymentInfo?.cardHolder || '');
  const [expiryMonth, setExpiryMonth] = useState(paymentInfo?.expiryMonth || '');
  const [expiryYear, setExpiryYear] = useState(paymentInfo?.expiryYear || '');
  const [cvv, setCvv] = useState(paymentInfo?.cvv || '');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const validateAndSave = useCallback(() => {
    const isValid = 
      cardNumber.replace(/\s/g, '').length === 16 &&
      cardHolder.length > 0 &&
      expiryMonth.length === 2 &&
      expiryYear.length === 2 &&
      cvv.length === 3;

    if (isValid) {
      setPaymentInfo({ cardNumber, cardHolder, expiryMonth, expiryYear, cvv });
      markStepComplete(3);
    }
  }, [cardNumber, cardHolder, expiryMonth, expiryYear, cvv, setPaymentInfo, markStepComplete]);

  useEffect(() => {
    validateAndSave();
  }, [validateAndSave]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your payment information to complete the booking
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="cardNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
            Card Number
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              className="pl-10 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardHolder" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
            Cardholder Name
          </Label>
          <Input
            id="cardHolder"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            placeholder="JOHN DOE"
            className="focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryMonth" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
              Expiry Month
            </Label>
            <Input
              id="expiryMonth"
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
              placeholder="MM"
              maxLength={2}
              className="focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryYear" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
              Expiry Year
            </Label>
            <Input
              id="expiryYear"
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
              placeholder="YY"
              maxLength={2}
              className="focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvv" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
              CVV
            </Label>
            <Input
              id="cvv"
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              maxLength={3}
              className="focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
        <Lock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-900 dark:text-green-100">
            Secure Payment
          </p>
          <p className="text-xs text-green-700 dark:text-green-200 mt-1">
            Your payment information is encrypted and secure. We never store your full card details.
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center pb-2">
        💡 Test card: 4242 4242 4242 4242
      </div>
    </div>
  );
}
