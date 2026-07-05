'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Loader2, ArrowLeft } from 'lucide-react';
import AuthPageShell from '@/components/auth/AuthPageShell';
import AuthLoadingModal from '@/components/auth/AuthLoadingModal';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      // Small delay to ensure toast container is mounted
      const t = setTimeout(() => {
        toast.error('Your session has expired. Please sign in again.');
      }, 100);
      router.replace('/auth/login');
      return () => clearTimeout(t);
    }
  }, [searchParams, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [emailVal, setEmailVal] = useState('');

  // OTP Verification states
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);

  const [rootError, setRootError] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setRootError('');
    try {
      const response = await api.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      const data = response.data;
      if (data && data.isSuccess === false) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      setEmailVal(values.email);
      setStep('otp');
      toast.success('Login code sent successfully!');
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Invalid email or password.';
      setRootError(msg);
    }
  };

  const triggerOtpSubmit = async (codeToSubmit: string) => {
    setOtpError('');
    setVerifyingOtp(true);
    try {
      const response = await api.post('/auth/login/verify', {
        email: emailVal,
        otp: codeToSubmit,
      });

      const data = response.data;
      if (data && data.isSuccess === false) {
        throw new Error(data.message || 'Verification failed. Please check the code.');
      }

      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user || { email: emailVal };

      if (!token) {
        throw new Error('Authentication token not received.');
      }

      localStorage.setItem('kredar_token', token);
      localStorage.setItem('kredar_current_user', JSON.stringify(user));

      // Inject token into Axios headers for immediate profile fetch
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      toast.success('Logged in successfully!');

      // Dynamically verify onboarding completion from backend status and profile
      let onboardingDone = false;
      try {
        const onboardingRes = await api.get('/onboarding');
        const onboarding = onboardingRes.data?.data || onboardingRes.data;
        if (
          onboarding &&
          (onboarding.status === 'UnderReview' || onboarding.status === 'Approved')
        ) {
          onboardingDone = true;
        } else {
          const profileRes = await api.get('/tenants/profile');
          const profile = profileRes.data?.data || profileRes.data;
          onboardingDone = !!(profile?.legalName || profile?.businessName || profile?.isOnboarded);
        }
      } catch (err) {
        console.error('Failed to fetch onboarding/profile status during login:', err);
      }

      if (onboardingDone) {
        localStorage.setItem('kredar_onboarding_complete', 'true');
        router.replace('/dashboard');
      } else {
        localStorage.removeItem('kredar_onboarding_complete');
        router.replace('/onboarding');
      }
    } catch (e: any) {
      const msg =
        e.response?.data?.message || e.message || 'Verification failed. Please check the code.';
      setOtpError(msg);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setOtpError('Please enter a valid 6-digit login code.');
      return;
    }
    await triggerOtpSubmit(otpCode);
  };

  const handleOtpChange = (val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    setOtpCode(cleanVal);
    if (cleanVal.length === 6) {
      triggerOtpSubmit(cleanVal);
    }
  };

  const handleResendOtp = async () => {
    setResendingOtp(true);
    try {
      await api.post('/auth/login', {
        email: emailVal,
        password: getValues('password'),
      });
      toast.success('A new login code has been sent to your email.');
    } catch (e: any) {
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setResendingOtp(false);
    }
  };

  const shellTitle = step === 'credentials' ? 'Sign in' : 'Security verification';
  const shellSubtitle =
    step === 'credentials'
      ? 'Enter your email below to sign in'
      : `Confirm your identity to complete sign in`;

  return (
    <AuthPageShell
      title={shellTitle}
      subtitle={shellSubtitle}
      bottomCtaHref="/auth/signup"
      bottomCtaLabel="Sign up"
    >
      {(isSubmitting || verifyingOtp) && (
        <AuthLoadingModal
          message={isSubmitting ? 'Sending login code...' : 'Verifying login code...'}
        />
      )}

      {step === 'credentials' ? (
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
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-1 flex-col">
          <div className="space-y-5">
            <p className="text-sm text-[#45504b] text-center">
              We sent a 6-digit security code to{' '}
              <span className="font-semibold text-[#081b10] break-all">{emailVal}</span>
            </p>

            {/* Code Input */}
            <div>
              <label htmlFor="otp" className="kredar-label">
                Security Code
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otpCode}
                onChange={(e) => handleOtpChange(e.target.value)}
                className="kredar-input tracking-[0.5em] text-center text-lg font-bold"
              />
              {otpError && <p className="kredar-error-text text-center mt-2">{otpError}</p>}
            </div>

            <button type="submit" disabled={verifyingOtp} className="kredar-btn-primary w-full">
              {verifyingOtp ? 'Verifying…' : 'Confirm Sign In'}
            </button>

            <div className="flex flex-col items-center gap-3 pt-3 text-center">
              <button
                type="button"
                disabled={resendingOtp}
                onClick={handleResendOtp}
                className="text-xs text-[#0f8b4b] hover:underline font-medium disabled:opacity-50"
              >
                {resendingOtp ? 'Resending…' : "Didn't receive code? Resend"}
              </button>

              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="text-xs text-[#45504b] hover:text-[#081b10] font-medium flex items-center gap-1.5 mt-1"
              >
                <ArrowLeft size={14} />
                Back to credentials login
              </button>
            </div>
          </div>
        </form>
      )}
    </AuthPageShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFF]">
          <div className="w-6 h-6 border-2 border-[#0f8b4b] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
