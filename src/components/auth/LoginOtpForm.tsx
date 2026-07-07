'use client';

import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface LoginOtpFormProps {
  email: string;
  otpCode: string;
  onOtpChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  verifyingOtp: boolean;
  resendingOtp: boolean;
  otpError: string;
}

export default function LoginOtpForm({
  email,
  otpCode,
  onOtpChange,
  onSubmit,
  onResend,
  onBack,
  verifyingOtp,
  resendingOtp,
  otpError,
}: LoginOtpFormProps) {
  const handleInputChange = (val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    onOtpChange(cleanVal);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-1 flex-col">
      <div className="space-y-5">
        <p className="text-sm text-[#45504b] text-center">
          We sent a 6-digit security code to{' '}
          <span className="font-semibold text-[#081b10] break-all">{email}</span>
        </p>

        {/* Code Input */}
        <div>
          <label htmlFor="otp" className="kredar-label">
            Security Code
          </label>
          <input
            id="otp"
            type="text"
            maxLength={6}
            placeholder="000000"
            value={otpCode}
            onChange={(e) => handleInputChange(e.target.value)}
            className="kredar-input tracking-[0.5em] text-center text-lg font-bold"
          />
          {otpError && <p className="kredar-error-text text-center mt-2">{otpError}</p>}
        </div>

        <button type="submit" disabled={verifyingOtp} className="kredar-btn-primary w-full">
          {verifyingOtp ? 'Verifying…' : 'Confirm Sign In'}
        </button>

        <div className="flex flex-col items-center gap-3 pt-3 text-center">
          <button
            type="button"
            disabled={resendingOtp}
            onClick={onResend}
            className="text-xs text-[#0f8b4b] hover:underline font-medium disabled:opacity-50"
          >
            {resendingOtp ? 'Resending…' : "Didn't receive code? Resend"}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="text-xs text-[#45504b] hover:text-[#081b10] font-medium flex items-center gap-1.5 mt-1"
          >
            <ArrowLeft size={14} />
            Back to credentials login
          </button>
        </div>
      </div>
    </form>
  );
}
