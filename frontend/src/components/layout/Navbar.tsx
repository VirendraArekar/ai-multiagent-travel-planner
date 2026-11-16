'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Bell, User, LogOut, Settings, 
  Sparkles, Compass, Plane, Hotel, Menu, X, 
  Calendar, Activity, LayoutDashboard
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { logout } from '@/store/authSlice';
import { api } from '@/lib/api';
import { NotificationItem } from '@/types';
import BrandLogo from '@/components/common/BrandLogo';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { useToast } from '@/context/ToastContext';

export default function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.getNotifications().then((list) => {
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.read).length);
    });
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.info('You have been signed out.');
    router.push('/login');
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    toast.success('All notifications marked as read.');
  };

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

  const navLinks = [
    { label: 'Explore', href: '/destinations', icon: Compass },
    { label: 'Flights', href: '/flights', icon: Plane },
    { label: 'Hotels', href: '/hotels', icon: Hotel },
    { label: 'My Trips', href: '/trips', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-100/80 bg-white/90 backdrop-blur-md dark:border-rose-950/80 dark:bg-[#12080b]/90 transition-colors">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {!isPublicPage && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-rose-900 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-950/60 lg:hidden transition-colors"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <BrandLogo size="md" href={isAuthenticated ? '/dashboard' : '/'} />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 lg:gap-4">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-50 text-rose-900 shadow-2xs dark:bg-rose-950/80 dark:text-rose-200'
                    : 'text-rose-900/70 hover:bg-rose-50/60 hover:text-rose-950 dark:text-rose-300/70 dark:hover:bg-rose-950/40 dark:hover:text-rose-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-rose-700 dark:text-rose-400' : 'text-rose-800/50 dark:text-rose-400/50'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/wizard"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-900 to-rose-800 px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm shadow-rose-950/20 hover:from-rose-800 hover:to-rose-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span>AI Wizard</span>
          </Link>
        </nav>

        {/* Right: Theme Toggle, Notifications & User Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Dark / Light Mode Switch */}
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative rounded-xl p-2 text-rose-900 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-950/60 transition-colors"
                  title="Notifications"
                  aria-label="View notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white ring-2 ring-white dark:ring-rose-950">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-rose-100 bg-white p-4 shadow-2xl dark:border-rose-900/60 dark:bg-[#180e12] z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-950">
                      <h4 className="font-bold text-xs sm:text-sm text-rose-950 dark:text-rose-50">Notifications</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs font-semibold text-rose-700 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="mt-2 divide-y divide-rose-50 dark:divide-rose-950/50 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="py-4 text-center text-xs text-rose-800/60 dark:text-rose-400/60">No new notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`py-2.5 text-xs transition-colors ${
                              !n.read ? 'bg-rose-50/70 dark:bg-rose-950/30 px-2 rounded-xl my-1' : ''
                            }`}
                          >
                            <p className="font-bold text-rose-950 dark:text-rose-100">{n.title}</p>
                            <p className="text-rose-900/70 dark:text-rose-300/70 mt-0.5 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <Link
                      href="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="block text-center mt-3 pt-2 text-xs font-bold text-rose-800 hover:text-rose-900 hover:underline dark:text-rose-300"
                    >
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-full border border-rose-200/80 p-1 pr-3 hover:border-rose-300 dark:border-rose-900/60 dark:hover:border-rose-800 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-rose-900 to-rose-700 flex items-center justify-center text-white text-xs font-black uppercase shadow-xs">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <span className="text-xs font-bold text-rose-950 dark:text-rose-200 hidden sm:inline">
                    {user?.firstName || 'Traveler'}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-rose-100 bg-white p-2 shadow-2xl dark:border-rose-900/60 dark:bg-[#180e12] z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2.5 border-b border-rose-100 dark:border-rose-950">
                      <p className="text-xs font-bold text-rose-950 dark:text-rose-100">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[11px] text-rose-800/60 dark:text-rose-400/60 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1 text-xs font-semibold">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-900 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-950/50"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 text-rose-700 dark:text-rose-400" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-900 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-950/50"
                      >
                        <User className="h-3.5 w-3.5 text-rose-700 dark:text-rose-400" />
                        Travel Profile
                      </Link>
                      <Link
                        href="/agents/monitoring"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-900 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-950/50"
                      >
                        <Activity className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                        Agent Monitor
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-900 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-950/50"
                      >
                        <Settings className="h-3.5 w-3.5 text-rose-700 dark:text-rose-400" />
                        System Settings
                      </Link>
                    </div>
                    <div className="border-t border-rose-100 dark:border-rose-950 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 text-xs font-bold"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex text-xs font-bold text-rose-900 hover:text-rose-950 dark:text-rose-200 dark:hover:text-white px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-950/20 hover:from-rose-800 hover:to-rose-700 transition-all active:scale-95"
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}

          {/* Mobile Navigation Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-rose-900 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-950/60 md:hidden transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Slideout */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white/95 px-4 pt-3 pb-6 shadow-xl dark:border-rose-950 dark:bg-[#140a0e]/95 backdrop-blur-md">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200'
                      : 'text-rose-900/80 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/50'
                  }`}
                >
                  <Icon className="h-4 w-4 text-rose-700 dark:text-rose-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/wizard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-900 to-rose-800 text-white shadow-xs mt-2"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>AI Trip Wizard</span>
            </Link>
            {!isAuthenticated && (
              <div className="flex gap-2 pt-3 border-t border-rose-100 dark:border-rose-950 mt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold text-rose-900 rounded-xl border border-rose-200 dark:border-rose-900 dark:text-rose-200"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold text-white bg-rose-900 rounded-xl shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
