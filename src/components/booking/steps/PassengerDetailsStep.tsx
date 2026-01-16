'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBookingStore } from '@/store/bookingStore';

interface PassengerDetailsStepProps {
  onComplete?: () => void;
}

export function PassengerDetailsStep({ onComplete }: PassengerDetailsStepProps) {
  const { passengers, setPassengers, markStepComplete, selectedFlight } = useBookingStore();
  
  const [localPassengers, setLocalPassengers] = useState(passengers.length > 0 ? passengers : [
    {
      id: '1',
      type: 'adult' as const,
      title: 'Mr' as const,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
    }
  ]);

  const addPassenger = () => {
    setLocalPassengers([
      ...localPassengers,
      {
        id: Date.now().toString(),
        type: 'adult' as const,
        title: 'Mr' as const,
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nationality: '',
      }
    ]);
  };

  const removePassenger = (id: string) => {
    setLocalPassengers(localPassengers.filter(p => p.id !== id));
  };

  const updatePassenger = (id: string, field: string, value: any) => {
    setLocalPassengers(localPassengers.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const validateAndSave = useCallback(() => {
    const isValid = localPassengers.every(p =>
      p.firstName && p.lastName && p.dateOfBirth && p.nationality
    );

    if (isValid) {
      setPassengers(localPassengers);
      markStepComplete(1);
    }
  }, [localPassengers, setPassengers, markStepComplete]);

  useEffect(() => {
    validateAndSave();
  }, [validateAndSave]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Passenger Information</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter details for all passengers as they appear on travel documents
        </p>
      </div>

      {localPassengers.map((passenger, index) => (
        <div key={passenger.id} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md transition-shadow">
          {localPassengers.length > 1 && (
            <button
              onClick={() => removePassenger(passenger.id)}
              className="absolute top-4 right-4 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Passenger {index + 1}</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                Title
              </Label>
              <Select
                value={passenger.title}
                onValueChange={(value) => updatePassenger(passenger.id, 'title', value)}
              >
                <SelectTrigger className="w-full h-11 sm:h-10 text-base sm:text-sm focus-visible:ring-blue-500/50 focus-visible:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr">Mr</SelectItem>
                  <SelectItem value="Mrs">Mrs</SelectItem>
                  <SelectItem value="Ms">Ms</SelectItem>
                  <SelectItem value="Dr">Dr</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                Type
              </Label>
              <Select
                value={passenger.type}
                onValueChange={(value) => updatePassenger(passenger.id, 'type', value)}
              >
                <SelectTrigger className="w-full h-11 sm:h-10 text-base sm:text-sm focus-visible:ring-blue-500/50 focus-visible:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Adult (12+ years)</SelectItem>
                  <SelectItem value="child">Child (2-11 years)</SelectItem>
                  <SelectItem value="infant">Infant (0-2 years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`firstName-${passenger.id}`} className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                First Name
              </Label>
              <Input
                id={`firstName-${passenger.id}`}
                value={passenger.firstName}
                onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                placeholder="As on passport"
                className="h-11 sm:h-10 text-base sm:text-sm focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`lastName-${passenger.id}`} className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                Last Name
              </Label>
              <Input
                id={`lastName-${passenger.id}`}
                value={passenger.lastName}
                onChange={(e) => updatePassenger(passenger.id, 'lastName', e.target.value)}
                placeholder="As on passport"
                className="h-11 sm:h-10 text-base sm:text-sm focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`dob-${passenger.id}`} className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                Date of Birth
              </Label>
              <Input
                id={`dob-${passenger.id}`}
                type="date"
                value={passenger.dateOfBirth}
                onChange={(e) => updatePassenger(passenger.id, 'dateOfBirth', e.target.value)}
                className="h-11 sm:h-10 text-base sm:text-sm focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`nationality-${passenger.id}`} className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                Nationality
              </Label>
              <Input
                id={`nationality-${passenger.id}`}
                value={passenger.nationality}
                onChange={(e) => updatePassenger(passenger.id, 'nationality', e.target.value)}
                placeholder="e.g., United States"
                className="h-11 sm:h-10 text-base sm:text-sm focus-visible:ring-blue-500/50 focus-visible:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      ))}

      <Button 
        onClick={addPassenger} 
        variant="outline" 
        className="w-full h-11 sm:h-10 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Another Passenger
      </Button>
    </div>
  );
}
