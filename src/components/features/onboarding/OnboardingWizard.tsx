'use client';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { api } from '@/lib/api';
import { toast } from 'sonner';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import KredarLogo from '@/components/KredarLogo';
import StepIndicator from './StepIndicator';
import Step1BusinessInfo, { type Step1Data } from './Step1BusinessInfo';
import Step2BusinessVerification, { type Step2Data } from './Step2BusinessVerification';
import Step3Account, { type Step3Data } from './Step3Account';
import Step4ReviewSubmit from './Step4ReviewSubmit';
import SuccessScreen from './SuccessScreen';

interface OnboardingData {
  businessInfo: Step1Data | null;
  businessDocs: Step2Data | null;
  accountDetails: Step3Data | null;
}

const STEPS = [
  { id: 1, label: 'Business Information' },
  { id: 2, label: 'Business Verification' },
  { id: 3, label: 'Account' },
  { id: 4, label: 'Review & Submit' },
];

export default function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    businessInfo: null,
    businessDocs: null,
    accountDetails: null,
  });

  // Save progress helper
  const saveProgress = (step: number, updatedData: OnboardingData) => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('kredar_current_user') || '{}');
      const userKey = user.email
        ? `kredar_onboarding_state_${user.email}`
        : 'kredar_onboarding_state';
      localStorage.setItem(
        userKey,
        JSON.stringify({
          currentStep: step,
          businessInfo: updatedData.businessInfo,
          accountDetails: updatedData.accountDetails,
        }),
      );
    }
  };

  // Mount checks: Load saved progress & redirect if already onboarded
  useEffect(() => {
    const initOnboarding = async () => {
      try {
        const onboardingRes = await api.get('/onboarding');
        const onboarding = onboardingRes.data?.data || onboardingRes.data;
        if (
          onboarding &&
          (onboarding.status === 'UnderReview' || onboarding.status === 'Approved')
        ) {
          localStorage.setItem('kredar_onboarding_complete', 'true');
          toast.success('Your application is under review. Redirecting to dashboard...');
          router.replace('/dashboard');
          return;
        }

        const res = await api.get('/tenants/profile');
        const profile = res.data?.data || res.data;
        if (profile && (profile.legalName || profile.businessName || profile.isOnboarded)) {
          localStorage.setItem('kredar_onboarding_complete', 'true');
          toast.success('You have already completed onboarding!');
          router.replace('/dashboard');
          return;
        }
      } catch (err) {
        console.error('Failed to load profile/onboarding status on mount:', err);
      }

      if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem('kredar_current_user') || '{}');
        const userKey = user.email
          ? `kredar_onboarding_state_${user.email}`
          : 'kredar_onboarding_state';
        const savedState = localStorage.getItem(userKey);
        if (savedState) {
          try {
            const parsed = JSON.parse(savedState);
            if (parsed.currentStep) {
              setCurrentStep(parsed.currentStep);
            }
            if (parsed.businessInfo || parsed.accountDetails) {
              setData((prev) => ({
                ...prev,
                businessInfo: parsed.businessInfo || null,
                accountDetails: parsed.accountDetails || null,
              }));
            }
          } catch (e) {
            console.error('Failed to parse saved state:', e);
          }
        }
      }
    };

    initOnboarding();
  }, [router]);

  const triggerTransition = (nextStep: number, updateFn: () => void) => {
    setTransitioning(true);
    setTimeout(() => {
      updateFn();
      setCurrentStep(nextStep);
      setTransitioning(false);
    }, 200); // 200ms transition loading state
  };

  /* ── Step handlers ── */
  const handleStep1 = (d: Step1Data) => {
    triggerTransition(2, () => {
      setData((prev) => {
        const nextData = { ...prev, businessInfo: d };
        saveProgress(2, nextData);
        return nextData;
      });
    });
  };

  const handleStep2 = (d: Step2Data) => {
    triggerTransition(3, () => {
      setData((prev) => {
        const nextData = { ...prev, businessDocs: d };
        saveProgress(3, nextData);
        return nextData;
      });
    });
  };

  const handleStep3 = (d: Step3Data) => {
    triggerTransition(4, () => {
      setData((prev) => {
        const nextData = { ...prev, accountDetails: d };
        saveProgress(4, nextData);
        return nextData;
      });
    });
  };

  const handleBack = (prevStep: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentStep(prevStep);
      saveProgress(prevStep, data);
      setTransitioning(false);
    }, 150);
  };

  const handleSubmit = async () => {
    setTransitioning(true);
    try {
      const rawPhone = (data.businessInfo?.phoneNumber || '').replace(/\s+/g, '');
      const phoneWithoutZero = rawPhone.startsWith('0') ? rawPhone.slice(1) : rawPhone;
      const contactPhone = `${data.businessInfo?.countryCode || ''}${phoneWithoutZero}`.replace(
        /\s+/g,
        '',
      );

      await api.post('/onboarding/submit', {
        legalName: data.businessInfo?.businessName,
        registrationNumber: data.businessInfo?.registrationNumber || null,
        businessType: data.businessInfo?.businessType,
        industry: data.businessInfo?.industry,
        country: data.businessInfo?.country,
        address: data.businessInfo?.businessAddress,
        contactPhone,
        website: data.businessInfo?.website
          ? data.businessInfo.website.startsWith('http')
            ? data.businessInfo.website
            : `https://${data.businessInfo.website}`
          : null,
        settlementBankName: data.accountDetails?.bankName,
        settlementBankCode: data.accountDetails?.bankCode || '',
        settlementAccountName: data.accountDetails?.accountName,
        settlementAccountNumber: data.accountDetails?.accountNumber,
      });

      // Clear draft progress from localStorage
      if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem('kredar_current_user') || '{}');
        const userKey = user.email
          ? `kredar_onboarding_state_${user.email}`
          : 'kredar_onboarding_state';
        localStorage.removeItem(userKey);
      }

      localStorage.setItem('kredar_onboarding_complete', 'true');
      setIsComplete(true);
      toast.success('Onboarding details submitted successfully!');
    } catch (e: any) {
      console.error('Onboarding submit error details:', e.response?.data);
      let errorMsg = 'Onboarding submission failed.';
      if (e.response?.data) {
        if (typeof e.response.data === 'string') {
          errorMsg = e.response.data;
        } else if (e.response.data.message) {
          errorMsg = e.response.data.message;
        } else if (e.response.data.error) {
          errorMsg = e.response.data.error;
        } else if (e.response.data.errors) {
          const errorsObj = e.response.data.errors;
          const details = Object.entries(errorsObj)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ');
          if (details) errorMsg = details;
        }
      } else {
        errorMsg = e.message || errorMsg;
      }
      toast.error(`Submission failed: ${errorMsg}`);
    } finally {
      setTransitioning(false);
    }
  };

  if (isComplete) return <SuccessScreen />;

  return (
    <div className="min-h-screen bg-[#f5f5f5] relative">
      {/* Logo */}
      <div className="px-8 py-5">
        <KredarLogo />
      </div>

      <div className="mx-auto max-w-[680px] px-4 pb-12 relative">
        {/* Stepper card */}
        <div className="bg-white/70 backdrop-blur-sm border border-[#d8e1da] rounded-2xl px-8 py-6 mb-4">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Transition Loading Overlay */}
        {transitioning && (
          <div className="absolute inset-0 bg-[#f5f5f5]/60 z-30 flex items-center justify-center min-h-[300px]">
            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#0f8b4b] animate-spin" />
              <span className="text-sm font-semibold text-[#081b10]">Processing...</span>
            </div>
          </div>
        )}

        {/* Active step */}
        {currentStep === 1 && (
          <Step1BusinessInfo
            defaultValues={data.businessInfo}
            onNext={handleStep1}
            onBack={() => {}}
          />
        )}
        {currentStep === 2 && (
          <Step2BusinessVerification
            defaultValues={data.businessDocs}
            onNext={handleStep2}
            onBack={() => handleBack(1)}
          />
        )}
        {currentStep === 3 && (
          <Step3Account
            defaultValues={data.accountDetails}
            onNext={handleStep3}
            onBack={() => handleBack(2)}
          />
        )}
        {currentStep === 4 && (
          <Step4ReviewSubmit data={data} onBack={() => handleBack(3)} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}
