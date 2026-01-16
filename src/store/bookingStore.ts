import { create } from 'zustand';

interface Passenger {
  id: string;
  type: 'adult' | 'child' | 'infant';
  title: 'Mr' | 'Mrs' | 'Ms' | 'Dr';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  passportExpiry?: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  countryCode: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

interface BookingState {
  // Selected flight
  selectedFlight: any | null;
  
  // Wizard steps
  currentStep: number;
  completedSteps: number[];
  
  // Booking data
  passengers: Passenger[];
  contactInfo: ContactInfo | null;
  paymentInfo: PaymentInfo | null;
  
  // Actions
  setSelectedFlight: (flight: any) => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  setPassengers: (passengers: Passenger[]) => void;
  setContactInfo: (info: ContactInfo) => void;
  setPaymentInfo: (info: PaymentInfo) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedFlight: null,
  currentStep: 1,
  completedSteps: [],
  passengers: [],
  contactInfo: null,
  paymentInfo: null,

  setSelectedFlight: (flight) => set({ selectedFlight: flight }),
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  markStepComplete: (step) =>
    set((state) => ({
      completedSteps: [...new Set([...state.completedSteps, step])],
    })),
  
  setPassengers: (passengers) => set({ passengers }),
  
  setContactInfo: (info) => set({ contactInfo: info }),
  
  setPaymentInfo: (info) => set({ paymentInfo: info }),
  
  resetBooking: () =>
    set({
      selectedFlight: null,
      currentStep: 1,
      completedSteps: [],
      passengers: [],
      contactInfo: null,
      paymentInfo: null,
    }),
}));
