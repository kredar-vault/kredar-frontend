'use client';

import LandingHero from '@/components/features/landing/LandingHero';
import LandingFeatures from '@/components/features/landing/LandingFeatures';
import LandingHowItWorks from '@/components/features/landing/LandingHowItWorks';
import LandingInfrastructure from '@/components/features/landing/LandingInfrastructure';
import LandingFaq from '@/components/features/landing/LandingFaq';
import LandingFooter from '@/components/features/landing/LandingFooter';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF] text-[#081b10] font-sans antialiased overflow-x-hidden selection:bg-[#0f8b4b]/20">
      {/* 1. Hero segment with capsule Navbar */}
      <LandingHero />

      {/* 2. Built for better payment operations */}
      <LandingFeatures />

      {/* 3. How it works dark block */}
      <LandingHowItWorks />

      {/* 4. Infrastructure scales block */}
      <LandingInfrastructure />

      {/* 5. Frequently asked questions accordion */}
      <LandingFaq />

      {/* 6. High-fidelity Footer columns */}
      <LandingFooter />
    </main>
  );
}
