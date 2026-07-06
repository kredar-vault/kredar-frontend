'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AuthPageShell from '@/components/auth/AuthPageShell';
import AuthLoadingModal from '@/components/auth/AuthLoadingModal';
import LoginCredentialsForm, { LoginValues } from '@/components/auth/LoginCredentialsForm';
import LoginOtpForm from '@/components/auth/LoginOtpForm';
import { useLogin, useVerifyOtp } from '@/api/auth/hooks';
import { setToken, setCurrentUser, setOnboardingComplete, clearAuthCookies } from '@/lib/cookies';
import { api } from '@/lib/api';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      const t = setTimeout(() => {
        toast.error('Your session has expired. Please sign in again.');
      }, 100);
      router.replace('/auth/login');
      return () => clearTimeout(t);
    }
  }, [searchParams, router]);

  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [emailVal, setEmailVal] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [rootError, setRootError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loginMutation = useLogin();
  const verifyOtpMutation = useVerifyOtp();

  const handleCredentialsSubmit = async (values: LoginValues) => {
    setRootError('');
    setEmailVal(values.email);
    setPasswordVal(values.password);

    try {
      const data = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      if (data && data.isSuccess === false) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      setStep('otp');
      toast.success('Login code sent successfully!');
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Invalid email or password.';
      setRootError(msg);
    }
  };

  const executeOtpVerification = async (codeToSubmit: string) => {
    setOtpError('');
    setIsLoggingIn(true);
    try {
      const data = await verifyOtpMutation.mutateAsync({
        email: emailVal,
        otp: codeToSubmit,
      });

      if (data && data.isSuccess === false) {
        throw new Error(data.message || 'Verification failed. Please check the code.');
      }

      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user || { email: emailVal };

      if (!token) {
        throw new Error('Authentication token not received.');
      }

      clearAuthCookies();
      setToken(token);
      setCurrentUser(user);

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

      setOnboardingComplete(onboardingDone);

      if (onboardingDone) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    } catch (e: any) {
      const msg =
        e.response?.data?.message || e.message || 'Verification failed. Please check the code.';
      setOtpError(msg);
      setIsLoggingIn(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setOtpError('Please enter a valid 6-digit login code.');
      return;
    }
    await executeOtpVerification(otpCode);
  };

  const handleOtpChange = (val: string) => {
    setOtpCode(val);
    if (val.length === 6) {
      executeOtpVerification(val);
    }
  };

  const handleResendOtp = async () => {
    try {
      await loginMutation.mutateAsync({
        email: emailVal,
        password: passwordVal,
      });
      toast.success('A new login code has been sent to your email.');
    } catch (e: any) {
      toast.error('Failed to resend code. Please try again.');
    }
  };

  const shellTitle = step === 'credentials' ? 'Sign in' : 'Security verification';
  const shellSubtitle =
    step === 'credentials'
      ? 'Enter your email below to sign in'
      : 'Confirm your identity to complete sign in';

  const isMutating = loginMutation.isPending || verifyOtpMutation.isPending || isLoggingIn;

  return (
    <AuthPageShell
      title={shellTitle}
      subtitle={shellSubtitle}
      bottomCtaHref="/auth/signup"
      bottomCtaLabel="Sign up"
    >
      {isMutating && (
        <AuthLoadingModal
          message={
            loginMutation.isPending
              ? 'Sending login code...'
              : isLoggingIn
                ? 'Signing you in...'
                : 'Verifying login code...'
          }
        />
      )}

      {step === 'credentials' ? (
        <LoginCredentialsForm
          onSubmit={handleCredentialsSubmit}
          isSubmitting={loginMutation.isPending}
          rootError={rootError}
        />
      ) : (
        <LoginOtpForm
          email={emailVal}
          otpCode={otpCode}
          onOtpChange={handleOtpChange}
          onSubmit={handleOtpSubmit}
          onResend={handleResendOtp}
          onBack={() => setStep('credentials')}
          verifyingOtp={verifyOtpMutation.isPending || isLoggingIn}
          resendingOtp={loginMutation.isPending}
          otpError={otpError}
        />
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
