'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import BusinessInfoFormFields from './BusinessInfoFormFields';

const schema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .regex(/^[a-zA-Z\s-&.']+$/, 'Business name must only contain letters (no numbers allowed)'),
  registrationNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[a-zA-Z0-9\s-]+$/.test(val),
      'Registration number must contain only letters and numbers',
    ),
  businessType: z.string().min(1, 'Please select a business type'),
  industry: z.string().min(1, 'Please select an industry'),
  country: z.string().min(1, 'Please select a country'),
  businessAddress: z.string().min(1, 'Business address is required'),
  countryCode: z.string().min(1, 'Required'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{7,15}$/, 'Phone number must contain only numbers'),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/.*)?$/.test(val),
      'Enter a valid website URL',
    ),
});

export type Step1Data = z.infer<typeof schema>;

interface Props {
  defaultValues: Step1Data | null;
  onNext: (data: Step1Data) => void;
  onBack: () => void;
}

export default function Step1BusinessInfo({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(),
    defaultValues: defaultValues ?? {
      countryCode: '+000',
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="bg-white rounded-2xl shadow-sm px-10 py-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-[#081b10]">Business Details</h1>
        <p className="mt-1.5 text-sm text-[#45504b]">
          Provide your business details to start the KYB (Know Your Business) process
        </p>
      </div>

      {/* Form Fields inputs */}
      <BusinessInfoFormFields register={register} errors={errors} />

      {/* Notice */}
      <div className="mt-6 flex items-start gap-2 text-sm text-[#45504b]">
        <AlertCircle size={15} className="text-[#ef4444] flex-shrink-0 mt-0.5" />
        <span>Ensure the information provided matches your legal documents</span>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <button type="button" onClick={onBack} className="kredar-btn-outline">
          Back
        </button>
        <button type="submit" className="kredar-btn-primary">
          Next
        </button>
      </div>
    </form>
  );
}
