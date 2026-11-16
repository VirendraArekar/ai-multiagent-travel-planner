import type { Metadata } from 'next';
import './globals.css';
import StoreProvider from '@/store/StoreProvider';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Antigravity Travel Planner | Multi-Agent AI Travel SaaS',
  description: 'Production-ready AI Multi-Agent Travel Planner collaborating across specialized agents for destination research, flight comparison, hotel discovery, and day-by-day itineraries.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full antialiased text-rose-950 bg-[#fdfafb] dark:bg-[#0d0608] dark:text-rose-100 selection:bg-rose-900 selection:text-white">
        <StoreProvider>
          <ThemeProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
            </ToastProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
