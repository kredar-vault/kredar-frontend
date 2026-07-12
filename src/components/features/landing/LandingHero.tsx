'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from './Landingnavbar';
import Button from './Button';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  href: string;
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#030A05] text-white border-b border-[#14291B]">
      {/* Crisp Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #22C76A 1px, transparent 1px), linear-gradient(to bottom, #22C76A 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <Navbar />

      {/* Main Hero Showcase */}
      <main className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-6 mt-28 text-center">
        <h1 className="max-w-3xl text-3xl font-bold text-center tracking-[-0.04em] text-white md:text-5xl leading-[1.1]">
          Never wonder who paid <br /> again.
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">
          Kredar pairs every customer with a dedicated virtual account. Payments route, verify, and
          settle instantly into your core ledger without human intervention.
        </p>

        {/* Centered CTA Buttons layout for both Mobile and Desktop */}
        <div className="mt-8 flex flex-col justify-center items-center gap-3 sm:flex-row z-30 w-full sm:w-auto">
          <Link href="/auth/signup" className="w-full sm:w-auto flex justify-center">
            <Button className="bg-white text-[#030A05] hover:bg-white/90 w-full sm:w-auto justify-center">
              Create Free Account
            </Button>
          </Link>
          <Link href="/docs" className="w-full sm:w-auto flex justify-center">
            <Button variant="secondary" className="w-full sm:w-auto justify-center">
              Explore API Reference
            </Button>
          </Link>
        </div>

        {/* Tight, Clean Paystack-Style Interface Dashboard */}
        <div className="relative mt-12 w-full max-w-4xl h-[240px] overflow-hidden rounded-t-xl border-t border-x border-[#14291B] bg-[#050D07] text-left shadow-[0_-20px_50px_rgba(0,0,0,0.6)]">
          {/* Top window utility bar */}
          <div className="flex items-center justify-between border-b border-[#14291B] bg-[#09160E] px-4 py-2.5">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#14291B]" />
                <span className="h-2 w-2 rounded-full bg-[#14291B]" />
                <span className="h-2 w-2 rounded-full bg-[#14291B]" />
              </div>
              <span className="text-[11px] font-medium tracking-wider uppercase text-gray-500">
                Live Production environment
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded bg-[#102216] px-2 py-0.5 border border-[#1b3d26]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C76A] animate-pulse" />
              <span className="text-[10px] font-semibold text-[#22C76A]">System Operational</span>
            </div>
          </div>

          {/* Inner Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#14291B] h-full">
            {/* Col 1: Main Balance Metrics */}
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                  Available Pool Balance
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-white mt-1">₦4,520,800.00</h3>
              </div>
              <div className="bg-[#09160E] border border-[#14291B] p-2.5 rounded flex items-center justify-between">
                <span className="text-[11px] text-gray-400">Next Payout</span>
                <span className="text-[11px] font-semibold text-[#22C76A]">
                  Automatic (10:00 AM)
                </span>
              </div>
            </div>

            {/* Col 2: Live Channels */}
            <div className="p-5 space-y-2.5">
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                Virtual Route Status
              </p>

              <div className="space-y-2">
                {[
                  { name: 'Wema Virtual Ledger', bank: '902****211', status: 'Active' },
                  { name: 'Providus Engine', bank: '102****582', status: 'Active' },
                ].map((channel, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs bg-[#09160E]/40 p-2 rounded border border-[#14291B]/40"
                  >
                    <div>
                      <p className="font-medium text-gray-300">{channel.name}</p>
                      <p className="text-[10px] text-gray-500">{channel.bank}</p>
                    </div>
                    <span className="text-[10px] bg-[#102216] text-[#22C76A] px-1.5 py-0.5 rounded font-medium">
                      {channel.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 3: Stream Logs */}
            <div className="p-5 space-y-2.5">
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                Real-Time Event Stream
              </p>

              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-[#22C76A]">✓ invoice.settled</span>
                  <span>₦120,000</span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>• account.assigned</span>
                  <span>usr_94a</span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-[#22C76A]">✓ invoice.settled</span>
                  <span>₦45,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
