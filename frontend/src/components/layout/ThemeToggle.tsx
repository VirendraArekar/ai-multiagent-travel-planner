'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200/80 bg-rose-50/50 p-2 text-rose-900 shadow-2xs hover:bg-rose-100 hover:text-rose-950 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-900/50 dark:hover:text-rose-100 transition-colors ${className}`}
      title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label="Toggle Dark/Light Mode"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 transition-transform rotate-0 hover:rotate-90 duration-300 text-amber-300" />
      ) : (
        <Moon className="h-4 w-4 transition-transform -rotate-12 hover:rotate-0 duration-300 text-rose-900" />
      )}
    </button>
  );
}
