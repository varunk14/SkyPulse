'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, CloudOff } from 'lucide-react';

export function MockDataToggle() {
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    // Load preference from localStorage
    const stored = localStorage.getItem('useMockData');
    if (stored !== null) {
      setUseMockData(stored === 'true');
    }
  }, []);

  const handleToggle = () => {
    const newValue = !useMockData;
    setUseMockData(newValue);
    localStorage.setItem('useMockData', String(newValue));
    // Force page reload to apply changes
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={useMockData ? "default" : "outline"}
        size="sm"
        onClick={handleToggle}
        className="gap-1 sm:gap-2 px-2 sm:px-3"
      >
        {useMockData ? (
          <>
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Mock Data</span>
            <span className="sm:hidden">Mock</span>
          </>
        ) : (
          <>
            <CloudOff className="h-4 w-4" />
            <span className="hidden sm:inline">Live API</span>
            <span className="sm:hidden">Live</span>
          </>
        )}
      </Button>
      {useMockData && (
        <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
          Demo Mode
        </Badge>
      )}
    </div>
  );
}

// Also export a function to check if mock data is enabled
export function useMockDataEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('useMockData') === 'true';
}
