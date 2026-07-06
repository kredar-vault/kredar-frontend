'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginValues = z.infer<typeof loginSchema>;

interface LoginCredentialsFormProps {
  onSubmit: (values: LoginValues) => Promise<void>;
  isSubmitting: boolean;
  rootError: string;
}

export default function LoginCredentialsForm({
  onSubmit,
  isSubmitting,
  rootError,
}: LoginCredentialsFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  return (
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
          {isSubmitting ? 'Sending Code…' : 'Sign in with Email'}
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
  );
}
