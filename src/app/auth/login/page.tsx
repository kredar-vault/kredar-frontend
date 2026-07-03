'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rootError, setRootError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setRootError('');
    try {
      const users: { id: number; email: string; password: string; verified?: boolean }[] =
        JSON.parse(localStorage.getItem('kredar_users') ?? '[]');
      const user = users.find((u) => u.email === values.email && u.password === values.password);
      if (!user) {
        setRootError('Invalid email or password.');
        return;
      }

      if (user.verified === false) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const { sendVerificationEmail } = await import('@/lib/email');
        await sendVerificationEmail(values.email, verificationCode);
        router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);
        return;
      }

      localStorage.setItem('kredar_token', `mock-token-${user.id}-${Date.now()}`);
      localStorage.setItem('kredar_current_user', JSON.stringify(user));

      // If onboarding already complete, go dashboard; otherwise resume onboarding
      const onboardingDone = localStorage.getItem('kredar_onboarding_complete') === 'true';
      router.replace(onboardingDone ? '/dashboard' : '/onboarding');
    } catch (e) {
      setRootError('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthPageShell
      title="Sign in"
      subtitle="Enter your email below to sign in"
      bottomCtaHref="/auth/signup"
      bottomCtaLabel="Sign up"
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

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-[#081b10]">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#0f8b4b] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative mt-0">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={cn('kredar-input pr-12', errors.password && 'input-error')}
                placeholder="Enter your password"
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

          {rootError && <p className="text-sm text-[#ef4444] text-center">{rootError}</p>}

          <button type="submit" disabled={isSubmitting} className="kredar-btn-primary w-full">
            {isSubmitting ? 'Signing in…' : 'Sign in with Email'}
          </button>
        </div>

        <div className="mt-auto pt-8 text-center text-sm text-[#45504b]">
          By clicking continue, you agree to our{' '}
          <Link href="/terms" className="underline text-[#0f8b4b]">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline text-[#0f8b4b]">
            Privacy Policy
          </Link>
          .
        </div>
      </form>
    </AuthPageShell>
  );
}
