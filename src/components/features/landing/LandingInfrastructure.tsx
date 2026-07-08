import React from 'react';
import Link from 'next/link';

export default function InfrastructureSection() {
  return (
    <section className="w-full bg-[#030A05] text-white py-12 md:py-14  selection:bg-[#006C49]/30 relative overflow-hidden">
      {/* Background radial glow behind the mockups */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-[radial-gradient(circle_closest-side,#006C49,transparent)] opacity-[0.12] blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* ── LEFT COLUMN: CONTENT TEXT ── */}
        <div className="lg:col-span-5 space-y-3.5 text-left">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#00FF9D] block">
            Built for growth
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-none">
            Infrastructure that <br />
            <span className="text-[#00FF9D]">Scales with your</span> <br />
            Business
          </h2>

          <p className="text-[11px] md:text-xs text-gray-400 font-normal leading-relaxed max-w-sm">
            From customer onboarding to real-time reconciliation, Kredar provides simple yet
            powerful payment infrastructure for businesses handling high-volume bank transfers.
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-1">
            <Link
              href="/auth/login"
              className="px-4 h-8 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white bg-[#006C49] rounded-full hover:bg-[#00855a] transition-all duration-200"
            >
              Get Started
              <svg
                width="8"
                height="8"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 7H13M13 7L7 1M13 7L7 13"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/docs"
              className="px-4 h-8 flex items-center justify-center text-[11px] font-medium text-gray-300 bg-[#121F16] border border-[#1C3524] rounded-full hover:bg-[#192F20] transition-all duration-200"
            >
              View API Docs
            </Link>
          </div>
        </div>

        {/* ── RIGHT COLUMN: OVERLAPPING MOBILE MOCKUPS (REDUCED HEIGHT) ── */}
        <div className="lg:col-span-7 w-full flex justify-center lg:justify-end items-center relative min-h-[260px] md:min-h-[280px]">
          {/* Main frame box containing the visual (Significantly reduced height constraint) */}
          <div className="w-full max-w-[500px] h-[260px] md:h-[280px] bg-[#050E08]/40 border border-[#102416] rounded-2xl relative flex items-center justify-center overflow-hidden">
            {/* Subtle inner card sheen */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#006C49]/5 to-transparent pointer-events-none" />

            {/* MOCKUP 1: LEFT / UNDER PHONE */}
            <div className="absolute left-[15%] md:left-[22%] bottom-[-55px] w-[140px] md:w-[160px] aspect-[9/18] bg-[#030A05] rounded-[24px] border-[3px] border-[#16271C] shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-1.5 transform -rotate-12 origin-bottom transition-transform hover:rotate-0 duration-500 z-10">
              <div className="w-full h-full bg-[#050D07] rounded-[18px] p-2 flex flex-col text-left border border-[#102216]">
                {/* Brand Header */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="w-2.5 h-2.5 flex items-center justify-center bg-[#00FF9D] rounded-[1.5px]">
                    <span className="text-[4px] font-bold text-[#030A05]">K</span>
                  </div>
                  <span className="text-[5.5px] font-bold tracking-wider uppercase text-gray-400">
                    Kredar
                  </span>
                </div>

                <span className="text-[8px] font-bold text-white block mb-0.5">
                  Virtual Account
                </span>
                <span className="text-[5.5px] text-gray-500 block mb-2">
                  Real-time settlement router
                </span>

                {/* Account details panel */}
                <div className="p-1.5 rounded-md bg-[#0E2416] border border-[#1A3A25] space-y-1 flex-1">
                  <span className="text-[5px] text-[#00FF9D]/60 uppercase tracking-wider block">
                    Assigned To
                  </span>
                  <p className="text-[7.5px] font-bold text-white leading-none">
                    Chidi Enterprises Ltd.
                  </p>

                  <span className="text-[5px] text-[#00FF9D]/60 uppercase tracking-wider block pt-0.5">
                    Account Number
                  </span>
                  <p className="text-[9px] font-mono font-bold text-white tracking-wide">
                    0123 4567 89
                  </p>

                  <span className="text-[5px] text-gray-400 block pt-0.5">Bank Node</span>
                  <p className="text-[6.5px] font-medium text-gray-300">Access Bank PLC</p>
                </div>
              </div>
            </div>

            {/* MOCKUP 2: RIGHT / FOREGROUND PHONE */}
            <div className="absolute right-[18%] md:right-[24%] bottom-[-35px] w-[150px] md:w-[170px] aspect-[9/18] bg-[#030A05] rounded-[26px] border-[4px] border-[#1C3324] shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 transform rotate-6 origin-bottom transition-transform hover:rotate-0 duration-500 z-20">
              <div className="w-full h-full bg-[#050D07] rounded-[20px] p-2 flex flex-col text-left border border-[#122719]">
                {/* Micro App Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 flex items-center justify-center bg-[#00FF9D] rounded-[2px]">
                      <span className="text-[5px] font-bold text-[#030A05]">K</span>
                    </div>
                    <span className="text-[6.5px] font-bold tracking-wider uppercase text-gray-200">
                      Kredar
                    </span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[#00FF9D]" />
                </div>

                {/* Main Balance metrics */}
                <span className="text-[5.5px] text-gray-500 uppercase tracking-wider block">
                  Total Pool
                </span>
                <span className="text-sm font-bold text-white tracking-tight block mb-1.5">
                  ₦2,400,000
                </span>

                {/* Mini Graph Box representation */}
                <div className="p-1 rounded-md bg-[#08160E] border border-[#14291B] mb-2">
                  <div className="w-full h-4 flex items-end gap-0.5">
                    <div className="w-full h-[40%] bg-[#006C49] rounded-[1px]" />
                    <div className="w-full h-[55%] bg-[#006C49] rounded-[1px]" />
                    <div className="w-full h-[45%] bg-[#006C49] rounded-[1px]" />
                    <div className="w-full h-[75%] bg-[#00FF9D] rounded-[1px]" />
                    <div className="w-full h-[60%] bg-[#00FF9D] rounded-[1px]" />
                    <div className="w-full h-[90%] bg-[#00FF9D] rounded-[1px]" />
                  </div>
                </div>

                {/* Recent Settlements Ledger */}
                <div className="flex-1 space-y-0.5 overflow-hidden">
                  {[
                    { title: 'Flexi Inc', val: '+₦140k' },
                    { title: 'Chidi Ent.', val: '+₦750k' },
                    { title: 'Tayo O.', val: '+₦45k' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-0.5 px-1 rounded-[3px] bg-[#07130B] flex items-center justify-between border border-[#14291B]/40"
                    >
                      <span className="text-[6.5px] font-medium text-gray-300">{item.title}</span>
                      <span className="text-[6px] font-bold text-[#00FF9D]">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
