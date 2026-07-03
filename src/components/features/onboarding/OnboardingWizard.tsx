'use client';

import { useState } from 'react';
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    businessInfo: null,
    businessDocs: null,
    accountDetails: null,
  });

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
      setData((prev) => ({ ...prev, businessInfo: d }));
    });
  };

  const handleStep2 = (d: Step2Data) => {
    triggerTransition(3, () => {
      setData((prev) => ({ ...prev, businessDocs: d }));
    });
  };

  const handleStep3 = (d: Step3Data) => {
    triggerTransition(4, () => {
      setData((prev) => ({ ...prev, accountDetails: d }));
    });
  };

  const handleBack = (prevStep: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentStep(prevStep);
      setTransitioning(false);
    }, 150);
  };

  const handleSubmit = () => {
    setTransitioning(true);
    setTimeout(() => {
      // Persist to localStorage (will be replaced by real API later)
      localStorage.setItem('kredar_onboarding_complete', 'true');
      localStorage.setItem(
        'kredar_onboarding_data',
        JSON.stringify({
          businessInfo: data.businessInfo,
          businessDocs: {
            certificateName: data.businessDocs?.certificate?.name,
            proofOfAddressName: data.businessDocs?.proofOfAddress?.name,
          },
          accountDetails: data.accountDetails,
        }),
      );
      setIsComplete(true);
      setTransitioning(false);
    }, 300);
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
        <div className="bg-white/70 backdrop-blur-sm border border-[#d8e1da] rounded-2xl px-8 py-5 mb-4">
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
