'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowLeft,
  Utensils,
  Sun,
  Globe,
  Info,
  Heart
} from 'lucide-react';
import { api } from '@/lib/api';
import { Destination } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { toast } = useToast();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const d = await api.getDestinationById(resolvedParams.id);
        setDestination(d);
        const saved = localStorage.getItem('fav_destinations');
        if (saved) {
          const list: string[] = JSON.parse(saved);
          setIsSaved(list.includes(resolvedParams.id));
        }
      } catch (e) {
        console.error('Failed to load destination', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedParams.id]);

  const toggleWishlist = () => {
    if (!destination) return;
    const saved = localStorage.getItem('fav_destinations');
    let list: string[] = saved ? JSON.parse(saved) : [];
    if (isSaved) {
      list = list.filter((id) => id !== destination.id);
      setIsSaved(false);
      toast.info(`Removed ${destination.name} from your saved destinations.`);
    } else {
      list.push(destination.id);
      setIsSaved(true);
      toast.success(`Saved ${destination.name} to your travel wishlist!`);
    }
    localStorage.setItem('fav_destinations', JSON.stringify(list));
  };

  if (loading) {
    return <div className="py-24 text-center text-slate-400">Loading destination details...</div>;
  }

  if (!destination) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Destination Not Found</h2>
        <Link href="/destinations" className="text-rose-800 dark:text-rose-300 font-semibold hover:underline">
          &larr; Back to all destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-xs font-semibold text-rose-800 dark:text-rose-300 hover:text-rose-950 dark:hover:text-rose-100 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Destinations
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[360px] flex items-end p-6 md:p-10 shadow-xl bg-gradient-to-t from-slate-950 via-slate-900 to-rose-950">
        <Image
          src={destination.heroImageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'}
          alt={destination.name}
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="relative z-10 space-y-2 max-w-2xl text-white">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white border border-rose-700/50 backdrop-blur-md">
              {destination.country}
            </span>
            <button
              type="button"
              onClick={toggleWishlist}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black">{destination.name}</h1>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            {destination.description}
          </p>
        </div>
      </div>

      {/* Main Info Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Key Facts */}
          <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-rose-800 dark:text-rose-400" />
              Travel Intelligence Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0d0608] border border-slate-100 dark:border-[#33151f]">
                <span className="text-slate-400 block mb-1">Best Travel Season</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {destination.bestTimeToVisit || 'May to October'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0d0608] border border-slate-100 dark:border-[#33151f]">
                <span className="text-slate-400 block mb-1">Daily Budget</span>
                <span className="font-bold text-rose-950 dark:text-rose-200">
                  ${destination.averageDailyCostUsd} / day
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0d0608] border border-slate-100 dark:border-[#33151f]">
                <span className="text-slate-400 block mb-1">Local Currency</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {destination.currency || 'EUR'}
                </span>
              </div>
            </div>
          </div>

          {/* Safety & Advisory */}
          <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Safety & Health Advisory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              • <strong>Advisory Rating:</strong> Low Risk. Standard city caution recommended.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              • <strong>Emergency Numbers:</strong> Police 112 (EU), Medical 15.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              • <strong>Visa & Documentation:</strong> Verified valid for up to 90 days stay for Schengen visa holders.
            </p>
          </div>
        </div>

        {/* Action Sidebar */}
        <div>
          <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-lg space-y-4 sticky top-24">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Ready to explore {destination.name}?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Launch our 11-agent orchestration engine to build a custom day-by-day itinerary with real flight options.
            </p>
            <Link
              href={`/wizard?destination=${encodeURIComponent(destination.name)}`}
              className="w-full py-3.5 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-rose-950/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-rose-300" /> Plan Trip with AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
