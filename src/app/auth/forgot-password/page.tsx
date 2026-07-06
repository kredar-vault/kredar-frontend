'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useForgotPassword } from '@/api/auth/hooks';

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [rootError, setRootError] = useState('');

  const forgotMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (values: ForgotValues) => {
    setRootError('');
    try {
      const response = await forgotMutation.mutateAsync({
        email: values.email,
      });

      if (response && response.isSuccess === false) {
        setRootError(response.message || 'Failed to send reset code. Please try again.');
        return;
      }

      toast.success('Password reset code sent to your email.');
      router.push(`/auth/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch (e: any) {
      const msg =
        e.response?.data?.message || e.message || 'Something went wrong. Please try again.';
      setRootError(msg);
    }
  };

  const isSubmitting = forgotMutation.isPending;

  return (
    <AuthPageShell
      title="Forgot password"
      subtitle="Enter your email to request a password reset code"
      bottomCtaHref="/auth/login"
      bottomCtaLabel="Back to Sign in"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <div className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="kredar-label">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={cn('kredar-input', errors.email && 'input-error')}
            />
            {errors.email && <p className="kredar-error-text">{errors.email.message}</p>}
          </div>

          {rootError && <p className="text-sm text-[#ef4444] text-center">{rootError}</p>}

          <button type="submit" disabled={isSubmitting} className="kredar-btn-primary w-full">
            {isSubmitting ? 'Sending code…' : 'Send Reset Code'}
          </button>
        </div>
      </form>
    </AuthPageShell>
  );
}
