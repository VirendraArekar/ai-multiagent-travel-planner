'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  href?: string;
}

export default function BrandLogo({
  className = '',
  size = 'md',
  showSubtitle = true,
  href = '/',
}: BrandLogoProps) {
  const iconSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9 sm:h-10 sm:w-10',
    lg: 'h-12 w-12 sm:h-14 sm:w-14',
  };

  const symbolSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };

  const textSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base sm:text-lg font-extrabold',
    lg: 'text-xl sm:text-2xl font-black',
  };

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Maroon & Rose Gradient Crest */}
      <div
        className={`relative flex items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-950 via-rose-900 to-rose-700 p-0.5 shadow-md shadow-rose-950/20 text-white ${iconSizes[size]}`}
      >
        <div className="flex h-full w-full items-center justify-center rounded-[10px] sm:rounded-[14px] bg-gradient-to-br from-rose-900 via-rose-800 to-rose-950">
          <Compass className={`${symbolSizes[size]} text-rose-100 transition-transform hover:rotate-45 duration-500`} />
        </div>
        <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white">
          <Sparkles className="h-2 w-2" />
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <span className={`tracking-tight text-rose-950 dark:text-rose-50 ${textSizes[size]}`}>
          Antigravity<span className="text-rose-700 dark:text-rose-400">Travel</span>
        </span>
        {showSubtitle && (
          <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-rose-900/60 dark:text-rose-400/70">
            AI Multi-Agent Planner
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
