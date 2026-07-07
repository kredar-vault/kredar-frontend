'use client';

import LandingFaq from '@/components/features/landing/LandingFaq';
import FeaturesSection from '@/components/features/landing/LandingFeatures';
import LandingFooter from '@/components/features/landing/LandingFooter';
import HeroSection from '@/components/features/landing/LandingHero';
import Hero from '@/components/features/landing/LandingHero';
import ProcessSection from '@/components/features/landing/LandingHowItWorks';
import InfrastructureSection from '@/components/features/landing/LandingInfrastructure';
import Navbar from '@/components/features/landing/Landingnavbar';

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <InfrastructureSection />
      <LandingFaq />
      <LandingFooter />
    </div>
  );
}
