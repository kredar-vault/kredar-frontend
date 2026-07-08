'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import KredarLogo from '@/components/KredarLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [needsMfa, setNeedsMfa] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.login(email, password, needsMfa ? totp : undefined);
      localStorage.setItem('kredar_admin_token', res.token);
      router.replace('/admin/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (msg.toLowerCase().includes('mfa')) {
        setNeedsMfa(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] relative flex items-center justify-center lg:block">
      {/* Mobile background */}
      <div className="absolute inset-0 z-0 lg:hidden">
        <img
          src="/images/Left.png"
          alt="Kredar Background"
          className="h-full w-full object-cover filter brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-[#0a2e1f]/20 mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 p-5">
        {/* Desktop left panel */}
        <div className="relative hidden lg:block overflow-hidden rounded-md">
          <img
            src="/images/Left.png"
            alt="Kredar"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Right panel */}
        <div className="flex items-center justify-center w-full px-4 sm:px-8 py-10">
          <div className="flex min-h-[560px] w-full max-w-[420px] flex-col rounded-lg bg-white lg:bg-white/70 border border-white/5 px-6 sm:px-10 py-8 lg:border-none">
            {/* Logo + Admin badge */}
            <div className="flex items-center gap-3 mb-8">
              <KredarLogo />
              <span className="text-xs font-semibold text-[#45504b] bg-[#eaf3ed] px-2 py-0.5 rounded-full tracking-wide">
                Admin
              </span>
            </div>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-[2.25rem] font-semibold text-slate-900 leading-tight">Sign in</h1>
              <p className="mt-2 text-sm text-slate-500">Access the Kredar admin portal</p>
            </div>

            {/* Form */}
            <div className="mt-8 flex flex-1 flex-col">
              <form onSubmit={handleSubmit} className="space-y-5 flex-1">
                <div>
                  <label className="block text-xs font-semibold text-[#45504b] mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-[#d8e1da] bg-white rounded-xl px-4 py-3 text-sm text-[#081b10] placeholder:text-[#9ca3a8] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] transition-colors"
                    placeholder="admin@kredar.xyz"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#45504b] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full border border-[#d8e1da] bg-white rounded-xl px-4 py-3 pr-11 text-sm text-[#081b10] placeholder:text-[#9ca3a8] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#45504b] hover:text-[#081b10] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {needsMfa && (
                  <div>
                    <label className="block text-xs font-semibold text-[#45504b] mb-1.5">
                      Authenticator code
                    </label>
                    <input
                      type="text"
                      value={totp}
                      onChange={(e) => setTotp(e.target.value)}
                      required
                      maxLength={6}
                      className="w-full border border-[#d8e1da] bg-white rounded-xl px-4 py-3 text-sm text-[#081b10] tracking-[0.4em] text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/20 focus:border-[#0f8b4b] transition-colors"
                      placeholder="000000"
                    />
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl px-4 py-3">
                    <span className="mt-0.5">⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0f8b4b] hover:bg-[#0c703c] disabled:opacity-60 text-white font-semibold text-sm rounded-xl py-3 transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-[#d8e1da]">
              <p className="text-center text-xs text-[#8c9c94]">
                © 2026 Kredar. Restricted access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
