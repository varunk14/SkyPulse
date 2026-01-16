'use client';

import { useEffect } from 'react';
import { CheckCircle2, Download, Mail, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { triggerBookingConfetti } from '@/lib/confetti';

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails?: {
    bookingReference: string;
    origin: string;
    destination: string;
    departureDate: string;
    totalPrice: string;
  };
}

export function BookingSuccessModal({ isOpen, onClose, bookingDetails }: BookingSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti when modal opens
      setTimeout(() => {
        triggerBookingConfetti();
      }, 300);
    }
  }, [isOpen]);

  if (!bookingDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 animate-scale-in" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Booking Confirmed! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Booking Reference</span>
              <span className="font-mono font-bold text-lg">{bookingDetails.bookingReference}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Route</span>
              <span className="font-semibold">
                {bookingDetails.origin} → {bookingDetails.destination}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Departure</span>
              <span className="font-semibold">{bookingDetails.departureDate}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-muted-foreground">Total Paid</span>
              <span className="font-bold text-xl text-primary">{bookingDetails.totalPrice}</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              📧 Confirmation email sent to your inbox
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>

          <Button onClick={onClose} className="w-full gap-2" size="lg">
            <Calendar className="h-4 w-4" />
            View My Trips
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
