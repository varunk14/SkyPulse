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
    // Don't auto-close - let the success modal handle closing
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden p-0 flex flex-col">
        <DialogTitle className="sr-only">Complete Your Booking</DialogTitle>
        
        {/* Header with stepper */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b px-4 sm:px-6 py-3 sm:py-4 z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <h2 className="text-lg sm:text-2xl font-bold">Complete Your Booking</h2>
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Step indicator - horizontal scroll on mobile */}
          <div className="flex items-center gap-2 sm:gap-0 overflow-x-auto overflow-y-visible py-2 -mx-4 px-6 sm:mx-0 sm:px-0 scrollbar-hide sm:justify-between">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center flex-shrink-0 sm:flex-1">
                <div className="flex flex-col items-center flex-shrink-0 sm:flex-1 px-1">
                  <button
                    onClick={() => completedSteps.includes(step.number) && setCurrentStep(step.number)}
                    disabled={!completedSteps.includes(step.number) && step.number !== currentStep}
                    className={`
                      relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 text-sm sm:text-base
                      ${currentStep === step.number
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white sm:scale-110 shadow-lg shadow-blue-500/50'
                        : completedSteps.includes(step.number)
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                      }
                      ${completedSteps.includes(step.number) && step.number !== currentStep ? 'cursor-pointer hover:scale-105' : ''}
                    `}
                  >
                    {completedSteps.includes(step.number) ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      step.number
                    )}
                  </button>
                  <span className={`
                    text-xs mt-1.5 sm:mt-2 font-medium transition-colors whitespace-nowrap
                    ${currentStep === step.number 
                      ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                      : completedSteps.includes(step.number)
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400 dark:text-gray-600'
                    }
                  `}>
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{step.title.slice(0, 4)}</span>
                  </span>
                </div>
                
                {index < STEPS.length - 1 && (
                  <div className={`
                    h-0.5 sm:h-1 w-6 sm:flex-1 mx-0.5 sm:mx-2 transition-all duration-500 rounded-full flex-shrink-0
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

        {/* Step content - scrollable, responsive padding */}
        <div 
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 min-h-0 scroll-smooth max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-220px)]"
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
                <CurrentStepComponent 
                  onComplete={handleBookingComplete}
                  onWizardClose={currentStep === STEPS.length ? handleClose : undefined}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer with navigation - responsive */}
        <div className="flex-shrink-0 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 border-t px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
          <Button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            variant="outline"
            className="flex-1 sm:flex-none h-11 sm:h-12 transition-all hover:scale-105"
          >
            <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Back</span>
          </Button>

          <div className="text-xs sm:text-sm font-medium text-gray-500 hidden sm:block">
            Step {currentStep} of {STEPS.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canGoNext || currentStep === STEPS.length}
            className="flex-1 sm:flex-none h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-105 shadow-lg"
          >
            Next
            <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
