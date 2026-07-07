'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useResendVerification, useVerifyEmailQuery } from '@/api/auth/hooks';
import { getRegisteredEmail } from '@/lib/cookies';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || getRegisteredEmail() || '';

  const verifyQuery = useVerifyEmailQuery(token, email);
  const resendMutation = useResendVerification();

  useEffect(() => {
    if (!token) return;

    if (verifyQuery.isSuccess) {
      router.replace('/auth/email-verified?verified=true');
    } else if (verifyQuery.isError) {
      router.replace('/auth/email-verified?verified=false');
    }
  }, [token, verifyQuery.isSuccess, verifyQuery.isError, router]);

  // If token in URL — show spinner while verifying
  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[#0f8b4b] animate-spin mx-auto" />
          <p className="text-sm text-[#45504b]">Verifying your email address…</p>
        </div>
      </div>
    );
  }

  // No token — holding page after signup
  const handleResend = async () => {
    if (!email) {
      toast.error('Email not found. Please sign up again.');
      return;
    }
    try {
      await resendMutation.mutateAsync({ email });
      toast.success('Verification link resent!');
    } catch (e: any) {
      toast.error(e.response?.data?.message || e.message || 'Failed to resend link.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7faf6] px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[#d8e1da] p-10 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-[#effaf2] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail size={30} className="text-[#0f8b4b]" />
        </div>

        <h1 className="text-xl font-bold text-[#081b10] mb-2">Check your email</h1>
        <p className="text-sm text-[#45504b] leading-relaxed mb-8">
          We sent a verification link to{' '}
          <span className="font-semibold text-[#081b10]">{email || 'your email address'}</span>.
          Click the link to verify your account and sign in.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full border border-[#d8e1da] text-[#081b10] text-sm font-semibold py-3 rounded-xl hover:bg-[#f7faf6] transition-colors"
          >
            Return to sign in
          </button>
        </div>

        <button
          type="button"
          onClick={() => router.replace('/auth/login')}
          className="kredar-btn-outline w-full"
        >
          Verified on another device? Go to login
        </button>

        <p className="text-xs text-[#8c9c94] mt-2">
          Didn't receive the email? Check your spam folder or click above to request a new link.
        <p className="text-xs text-[#45504b] mt-6">
          Didn't receive the email? Check your spam folder or{' '}
          <button
            onClick={handleResend}
            disabled={resendMutation.isPending}
            className="text-[#0f8b4b] font-semibold hover:underline disabled:opacity-50"
          >
            {resendMutation.isPending ? 'Resending…' : 'resend verification link'}
          </button>
          .
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#0f8b4b] animate-spin" />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
