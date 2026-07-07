'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from './Landingnavbar';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#030A05] text-white">
      {/* Background Ambience */}

      <Navbar />
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-[-220px] h-[650px] w-[1100px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(22,158,92,0.38)_0%,rgba(22,158,92,0.18)_35%,rgba(22,158,92,0.05)_70%,transparent_100%)] blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#169E5C]/30 to-transparent" />
        <div className="absolute left-[-120px] top-[180px] h-[420px] w-[420px] rounded-full bg-[#169E5C]/10 blur-[150px]" />
        <div className="absolute right-[-150px] top-[120px] h-[460px] w-[460px] rounded-full bg-[#169E5C]/10 blur-[170px]" />
      </div>

      {/* Main Hero Showcase */}
      <main className="relative z-20 mx-auto flex max-w-7xl flex-col items-center px-6 pt-16 text-center">
        <span className="mb-5 rounded-full border border-[#21462D] bg-[#08120D]/70 px-4 py-2 text-[11px] font-medium text-[#D6ECDD] backdrop-blur">
          Modern payment infrastructure for businesses
        </span>

        <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.05em] md:text-6xl">
          Never wonder
          <br />
          who paid again.
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
          Dedicated virtual accounts, instant reconciliation, real-time verification and payment
          infrastructure built for modern African businesses.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/docs"
            className="flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#030A05] transition hover:bg-gray-100"
          >
            Get Started
          </Link>

          <Link
            href="/docs"
            className="flex h-12 items-center justify-center rounded-full border border-[#21462D] bg-[#07130B]/70 px-7 text-sm text-gray-300 transition hover:bg-[#0B1810]"
          >
            View API Docs
          </Link>
        </div>

        {/* Visual Showcase Interface */}
        <div className="relative mt-14 flex h-[470px] w-full items-end justify-center overflow-hidden">
          {/* Left floating cards */}
          <div className="absolute left-[6%] top-6 hidden flex-col gap-5 lg:flex">
            <div className="-rotate-2 rounded-full border border-[#21462D] bg-[#09160E]/90 px-3 py-2 text-[11px] backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#22C76A]" />
                Account Created
              </div>
            </div>

            <div className="-rotate-3 rounded-2xl border border-[#21462D] bg-[#09160E]/90 p-5 shadow-[0_30px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-300 hover:rotate-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                Total Virtual Accounts
              </p>
              <h3 className="mt-2 text-3xl font-black">12</h3>
              <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                Funds Managed
              </p>
              <div className="mt-2 text-xl font-bold text-[#22C76A]">₦2.1M</div>
            </div>
          </div>

          {/* Right floating cards */}
          <div className="absolute right-[6%] top-2 hidden flex-col gap-5 lg:flex">
            <div className="rotate-2 rounded-full border border-[#21462D] bg-[#09160E]/90 px-3 py-2 text-[11px] backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#22C76A]" />
                Real-time Verification
              </div>
            </div>

            <div className="rotate-3 rounded-2xl border border-[#21462D] bg-[#09160E]/90 p-5 text-left shadow-[0_30px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-300 hover:rotate-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                Recent Transaction
              </p>
              <p className="mt-3 text-sm font-semibold text-white">
                <span className="font-bold text-[#22C76A]">+₦120,000</span> from Account #392
              </p>
              <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-[#183622]">
                <div className="h-full w-3/4 rounded-full bg-[#22C76A]" />
              </div>
            </div>
          </div>

          {/* Phone Glow Effect */}
          <div className="absolute bottom-0 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#169E5C]/30 blur-[120px]" />

          {/* Phone Frame */}
          <div className="relative z-20 w-[270px] overflow-hidden rounded-[40px] border-[6px] border-[#16271C] bg-[#030A05] p-2 shadow-[0_35px_90px_rgba(0,0,0,0.75)] md:w-[295px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
            <div className="absolute left-1/2 top-2 z-30 h-4 w-24 -translate-x-1/2 rounded-full bg-[#182C20]" />

            <div className="rounded-[32px] border border-[#14291B] bg-[#050D07] px-4 pb-4 pt-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-[#22C76A]">
                    <span className="text-[8px] font-black text-[#030A05]">K</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-300">
                    Kredar
                  </span>
                </div>
                <div className="h-3 w-3 rounded-full bg-[#173822]" />
              </div>

              <div className="mt-5 rounded-xl border border-[#173822] bg-[#09160E] p-3">
                <p className="text-[9px] text-gray-500">Current Wallet Balance</p>
                <h2 className="mt-1 text-xl font-black">₦540,000</h2>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-[#245534] bg-[#102216] py-2 text-center text-[9px] font-bold text-[#22C76A]">
                  Dedicated Core
                </div>
                <div className="rounded-lg border border-[#173822] bg-[#07130B] py-2 text-center text-[9px] text-gray-400">
                  Virtual Router
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {[
                  { id: 'Wema Circle', num: '902****211' },
                  { id: 'Providus Main', num: '102****582' },
                  { id: 'Sterling Pool', num: '818****034' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-[#173822]/50 bg-[#07130B]/70 p-2"
                  >
                    <div>
                      <p className="text-[10px] font-semibold">{item.id}</p>
                      <p className="text-[8px] text-gray-500">{item.num}</p>
                    </div>
                    <span className="rounded bg-[#102216] px-2 py-1 text-[7px] font-bold uppercase text-[#22C76A]">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom structural crop */}
          <div className="pointer-events-none absolute bottom-0 left-0 z-30 h-8 w-full bg-[#030A05]" />
        </div>
      </main>

      {/* Structural Ambient Green Blurs */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <div className="absolute bottom-[-120px] h-[420px] w-[1200px] rounded-full bg-[linear-gradient(180deg,#7CF59A_0%,#4ADE80_30%,#22C55E_55%,transparent_100%)] opacity-90 blur-[90px]" />
        <div className="absolute bottom-[-40px] h-[220px] w-[700px] rounded-full bg-white opacity-70 blur-[80px]" />
        <div className="absolute bottom-[-140px] h-[500px] w-[1600px] rounded-full bg-[#22C55E] opacity-25 blur-[180px]" />
      </div>
    </section>
  );
}
