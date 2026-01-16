'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { airportCoordinates } from '@/lib/airportCoordinates';
import { Plane, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InteractiveFlightMapProps {
  origin: string;
  destination: string;
  stops?: string[];
  className?: string;
}

// Custom zoom controls component
function ZoomControls({ map, origin, destination, stops }: { 
  map: any;
  origin: string;
  destination: string;
  stops?: string[];
}) {
  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  const handleFitBounds = () => {
    if (map) {
      const originCoords = airportCoordinates[origin];
      const destCoords = airportCoordinates[destination];
      if (originCoords && destCoords) {
        const allCoords: [number, number][] = [originCoords];
        if (stops) {
          stops.forEach(stop => {
            const stopCoords = airportCoordinates[stop];
            if (stopCoords) allCoords.push(stopCoords);
          });
        }
        allCoords.push(destCoords);
        
        const lats = allCoords.map(c => c[0]);
        const lngs = allCoords.map(c => c[1]);
        const bounds: [[number, number], [number, number]] = [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)]
        ];
        
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        onClick={handleZoomIn}
        size="sm"
        className="bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200 h-9 w-9 p-0"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        onClick={handleZoomOut}
        size="sm"
        className="bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200 h-9 w-9 p-0"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        onClick={handleFitBounds}
        size="sm"
        className="bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200 h-9 w-9 p-0"
        title="Fit Route"
      >
        <Plane className="h-4 w-4" />
      </Button>
    </div>
  );
}

// The actual map component - dynamically imported to avoid SSR issues
const LeafletMap = dynamic(
  () => import('./LeafletMapContent').then(mod => mod.LeafletMapContent),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }
);

export function InteractiveFlightMap({ origin, destination, stops = [], className = '' }: InteractiveFlightMapProps) {
  const originCoords = airportCoordinates[origin];
  const destCoords = airportCoordinates[destination];
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  // Use a mount counter to ensure fresh container on each mount
  const [mountId, setMountId] = useState(() => Date.now());

  useEffect(() => {
    // Generate new mount ID on each mount to force fresh container
    setMountId(Date.now());
    setIsMounted(true);
    
    return () => {
      setIsMounted(false);
      setMapInstance(null);
    };
  }, []);

  const handleMapReady = useCallback((map: any) => {
    setMapInstance(map);
  }, []);

  if (!originCoords || !destCoords) {
    return (
      <div className={`w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="text-gray-500">Invalid airport coordinates</div>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className={`w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg ${className}`}
    >
      <LeafletMap
        key={`leaflet-map-${mountId}`}
        origin={origin}
        destination={destination}
        stops={stops}
        originCoords={originCoords}
        destCoords={destCoords}
        onMapReady={handleMapReady}
      />
      
      <ZoomControls 
        map={mapInstance} 
        origin={origin} 
        destination={destination} 
        stops={stops} 
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2 z-[1000] border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Origin</span>
          </div>
          {stops.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-gray-700 dark:text-gray-300">Layover</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Destination</span>
          </div>
        </div>
      </div>
    </div>
  );
}
