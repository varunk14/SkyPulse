"use client";

import { memo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} from "react-simple-maps";
import { getAirportCoordinates } from "@/lib/airportCoordinates";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Props {
  origin: string;
  destination: string;
  stops?: string[];
}

function FlightRouteMapComponent({ origin, destination, stops = [] }: Props) {
  const originCoords = getAirportCoordinates(origin);
  const destCoords = getAirportCoordinates(destination);
  
  if (!originCoords || !destCoords) {
    return null;
  }

  const centerLng = (originCoords[1] + destCoords[1]) / 2;
  const centerLat = (originCoords[0] + destCoords[0]) / 2;
  
  const distance = Math.sqrt(
    Math.pow(destCoords[0] - originCoords[0], 2) + Math.pow(destCoords[1] - originCoords[1], 2)
  );
  
  // Base scale calculation
  let baseScale = 200;
  if (distance < 10) baseScale = 800;
  else if (distance < 30) baseScale = 400;
  else if (distance < 60) baseScale = 200;
  else baseScale = 120;

  const [zoom, setZoom] = useState(1);
  const scale = baseScale * zoom;

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.5, 4));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.5, 0.5));
  const handleReset = () => setZoom(1);

  const routePoints: [number, number][] = [[originCoords[1], originCoords[0]]];
  stops.forEach((stop) => {
    const coords = getAirportCoordinates(stop);
    if (coords) routePoints.push([coords[1], coords[0]]);
  });
  routePoints.push([destCoords[1], destCoords[0]]);

  return (
    <div className="w-full">
      {/* Map Container */}
      <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        
        {/* Map */}
        <div style={{ pointerEvents: 'none', userSelect: 'none', width: '100%', height: '100%' }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [centerLng, centerLat], scale }}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#E2E8F0"
                    stroke="#CBD5E1"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            <Line
              coordinates={routePoints}
              stroke="#6366F1"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray="6 4"
            />

            <Marker coordinates={[originCoords[1], originCoords[0]]}>
              <circle r={8} fill="#10B981" stroke="#fff" strokeWidth={2} />
              <text textAnchor="middle" y={-15} style={{ fontSize: "11px", fontWeight: "bold", fill: "#1F2937" }}>
                {origin}
              </text>
            </Marker>

            {stops.map((stop) => {
              const coords = getAirportCoordinates(stop);
              if (!coords) return null;
              return (
                <Marker key={stop} coordinates={[coords[1], coords[0]]}>
                  <circle r={6} fill="#F59E0B" stroke="#fff" strokeWidth={2} />
                  <text textAnchor="middle" y={-12} style={{ fontSize: "9px", fontWeight: "500", fill: "#1F2937" }}>
                    {stop}
                  </text>
                </Marker>
              );
            })}

            <Marker coordinates={[destCoords[1], destCoords[0]]}>
              <circle r={8} fill="#EF4444" stroke="#fff" strokeWidth={2} />
              <text textAnchor="middle" y={-15} style={{ fontSize: "11px", fontWeight: "bold", fill: "#1F2937" }}>
                {destination}
              </text>
            </Marker>
          </ComposableMap>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="p-1.5 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            title="Reset zoom"
          >
            <RotateCcw className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Origin</span>
        </div>
        {stops.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Layover</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>Destination</span>
        </div>
      </div>
    </div>
  );
}

export const FlightRouteMap = memo(FlightRouteMapComponent);
