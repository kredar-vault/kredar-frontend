'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import KredarLogo from '@/components/KredarLogo';

interface NavButtonProps {
  children: React.ReactNode;
  href: string;
}

function NavButton({ children, href }: NavButtonProps) {
  return (
    <Link
      href={href}
      className="flex h-9 items-center justify-center rounded-full bg-[#22C76A] px-5 text-[11px] font-semibold text-[#030A05] transition-colors duration-150 hover:bg-[#1eb35f] whitespace-nowrap"
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-50 mx-auto flex w-full max-w-7xl items-center justify-center px-4 pt-6 md:px-6">
      <div className="flex h-14 w-full items-center justify-between rounded-full border border-[#173822] bg-[#07130B]/80 px-6 backdrop-blur-xl">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <KredarLogo />
        </Link>

        {/* DESKTOP NAVIGATION — Pure white text explicitly declared */}
        <nav className="hidden items-center gap-8 text-[12px] font-medium text-white md:flex">
          <a href="#features" className="text-white transition hover:text-white/80">
            Features
          </a>
          <a href="#process" className="text-white transition hover:text-white/80">
            Process
          </a>
          <a href="#faq" className="text-white transition hover:text-white/80">
            FAQs
          </a>
          <Link href="/docs" className="text-white transition hover:text-white/80">
            API Docs
          </Link>
        </nav>

        {/* DESKTOP ACTION CTA */}
        <div className="hidden md:block">
          <NavButton href="/auth/login">Get Started</NavButton>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#173822] text-white transition hover:text-white/80 md:hidden"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* MOBILE OVERLAY MENU */}
      {isOpen && (
        <div className="absolute inset-x-4 top-24 z-40 rounded-3xl border border-[#173822] bg-[#07130B]/95 p-6 backdrop-blur-2xl md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-sm font-medium text-white">
            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="p-2 text-white transition hover:bg-white/5 rounded-lg"
            >
              Features
            </a>
            <a
              href="#process"
              onClick={() => setIsOpen(false)}
              className="p-2 text-white transition hover:bg-white/5 rounded-lg"
            >
              Process
            </a>
            <a
              href="#faq"
              onClick={() => setIsOpen(false)}
              className="p-2 text-white transition hover:bg-white/5 rounded-lg"
            >
              FAQs
            </a>
            <Link
              href="/docs"
              onClick={() => setIsOpen(false)}
              className="p-2 text-white transition hover:bg-white/5 rounded-lg"
            >
              API Docs
            </Link>

            <hr className="border-white/5 my-2" />

            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex h-11 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#030A05] transition hover:bg-[#1eb35f]"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
