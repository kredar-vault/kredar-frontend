'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
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
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="bg-white border border-[#d8e1da] rounded-2xl shadow-sm p-10 w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 bg-[#f0faf5] rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} className="text-[#0f8b4b]" />
          </div>
          <h1 className="text-xl font-bold text-[#081b10]">Admin Portal</h1>
          <p className="text-sm text-[#45504b]">Sign in to the Kredar admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#45504b] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#d8e1da] rounded-lg px-3 py-2.5 text-sm text-[#081b10] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/30 focus:border-[#0f8b4b]"
              placeholder="admin@kredar.xyz"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#45504b] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#d8e1da] rounded-lg px-3 py-2.5 text-sm text-[#081b10] focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/30 focus:border-[#0f8b4b]"
              placeholder="••••••••"
            />
          </div>

          {needsMfa && (
            <div>
              <label className="block text-xs font-semibold text-[#45504b] mb-1.5">
                Authenticator Code
              </label>
              <input
                type="text"
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                required
                maxLength={6}
                className="w-full border border-[#d8e1da] rounded-lg px-3 py-2.5 text-sm text-[#081b10] tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#0f8b4b]/30 focus:border-[#0f8b4b]"
                placeholder="000000"
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f8b4b] hover:bg-[#0c703c] disabled:opacity-60 text-white font-semibold text-sm rounded-lg py-2.5 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
