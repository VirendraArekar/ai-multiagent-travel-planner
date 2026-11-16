'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAppDispatch } from '@/store/store';
import { setCredentials } from '@/store/authSlice';
import { api } from '@/lib/api';
import BrandLogo from '@/components/common/BrandLogo';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const resp = await api.register({
        email,
        password,
        firstName,
        lastName,
      });

      dispatch(setCredentials({
        user: {
          id: resp.userId,
          email: resp.email,
          firstName: resp.firstName,
          lastName: resp.lastName,
          role: resp.role,
        },
        accessToken: resp.accessToken,
        refreshToken: resp.refreshToken,
      }));
      toast.success('Registration successful! Welcome to Antigravity Travel.');
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8 sm:py-14">
      <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-6 sm:p-8 shadow-xl shadow-rose-950/5 dark:border-rose-950/80 dark:bg-[#160a0f] transition-all">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <BrandLogo size="lg" showSubtitle={false} href="/" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-rose-950 dark:text-rose-50">Create your account</h2>
          <p className="mt-1.5 text-xs text-rose-900/60 dark:text-rose-400/60 font-medium">
            Start engineering intelligent multi-agent travel plans
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-200 dark:border-rose-900">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-rose-950 dark:text-rose-200 mb-1">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-rose-800/40 dark:text-rose-400/40" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Elena"
                  className="w-full rounded-xl border border-rose-100 bg-rose-50/30 pl-9 pr-3 py-2 text-xs font-semibold text-rose-950 focus:border-rose-700 focus:bg-white focus:outline-hidden dark:border-rose-950 dark:bg-[#1a0c12] dark:text-rose-100 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-950 dark:text-rose-200 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Rostova"
                className="w-full rounded-xl border border-rose-100 bg-rose-50/30 px-3 py-2 text-xs font-semibold text-rose-950 focus:border-rose-700 focus:bg-white focus:outline-hidden dark:border-rose-950 dark:bg-[#1a0c12] dark:text-rose-100 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-950 dark:text-rose-200 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-rose-800/40 dark:text-rose-400/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@example.com"
                className="w-full rounded-xl border border-rose-100 bg-rose-50/30 pl-9 pr-3 py-2 text-xs font-semibold text-rose-950 focus:border-rose-700 focus:bg-white focus:outline-hidden dark:border-rose-950 dark:bg-[#1a0c12] dark:text-rose-100 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-950 dark:text-rose-200 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-rose-800/40 dark:text-rose-400/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-rose-100 bg-rose-50/30 pl-9 pr-3 py-2 text-xs font-semibold text-rose-950 focus:border-rose-700 focus:bg-white focus:outline-hidden dark:border-rose-950 dark:bg-[#1a0c12] dark:text-rose-100 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-950 dark:text-rose-200 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-rose-800/40 dark:text-rose-400/40" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-rose-100 bg-rose-50/30 pl-9 pr-3 py-2 text-xs font-semibold text-rose-950 focus:border-rose-700 focus:bg-white focus:outline-hidden dark:border-rose-950 dark:bg-[#1a0c12] dark:text-rose-100 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-800 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-950/20 hover:from-rose-900 hover:to-rose-700 transition-all disabled:opacity-60 mt-5 active:scale-[0.98] cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creating account...
              </span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-rose-900/60 dark:text-rose-400/60">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-rose-800 hover:underline dark:text-rose-400">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
