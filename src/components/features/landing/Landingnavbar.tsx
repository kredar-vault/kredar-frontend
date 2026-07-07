'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import KredarLogo from '@/components/KredarLogo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-50 mx-auto flex max-w-7xl items-center justify-center px-4 pt-6 md:px-6">
      <div className="flex h-14 w-full items-center justify-between rounded-full border border-[#173822] bg-[#07130B]/80 px-6 backdrop-blur-xl">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <KredarLogo />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-8 text-[12px] font-medium text-gray-400 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#process" className="transition hover:text-white">
            Process
          </a>
          <a href="#faq" className="transition hover:text-white">
            FAQs
          </a>
          <Link href="/docs" className="transition hover:text-white">
            API Docs
          </Link>
        </nav>

        {/* DESKTOP ACTION CTA */}
        <div className="hidden md:block">
          <Link
            href="/auth/login"
            className="rounded-full bg-[#006C49] px-5 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#005237]"
          >
            Get Started
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#173822] text-gray-400 transition hover:text-white md:hidden"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* MOBILE OVERLAY MENU */}
      {isOpen && (
        <div className="absolute inset-x-4 top-24 z-40 rounded-3xl border border-[#173822] bg-[#07130B]/95 p-6 backdrop-blur-2xl md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-sm font-medium text-gray-400">
            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="p-2 transition hover:text-white rounded-lg hover:bg-white/5"
            >
              Features
            </a>
            <a
              href="#process"
              onClick={() => setIsOpen(false)}
              className="p-2 transition hover:text-white rounded-lg hover:bg-white/5"
            >
              Process
            </a>
            <a
              href="#faq"
              onClick={() => setIsOpen(false)}
              className="p-2 transition hover:text-white rounded-lg hover:bg-white/5"
            >
              FAQs
            </a>
            <Link
              href="/docs"
              onClick={() => setIsOpen(false)}
              className="p-2 transition hover:text-white rounded-lg hover:bg-white/5"
            >
              API Docs
            </Link>

            <hr className="border-white/5 my-2" />

            <Link
              href="/docs"
              onClick={() => setIsOpen(false)}
              className="flex h-11 items-center justify-center rounded-full bg-[#006C49] text-xs font-semibold text-white transition hover:bg-[#005237]"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
