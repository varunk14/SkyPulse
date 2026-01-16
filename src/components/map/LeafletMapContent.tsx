'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { airportCoordinates } from '@/lib/airportCoordinates';

interface LeafletMapContentProps {
  origin: string;
  destination: string;
  stops?: string[];
  originCoords: [number, number];
  destCoords: [number, number];
  onMapReady: (map: L.Map) => void;
}

// Component to handle bounds and map ready callback
function MapController({ 
  originCoords, 
  destCoords, 
  stops,
  onMapReady 
}: { 
  originCoords: [number, number];
  destCoords: [number, number];
  stops?: string[];
  onMapReady: (map: L.Map) => void;
}) {
  const map = useMap();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!map || initializedRef.current) return;
    
    // Invalidate size to ensure tiles load correctly
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
    
    // Calculate bounds including all points
    const allCoords: [number, number][] = [originCoords];
    if (stops) {
      stops.forEach(stop => {
        const coords = airportCoordinates[stop];
        if (coords) allCoords.push(coords);
      });
    }
    allCoords.push(destCoords);
    
    const lats = allCoords.map(c => c[0]);
    const lngs = allCoords.map(c => c[1]);
    const bounds: L.LatLngBoundsExpression = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ];
    
    map.fitBounds(bounds, { padding: [50, 50] });
    initializedRef.current = true;
    onMapReady(map);
  }, [map, originCoords, destCoords, stops, onMapReady]);

  return null;
}

// Create icons outside component to avoid recreation
function createIcons() {
  return {
    originIcon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 20px;
        height: 20px;
        background-color: #10b981;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    }),
    layoverIcon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 20px;
        height: 20px;
        background-color: #f59e0b;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    }),
    destinationIcon: L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 20px;
        height: 20px;
        background-color: #ef4444;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    }),
  };
}

export function LeafletMapContent({ 
  origin, 
  destination, 
  stops = [],
  originCoords,
  destCoords,
  onMapReady 
}: LeafletMapContentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const iconsRef = useRef<ReturnType<typeof createIcons> | null>(null);
  
  // Ensure we're on client side before rendering
  useEffect(() => {
    setIsMounted(true);
    iconsRef.current = createIcons();
  }, []);

  // Calculate stop coordinates
  const stopCoords = useMemo(() => 
    stops.map(stop => airportCoordinates[stop]).filter(Boolean) as [number, number][],
    [stops]
  );

  // Create polyline path
  const path = useMemo(() => {
    const p: [number, number][] = [originCoords];
    stopCoords.forEach(coord => p.push(coord));
    p.push(destCoords);
    return p;
  }, [originCoords, destCoords, stopCoords]);

  // Don't render until mounted on client
  if (!isMounted || !iconsRef.current) {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e5e7eb' }}>
        <div style={{ color: '#6b7280' }}>Loading map...</div>
      </div>
    );
  }

  const icons = iconsRef.current;

  return (
    <MapContainer
      center={originCoords}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController
        originCoords={originCoords}
        destCoords={destCoords}
        stops={stops}
        onMapReady={onMapReady}
      />
      
      {/* Origin Marker - Green */}
      <Marker position={originCoords} icon={icons.originIcon}>
        <Popup>
          <div className="text-center">
            <div className="font-bold text-green-600">{origin}</div>
            <div className="text-sm text-gray-600">Origin</div>
          </div>
        </Popup>
      </Marker>
      
      {/* Stop Markers - Amber/Orange */}
      {stopCoords.map((coords, index) => {
        const stopCode = stops[index];
        return (
          <Marker 
            key={`stop-${index}-${stopCode}`} 
            position={coords}
            icon={icons.layoverIcon}
          >
            <Popup>
              <div className="text-center">
                <div className="font-bold text-amber-600">{stopCode}</div>
                <div className="text-sm text-gray-600">Layover</div>
              </div>
            </Popup>
          </Marker>
        );
      })}
      
      {/* Destination Marker - Red */}
      <Marker position={destCoords} icon={icons.destinationIcon}>
        <Popup>
          <div className="text-center">
            <div className="font-bold text-red-600">{destination}</div>
            <div className="text-sm text-gray-600">Destination</div>
          </div>
        </Popup>
      </Marker>
      
      {/* Flight Route Line */}
      <Polyline
        positions={path}
        pathOptions={{
          color: '#6366f1',
          weight: 3,
          opacity: 0.7,
          dashArray: '10, 10'
        }}
      />
    </MapContainer>
  );
}
