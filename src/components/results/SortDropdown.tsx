'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'price_asc' | 'price_desc' | 'duration_asc' | 'departure_asc' | 'departure_desc';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px] bg-white">
        <ArrowUpDown className="h-4 w-4 mr-2 text-gray-500" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="price_asc">Price: Low to High</SelectItem>
        <SelectItem value="price_desc">Price: High to Low</SelectItem>
        <SelectItem value="duration_asc">Duration: Shortest</SelectItem>
        <SelectItem value="departure_asc">Departure: Earliest</SelectItem>
        <SelectItem value="departure_desc">Departure: Latest</SelectItem>
      </SelectContent>
    </Select>
  );
}
