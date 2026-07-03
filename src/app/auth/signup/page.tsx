'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import AuthPageShell from '@/components/auth/AuthPageShell';
import AuthLoadingModal from '@/components/auth/AuthLoadingModal';
import { cn } from '@/lib/utils';

const signupSchema = z
  .object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rootError, setRootError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupValues) => {
    setRootError('');
    try {
      const users: { id: number; email: string; password: string; verified?: boolean }[] =
        JSON.parse(localStorage.getItem('kredar_users') ?? '[]');

      if (users.find((u) => u.email === values.email)) {
        setError('email', { message: 'An account with this email already exists.' });
        return;
      }

      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Save user with verified = false
      const newUser = {
        id: Date.now(),
        email: values.email,
        password: values.password,
        verified: false,
      };
      users.push(newUser);
      localStorage.setItem('kredar_users', JSON.stringify(users));

      // Import the helper dynamically or call it directly
      const { sendVerificationEmail } = await import('@/lib/email');
      await sendVerificationEmail(values.email, verificationCode);

      // Redirect to verification page
      router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (e) {
      setRootError('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthPageShell
      title="Create an account"
      subtitle="Enter your details below to sign up"
      bottomCtaHref="/auth/login"
      bottomCtaLabel="Sign in"
    >
      {isSubmitting && <AuthLoadingModal message="Creating your account..." />}
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
            <label htmlFor="password" className="kredar-label">
              Password
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
              Confirm password
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
            {isSubmitting ? 'Creating account…' : 'Sign up with Email'}
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
