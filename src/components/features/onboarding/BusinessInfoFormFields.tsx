'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Step1Data } from './Step1BusinessInfo';

interface BusinessInfoFormFieldsProps {
  register: UseFormRegister<Step1Data>;
  errors: FieldErrors<Step1Data>;
}

const BUSINESS_TYPES = [
  { value: 'SoleProprietorship', label: 'Sole Proprietorship' },
  { value: 'Partnership', label: 'Partnership' },
  { value: 'LimitedLiabilityCompany', label: 'Limited Liability Company (LLC)' },
  { value: 'LimitedLiabilityPartnership', label: 'Limited Liability Partnership (LLP)' },
  { value: 'Corporation', label: 'Corporation' },
  { value: 'NonProfit', label: 'Non-Profit Organisation' },
];

const INDUSTRIES = [
  { value: 'Finance', label: 'Finance' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Education', label: 'Education' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Logistics', label: 'Logistics' },
  { value: 'RealEstate', label: 'Real Estate' },
  { value: 'MediaAndEntertainment', label: 'Media & Entertainment' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Other', label: 'Other' },
];

const COUNTRIES = [
  { code: '+234', name: 'Nigeria' },
  { code: '+1', name: 'United States' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+233', name: 'Ghana' },
  { code: '+254', name: 'Kenya' },
  { code: '+27', name: 'South Africa' },
  { code: '+251', name: 'Ethiopia' },
  { code: '+255', name: 'Tanzania' },
];

const COUNTRY_CODES = ['+000', '+1', '+44', '+234', '+233', '+254', '+27', '+251', '+255'];

export default function BusinessInfoFormFields({ register, errors }: BusinessInfoFormFieldsProps) {
  return (
    <div className="space-y-5">
      {/* Row 1: Business name + Registration number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="kredar-label">Business name*</label>
          <input
            placeholder="Enter your business name"
            {...register('businessName')}
            className={cn('kredar-input', errors.businessName && 'input-error')}
          />
          {errors.businessName && (
            <p className="kredar-error-text">{errors.businessName.message}</p>
          )}
        </div>
        <div>
          <label className="kredar-label">Business registration number</label>
          <input
            placeholder="Enter your business registration number"
            {...register('registrationNumber')}
            className="kredar-input"
          />
        </div>
      </div>

      {/* Row 2: Business type + Industry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative">
          <label className="kredar-label">Business type*</label>
          <select
            {...register('businessType')}
            className={cn('kredar-select pr-10', errors.businessType && 'input-error')}
          >
            <option value="">Select business type</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-[calc(50%+12px)] -translate-y-1/2 text-[#45504b]"
          />
          {errors.businessType && (
            <p className="kredar-error-text">{errors.businessType.message}</p>
          )}
        </div>
        <div className="relative">
          <label className="kredar-label">Industry*</label>
          <select
            {...register('industry')}
            className={cn('kredar-select pr-10', errors.industry && 'input-error')}
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-[calc(50%+12px)] -translate-y-1/2 text-[#45504b]"
          />
          {errors.industry && <p className="kredar-error-text">{errors.industry.message}</p>}
        </div>
      </div>

      {/* Row 3: Country + Business address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative">
          <label className="kredar-label">Country*</label>
          <select
            {...register('country')}
            className={cn('kredar-select pr-10', errors.country && 'input-error')}
          >
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-[calc(50%+12px)] -translate-y-1/2 text-[#45504b]"
          />
          {errors.country && <p className="kredar-error-text">{errors.country.message}</p>}
        </div>
        <div>
          <label className="kredar-label">Business address*</label>
          <input
            placeholder="Enter your business address"
            {...register('businessAddress')}
            className={cn('kredar-input', errors.businessAddress && 'input-error')}
          />
          {errors.businessAddress && (
            <p className="kredar-error-text">{errors.businessAddress.message}</p>
          )}
        </div>
      </div>

      {/* Row 4: Country code + Phone + Website */}
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-4">
        <div>
          <label className="kredar-label">Country code</label>
          <select
            {...register('countryCode')}
            className={cn('kredar-select', errors.countryCode && 'input-error')}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="kredar-label">Phone Number</label>
          <input
            placeholder="Enter your phone number"
            {...register('phoneNumber')}
            className={cn('kredar-input', errors.phoneNumber && 'input-error')}
          />
          {errors.phoneNumber && <p className="kredar-error-text">{errors.phoneNumber.message}</p>}
        </div>
        <div>
          <label className="kredar-label">Website</label>
          <input
            placeholder="johndoe.ltd@meridian.com"
            {...register('website')}
            className="kredar-input"
          />
        </div>
      </div>
    </div>
  );
}
