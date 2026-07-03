'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [rootError, setRootError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (values: ForgotValues) => {
    setRootError('');
    try {
      const users: any[] = JSON.parse(localStorage.getItem('kredar_users') ?? '[]');
      const exists = users.find((u) => u.email === values.email);

      if (!exists) {
        // For security reasons, we can show generic success or show an error.
        // The user requested that we connect it to localStorage database, so we will validate if email exists.
        setRootError('No account found with this email address.');
        return;
      }

      // Generate verification reset code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Send password reset email
      const { sendPasswordResetEmail } = await import('@/lib/email');
      await sendPasswordResetEmail(values.email, resetCode);

      router.push(`/auth/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch {
      setRootError('Something went wrong. Please try again.');
    }
  };

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
