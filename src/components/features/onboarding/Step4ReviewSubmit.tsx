'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, FileText, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReviewDetailsGrid from './ReviewDetailsGrid';
import type { Step1Data } from './Step1BusinessInfo';
import type { Step2Data } from './Step2BusinessVerification';
import type { Step3Data } from './Step3Account';
import Button from '../landing/Button';

interface OnboardingData {
  businessInfo: Step1Data | null;
  businessDocs: Step2Data | null;
  accountDetails: Step3Data | null;
}

interface Props {
  data: OnboardingData;
  onBack: () => void;
  onSubmit: () => void;
}

export default function Step4ReviewSubmit({ data, onBack, onSubmit }: Props) {
  const [certified, setCertified] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const { businessInfo: bi, businessDocs: bd, accountDetails: ad } = data;

  const handleSubmit = () => {
    setAttempted(true);
    if (!certified) return;
    onSubmit();
  };

  return (
    <div className="bg-white rounded-md  px-10 py-8 space-y-8">
      {/* Renders Section 1 & Section 3 details */}
      <ReviewDetailsGrid bi={bi} ad={ad} />

      <hr className="border-[#d8e1da]" />

      {/* ── Section 2: Business Documents ── */}
      <section>
        <h2 className="text-2xl font-semibold text-[#081b10] mb-4">Business documents</h2>
        <div className="space-y-3">
          {/* Certificate */}
          <div className="flex items-center justify-between py-4 px-5 border border-[#d8e1da] rounded-xl bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f7faf6] rounded-lg flex items-center justify-center border border-[#d8e1da]">
                <FileText size={18} className="text-[#45504b]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#081b10]">
                  {bd?.certificate?.name ?? 'Certificate.pdf'}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="7" cy="7" r="6" fill="#0f8b4b" fillOpacity="0.1" />
                    <path
                      d="M10 5L5.5 9.5L3.5 7.5"
                      stroke="#0f8b4b"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xs text-[#0f8b4b] font-medium">Complete</span>
                </div>
              </div>
            </div>
            <Button
              type="button"
              className="text-[#ef4444] hover:text-red-600 transition-colors p-1.5 hover:bg-[#fff0f0] rounded-lg"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          {/* Proof of Address */}
          <div className="flex items-center justify-between py-4 px-5 border border-[#d8e1da] rounded-xl bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f7faf6] rounded-lg flex items-center justify-center border border-[#d8e1da]">
                <FileText size={18} className="text-[#45504b]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#081b10]">
                  {bd?.proofOfAddress?.name ?? 'Proof of Address.pdf'}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="7" cy="7" r="6" fill="#0f8b4b" fillOpacity="0.1" />
                    <path
                      d="M10 5L5.5 9.5L3.5 7.5"
                      stroke="#0f8b4b"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xs text-[#0f8b4b] font-medium">Complete</span>
                </div>
              </div>
            </div>
            <Button
              type="button"
              className="text-[#ef4444] hover:text-red-600 transition-colors p-1.5 hover:bg-[#fff0f0] rounded-lg"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 text-sm text-[#45504b]">
          <AlertCircle size={15} className="text-[#ef4444] flex-shrink-0 mt-0.5" />
          <span>
            Documents are encrypted and stored securely. Verification typically takes 1 to 2
            business days. You will be notified via email once the review is complete
          </span>
        </div>
      </section>

      <hr className="border-[#d8e1da]" />

      {/* ── Custom Certification checkbox ── */}
      <div>
        <div className="flex items-start gap-3">
          <Button
            type="button"
            onClick={() => setCertified(!certified)}
            className={cn(
              'mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all flex-shrink-0 focus:outline-none',
              certified
                ? 'bg-[#0f8b4b] border-[#0f8b4b] text-white'
                : 'border-[#d8e1da] bg-white hover:border-[#0f8b4b]',
            )}
          >
            {certified && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 3L4.5 8.5L2 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </Button>
          <label
            className="text-sm text-[#45504b] cursor-pointer leading-snug select-none"
            onClick={() => setCertified(!certified)}
          >
            I certify that the information provided is accurate and I agree to the{' '}
            <Link
              href="/terms"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-[#0f8b4b] font-medium hover:underline focus:outline-none"
            >
              Kredar Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-[#0f8b4b] font-medium hover:underline focus:outline-none"
            >
              Privacy Policy
            </Link>
          </label>
        </div>
        {attempted && !certified && (
          <p className="kredar-error-text mt-2">You must certify before submitting</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <Button type="button" onClick={onBack} className="kredar-btn-outline">
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} className="kredar-btn-primary">
          Submit
        </Button>
      </div>
    </div>
  );
}
