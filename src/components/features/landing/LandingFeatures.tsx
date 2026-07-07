import React from 'react';

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="w-full bg-[#FAFDFB] py-16 md:py-20 font-sans selection:bg-[#006C49]/10"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-14">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#006C49] block mb-2">
            Features
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3 leading-tight">
            Built for better payment operations
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
            From collecting payment to always-accurate records, Kredar helps your team move faster
            with total confidence.
          </p>
        </div>

        {/* ── BENTO GRID LAYOUT ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Main Showcase Card: Dedicated Virtual Accounts (Spans 2 columns) */}
          <div className="md:col-span-2 rounded-2xl bg-[#05130A] p-5 md:p-7 flex flex-col justify-between min-h-[280px] md:min-h-[310px] shadow-sm relative overflow-hidden group">
            {/* Subtle premium glow overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_closest-side,#006C49,transparent)] opacity-[0.12] blur-3xl pointer-events-none" />

            <div>
              {/* Icon Badging */}
              <div className="w-8 h-8 rounded-lg bg-[#0E2416] border border-[#1A3A25] flex items-center justify-center mb-4 text-[#00FF9D]">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight mb-2">
                Dedicated Virtual Accounts
              </h3>
              <p className="text-[11px] md:text-xs text-gray-400 font-normal leading-relaxed max-w-lg">
                Collect bank transfers through dedicated payment accounts and confirm payment
                automatically the moment it arrives. No manual checking, no missed payments, no
                reconciliation headaches.
              </p>
            </div>

            {/* Inner Dashboard Component Simulation */}
            <div className="mt-6 w-full rounded-xl bg-[#091C10] border border-[#142E1B] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transform group-hover:translate-y-[-1px] transition-transform duration-300">
              <div className="space-y-0.5">
                <span className="text-[9px] font-semibold text-[#00FF9D]/60 uppercase tracking-wider block">
                  Account assigned to
                </span>
                <p className="text-xs font-bold text-white">Chidi Enterprises Ltd.</p>
                <p className="text-[10px] text-gray-400 font-mono">0123456789 • Access Bank</p>
              </div>
              <div className="self-start sm:self-center">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#0E2416] border border-[#1A3A25] text-[9px] font-bold text-[#00FF9D] uppercase tracking-wide">
                  <span className="w-1 h-1 rounded-full bg-[#00FF9D] animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Card: Built to Scale */}
          <div className="rounded-2xl bg-[#F6F9F7] border border-gray-100 p-5 md:p-7 flex flex-col justify-start min-h-[280px] md:min-h-[310px] shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#E6EFEA] flex items-center justify-center mb-4 text-[#006C49]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>

            <h3 className="text-base font-bold text-gray-900 tracking-tight mb-2">
              Built to scale
            </h3>
            <p className="text-[11px] md:text-xs text-gray-500 font-normal leading-relaxed">
              Manage thousands of virtual accounts in real-time across every major bank without
              risking server dropouts or verification bottlenecks.
            </p>
          </div>
        </div>

        {/* ── BASE ROW TRIPLE CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Base Card 1: Payments verified */}
          <div className="rounded-xl bg-[#F6F9F7] border border-gray-100 p-4 md:p-5 flex flex-col shadow-sm">
            <div className="w-7 h-7 rounded-md bg-[#E6EFEA] flex items-center justify-center mb-3.5 text-[#006C49]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-gray-900 mb-1">Payments verified</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Every payment is automatically reconciled and confirmed instantly.
            </p>
          </div>

          {/* Base Card 2: Real-time visibility */}
          <div className="rounded-xl bg-[#F6F9F7] border border-gray-100 p-4 md:p-5 flex flex-col shadow-sm">
            <div className="w-7 h-7 rounded-md bg-[#E6EFEA] flex items-center justify-center mb-3.5 text-[#006C49]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-gray-900 mb-1">Real-time visibility</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Complete insight into all your payment flows, always on.
            </p>
          </div>

          {/* Base Card 3: Insights that matter */}
          <div className="rounded-xl bg-[#F6F9F7] border border-gray-100 p-4 md:p-5 flex flex-col shadow-sm">
            <div className="w-7 h-7 rounded-md bg-[#E6EFEA] flex items-center justify-center mb-3.5 text-[#006C49]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h4 className="text-xs font-bold text-gray-900 mb-1">Insights that matter</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Smart alerts and analytics keep you fully informed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
