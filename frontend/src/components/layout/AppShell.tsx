'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if public auth or landing page
  const isPublic = pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

  if (isPublic) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fdfafb] text-rose-950 dark:bg-[#0d0608] dark:text-rose-100 transition-colors">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfafb] text-rose-950 dark:bg-[#0d0608] dark:text-rose-100 transition-colors">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:pl-64 flex flex-col min-h-[calc(100vh-4rem)]">
          <div className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl mx-auto w-full transition-all">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
