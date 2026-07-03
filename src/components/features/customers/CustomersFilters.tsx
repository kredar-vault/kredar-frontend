'use client';

import { Search, Download, ChevronDown } from 'lucide-react';

interface CustomersFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function CustomersFilters({ searchQuery, setSearchQuery }: CustomersFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Search input by ID or Name */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45504b]" />
          <input
            type="text"
            placeholder="Search by ID or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="kredar-input pl-10 pr-4 h-9 text-xs border-[#d8e1da]"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select className="kredar-select h-9 text-xs pl-3 pr-8 w-32 border-[#d8e1da]">
            <option>Status</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Unverified</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
          />
        </div>

        {/* Country Dropdown */}
        <div className="relative">
          <select className="kredar-select h-9 text-xs pl-3 pr-8 w-32 border-[#d8e1da]">
            <option>Country</option>
            <option>Nigeria</option>
            <option>Ghana</option>
            <option>Kenya</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
          />
        </div>

        {/* Date joined Dropdown */}
        <div className="relative">
          <select className="kredar-select h-9 text-xs pl-3 pr-8 w-36 border-[#d8e1da]">
            <option>Date joined</option>
            <option>Last 14 days</option>
            <option>Last 30 days</option>
            <option>This Year</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45504b] pointer-events-none"
          />
        </div>
      </div>

      <div>
        {/* Export Button (Green) */}
        <button className="kredar-btn-primary flex items-center gap-2 h-9 px-4 text-xs font-semibold">
          <Download size={14} />
          Export
        </button>
      </div>
    </div>
  );
}
