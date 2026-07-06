'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronDown, Globe, Check, TrendingUp, Bell, X } from 'lucide-react';
import KredarLogo from '@/components/KredarLogo';

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Why is Kredar right for me?',
      a: 'Kredar is built specifically for modern African businesses that need reliable, automated, and real-time bank transfer collections. Unlike manual tracking, our virtual accounts reconcile payments instantly, eliminating confirmation delays and operational errors.',
    },
    {
      q: 'How does Kredar handle payment matching?',
      a: 'Every customer is assigned a unique virtual account number. When a bank transfer is made, our infrastructure instantly identifies the owner of the virtual account, reconciles the payment, and fires a webhook to notify your system in milliseconds.',
    },
    {
      q: 'Can Kredar integrate with my existing platform?',
      a: 'Yes. We provide Developer-friendly REST APIs and robust webhook endpoints. Integrating Kredar into your existing checkout flows, ERPs, or internal admin tools takes just a few lines of code.',
    },
    {
      q: 'Is Kredar compatible with all Nigerian banks?',
      a: 'Absolutely. Kredar supports fast and seamless transfer processing across all licensed commercial banks, microfinance banks, and fintech providers in Nigeria.',
    },
    {
      q: 'Is Kredar compliant with my existing platform?',
      a: 'Yes, we adhere to the highest industry standards for security, data privacy, and financial regulations to ensure compliance and robust security for every transaction.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#081b10] font-sans selection:bg-[#0f8b4b]/20 selection:text-[#10422a]">
      {/* ─── NAVBAR (Transparent bg, Collapsible) ─── */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 md:px-12 py-5 bg-transparent">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <KredarLogo light={true} />
          </Link>

          {/* Navigation links - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-zinc-300 hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#process"
              className="text-zinc-300 hover:text-white transition-colors text-sm font-medium"
            >
              Use Cases
            </a>
            <a
              href="#infrastructure"
              className="text-zinc-300 hover:text-white transition-colors text-sm font-medium"
            >
              Developers
            </a>
            <Link
              href="/docs"
              className="text-zinc-300 hover:text-white transition-colors text-sm font-medium"
            >
              API Docs
            </Link>
          </nav>

          {/* CTA - Desktop */}
          <div className="hidden md:block">
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-[#0f8b4b] hover:bg-[#0c723d] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-[0_0_15px_rgba(15,139,75,0.3)] hover:shadow-[0_0_20px_rgba(15,139,75,0.5)] transition-all duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu trigger - Transparent bg, Collapsible Custom 2-Line Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white bg-transparent hover:bg-white/10 transition-colors p-2 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X size={20} />
            ) : (
              <svg
                width="20"
                height="12"
                viewBox="0 0 20 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="0" y1="1" x2="20" y2="1" />
                <line x1="0" y1="11" x2="20" y2="11" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 inset-x-4 bg-zinc-950/95 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-lg flex flex-col gap-6 animate-in fade-in slide-in-from-top-5 duration-200">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors text-base font-semibold"
            >
              Features
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors text-base font-semibold"
            >
              Use Cases
            </a>
            <a
              href="#infrastructure"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors text-base font-semibold"
            >
              Developers
            </a>
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-300 hover:text-white transition-colors text-base font-semibold"
            >
              API Docs
            </Link>
            <hr className="border-white/10" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/auth/login');
              }}
              className="bg-[#0f8b4b] hover:bg-[#0c723d] text-white py-3 rounded-full text-center text-base font-semibold transition-colors shadow-lg"
            >
              Get Started
            </button>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative bg-[#06150d] pt-32 md:pt-40 pb-20 md:pb-32 overflow-hidden flex flex-col items-center">
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2 pointer-events-none">
          <div className="w-[800px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center z-10 relative">
          {/* Announcement badge */}
          <div className="inline-flex items-center gap-2 bg-[#122e1f] hover:bg-[#183c29] border border-emerald-800/30 rounded-full px-3 py-1 text-xs text-emerald-400 font-medium mb-8 cursor-pointer transition-all duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>NOW LIVE — Bank transfer collection at scale</span>
            <span className="flex items-center gap-0.5 bg-emerald-500/20 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider text-emerald-300 ml-1">
              More →
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
            Never wonder who <br className="hidden sm:inline" /> paid again
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Are you ready for a smarter way to collect bank transfers? Kredar gives you dedicated
            accounts, instant reconciliation, and real-time payment verification.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-[#06150d] font-semibold px-8 py-3.5 rounded-full shadow-lg flex items-center justify-center gap-2 transition-all duration-300 group hover:translate-x-0.5"
            >
              Get Started
              <ArrowRight
                size={18}
                className="text-[#06150d] transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <button
              onClick={() => router.push('/docs')}
              className="w-full sm:w-auto border border-emerald-800/40 hover:border-emerald-700 bg-[#0c2417]/50 text-zinc-300 hover:text-white px-8 py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5"
            >
              View API Docs
            </button>
          </div>

          {/* Empty Space Placeholder for Dashboard Image */}
          <div className="w-full max-w-4xl aspect-[1.3] md:aspect-[1.5] border border-emerald-800/20 bg-zinc-950/40 rounded-2xl shadow-[0_20px_50px_rgba(4,18,10,0.8)] backdrop-blur-sm mx-auto overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 to-transparent pointer-events-none" />
            {/* Styled inner area left empty for the dashboard image */}
            <div className="absolute inset-0 flex items-center justify-center text-zinc-750 font-mono text-sm border-2 border-dashed border-emerald-950/20 rounded-2xl m-4">
              [Dashboard Mockup Image Container - Drop Image Here]
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="py-20 md:py-32 px-6 bg-[#f7faf6] scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#0f8b4b] uppercase text-xs tracking-widest font-semibold block mb-3">
              Features
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#081b10] mb-4">
              Built for better payment operations
            </h2>
            <p className="text-[#45504b] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              From collecting payment to always-accurate records, Kredar helps your team move faster
              with total confidence.
            </p>
          </div>

          {/* Features Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Dedicated Virtual Accounts (Large dark card) */}
            <div className="md:col-span-2 bg-[#06150d] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between min-h-[320px] shadow-lg">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#0f8b4b] mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Dedicated Virtual Accounts</h3>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md">
                  Collect bank transfers through dedicated payment accounts and confirm payment
                  automatically the moment it arrives. No manual checking, no missed payments, no
                  reconciliation headaches.
                </p>
              </div>

              {/* In-card Active Account Details mockup */}
              <div className="mt-8 border border-emerald-950 bg-[#072114]/90 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-semibold mb-1 block">
                    Account assigned to
                  </span>
                  <h4 className="text-white text-lg font-bold">Chidi Enterprises Ltd.</h4>
                  <p className="text-zinc-400 text-sm font-mono mt-0.5">0123456789 · Access Bank</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </div>
              </div>
            </div>

            {/* Card 2: Built to Scale */}
            <div className="md:col-span-1 bg-white border border-[#d8e1da] rounded-3xl p-8 flex flex-col justify-between min-h-[320px] shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0f8b4b] flex items-center justify-center mb-6">
                <Globe size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#081b10] mb-3">Built to scale</h3>
                <p className="text-[#45504b] text-sm md:text-base leading-relaxed">
                  Manage thousands of virtual accounts in real-time across every major bank without
                  missing a beat.
                </p>
              </div>
            </div>

            {/* Card 3: Payments Verified */}
            <div className="bg-white border border-[#d8e1da] rounded-3xl p-8 flex flex-col justify-between min-h-[240px] shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0f8b4b] flex items-center justify-center mb-6">
                <Check size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#081b10] mb-2">Payments verified</h3>
                <p className="text-[#45504b] text-xs md:text-sm leading-relaxed">
                  Every payment is automatically reconciled and confirmed instantly, minimizing
                  ledger errors.
                </p>
              </div>
            </div>

            {/* Card 4: Real-time Visibility */}
            <div className="bg-white border border-[#d8e1da] rounded-3xl p-8 flex flex-col justify-between min-h-[240px] shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0f8b4b] flex items-center justify-center mb-6">
                <TrendingUp size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#081b10] mb-2">Real-time visibility</h3>
                <p className="text-[#45504b] text-xs md:text-sm leading-relaxed">
                  Complete insight into all your incoming and outgoing payment flows, updated
                  second-by-second.
                </p>
              </div>
            </div>

            {/* Card 5: Insights that Matter */}
            <div className="bg-white border border-[#d8e1da] rounded-3xl p-8 flex flex-col justify-between min-h-[240px] shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0f8b4b] flex items-center justify-center mb-6">
                <Bell size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#081b10] mb-2">Insights that matter</h3>
                <p className="text-[#45504b] text-xs md:text-sm leading-relaxed">
                  Smart alerts, automated webhooks, and customizable notifications keep you fully
                  informed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROCESS SECTION ─── */}
      <section id="process" className="py-20 md:py-32 px-6 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#0f8b4b] uppercase text-xs tracking-widest font-semibold block mb-3">
              Process
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#081b10] mb-4">
              How it works
            </h2>
            <p className="text-[#45504b] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              From collecting payment to always-accurate records — Kredar helps you operate with
              total confidence.
            </p>
          </div>

          {/* Process Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-[#f7faf6] border border-[#d8e1da]/60 rounded-2xl p-6 flex flex-col justify-between min-h-[240px] hover:shadow-md hover:border-[#0f8b4b]/30 transition-all duration-300">
              <span className="text-4xl font-extrabold text-[#0f8b4b]/15 select-none font-mono">
                01
              </span>
              <div>
                <h4 className="text-base font-bold text-[#081b10] mb-2">
                  Create Customer Accounts
                </h4>
                <p className="text-xs text-[#45504b] leading-relaxed">
                  From customer onboarding to real-time reconciliation, Kredar provides unique
                  virtual payment accounts for each of your customers.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#f7faf6] border border-[#d8e1da]/60 rounded-2xl p-6 flex flex-col justify-between min-h-[240px] hover:shadow-md hover:border-[#0f8b4b]/30 transition-all duration-300">
              <span className="text-4xl font-extrabold text-[#0f8b4b]/15 select-none font-mono">
                02
              </span>
              <div>
                <h4 className="text-base font-bold text-[#081b10] mb-2">Automatic Matching</h4>
                <p className="text-xs text-[#45504b] leading-relaxed">
                  Every inbound transfer is automatically matched and reconciled with zero manual
                  effort required from your team.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#f7faf6] border border-[#d8e1da]/60 rounded-2xl p-6 flex flex-col justify-between min-h-[240px] hover:shadow-md hover:border-[#0f8b4b]/30 transition-all duration-300">
              <span className="text-4xl font-extrabold text-[#0f8b4b]/15 select-none font-mono">
                03
              </span>
              <div>
                <h4 className="text-base font-bold text-[#081b10] mb-2">Receive Payments</h4>
                <p className="text-xs text-[#45504b] leading-relaxed">
                  Payments are confirmed, settled and available for your customers within seconds of
                  arrival.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#f7faf6] border border-[#d8e1da]/60 rounded-2xl p-6 flex flex-col justify-between min-h-[240px] hover:shadow-md hover:border-[#0f8b4b]/30 transition-all duration-300">
              <span className="text-4xl font-extrabold text-[#0f8b4b]/15 select-none font-mono">
                04
              </span>
              <div>
                <h4 className="text-base font-bold text-[#081b10] mb-2">Stay Updated</h4>
                <p className="text-xs text-[#45504b] leading-relaxed">
                  Get real-time notifications and powerful analytics on every transaction across
                  your entire business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INFRASTRUCTURE / SCALE SECTION ─── */}
      <section
        id="infrastructure"
        className="relative bg-[#06150d] py-20 md:py-32 px-6 overflow-hidden scroll-mt-20"
      >
        {/* Glow Gradient */}
        <div className="absolute bottom-0 right-0 translate-y-1/3 translate-x-1/3 pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Info details */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="text-[#0f8b4b] uppercase text-xs tracking-widest font-semibold mb-3">
                Built for Growth
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.15]">
                Infrastructure that Scales with your Business
              </h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                From customer onboarding to real-time reconciliation, Kredar provides simple yet
                powerful payment infrastructure for businesses handling high-volume bank transfers.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full sm:w-auto bg-[#0f8b4b] hover:bg-[#0c723d] text-white px-7 py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-lg"
                >
                  Get Started
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => router.push('/docs')}
                  className="w-full sm:w-auto border border-[#2a3c31] hover:border-emerald-800 bg-[#0c2417]/25 hover:bg-[#0c2417]/50 text-zinc-300 hover:text-white px-7 py-3 rounded-full text-sm font-semibold transition-colors"
                >
                  View API Docs
                </button>
              </div>
            </div>

            {/* Empty space placeholder for infrastructure phone mockup image */}
            <div className="lg:col-span-7">
              <div className="w-full aspect-[1.3] border border-emerald-800/20 bg-zinc-950/40 rounded-2xl shadow-[0_20px_50px_rgba(4,18,10,0.8)] backdrop-blur-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-bl from-emerald-950/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center text-zinc-750 font-mono text-sm border-2 border-dashed border-emerald-950/20 rounded-2xl m-4">
                  [Mobile Phone Mockups Container - Drop Image Here]
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section className="py-20 md:py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#0f8b4b] uppercase text-xs tracking-widest font-semibold block mb-3">
              FAQ
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#081b10] mb-4">
              Frequently asked questions
            </h2>
            <p className="text-[#45504b] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Find answers to common questions about our platform, pricing, and features.
            </p>
          </div>

          {/* Accordion Questions List */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-[#f7faf6] border border-[#d8e1da] rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full py-5 px-6 flex items-center justify-between text-left gap-4 hover:bg-[#eef2ed]/60 transition-colors"
                  >
                    <span className="font-bold text-[#081b10] text-sm md:text-base">{faq.q}</span>
                    <span
                      className={`text-[#0f8b4b] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      <ChevronDown size={20} />
                    </span>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-52 border-t border-[#d8e1da]/50' : 'max-h-0'
                    } overflow-hidden`}
                  >
                    <div className="p-6 text-xs md:text-sm text-[#45504b] leading-relaxed bg-[#f7faf6]/40">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── READY TO GET STARTED / FOOTER SECTION ─── */}
      <footer className="bg-[#05130b] text-white border-t border-emerald-950/60">
        {/* Ready to Get Started CTA Area */}
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 border-b border-emerald-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Ready to get started?
            </h2>
            <p className="text-zinc-400 text-sm md:text-base">
              Join thousands of businesses using Kredar to collect payments.
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => router.push('/auth/login')}
              className="flex-1 md:flex-none bg-[#0f8b4b] hover:bg-[#0c723d] text-white px-7 py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-950/20"
            >
              Get Started
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => router.push('/docs')}
              className="flex-1 md:flex-none border border-[#2a3c31] hover:border-emerald-800 bg-[#0c2417]/25 hover:bg-[#0c2417]/50 text-zinc-300 hover:text-white px-7 py-3.5 rounded-full text-sm font-semibold transition-colors"
            >
              View API Docs
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
          {/* Brand/Tagline */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <KredarLogo light={true} />
            <p className="text-zinc-455 text-xs md:text-sm leading-relaxed max-w-[200px]">
              The payment infrastructure for modern African businesses.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-zinc-400 hover:text-white text-xs md:text-sm transition-colors"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Use Cases */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider">Use Cases</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#process"
                  className="text-zinc-400 hover:text-white text-xs md:text-sm transition-colors"
                >
                  E-commerce
                </a>
              </li>
              <li>
                <a
                  href="#process"
                  className="text-zinc-400 hover:text-white text-xs md:text-sm transition-colors"
                >
                  Marketplaces
                </a>
              </li>
              <li>
                <a
                  href="#process"
                  className="text-zinc-400 hover:text-white text-xs md:text-sm transition-colors"
                >
                  SaaS
                </a>
              </li>
              <li>
                <a
                  href="#process"
                  className="text-zinc-400 hover:text-white text-xs md:text-sm transition-colors"
                >
                  Finance
                </a>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
              Developers
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/docs"
                  className="text-zinc-400 hover:text-white text-xs md:text-sm transition-colors"
                >
                  API Docs
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-zinc-400 hover:text-white text-xs md:text-sm transition-colors"
                >
                  Webhooks
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-zinc-400 hover:text-white text-xs md:text-sm transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-zinc-400 hover:text-white text-xs md:text-sm transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright info row */}
        <div className="max-w-6xl mx-auto px-6 py-8 border-t border-emerald-950/60 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>&copy; 2025 Kredar. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
