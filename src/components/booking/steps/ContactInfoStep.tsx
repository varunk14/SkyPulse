'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBookingStore } from '@/store/bookingStore';

interface ContactInfoStepProps {
  onComplete?: () => void;
}

export function ContactInfoStep({ onComplete }: ContactInfoStepProps) {
  const { contactInfo, setContactInfo, markStepComplete } = useBookingStore();
  
  const [email, setEmail] = useState(contactInfo?.email || '');
  const [phone, setPhone] = useState(contactInfo?.phone || '');
  const [countryCode, setCountryCode] = useState(contactInfo?.countryCode || '+1');

  const validateAndSave = useCallback(() => {
    const isValid = email && phone && email.includes('@');

    if (isValid) {
      setContactInfo({ email, phone, countryCode });
      markStepComplete(2);
    }
  }, [email, phone, countryCode, setContactInfo, markStepComplete]);

  useEffect(() => {
    validateAndSave();
  }, [validateAndSave]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We'll send booking confirmation and updates to these details
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="h-11 sm:h-10 text-base sm:text-sm pl-10 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
            Phone Number
          </Label>
          <div className="flex gap-3">
            <div className="space-y-2 w-20 sm:w-24">
              <Input
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder="+1"
                className="h-11 sm:h-10 text-base sm:text-sm focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
              />
            </div>
            <div className="relative flex-1 space-y-2">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="h-11 sm:h-10 text-base sm:text-sm pl-10 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          📧 Your booking confirmation will be sent to <strong>{email || 'your email'}</strong>
        </p>
      </div>
    </div>
  );
}
