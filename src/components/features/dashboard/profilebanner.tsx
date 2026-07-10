'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { api } from '@/lib/api';
import {
  isBannerDismissed,
  dismissBanner,
  setOnboardingCompleteFlag,
} from '@/lib/onboarding-status';

type OnboardingStatus = 'NotStarted' | 'UnderReview' | 'Approved' | null;

export default function ProfileCompletionBanner() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<OnboardingStatus>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      // Respect manual dismissals first
      if (isBannerDismissed()) {
        setVisible(false);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/onboarding');
        const onboarding = res.data?.data || res.data;
        const currentStatus = onboarding?.status || 'NotStarted';

        setStatus(currentStatus);

        if (currentStatus === 'Approved') {
          setOnboardingCompleteFlag(true);
          setVisible(false);
        } else {
          // Keep banner open for NotStarted and UnderReview states
          setVisible(true);
        }
      } catch (err) {
        console.error('Failed to fetch live banner onboarding status:', err);
        // Fallback to hidden if API call encounters a strict failure
        setVisible(false);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading || !visible) return null;

  const handleDismiss = () => {
    dismissBanner();
    setVisible(false);
  };

  const handleComplete = () => {
    router.push('/onboarding');
  };

  // 1. UNDER REVIEW THEME (Beautiful custom Indigo/Blue layout)
  if (status === 'UnderReview') {
    return (
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-indigo-500/10 bg-[#f4f7ff] px-5 py-3.5 mb-6 selection:bg-indigo-500/10">
        <div className="flex items-center gap-3">
          <div className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#0c1424]">Application under review</p>
            <p className="text-xs text-gray-500">
              We are currently reviewing your KYC verification documents. You will get full access
              shortly.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="text-gray-400 hover:text-[#0c1424] p-1.5 rounded-lg hover:bg-white/60 shrink-0 transition"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  // 2. INCOMPLETE PROFILE THEME (Branded Deep Emerald Accent)
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#006C49]/10 bg-[#f4faf7] px-5 py-3.5 mb-6 selection:bg-[#006C49]/10 animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-bold text-[#030A05]">Your profile is incomplete</p>
          <p className="text-xs text-gray-600">
            Finish setting up your business profile to unlock live API payments and payout
            settlement rules.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleComplete}
        className="h-9 rounded-full bg-[#006C49] px-4 text-xs font-semibold text-white transition hover:bg-[#005237] shrink-0"
      >
        Complete profile
      </button>
    </div>
  );
}
