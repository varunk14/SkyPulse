'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/store/bookingStore';
import { PassengerDetailsStep } from './steps/PassengerDetailsStep';
import { ContactInfoStep } from './steps/ContactInfoStep';
import { PaymentStep } from './steps/PaymentStep';
import { ReviewStep } from './steps/ReviewStep';

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { number: 1, title: 'Passengers', component: PassengerDetailsStep },
  { number: 2, title: 'Contact', component: ContactInfoStep },
  { number: 3, title: 'Payment', component: PaymentStep },
  { number: 4, title: 'Review', component: ReviewStep },
];

export function BookingWizard({ isOpen, onClose }: BookingWizardProps) {
  const { currentStep, setCurrentStep, completedSteps, resetBooking } = useBookingStore();
  const [bookingComplete, setBookingComplete] = useState(false);
  
  const CurrentStepComponent = STEPS[currentStep - 1]?.component;

  const canGoNext = completedSteps.includes(currentStep);
  const canGoPrevious = currentStep > 1;

  // Reset when wizard opens
  useEffect(() => {
    if (isOpen) {
      setBookingComplete(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    // Reset wizard state after a short delay
    setTimeout(() => {
      resetBooking();
      setCurrentStep(1);
    }, 300);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Listen for booking completion
  const handleBookingComplete = () => {
    setBookingComplete(true);
    // Close wizard after confetti
    setTimeout(() => {
      handleClose();
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 flex flex-col">
        <DialogTitle className="sr-only">Complete Your Booking</DialogTitle>
        
        {/* Header with stepper */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b px-6 py-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Complete Your Booking</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Step indicator - IMPROVED UI */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => completedSteps.includes(step.number) && setCurrentStep(step.number)}
                    disabled={!completedSteps.includes(step.number) && step.number !== currentStep}
                    className={`
                      relative w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                      ${currentStep === step.number
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110 shadow-lg shadow-blue-500/50'
                        : completedSteps.includes(step.number)
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                      }
                      ${completedSteps.includes(step.number) && step.number !== currentStep ? 'cursor-pointer hover:scale-105' : ''}
                    `}
                  >
                    {completedSteps.includes(step.number) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </button>
                  <span className={`
                    text-xs mt-2 font-medium transition-colors hidden sm:block
                    ${currentStep === step.number 
                      ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                      : completedSteps.includes(step.number)
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400 dark:text-gray-600'
                    }
                  `}>
                    {step.title}
                  </span>
                </div>
                
                {index < STEPS.length - 1 && (
                  <div className={`
                    h-1 flex-1 mx-2 transition-all duration-500 rounded-full
                    ${completedSteps.includes(step.number) 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                    }
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div 
          className="flex-1 overflow-y-auto px-6 pt-6 pb-8 min-h-0 scroll-smooth" 
          style={{ maxHeight: 'calc(90vh - 220px)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {CurrentStepComponent && (
                <CurrentStepComponent onComplete={handleBookingComplete} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer with navigation - IMPROVED UI */}
        <div className="flex-shrink-0 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 border-t px-6 py-4 flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            variant="outline"
            size="lg"
            className="transition-all hover:scale-105"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm font-medium text-gray-500">
            Step {currentStep} of {STEPS.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canGoNext || currentStep === STEPS.length}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-105 shadow-lg"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
