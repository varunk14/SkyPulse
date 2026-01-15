"use client";

import { memo } from "react";
import { Plane } from "lucide-react";

interface Props {
  origin: string;
  destination: string;
  stops?: string[];
}

function FlightRouteMapComponent({ origin, destination, stops = [] }: Props) {
  return (
    <div className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Origin */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg shadow-sm">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="font-bold text-gray-800">{origin}</span>
        </div>

        {/* Stops */}
        {stops.map((stop) => (
          <div key={stop} className="flex items-center gap-2">
            <div className="flex items-center text-indigo-400">
              <span className="text-xs">---</span>
              <Plane className="h-4 w-4 mx-1" />
              <span className="text-xs">---</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg shadow-sm">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="font-medium text-gray-700">{stop}</span>
            </div>
          </div>
        ))}

        {/* Final arrow to destination */}
        <div className="flex items-center text-indigo-400">
          <span className="text-xs">---</span>
          <Plane className="h-4 w-4 mx-1" />
          <span className="text-xs">---</span>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg shadow-sm">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="font-bold text-gray-800">{destination}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Origin</span>
        </div>
        {stops.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Layover</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>Destination</span>
        </div>
      </div>
    </div>
  );
}

export const FlightRouteMap = memo(FlightRouteMapComponent);
