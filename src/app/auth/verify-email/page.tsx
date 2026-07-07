'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { toast } from 'sonner';
import { Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useResendVerification, useVerifyEmailQuery } from '@/api/auth/hooks';
import { getRegisteredEmail, setToken, setCurrentUser } from '@/lib/cookies';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || getRegisteredEmail() || '';

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const verifyQuery = useVerifyEmailQuery(token, email);
  const resendMutation = useResendVerification();

  useEffect(() => {
    if (token) {
      if (verifyQuery.isLoading) {
        setStatus('verifying');
      } else if (verifyQuery.isSuccess) {
        const responseData = verifyQuery.data;
        const userToken = responseData?.token || responseData?.data?.token;
        const user = responseData?.user || responseData?.data?.user || { email };

        if (userToken) {
          setToken(userToken);
          setCurrentUser(user);
        }

        setStatus('success');
        toast.success('Email verified successfully! Please sign in.');
        const t = setTimeout(() => {
          router.replace('/auth/login');
        }, 1500);
        return () => clearTimeout(t);
      } else if (verifyQuery.isError) {
        setStatus('error');
        const err: any = verifyQuery.error;
        const msg =
          err.response?.data?.message ||
          err.message ||
          'Email verification link is invalid or has expired.';
        setErrorMsg(msg);
      }
    } else {
      setStatus('idle');
    }
  }, [
    token,
    email,
    router,
    verifyQuery.isLoading,
    verifyQuery.isSuccess,
    verifyQuery.isError,
    verifyQuery.data,
    verifyQuery.error,
  ]);

  const handleResend = async () => {
    if (!email) {
      toast.error('Email address not found. Please sign up again.');
      return;
    }
    try {
      await resendMutation.mutateAsync({ email });
      toast.success('Verification link resent successfully!');
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Failed to resend verification link.';
      toast.error(msg);
    }
  };

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#0f8b4b] animate-spin" />
        <p className="text-sm font-medium text-[#45504b]">
          Verifying your email address, please wait...
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-[#0f8b4b]" />
        <h3 className="text-lg font-bold text-[#081b10]">Verification Successful!</h3>
        <p className="text-sm text-[#45504b]">Taking you to login...</p>
        <button
          type="button"
          onClick={() => router.replace('/auth/login')}
          className="kredar-btn-primary w-full max-w-xs mt-2"
        >
          Go to login
        </button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#ef4444]" />
        <h3 className="text-lg font-bold text-[#ef4444]">Verification Failed</h3>
        <p className="text-sm text-[#45504b] max-w-xs">{errorMsg}</p>
        <button
          onClick={() => router.replace('/auth/signup')}
          className="kredar-btn-primary w-full max-w-xs mt-2"
        >
          Back to Sign Up
        </button>
      </div>
    );
  }

  const resending = resendMutation.isPending;

  return (
    <div className="flex flex-col items-center py-4 text-center space-y-5">
      <div className="w-16 h-16 bg-[#effaf2] rounded-md flex items-center justify-center text-[#0f8b4b] mb-2">
        <Mail size={32} />
      </div>
      <p className="text-sm text-[#45504b] leading-relaxed">
        We've sent a confirmation link to{' '}
        <span className="font-semibold text-[#081b10] break-all">
          {email || 'your email address'}
        </span>
        . Please click the button in that email to confirm your account.
      </p>

      <div className="w-full pt-4 space-y-3">
        <button
          type="button"
          disabled={resending}
          onClick={handleResend}
          className="kredar-btn-primary w-full"
        >
          {resending ? 'Resending Link...' : 'Resend link'}
        </button>

        <button
          type="button"
          onClick={() => router.replace('/auth/login')}
          className="kredar-btn-outline w-full"
        >
          Verified on another device? Go to login
        </button>

        <p className="text-xs text-[#8c9c94] mt-2">
          Didn't receive the email? Check your spam folder or click above to request a new link.
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
          <div className="w-6 h-6 border-2 border-[#0f8b4b] border-t-transparent rounded-md animate-spin" />
        </div>
      }
    >
      <AuthPageShell
        title="Verify email"
        subtitle="Confirm your email to complete registration"
        bottomCtaHref="/auth/signup"
        bottomCtaLabel="Back to Sign up"
      >
        <VerifyEmailForm />
      </AuthPageShell>
    </Suspense>
  );
}
