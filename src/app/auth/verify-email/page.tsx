'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token') || '';
  const email =
    searchParams.get('email') ||
    (typeof window !== 'undefined' ? localStorage.getItem('kredar_registered_email') : '') ||
    '';

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const verifyToken = async (verifyToken: string) => {
      setStatus('verifying');
      setError('');
      try {
        const response = await api.get('/auth/verify-email', {
          params: {
            token: verifyToken,
          },
        });

        const userToken = response.data.token || response.data.data?.token;
        const user = response.data.user || response.data.data?.user || { email };

        if (userToken) {
          localStorage.setItem('kredar_token', userToken);
          localStorage.setItem('kredar_current_user', JSON.stringify(user));
        }

        setStatus('success');
        toast.success('Email verified successfully! Please sign in.');
        setTimeout(() => {
          router.replace('/auth/login');
        }, 1500);
      } catch (e: any) {
        setStatus('error');
        const msg =
          e.response?.data?.message ||
          e.message ||
          'Email verification link is invalid or has expired.';
        setError(msg);
      }
    };

    if (token) {
      verifyToken(token);
    } else {
      setStatus('idle');
    }
  }, [token, email, router]);

  const handleResend = async () => {
    if (!email) {
      toast.error('Email address not found. Please sign up again.');
      return;
    }
    setResending(true);
    try {
      await api.post('/auth/resend-verification', { email });
      toast.success('Verification link resent successfully!');
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Failed to resend verification link.';
      toast.error(msg);
    } finally {
      setResending(false);
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
        <p className="text-sm text-[#45504b]">Taking you to onboarding...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#ef4444]" />
        <h3 className="text-lg font-bold text-[#ef4444]">Verification Failed</h3>
        <p className="text-sm text-[#45504b] max-w-xs">{error}</p>
        <button
          onClick={() => router.replace('/auth/signup')}
          className="kredar-btn-primary w-full max-w-xs mt-2"
        >
          Back to Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-4 text-center space-y-5">
      <div className="w-16 h-16 bg-[#effaf2] rounded-full flex items-center justify-center text-[#0f8b4b] mb-2">
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
          <div className="w-6 h-6 border-2 border-[#0f8b4b] border-t-transparent rounded-full animate-spin" />
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
