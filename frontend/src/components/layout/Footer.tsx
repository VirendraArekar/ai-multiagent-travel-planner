'use client';

import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';

export default function Footer() {
  return (
    <footer className="border-t border-rose-100 bg-white/80 dark:border-rose-950/80 dark:bg-[#0f0709]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showSubtitle={false} href="/" />
            <span className="text-[11px] text-rose-900/50 dark:text-rose-400/50">© 2026 Enterprise Edition</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-rose-900/70 dark:text-rose-300/70">
            <Link href="/destinations" className="hover:text-rose-950 dark:hover:text-rose-100 transition-colors">
              Destinations
            </Link>
            <Link href="/flights" className="hover:text-rose-950 dark:hover:text-rose-100 transition-colors">
              Flights
            </Link>
            <Link href="/hotels" className="hover:text-rose-950 dark:hover:text-rose-100 transition-colors">
              Hotels
            </Link>
            <Link href="/agents/monitoring" className="hover:text-rose-950 dark:hover:text-rose-100 transition-colors">
              AI Multi-Agents
            </Link>
            <Link href="/settings" className="hover:text-rose-950 dark:hover:text-rose-100 transition-colors">
              API Docs & Tools
            </Link>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-rose-900/60 dark:text-rose-400/60">
            <span>Powered by 11 Specialized AI Agents</span>
            <Sparkles className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
          </div>
        </div>
      </div>
    </footer>
  );
}
