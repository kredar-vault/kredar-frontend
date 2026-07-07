'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { isOnboardingComplete, isBannerDismissed, dismissBanner } from '@/lib/onboarding-status';

export default function ProfileCompletionBanner() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Read on mount only — this is set once at login time.
    setVisible(!isOnboardingComplete() && !isBannerDismissed());
  }, []);

  if (!visible) return null;

  const handleDismiss = () => {
    dismissBanner();
    setVisible(false);
  };

  const handleComplete = () => {
    router.push('/onboarding');
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#0f8b4b]/20 bg-[#effaf2] px-5 py-3.5 mb-6">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-bold text-[#081b10]">Your profile is incomplete</p>
          <p className="text-xs text-[#45504b]">
            Finish setting up your business profile to unlock full access.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleComplete}
          className="kredar-btn-primary h-9 text-xs font-semibold px-4"
        >
          Complete profile
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="text-[#45504b] hover:text-[#081b10] p-1.5 rounded-lg hover:bg-white/60"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
