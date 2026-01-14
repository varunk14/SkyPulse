'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useSearchStore } from '@/store/searchStore';
import { parseDuration, formatPrice } from '@/lib/formatters';
import { parseISO, format } from 'date-fns';

interface PriceDataPoint {
  price: number;
  name: string;
  count: number;
  airline: string;
  fullTime: string;
}

export function PriceGraph() {
  const { flights, filters, airlinesDictionary } = useSearchStore();

  // Generate data for the graph based on filtered flights
  const { graphData, stats } = useMemo(() => {
    if (flights.length === 0) {
      return { graphData: [], stats: null };
    }

    // Apply filters (same logic as FlightList)
    const filteredFlights = flights.filter((flight) => {
      const price = parseFloat(flight.price.grandTotal);
      const outbound = flight.itineraries[0];
      const stops = outbound.segments.length - 1;
      const duration = parseDuration(outbound.duration);
      const departureHour = parseISO(outbound.segments[0].departure.at).getHours();
      const mainCarrier = flight.validatingAirlineCodes[0];

      if (filters.stops.length > 0) {
        const stopCategory = stops >= 2 ? 2 : stops;
        if (!filters.stops.includes(stopCategory)) return false;
      }
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      if (filters.airlines.length > 0 && !filters.airlines.includes(mainCarrier)) return false;
      if (departureHour < filters.departureTime[0] || departureHour > filters.departureTime[1]) return false;
      if (duration > filters.duration) return false;

      return true;
    });

    if (filteredFlights.length === 0) {
      return { graphData: [], stats: null };
    }

    // Group by price buckets for histogram-like display
    const prices = filteredFlights.map((f) => parseFloat(f.price.grandTotal));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Create data points sorted by departure time
    const data: PriceDataPoint[] = filteredFlights
      .map((flight) => ({
        price: parseFloat(flight.price.grandTotal),
        name: format(parseISO(flight.itineraries[0].segments[0].departure.at), 'HH:mm'),
        fullTime: flight.itineraries[0].segments[0].departure.at,
        count: 1,
        airline: airlinesDictionary[flight.validatingAirlineCodes[0]] || flight.validatingAirlineCodes[0],
      }))
      .sort((a, b) => new Date(a.fullTime).getTime() - new Date(b.fullTime).getTime());

    return {
      graphData: data,
      stats: {
        min: minPrice,
        max: maxPrice,
        avg: avgPrice,
        count: filteredFlights.length,
      },
    };
  }, [flights, filters, airlinesDictionary]);

  const currency = flights[0]?.price?.currency || 'USD';

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: PriceDataPoint }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3 min-w-[140px]">
          <p className="text-lg font-bold text-gray-900 font-mono">
            {formatPrice(data.price, currency)}
          </p>
          <p className="text-sm text-gray-600">{data.airline}</p>
          <p className="text-xs text-gray-400 mt-1">Departs at {data.name}</p>
        </div>
      );
    }
    return null;
  };

  if (flights.length === 0) {
    return null;
  }

  if (graphData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Price Overview</h3>
        <div className="h-[200px] flex items-center justify-center text-gray-500">
          No flights match your current filters
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Price Overview</h3>
          <p className="text-sm text-gray-500">
            {stats?.count} flights shown
          </p>
        </div>
        
        {stats && (
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Lowest</p>
              <p className="text-lg font-bold text-emerald-600 font-mono">
                {formatPrice(stats.min, currency)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Average</p>
              <p className="text-lg font-bold text-gray-900 font-mono">
                {formatPrice(stats.avg, currency)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 uppercase tracking-wide">Highest</p>
              <p className="text-lg font-bold text-rose-500 font-mono">
                {formatPrice(stats.max, currency)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-[200px] sm:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={graphData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => `$${value}`}
              width={60}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip content={<CustomTooltip />} />
            {stats && (
              <ReferenceLine
                y={stats.avg}
                stroke="#9CA3AF"
                strokeDasharray="5 5"
                label={{
                  value: 'Avg',
                  position: 'right',
                  fill: '#9CA3AF',
                  fontSize: 10,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="price"
              stroke="#4F46E5"
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={{
                r: 4,
                fill: '#4F46E5',
                strokeWidth: 2,
                stroke: '#fff',
              }}
              activeDot={{
                r: 6,
                fill: '#4F46E5',
                strokeWidth: 2,
                stroke: '#fff',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-brand-600" />
          <span>Flight prices by departure time</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-px w-4 border-t-2 border-dashed border-gray-400" />
          <span>Average price</span>
        </div>
      </div>
    </div>
  );
}
