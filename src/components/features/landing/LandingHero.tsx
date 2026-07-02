'use client';

import Link from 'next/link';

export default function LandingHero() {
  return (
    <section className="px-4 py-4 md:px-6 md:py-6">
      <div className="max-w-[1392px] min-h-[940px] mx-auto bg-[#030A03] rounded-[32px] p-6 md:p-12 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl">
        {/* Top Radial Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#169e5c]/10 to-transparent blur-[140px] pointer-events-none" />

        {/* Gold Four-pointed Star ✦ */}
        <div className="absolute top-16 right-16 text-[#C5A85A] opacity-60 pointer-events-none select-none text-xl animate-pulse">
          ✦
        </div>

        {/* CAPSULE NAVBAR */}
        <header className="w-full max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-full px-6 py-3 flex items-center justify-between backdrop-blur-md z-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0">
              <img
                src="/images/logo-icon.ico"
                alt="Kredar"
                className="w-3.5 h-3.5 brightness-0 invert"
              />
            </div>
            <span
              style={{
                color: '#FFF',
                fontFamily: 'var(--font-lexend-zetta)',
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '1.2px',
              }}
              className="uppercase tracking-[0.11em] select-none"
            >
              KREDAR
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs">
            <a
              href="#features"
              className="text-white hover:text-[#169E5C] transition-colors duration-150"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-white hover:text-[#169E5C] transition-colors duration-150"
            >
              Use Cases
            </a>
            <a
              href="#infrastructure"
              className="text-white hover:text-[#169E5C] transition-colors duration-150"
            >
              Developers
            </a>
            <a
              href="#faq"
              className="text-white hover:text-[#169E5C] transition-colors duration-150"
            >
              API Docs
            </a>
          </nav>

          {/* CTA Button */}
          <Link
            href="/auth/signup"
            className="bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-xs px-4 py-2 rounded-full transition-colors font-inter font-bold"
          >
            Get Started
          </Link>
        </header>

        {/* Core Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1 py-10">
          {/* Left: Heading Details */}
          <div className="space-y-8 z-10 max-w-xl animate-fade-in-up">
            <h1 className="text-4xl md:text-[52px] font-bold tracking-tight text-white leading-[1.1] font-sans">
              Never wonder who paid again
            </h1>
            <p className="text-sm md:text-base text-white leading-relaxed font-medium">
              Managing bank transfers shouldn't slow your business down. Kredar gives you a simpler
              way to collect payments, keep records accurate, and know exactly who has paid—all in
              real time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/auth/signup"
                className="bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-sm px-6 py-3.5 rounded-full text-center transition-colors shadow-lg font-inter font-bold"
              >
                Get Started
              </Link>
              <Link
                href="/docs"
                className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white text-sm px-6 py-3.5 rounded-full text-center transition-all font-inter font-bold"
              >
                View API Docs
              </Link>
            </div>
          </div>

          {/* Right: Gold Hand holding transparent ATM cards */}
          <div className="relative w-full h-[460px] flex items-center justify-center z-10 animate-scale-in">
            {/* Background Glow behind the hand */}
            <div className="hero-gradient absolute pointer-events-none select-none z-0 opacity-50 scale-50" />
            <img
              src="images/hand-atm.png"
              alt="Kredar ATM cards"
              className="max-w-full max-h-full object-contain pointer-events-none absolute z-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Bottom Information Grids styled like Figma screen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8 pt-8 border-t border-white/10 z-10">
          <div className="space-y-1.5">
            <span className="text-[#C5A85A] font-bold text-xs tracking-wider block">01</span>
            <h4 className="font-bold text-[#C5A85A] text-base leading-snug">
              Instant Payment Matching
            </h4>
            <p className="text-white/70 text-[13px] leading-relaxed max-w-sm">
              Automatically identify every incoming payment without manual verification.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-[#C5A85A] font-bold text-xs tracking-wider block">02</span>
            <h4 className="font-bold text-[#C5A85A] text-base leading-snug">Smarter Operations</h4>
            <p className="text-white/70 text-[13px] leading-relaxed max-w-sm">
              Spend less time reconciling and more time growing your business
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
