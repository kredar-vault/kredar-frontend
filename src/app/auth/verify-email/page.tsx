'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const verifySchema = z.object({
  code: z.string().length(6, 'Verification code must be exactly 6 digits'),
});

type VerifyValues = z.infer<typeof verifySchema>;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [rootError, setRootError] = useState('');
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyValues>({ resolver: zodResolver(verifySchema) });

  useEffect(() => {
    if (!email) {
      toast.error('Missing email address. Redirecting...');
      router.replace('/auth/signup');
    }
  }, [email, router]);

  const onSubmit = async (values: VerifyValues) => {
    setRootError('');
    try {
      const storedCode = localStorage.getItem(`otp_verify_${email}`);
      if (!storedCode || storedCode !== values.code) {
        setRootError('Invalid or expired verification code.');
        return;
      }

      // Mark user as verified in localStorage db
      const users: any[] = JSON.parse(localStorage.getItem('kredar_users') ?? '[]');
      const userIndex = users.findIndex((u) => u.email === email);

      if (userIndex !== -1) {
        users[userIndex].verified = true;
        localStorage.setItem('kredar_users', JSON.stringify(users));

        // Log in the verified user
        const loggedUser = users[userIndex];
        localStorage.setItem('kredar_token', `mock-token-${loggedUser.id}-${Date.now()}`);
        localStorage.setItem('kredar_current_user', JSON.stringify(loggedUser));

        // Remove code
        localStorage.removeItem(`otp_verify_${email}`);

        toast.success('Email verified successfully!');
        router.replace('/onboarding');
      } else {
        setRootError('User profile not found. Please sign up again.');
      }
    } catch (e) {
      setRootError('Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const { sendVerificationEmail } = await import('@/lib/email');
      await sendVerificationEmail(email, newCode);
      toast.success('A new verification code has been simulated.');
    } catch {
      toast.error('Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <div className="space-y-5">
        <p className="text-sm text-[#45504b] text-center">
          We sent a 6-digit verification code to{' '}
          <span className="font-semibold text-[#081b10]">{email}</span>
        </p>

        {/* Code Input */}
        <div>
          <label htmlFor="code" className="kredar-label">
            Verification Code
          </label>
          <input
            id="code"
            type="text"
            maxLength={6}
            placeholder="000000"
            {...register('code')}
            className={cn(
              'kredar-input tracking-[0.5em] text-center text-lg font-bold',
              errors.code && 'input-error',
            )}
          />
          {errors.code && <p className="kredar-error-text">{errors.code.message}</p>}
        </div>

        {rootError && <p className="text-sm text-[#ef4444] text-center">{rootError}</p>}

        <button type="submit" disabled={isSubmitting} className="kredar-btn-primary w-full">
          {isSubmitting ? 'Verifying…' : 'Verify Email'}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            disabled={resending}
            onClick={handleResend}
            className="text-xs text-[#0f8b4b] hover:underline font-medium disabled:opacity-50"
          >
            {resending ? 'Sending…' : "Didn't receive code? Resend"}
          </button>
        </div>
      </div>
    </form>
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
