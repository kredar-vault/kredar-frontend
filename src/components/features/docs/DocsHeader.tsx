'use client';

import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

export default function DocsHeader() {
  return (
    <header className="h-16 bg-white border-b border-[#e2ebd9] flex items-center px-6 justify-between sticky top-0 z-30">
      <div className="flex items-center gap-6 flex-1">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#5d6b60] hover:text-[#0f8b4b] transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Back to Home</span>
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-[#e2ebd9]" />

        {/* Brand logo wordmark */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-extrabold text-[14px] tracking-wider text-[#0c1e13] font-sans">
            API-DOC
          </span>
        </Link>

        {/* Search bar */}
        <div className="relative max-w-xs w-full hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Search docs and more"
            className="w-full bg-[#f4f7f4] border border-[#e2ebd9] rounded-lg py-1.5 pl-9 pr-4 text-xs text-[#0c1e13] placeholder-slate-400 focus:outline-none focus:border-[#0f8b4b] transition-colors"
          />
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-6 text-xs font-semibold text-[#4e5b52]">
        <Link href="/docs" className="hover:text-[#0f8b4b] transition-colors">
          API
        </Link>
        <Link href="/dashboard/help" className="hover:text-[#0f8b4b] transition-colors">
          Support
        </Link>
        <Link
          href="/auth/login"
          className="bg-[#10a35e] hover:bg-[#0d8e51] text-white px-4 py-2 rounded-lg transition-colors font-inter font-bold text-[11px]"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}
