'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import { clearAuthCookies, setToken, setCurrentUser, setOnboardingComplete } from '@/lib/cookies';

type TokenState = 'checking' | 'valid' | 'used' | 'missing';

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [tokenState, setTokenState] = useState<TokenState>(token ? 'checking' : 'missing');
  const [step, setStep] = useState<'landing' | 'password'>('landing');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) return;
    api
      .get(`/team/invite/validate?token=${token}`)
      .then((res) => {
        const valid = res.data?.data?.valid ?? false;
        setTokenState(valid ? 'valid' : 'used');
      })
      .catch(() => setTokenState('used'));
  }, [token]);

  // ── Checking token ────────────────────────────────────────────────────────
  if (tokenState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7faf6]">
        <Loader2 className="w-8 h-8 text-[#0f8b4b] animate-spin" />
      </div>
    );
  }

  // ── Missing token ─────────────────────────────────────────────────────────
  if (tokenState === 'missing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7faf6] px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#d8e1da] p-10 w-full max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-xl font-bold text-[#081b10] mb-2">Invalid link</h1>
          <p className="text-sm text-[#45504b]">
            No invite token found. Ask your admin to resend the invite.
          </p>
        </div>
      </div>
    );
  }

  // ── Already used ──────────────────────────────────────────────────────────
  if (tokenState === 'used') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7faf6] px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#d8e1da] p-10 w-full max-w-md text-center">
          <CheckCircle2 className="w-16 h-16 text-[#0f8b4b] mx-auto mb-6" />
          <h1 className="text-xl font-bold text-[#081b10] mb-2">Already accepted</h1>
          <p className="text-sm text-[#45504b] mb-8 leading-relaxed">
            This invitation has already been used. Sign in to access your dashboard.
          </p>
          <button
            onClick={() => router.replace('/auth/login')}
            className="w-full bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-sm font-semibold py-3.5 rounded-xl transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ── Success redirect ──────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7faf6] px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#d8e1da] p-10 w-full max-w-md text-center">
          <CheckCircle2 className="w-16 h-16 text-[#0f8b4b] mx-auto mb-6" />
          <h1 className="text-xl font-bold text-[#081b10] mb-2">You&apos;re in!</h1>
          <p className="text-sm text-[#45504b]">Taking you to the dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Landing ───────────────────────────────────────────────────────────────
  if (step === 'landing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7faf6] px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#d8e1da] p-10 w-full max-w-md text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef9f2] mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#0f8b4b]" />
          </div>
          <h1 className="text-xl font-bold text-[#081b10] mb-2">You&apos;ve been invited</h1>
          <p className="text-sm text-[#45504b] mb-8 leading-relaxed">
            You have been invited to join a team on Kredar. Accept the invitation to set up your
            account and access the dashboard.
          </p>
          <button
            onClick={() => setStep('password')}
            className="w-full bg-[#0f8b4b] hover:bg-[#0c703c] text-white text-sm font-semibold py-3.5 rounded-xl transition-colors"
          >
            Accept Invitation
          </button>
        </div>
      </div>
    );
  }

  // ── Password setup ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/team/accept', { token, password, confirmPassword });
      const auth = res.data?.data ?? res.data;

      clearAuthCookies();
      setToken(auth.token);
      setCurrentUser({ email: auth.email });
      setOnboardingComplete(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;

      setDone(true);
      setTimeout(() => router.replace('/dashboard'), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7faf6] px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[#d8e1da] p-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef9f2] mb-4">
            <CheckCircle2 className="w-7 h-7 text-[#0f8b4b]" />
          </div>
          <h1 className="text-xl font-bold text-[#081b10]">Set your password</h1>
          <p className="mt-1 text-sm text-[#45504b]">
            Create a password to access the Kredar dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#081b10]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-xl border border-[#d8e1da] bg-[#f7faf6] px-4 py-3 pr-11 text-sm text-[#081b10] outline-none focus:border-[#0f8b4b] focus:ring-2 focus:ring-[#0f8b4b]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#081b10]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#081b10]">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-[#d8e1da] bg-[#f7faf6] px-4 py-3 pr-11 text-sm text-[#081b10] outline-none focus:border-[#0f8b4b] focus:ring-2 focus:ring-[#0f8b4b]/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#081b10]"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f8b4b] hover:bg-[#0c703c] disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Setting up…' : 'Set password & go to dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#0f8b4b] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}
