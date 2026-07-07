'use client';

import { Search } from 'lucide-react';

interface CustomersFiltersProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function CustomersFilters({ searchQuery, setSearchQuery }: CustomersFiltersProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={14}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Filter records by profile signature..."
        className="h-10 w-full rounded-xl border border-[#eef2ef] bg-white pl-9 pr-4 text-xs font-medium text-[#081b10] placeholder-[#667085] outline-none  transition-all duration-200 focus:border-[#0f8b4b] focus:ring-2 focus:ring-[#0f8b4b]/5"
      />
    </div>
  );
}
