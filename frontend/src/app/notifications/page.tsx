'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  Plane,
  ShieldAlert,
  Calendar,
  Check
} from 'lucide-react';
import { api } from '@/lib/api';
import { NotificationItem } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterUnread, setFilterUnread] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getNotifications();
        setNotifications(data);
      } catch (e) {
        console.error('Failed to load notifications', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n))
      );
      toast.info('Notification marked as read.');
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true, read: true })));
    toast.success('All notifications marked as read.');
  };

  const filtered = notifications.filter((n) => (filterUnread ? !(n.isRead ?? n.read) : true));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
            Alerts
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notifications & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time updates from your multi-agent travel concierge and booking monitors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterUnread(!filterUnread)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              filterUnread
                ? 'bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white border-rose-800 shadow-sm'
                : 'border-slate-300 dark:border-[#33151f] text-slate-600 dark:text-slate-400 hover:border-rose-300'
            }`}
          >
            {filterUnread ? 'Showing Unread' : 'Filter Unread'}
          </button>
          <button
            type="button"
            onClick={markAllRead}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-rose-50 dark:bg-[#200d14] dark:hover:bg-[#33151f] text-slate-700 dark:text-slate-300 transition cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading notifications...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center space-y-2 bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-8">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">You&apos;re all caught up!</h3>
          <p className="text-xs text-slate-500">No new alerts or itinerary updates right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
                !(item.isRead ?? item.read)
                  ? 'bg-rose-50/40 dark:bg-[#200d14]/60 border-rose-200 dark:border-rose-900/50 shadow-xs'
                  : 'bg-white dark:bg-[#160a0f] border-slate-200 dark:border-[#33151f]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-950 to-rose-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    {(item as any).timestamp || item.createdAt || 'Today'}
                  </span>
                </div>
              </div>

              {!(item.isRead ?? item.read) && (
                <button
                  type="button"
                  onClick={() => markRead(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-800 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
