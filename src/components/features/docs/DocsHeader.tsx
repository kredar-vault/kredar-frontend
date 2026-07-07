'use client';

import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import KredarLogo from '@/components/KredarLogo';

export default function DocsHeader() {
  return (
    <header className="h-16 bg-white border-b border-[#e2ebd9] flex items-center px-6 justify-between sticky top-0 z-30">
      <div className="flex items-center gap-6 flex-1">
        {/* Back Button */}

        {/* Brand logo wordmark */}
        <Link href="/" className="flex items-center gap-2">
          <KredarLogo />
          <span className="font-bold text-[13px] tracking-wide text-[#5d6b60] border-l border-[#e2ebd9] pl-2 ml-1">
            Docs
          </span>
        </Link>

        {/* Search bar */}
        <div className="relative max-w-xs w-full hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Search Kredar docs..."
            className="w-full bg-[#f4f7f4] border border-[#e2ebd9] rounded-lg py-1.5 pl-9 pr-4 text-xs text-[#0c1e13] placeholder-slate-400 focus:outline-none focus:border-[#0f8b4b] transition-colors"
          />
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-6 text-xs font-semibold text-[#4e5b52]">
        <Link href="/help" className="hover:text-[#0f8b4b] transition-colors">
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
