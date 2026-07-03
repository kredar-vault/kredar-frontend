'use client';

import type { Step1Data } from './Step1BusinessInfo';
import type { Step3Data } from './Step3Account';

interface ReviewDetailsGridProps {
  bi: Step1Data | null;
  ad: Step3Data | null;
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[#45504b]">{label}</span>
      <span className="text-sm font-semibold text-[#081b10]">{value || '—'}</span>
    </div>
  );
}

export default function ReviewDetailsGrid({ bi, ad }: ReviewDetailsGridProps) {
  return (
    <div className="space-y-8">
      {/* ── Section 1: Business Details ── */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#081b10]">Business Details</h2>
          <p className="mt-1 text-sm text-[#45504b]">
            Provide your business details to start the KYB (Know Your Business) process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <Field label="Business name" value={bi?.businessName} />
          <Field label="Business registration number" value={bi?.registrationNumber} />
          <Field label="Business type" value={bi?.businessType} />
          <Field label="Industry" value={bi?.industry} />
          <Field label="Country" value={bi?.country} />
          <Field label="Business address" value={bi?.businessAddress} />
        </div>

        {/* Country code + Phone + Website */}
        <div className="grid grid-cols-3 gap-x-6 mt-6">
          <Field label="Country code" value={bi?.countryCode} />
          <Field label="Phone Number" value={bi?.phoneNumber} />
          <Field label="Website" value={bi?.website} />
        </div>
      </section>

      <hr className="border-[#d8e1da]" />

      {/* ── Section 3: Account Details ── */}
      <section>
        <h2 className="text-2xl font-semibold text-[#081b10] mb-4">Account details</h2>
        <div className="space-y-4">
          <Field label="Bank name" value={ad?.bankName} />
          <div className="grid grid-cols-2 gap-x-10">
            <Field label="Account name" value={ad?.accountName} />
            <Field label="Account number" value={ad?.accountNumber} />
          </div>
        </div>
      </section>
    </div>
  );
}
