'use client';

import Link from 'next/link';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingInfrastructure() {
  return (
    <section
      id="infrastructure"
      className="bg-[#FFF] px-6 py-[80px] md:pb-[128px] max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 align-self-stretch"
    >
      {/* Left info column */}
      <div className="w-full lg:w-[45%] space-y-6 lg:sticky lg:top-24">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#081b10] leading-[1.1]">
          Infrastructure that Scales with your Business
        </h2>
        <p className="text-base text-[#45504b] leading-relaxed">
          From customer onboarding to real-time reconciliation, Kredar powers reliable payment
          operations for businesses handling high-volume bank transfers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link
            href="/auth/signup"
            className="bg-[#0f8b4b] hover:bg-[#0c703c] text-white font-bold text-sm px-6 py-3.5 rounded-full text-center transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/dashboard"
            className="border border-[#d8e1da] hover:border-[#45504b] text-[#45504b] font-bold text-sm px-6 py-3.5 rounded-full text-center transition-all"
          >
            API Docs
          </Link>
        </div>
      </div>

      {/* Right mockup column */}
      <div className="w-full lg:w-[50%] bg-[#f5f5f5] border border-[#d8e1da] rounded-3xl p-4 md:p-6 shadow-xl relative overflow-hidden">
        <img src="images/dashpreview.png" alt="Dashboard Preview" />
      </div>
    </section>
  );
}
