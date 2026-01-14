'use client';

import { Button } from '@/components/ui/button';
import { useSearchStore } from '@/store/searchStore';
import { mockFlights, mockAirlinesDictionary } from '@/lib/mockData';
import { FlaskConical, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function MockDataLoader() {
  const { setFlights, setAirlinesDictionary, setIsLoading, flights } = useSearchStore();
  const [isSimulating, setIsSimulating] = useState(false);

  const loadMockData = async () => {
    // Simulate loading state
    setIsSimulating(true);
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setFlights(mockFlights);
    setAirlinesDictionary(mockAirlinesDictionary);
    setIsLoading(false);
    setIsSimulating(false);
  };

  const clearData = () => {
    setFlights([]);
    setAirlinesDictionary({});
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      {flights.length > 0 ? (
        <Button
          variant="outline"
          size="sm"
          onClick={clearData}
          className="bg-white shadow-lg hover:shadow-xl transition-shadow"
        >
          Clear Results
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={loadMockData}
          disabled={isSimulating}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          {isSimulating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <FlaskConical className="h-4 w-4 mr-2" />
              Load Mock Data
            </>
          )}
        </Button>
      )}
    </div>
  );
}
