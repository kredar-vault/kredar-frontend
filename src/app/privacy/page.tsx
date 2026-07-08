'use client';

import React from 'react';
import Navbar from '@/components/features/landing/Landingnavbar';
import LandingFooter from '@/components/features/landing/LandingFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030A05] text-white flex flex-col font-sans selection:bg-[#006C49]/30">
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
            Privacy Policy
          </h1>
          <p className="mt-4 text-xs md:text-sm text-gray-400 uppercase tracking-widest font-mono">
            Last Updated: July 8, 2026
          </p>
        </div>

        {/* Premium Glassmorphic Card Container */}
        <div className="border border-[#173822] bg-[#07130B]/60 rounded-3xl p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl space-y-8 text-sm md:text-base text-gray-300 leading-relaxed">
          <p>
            Welcome to Kredar (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). Kredar is
            a payment infrastructure provider built for modern African businesses, offering
            dedicated virtual accounts, instant reconciliation, real-time verification, and secure
            settlement routing. We respect your privacy and are committed to safeguarding the
            business and personal data you share with us.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, store, share, and protect your
            information when you register for, access, or use our platform, including our APIs,
            dashboards, onboarding portals, and website.
          </p>

          <hr className="border-white/10" />

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">1.</span> Information We Collect
            </h2>
            <p>
              We collect information necessary to verify your business, facilitate secure payments,
              prevent financial fraud, and comply with regulatory regulations. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>
                <strong className="text-gray-200">Merchant Profile Information:</strong> Business
                legal name, trading name, registration number (e.g., RC number), tax identification
                details, business address, telephone numbers, and email address.
              </li>
              <li>
                <strong className="text-gray-200">Know Your Business (KYB) Documentation:</strong>{' '}
                Official documents such as business registration certificates (CAC documents), proof
                of business address, and government-issued identification of directors, beneficial
                owners, or account representatives.
              </li>
              <li>
                <strong className="text-gray-200">Financial &amp; Transaction Details:</strong>{' '}
                Dedicated virtual accounts assigned to you, incoming and outgoing transaction logs,
                payment methods, transaction amounts, timestamps, sender/recipient details, and
                payout or settlement destination bank details.
              </li>
              <li>
                <strong className="text-gray-200">Technical &amp; Telemetry Data:</strong> IP
                addresses, API requests and response logs, access tokens, browser type, operating
                system, diagnostic telemetry, and event history (e.g., webhook payload delivery).
              </li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">2.</span> How We Use Your Information
            </h2>
            <p>
              We use your information to operate, secure, and optimize our payment infrastructure
              services:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>
                <strong className="text-gray-200">Identity &amp; Compliance Verification:</strong>{' '}
                Conducting mandatory KYB checks, Anti-Money Laundering (AML) assessments, and
                counter-terrorist financing screening to approve your merchant account.
              </li>
              <li>
                <strong className="text-gray-200">Payment Processing &amp; Reconciliation:</strong>{' '}
                Provisioning dedicated virtual accounts, routing incoming transfers, performing
                automated credit reconciliation, and notifying your backend via webhooks.
              </li>
              <li>
                <strong className="text-gray-200">Service Maintenance:</strong> Monitoring system
                health, debugging API integrations, and maintaining transaction logs.
              </li>
              <li>
                <strong className="text-gray-200">Security &amp; Fraud Mitigation:</strong> Tracking
                anomalous transaction patterns, blocking fraudulent attempts, securing client access
                tokens, and preventing financial crime.
              </li>
              <li>
                <strong className="text-gray-200">Communications:</strong> Sending transactional
                alerts, service notifications, API updates, and responding to developer support
                inquiries.
              </li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">3.</span> Sharing Your Information
            </h2>
            <p>
              We do not sell, rent, or trade your data to third parties. We only share information
              in the following compliance-driven or operational situations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>
                <strong className="text-gray-200">Partner Financial Institutions:</strong> We
                partner with licensed commercial banks (including Wema Bank, Providus Bank, and
                Sterling Bank) to issue dedicated virtual accounts. Business identity and
                transaction records are shared with these partners under strict regulatory
                guidelines.
              </li>
              <li>
                <strong className="text-gray-200">Regulatory &amp; Law Enforcement:</strong> We may
                share data with central banking authorities, financial intelligence units, or law
                enforcement bodies if required by law or to comply with AML/CFT regulatory
                requirements.
              </li>
              <li>
                <strong className="text-gray-200">Service Providers:</strong> Trusted third-party
                vendors who provide essential infrastructure (such as secure cloud hosting and
                database services) under strict data protection agreements.
              </li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">4.</span> Data Security &amp; Retention
            </h2>
            <p>
              We prioritize data security by employing industry-standard technical and
              organizational measures:
            </p>
            <p className="text-gray-400">
              All data transmitted through Kredar is encrypted using Transport Layer Security
              (TLS/SSL) in transit and Advanced Encryption Standard (AES-256) at rest. We implement
              robust firewalls, automated access logs, and strict access controls to ensure your
              dashboard and business documents remain secure.
            </p>
            <p className="text-gray-400">
              We retain merchant data for as long as is necessary to fulfill our service commitments
              or as legally mandated by relevant financial record-keeping laws and banking
              regulations in Nigeria.
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">5.</span> Your Rights
            </h2>
            <p>
              Depending on your jurisdiction (such as the Nigeria Data Protection Regulation -
              NDPR), you may possess rights regarding the data we hold, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>Requesting access to the personal or business records we retain.</li>
              <li>
                Requesting correction or updates to inaccurate, incomplete, or out-of-date
                information.
              </li>
              <li>
                Requesting restricted processing or deletion under specific circumstances (subject
                to banking retention requirements).
              </li>
            </ul>
            <p className="text-gray-400">
              To exercise any of these rights, or to contact our Data Protection Officer, please
              reach out to us at{' '}
              <a href="mailto:privacy@kredar.com" className="text-[#00FF9D] hover:underline">
                privacy@kredar.xyz
              </a>
              .
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#00FF9D] font-mono">6.</span> Policy Updates
            </h2>
            <p className="text-gray-400">
              We may revise this Privacy Policy periodically to reflect updates in regulatory
              requirements or changes to our payment infrastructure. We will notify you of
              significant changes by publishing the updated policy on this page with a revised
              &ldquo;Last Updated&rdquo; date.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
