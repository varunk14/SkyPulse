export { FlightRouteMap } from './FlightRouteMap';
// Export InteractiveFlightMap with dynamic import to avoid SSR issues
import dynamic from 'next/dynamic';

export const InteractiveFlightMap = dynamic(
  () => import('./InteractiveFlightMap').then((mod) => mod.InteractiveFlightMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }
);
