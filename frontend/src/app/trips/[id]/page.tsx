'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Compass,
  MapPin,
  Clock,
  DollarSign,
  Users,
  ShieldCheck,
  Map,
  PieChart,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Ticket
} from 'lucide-react';
import { api } from '@/lib/api';
import { Trip } from '@/types';

export default function TripOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getTripById(id);
        setTrip(data);
      } catch (e) {
        console.error('Failed to load trip', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="py-24 text-center text-slate-400">Loading trip overview...</div>;
  }

  if (!trip) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trip Not Found</h2>
        <Link href="/trips" className="text-rose-800 dark:text-rose-300 font-semibold hover:underline">
          &larr; Back to all trips
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 text-xs font-semibold text-rose-800 dark:text-rose-300 hover:text-rose-950 dark:hover:text-rose-100 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Trips
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[320px] flex items-end p-6 md:p-10 shadow-xl bg-gradient-to-t from-slate-950 via-slate-900 to-rose-950">
        <Image
          src={trip.heroImageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'}
          alt={trip.destination}
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="relative z-10 space-y-2 max-w-2xl text-white">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white border border-rose-700/50 backdrop-blur-md">
            {trip.totalDays} Days Expedition
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">{trip.title}</h1>
          <p className="text-xs md:text-sm text-slate-200 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-400" />
            {trip.origin} &rarr; {trip.destination} ({trip.startDate} - {trip.endDate})
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href={`/itinerary/${trip.id}`}
          className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] hover:border-rose-800/40 p-5 rounded-3xl shadow-sm hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-900 dark:group-hover:text-rose-300">
              Day-by-Day Itinerary
            </h3>
            <p className="text-xs text-slate-400">Timelines, stops, & tickets</p>
          </div>
        </Link>

        <Link
          href={`/map/${trip.id}`}
          className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] hover:border-rose-800/40 p-5 rounded-3xl shadow-sm hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-900 dark:group-hover:text-rose-300">
              Interactive Route Map
            </h3>
            <p className="text-xs text-slate-400">Geospatial waypoint pins</p>
          </div>
        </Link>

        <Link
          href={`/budget/${trip.id}`}
          className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] hover:border-rose-800/40 p-5 rounded-3xl shadow-sm hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-900 dark:group-hover:text-rose-300">
              Budget & Expenses
            </h3>
            <p className="text-xs text-slate-400">Allocation & spend graphs</p>
          </div>
        </Link>

        <Link
          href="/bookings"
          className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] hover:border-rose-800/40 p-5 rounded-3xl shadow-sm hover:shadow-md transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-900 dark:group-hover:text-rose-300">
              Confirmed Bookings
            </h3>
            <p className="text-xs text-slate-400">Flight PNRs & vouchers</p>
          </div>
        </Link>
      </div>

      {/* Summary info card */}
      <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Trip Specifications
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Travelers</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {(trip as any).travelersCount ?? (trip.adultsCount + (trip.childrenCount || 0))} Guests
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Pacing Style</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {trip.pace || 'Moderate'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Estimated Budget</span>
            <span className="font-bold text-rose-950 dark:text-rose-200 text-sm">
              ${((trip as any).estimatedCost ?? trip.budgetLimit ?? 2400).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Validation Critic Score</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {(trip as any).criticScore || 9.4} / 10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
