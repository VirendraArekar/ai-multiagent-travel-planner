'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Sparkles, Wand2, MessageSquare,
  Compass, Plane, Hotel, Map, Calendar, Wallet,
  BookmarkCheck, Heart, User, ShieldCheck, Activity,
  Sliders, Bell, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navGroups = [
    {
      title: 'AI Travel Engine',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'AI Multi-Agent Planner', href: '/planner', icon: Sparkles, badge: 'AI' },
        { label: 'Planning Wizard', href: '/wizard', icon: Wand2, badge: 'New' },
        { label: 'AI Travel Chat', href: '/chat', icon: MessageSquare },
      ],
    },
    {
      title: 'Discovery & Booking',
      items: [
        { label: 'Destinations', href: '/destinations', icon: Compass },
        { label: 'Flights Comparison', href: '/flights', icon: Plane },
        { label: 'Hotels & Lodging', href: '/hotels', icon: Hotel },
      ],
    },
    {
      title: 'Trip Management',
      items: [
        { label: 'My Trips', href: '/trips', icon: Calendar },
        { label: 'Itinerary Editor', href: '/itinerary/trip-paris-1', icon: Calendar },
        { label: 'Interactive Map', href: '/map/trip-paris-1', icon: Map },
        { label: 'Budget Dashboard', href: '/budget/trip-paris-1', icon: Wallet },
        { label: 'Confirmed Bookings', href: '/bookings', icon: BookmarkCheck },
        { label: 'Saved Destinations', href: '/saved-destinations', icon: Heart },
      ],
    },
    {
      title: 'Intelligence & Ops',
      items: [
        { label: 'Agent Monitoring', href: '/agents/monitoring', icon: Activity, badge: 'Live' },
        { label: 'Admin Console', href: '/admin', icon: ShieldCheck },
        { label: 'Travel Profile', href: '/profile', icon: User },
        { label: 'Notifications', href: '/notifications', icon: Bell },
        { label: 'System Settings', href: '/settings', icon: Sliders },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-rose-950/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-rose-100/90 bg-white/95 dark:border-rose-950/80 dark:bg-[#12080b]/95 backdrop-blur-md transition-transform duration-250 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-3.5 py-5">
          <nav className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h3 className="px-3 text-[10px] font-black tracking-widest text-rose-900/50 dark:text-rose-400/50 uppercase">
                  {group.title}
                </h3>
                <div className="mt-2 space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-rose-950 to-rose-900 text-white shadow-md shadow-rose-950/20'
                            : 'text-rose-950/70 hover:bg-rose-50/70 hover:text-rose-950 dark:text-rose-200/70 dark:hover:bg-rose-950/50 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 transition-colors ${
                            isActive ? 'text-rose-300' : 'text-rose-800/60 dark:text-rose-400/60 group-hover:text-rose-900 dark:group-hover:text-rose-200'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.badge && (
                            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${
                              isActive 
                                ? 'bg-rose-800 text-rose-100'
                                : 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                          {isActive && <ChevronRight className="h-3 w-3 text-rose-300 shrink-0" />}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Card / System Status */}
          <div className="mt-auto pt-6">
            <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-3.5 dark:border-rose-950/60 dark:bg-rose-950/20">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-bold text-rose-950 dark:text-rose-200">11 AI Agents Online</span>
              </div>
              <p className="text-[10px] text-rose-900/60 dark:text-rose-400/60 mt-1">
                Gemini Orchestrator active with zero-latency failover.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
