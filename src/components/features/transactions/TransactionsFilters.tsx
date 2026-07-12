'use client';

import { Search, Download, ChevronDown } from 'lucide-react';
import Button from '../landing/Button';

interface TransactionsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExport: () => void;
}

export default function TransactionsFilters({
  searchQuery,
  setSearchQuery,
  onExport,
}: TransactionsFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search Input by TRX ID */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45504b]" />
          <input
            type="text"
            placeholder="Search by TRX ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="kredar-input pl-10 pr-4 h-9 text-xs border-[#d8e1da]"
          />
        </div>

        {/* Date Select Dropdown */}
        <div className="relative">
          <select className="kredar-select h-9 text-xs pl-3 pr-8 w-36 border-[#d8e1da]">
            <option>Date</option>
            <option>Last 14 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>This Year</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
          />
        </div>

        {/* Currency Select Dropdown */}
        <div className="relative">
          <select className="kredar-select h-9 text-xs pl-3 pr-8 w-32 border-[#d8e1da]">
            <option>Currency</option>
            <option>NGN</option>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
          />
        </div>

        {/* Status Select Dropdown */}
        <div className="relative">
          <select className="kredar-select h-9 text-xs pl-3 pr-8 w-32 border-[#d8e1da]">
            <option>Status</option>
            <option>success</option>
            <option>Pending</option>
            <option>Failed</option>
            <option>Reversed</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
          />
        </div>
      </div>

      <div>
        {/* Export Button (Green) */}
        <Button
          onClick={onExport}
          className="kredar-btn-primary flex items-center gap-2 h-9 px-4 text-xs font-semibold"
        >
          <Download size={14} />
          Export
        </Button>
      </div>
    </div>
  );
}
