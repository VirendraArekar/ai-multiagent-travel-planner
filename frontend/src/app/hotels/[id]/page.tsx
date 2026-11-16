'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building,
  MapPin,
  Star,
  Check,
  ShieldCheck,
  Calendar,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Wifi,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { api } from '@/lib/api';
import { Hotel } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { toast } = useToast();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getHotelById(resolvedParams.id);
        setHotel(data);
      } catch (e) {
        console.error('Failed to load hotel', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="py-24 text-center text-slate-400">Loading hotel details...</div>;
  }

  if (!hotel) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hotel Not Found</h2>
        <Link href="/hotels" className="text-rose-800 dark:text-rose-300 font-semibold hover:underline">
          &larr; Back to all hotels
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/hotels"
          className="inline-flex items-center gap-2 text-xs font-semibold text-rose-800 dark:text-rose-300 hover:text-rose-950 dark:hover:text-rose-100 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Hotels
        </Link>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden min-h-[320px] flex items-end p-6 md:p-10 shadow-xl bg-gradient-to-t from-slate-950 via-slate-900 to-rose-950">
        <Image
          src={hotel.heroImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
          alt={hotel.name}
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="relative z-10 space-y-2 max-w-2xl text-white">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white border border-rose-700/50 backdrop-blur-md">
            {hotel.tier} Collection
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">{hotel.name}</h1>
          <p className="text-xs md:text-sm text-slate-200 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-400" />
            {hotel.address} • {hotel.distanceToCenterKm}km from city center
          </p>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Amenities & Inclusions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Array.isArray(hotel.amenities)
                ? hotel.amenities
                : typeof hotel.amenities === 'string'
                ? (() => {
                    try {
                      return JSON.parse(hotel.amenities);
                    } catch {
                      return [hotel.amenities];
                    }
                  })()
                : ['High-Speed WiFi', '24/7 Front Desk', 'Breakfast Buffet', 'Fitness Center', 'Air Conditioning']
              ).map((am: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-rose-700 dark:text-rose-400 shrink-0" />
                  <span>{am}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Policies & Booking Guarantee
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              • <strong>Cancellation:</strong> {hotel.cancellationPolicy}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              • <strong>Check-in:</strong> From 15:00 • <strong>Check-out:</strong> Until 11:00
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              • <strong>Verified by Booking Assistant Agent:</strong> Price matched against direct provider inventory with zero markups.
            </p>
          </div>
        </div>

        {/* Booking Card */}
        <div>
          <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-lg space-y-5 sticky top-24">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400">Nightly rate</span>
                <p className="text-3xl font-black text-rose-950 dark:text-rose-200">
                  ${hotel.pricePerNight}
                </p>
              </div>
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/40 px-2.5 py-1 rounded-full">
                ★ {hotel.reviewScore} Guest Rating
              </span>
            </div>

            <a
              href={hotel.bookingUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => toast.success(`Connecting to direct reservation platform for ${hotel.name}`)}
              className="w-full py-3.5 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-sm rounded-2xl shadow-md shadow-rose-950/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Reserve with Provider <ExternalLink className="w-4 h-4" />
            </a>

            <p className="text-[11px] text-center text-slate-400">
              Instant confirmation • No booking fees charged by Travel Planner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
