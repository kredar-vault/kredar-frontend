'use client';

import React from 'react';
import Navbar from '@/components/features/landing/Landingnavbar';
import LandingFooter from '@/components/features/landing/LandingFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#030A05] text-white flex flex-col  selection:bg-[#006C49]/30">
      {/* Top Navbar */}
      <Navbar />

      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[650px] w-[1100px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(22,158,92,0.15)_0%,transparent_100%)] blur-[120px]" />
      </div>

      {/* Main Content Layout */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-16 md:py-24 relative z-10">
        {/* Header Block */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-xs md:text-sm text-gray-400 uppercase tracking-widest font-mono">
            Last Updated: July 8, 2026
          </p>
        </div>

        {/* Premium Glassmorphic Card Container */}
        <div className="border border-[#173822] bg-[#07130B]/60 rounded-3xl p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl space-y-8 text-sm md:text-base text-gray-300 leading-relaxed">
          <p>
            Welcome to Kredar. These Terms &amp; Conditions (&ldquo;Terms&rdquo;) constitute a
            legally binding agreement between Kredar Technologies Ltd. (&ldquo;Kredar,&rdquo;
            &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) and the business entity or
            merchant (&ldquo;Merchant,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) accessing or
            using our payment infrastructure, webhooks, dashboards, APIs, and associated financial
            routing tools (collectively, the &ldquo;Services&rdquo;).
          </p>
          <p>
            By creating a merchant account, accessing our APIs, or utilizing any portion of the
            Services, you agree to comply with and be bound by these Terms. If you are entering into
            this agreement on behalf of a company or other legal entity, you represent that you have
            the legal authority to bind such entity.
          </p>

          <hr className="border-white/10" />

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">1.</span> Scope of Services
            </h2>
            <p>
              Kredar provides B2B fintech infrastructure and API services designed to facilitate
              dedicated virtual account routing, payment notifications, and automated transaction
              reconciliation. Specifically:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>
                <strong className="text-gray-200">Virtual Account Routing:</strong> We provision
                dedicated virtual accounts via our licensed partner banks to assist in collecting
                bank transfers.
              </li>
              <li>
                <strong className="text-gray-200">Reconciliation &amp; Notifications:</strong> We
                notify your applications in real-time via secure webhook events when customer
                deposits are received.
              </li>
              <li>
                <strong className="text-gray-200">Role of Kredar:</strong> Kredar is a technology
                provider and does not operate as a licensed bank or deposit-taking institution. All
                virtual bank accounts are issued, hosted, and regulated in partnership with
                commercial banking institutions (including Wema Bank, Providus Bank, and Sterling
                Bank).
              </li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">2.</span> Onboarding and KYB Verification
            </h2>
            <p>
              To access full virtual account features and transaction settlements, you must
              successfully complete our onboarding process:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>
                <strong className="text-gray-200">KYB Accuracy:</strong> You agree to provide
                current, complete, and authentic business data, including certificates of
                incorporation, tax identifiers, proof of business address, and identities of
                ultimate beneficial owners.
              </li>
              <li>
                <strong className="text-gray-200">Verification &amp; Suspension:</strong> We reserve
                the right to verify all submitted details. We may limit account functionality,
                suspend settlements, or terminate accounts if submitted documents are invalid,
                fraudulent, or fail KYC/KYB assessments.
              </li>
              <li>
                <strong className="text-gray-200">Credential Protection:</strong> You are
                responsible for safeguarding your dashboard credentials and private API keys. Any
                transaction or operation initiated using your account credentials or keys will be
                deemed authorized by you.
              </li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">3.</span> Acceptable Use &amp; Compliance
            </h2>
            <p>
              You agree to utilize Kredar only for legitimate and authorized business activities:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>
                <strong className="text-gray-200">Compliance with Law:</strong> You must comply with
                all local regulations regarding anti-money laundering (AML), countering terrorist
                financing (CFT), and consumer protection.
              </li>
              <li>
                <strong className="text-gray-200">Prohibited Transactions:</strong> You may not use
                the Services to process payments related to illegal products, unlicensed gaming or
                gambling, fraudulent schemes, or unregulated financial services.
              </li>
              <li>
                <strong className="text-gray-200">API Abuse:</strong> You must not attempt to
                disrupt or bypass API limits, scrape platform resources, distribute malicious
                software, or perform load tests on Kredar systems without prior written
                authorization.
              </li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">4.</span> Fees and Settlements
            </h2>
            <p>
              Our transaction processing and service fees are outlined in your dashboard settings or
              dedicated merchant agreement.
            </p>
            <p className="text-gray-400">
              Settlements are processed and dispatched to your designated settlement bank account
              according to the timelines configured on your merchant dashboard (typically next
              business day, T+1). Settlements may be delayed due to commercial bank downtime, local
              public holidays, network routing failures, or compliance audits.
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">5.</span> Disclaimer &amp; Limitation of
              Liability
            </h2>
            <p className="text-gray-400">
              THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE
              PLATFORM WILL ALWAYS BE SECURE, TIMELY, OR ERROR-FREE.
            </p>
            <p className="text-gray-400">
              IN NO EVENT SHALL KREDAR, ITS DIRECTORS, EMPLOYEES, OR BANKING PARTNERS BE LIABLE FOR
              ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR EXEMPLARY DAMAGES—INCLUDING LOSS
              OF PROFITS, DATA, OR BUSINESS REVENUE—ARISING OUT OF THE USE OF, OR INABILITY TO USE,
              THE SERVICES.
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">6.</span> Account Suspension and
              Termination
            </h2>
            <p className="text-gray-400">
              We may suspend your access to the dashboard, block virtual account generation, or
              freeze settlements at any time without prior notice if:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>You breach any provision of these Terms or our Acceptable Use Policy.</li>
              <li>
                We detect suspicious, high-risk, or potentially fraudulent transaction patterns.
              </li>
              <li>
                We are instructed to do so by any of our partner banks, regulatory agencies, or
                legal mandates.
              </li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">7.</span> Governing Law
            </h2>
            <p className="text-gray-400">
              These Terms shall be governed by, interpreted, and construed in accordance with the
              laws of the Federal Republic of Nigeria. Any disputes, controversies, or claims
              arising out of or relating to these Terms shall be subject to the exclusive
              jurisdiction of the competent courts located in Lagos, Nigeria.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
