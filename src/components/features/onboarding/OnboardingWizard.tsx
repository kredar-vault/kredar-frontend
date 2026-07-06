'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import KredarLogo from '@/components/KredarLogo';
import StepIndicator from './StepIndicator';
import Step1BusinessInfo, { type Step1Data } from './Step1BusinessInfo';
import Step2BusinessVerification, { type Step2Data } from './Step2BusinessVerification';
import Step3Account, { type Step3Data } from './Step3Account';
import Step4ReviewSubmit from './Step4ReviewSubmit';
import SuccessScreen from './SuccessScreen';
import { api } from '@/lib/api';
import { useSubmitOnboarding } from '@/api/tenant/hooks';
import {
  getCurrentUser,
  setOnboardingComplete,
  getOnboardingDraft,
  setOnboardingDraft,
  clearOnboardingDraft,
} from '@/lib/cookies';

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

  const submitMutation = useSubmitOnboarding();

  const saveProgress = (step: number, updatedData: OnboardingData) => {
    const user = getCurrentUser();
    setOnboardingDraft(
      {
        currentStep: step,
        businessInfo: updatedData.businessInfo,
        accountDetails: updatedData.accountDetails,
      },
      user?.email,
    );
  };

  useEffect(() => {
    const initOnboarding = async () => {
      try {
        const onboardingRes = await api.get('/onboarding');
        const onboarding = onboardingRes.data?.data || onboardingRes.data;
        if (
          onboarding &&
          (onboarding.status === 'UnderReview' || onboarding.status === 'Approved')
        ) {
          setOnboardingComplete(true);
          toast.success('Your application is under review. Redirecting to dashboard...');
          router.replace('/dashboard');
          return;
        }

        const res = await api.get('/tenants/profile');
        const profile = res.data?.data || res.data;
        if (profile && (profile.legalName || profile.businessName || profile.isOnboarded)) {
          setOnboardingComplete(true);
          toast.success('You have already completed onboarding!');
          router.replace('/dashboard');
          return;
        }
      } catch (err) {
        console.error('Failed to load profile/onboarding status on mount:', err);
      }

      const user = getCurrentUser();
      const savedState = getOnboardingDraft(user?.email);
      if (savedState) {
        if (savedState.currentStep) {
          setCurrentStep(savedState.currentStep);
        }
        if (savedState.businessInfo || savedState.accountDetails) {
          setData((prev) => ({
            ...prev,
            businessInfo: savedState.businessInfo || null,
            accountDetails: savedState.accountDetails || null,
          }));
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
    }, 200);
  };

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

      await submitMutation.mutateAsync({
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

      const user = getCurrentUser();
      clearOnboardingDraft(user?.email);
      setOnboardingComplete(true);
      setIsComplete(true);
      toast.success('Onboarding details submitted successfully!');
    } catch (e: any) {
      console.error('Onboarding submit error details:', e.response?.data);
      const msg = e.response?.data?.message || e.message || 'Onboarding submission failed.';
      toast.error(`Submission failed: ${msg}`);
    } finally {
      setTransitioning(false);
    }
  };

  if (isComplete) return <SuccessScreen />;

  return (
    <div className="min-h-screen bg-[#f5f5f5] relative">
      <div className="px-8 py-5">
        <KredarLogo />
      </div>

      <div className="mx-auto max-w-[680px] px-4 pb-12 relative">
        <div className="bg-white/70 backdrop-blur-sm border border-[#d8e1da] rounded-2xl px-8 py-6 mb-4">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        {transitioning && (
          <div className="absolute inset-0 bg-[#f5f5f5]/60 z-30 flex items-center justify-center min-h-[300px]">
            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#0f8b4b] animate-spin" />
              <span className="text-sm font-semibold text-[#081b10]">Processing...</span>
            </div>
          </div>
        )}

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
