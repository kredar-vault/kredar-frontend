'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

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
    <div className="min-h-screen flex bg-[#f7faf6]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-[#0a1f16] p-12 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0f8b4b] rounded-lg flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Kredar Admin</span>
        </div>

        <div className="space-y-6">
          <div className="w-12 h-1 bg-[#0f8b4b] rounded-full" />
          <h2 className="text-white text-3xl font-bold leading-snug">
            Platform control,
            <br />
            at your fingertips.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Manage tenants, review KYB applications, reconcile transactions and monitor webhook
            deliveries — all in one place.
          </p>
        </div>

        <p className="text-white/25 text-xs">© 2026 Kredar. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-[#0f8b4b] rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <span className="font-bold text-[#081b10] text-lg">Kredar Admin</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#081b10]">Sign in</h1>
            <p className="text-sm text-[#45504b] mt-1">Access the Kredar admin portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <label className="block text-xs font-semibold text-[#45504b] mb-1.5">Password</label>
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
      </div>
    </div>
  );
}
