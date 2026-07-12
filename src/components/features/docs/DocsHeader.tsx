'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import Button from '../landing/Button';

interface DocsHeaderProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSearchResultClick?: (id: string) => void;
}

const searchIndex = [
  {
    id: 'introduction',
    title: 'Introduction',
    category: 'Getting Started',
    content:
      'Welcome to Kredar. payment infrastructure B2B virtual accounts reconciliation API test mode live mode.',
  },
  {
    id: 'base-url',
    title: 'Base URL',
    category: 'Getting Started',
    content:
      'Base URL endpoint staging production environment https://api.kredar.xyz https://api.kredar.com self-hosting.',
  },
  {
    id: 'auth',
    title: 'Authentication',
    category: 'Getting Started',
    content: 'Authentication API key headers Bearer token Authorization secure dashboard.',
  },
  {
    id: 'create-dedicated-account',
    title: 'Create a Dedicated Virtual Account',
    category: 'Dedicated Accounts',
    content:
      'Create dedicated virtual account customer POST /api/v1/dedicated-accounts bank account name.',
  },
  {
    id: 'list-dedicated-accounts',
    title: 'List All Dedicated Accounts',
    category: 'Dedicated Accounts',
    content:
      'List dedicated accounts query parameters GET /api/v1/dedicated-accounts currency customer limit.',
  },
  {
    id: 'get-dedicated-account',
    title: 'Get Dedicated Account by ID',
    category: 'Dedicated Accounts',
    content:
      'Retrieve dedicated account details GET /api/v1/dedicated-accounts/:id path parameter.',
  },
  {
    id: 'list-transactions',
    title: 'List All Transactions',
    category: 'Transactions',
    content:
      'List all transactions payments logs details GET /api/v1/transactions query limit status.',
  },
  {
    id: 'create-transaction',
    title: 'Manual Transaction Record',
    category: 'Transactions',
    content:
      'Create manual transaction record deposit credit POST /api/v1/transactions account amount.',
  },
  {
    id: 'get-transaction',
    title: 'Get Transaction by ID',
    category: 'Transactions',
    content: 'Get transaction details ID GET /api/v1/transactions/:id path parameter.',
  },
  {
    id: 'customer-transactions',
    title: 'Get Customer Transactions',
    category: 'Transactions',
    content:
      'Retrieve customer transactions list ID GET /api/v1/transactions/customer/:customerId.',
  },
  {
    id: 'customer-transaction-stats',
    title: 'Get Customer Transaction Statistics',
    category: 'Transactions',
    content:
      'Get customer transaction statistics total volume GET /api/v1/transactions/customer/:customerId/stats.',
  },
  {
    id: 'health',
    title: 'Health Check',
    category: 'System',
    content: 'System health check check status uptime GET /health.',
  },
];

export default function DocsHeader({
  searchQuery = '',
  setSearchQuery,
  onSearchResultClick,
}: DocsHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results
  const results = searchQuery
    ? searchIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const handleResultClick = (id: string) => {
    if (onSearchResultClick) {
      onSearchResultClick(id);
    }
    if (setSearchQuery) {
      setSearchQuery('');
    }
    setShowDropdown(false);
  };

  return (
    <header className="h-16 bg-white border-b border-[#e2ebd9] flex items-center px-3 sm:px-6 justify-between sticky top-0 z-30 font-sans">
      <div className="flex items-center gap-2.5 sm:gap-6 flex-1 min-w-0">
        {/* Back Button - Visible on all devices */}
        <Link
          href="/"
          className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#5d6b60] hover:text-[#0f8b4b] transition-colors whitespace-nowrap"
          aria-label="Back to Home"
        >
          <ArrowLeft size={14} />
          <span className="hidden xs:inline">Back to Home</span>
          <span className="inline xs:hidden">Back</span>
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-[#e2ebd9]" />

        {/* Brand logo wordmark */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-bold text-[11px] sm:text-[14px] tracking-wider text-[#0c1e13] font-sans whitespace-nowrap">
            KREDAR <span className="hidden md:inline">API-DOC</span>
          </span>
        </Link>

        {/* Search bar - Responsive and visible on mobile/tablet/desktop */}
        <div
          ref={containerRef}
          className="relative flex-grow max-w-[120px] xs:max-w-[180px] sm:max-w-xs w-full"
        >
          <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
            <Search size={12} />
          </div>
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => {
              if (setSearchQuery) setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full bg-[#f4f7f4] border border-[#e2ebd9] rounded-lg py-1.5 pl-8 pr-3 text-[11px] sm:text-xs text-[#0c1e13] placeholder-slate-400 focus:outline-none focus:border-[#0f8b4b] transition-colors"
          />

          {/* Search Dropdown Overlay */}
          {showDropdown && searchQuery && (
            <div className="absolute top-full left-0 mt-1 w-[220px] xs:w-[260px] sm:w-80 bg-white border border-[#e2ebd9] rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-2 duration-150">
              {results.length > 0 ? (
                results.map((result) => (
                  <Button
                    key={result.id}
                    onClick={() => handleResultClick(result.id)}
                    className="w-full text-left px-4 py-2 hover:bg-[#f4f7f4] transition-colors flex flex-col gap-0.5 border-b border-[#f4f7f4] last:border-b-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#0c1e13] truncate">
                        {result.title}
                      </span>
                      <span className="text-[9px] font-bold text-[#0f8b4b] bg-[#0f8b4b]/10 px-1.5 py-0.5 rounded uppercase">
                        {result.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 line-clamp-1">
                      {result.content}
                    </span>
                  </Button>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-slate-400 text-center font-medium">
                  No results found for &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nav Actions - Stacked nicely */}
      <div className="flex items-center gap-3 sm:gap-6 text-[11px] sm:text-xs font-semibold text-[#4e5b52] flex-shrink-0 ml-2">
        <Link href="/help" className="hover:text-[#0f8b4b] transition-colors">
          Support
        </Link>
        <Link
          href="/auth/login"
          className="bg-[#10a35e] hover:bg-[#0d8e51] text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors font-sans font-bold text-[10px] sm:text-[11px]"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}
