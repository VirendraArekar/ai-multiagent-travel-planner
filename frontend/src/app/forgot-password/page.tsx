'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { api } from '@/lib/api';
import BrandLogo from '@/components/common/BrandLogo';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      toast.success('Password recovery instructions dispatched!');
    } catch (e) {
      toast.info('If registered, reset instructions have been dispatched.');
    }
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-[#33151f] bg-white dark:bg-[#160a0f] p-8 shadow-xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <BrandLogo size="lg" className="mb-4" />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reset password</h2>
          <p className="mt-1 text-xs text-rose-900/70 dark:text-rose-200/70">
            Enter your email to receive a password recovery link
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center dark:border-rose-900/50 dark:bg-rose-950/30">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-rose-900 to-rose-700 text-white mb-2 shadow-xs">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-sm text-rose-950 dark:text-rose-100">Reset instructions sent</h4>
            <p className="mt-1 text-xs text-rose-800 dark:text-rose-300">
              If an account is associated with <strong>{email}</strong>, you will receive password reset instructions.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-xs font-bold text-rose-800 dark:text-rose-300 hover:underline"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-rose-900/80 dark:text-rose-200/80 mb-1">
                Your Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@travelplanner.ai"
                  className="w-full rounded-xl border border-slate-300 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 py-3 text-xs font-bold text-white shadow-md shadow-rose-950/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              {loading ? 'Sending...' : 'Send Recovery Instructions'}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 dark:text-rose-300 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
