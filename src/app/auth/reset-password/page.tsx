'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const resetSchema = z
  .object({
    code: z.string().length(6, 'Reset code must be exactly 6 digits'),
    password: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetValues = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rootError, setRootError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  useEffect(() => {
    if (!email) {
      toast.error('Missing email address. Redirecting...');
      router.replace('/auth/forgot-password');
    }
  }, [email, router]);

  const onSubmit = async (values: ResetValues) => {
    setRootError('');
    try {
      const response = await api.post('/auth/reset-password', {
        token: values.code,
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (response.data && response.data.isSuccess === false) {
        setRootError(response.data.message || 'Failed to reset password. Please try again.');
        return;
      }

      toast.success('Password reset successfully! Please sign in.');
      router.replace('/auth/login');
    } catch (e: any) {
      const msg =
        e.response?.data?.message ||
        e.message ||
        'Failed to reset password. Please check the code.';
      setRootError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <div className="space-y-5">
        <p className="text-sm text-[#45504b] text-center">
          Enter the code sent to <span className="font-semibold text-[#081b10]">{email}</span> and
          choose a new password.
        </p>

        {/* Code Input */}
        <div>
          <label htmlFor="code" className="kredar-label">
            Reset Code
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

        {/* Password */}
        <div>
          <label htmlFor="password" className="kredar-label">
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={cn('kredar-input pr-12', errors.password && 'input-error')}
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45504b]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="kredar-error-text">{errors.password.message}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirmPassword" className="kredar-label">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              {...register('confirmPassword')}
              className={cn('kredar-input pr-12', errors.confirmPassword && 'input-error')}
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45504b]"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="kredar-error-text">{errors.confirmPassword.message}</p>
          )}
        </div>

        {rootError && <p className="text-sm text-[#ef4444] text-center">{rootError}</p>}

        <button type="submit" disabled={isSubmitting} className="kredar-btn-primary w-full">
          {isSubmitting ? 'Resetting…' : 'Reset Password'}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#0f8b4b] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthPageShell
        title="Reset password"
        subtitle="Choose a new password for your account"
        bottomCtaHref="/auth/login"
        bottomCtaLabel="Back to Sign in"
      >
        <ResetPasswordForm />
      </AuthPageShell>
    </Suspense>
  );
}
