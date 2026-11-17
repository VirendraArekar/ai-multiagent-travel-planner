'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Compass,
  MapPin,
  Clock,
  Plus,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  Sparkles,
  Trash2,
  Share2
} from 'lucide-react';
import { api } from '@/lib/api';
import { TripSummary } from '@/types';
import { useToast } from '@/context/ToastContext';
import DestinationArtwork from '@/components/common/DestinationArtwork';

const INITIAL_TRIPS: TripSummary[] = [
  {
    id: 'trip-paris-1',
    title: 'Romantic Paris Getaway',
    origin: 'New York (JFK)',
    destination: 'Paris, France',
    startDate: '2026-06-10',
    endDate: '2026-06-15',
    totalDays: 5,
    travelType: 'COUPLE',
    status: 'PLANNED',
    heroImageUrl: '/images/paris.svg',
    budgetLimit: 2500,
    currency: 'EUR',
    totalEstimatedCost: 2180,
    totalActivitiesCount: 15,
    shareToken: 'paris-share-2026',
  },
  {
    id: 'trip-tokyo-2',
    title: 'Tokyo Cherry Blossom Expedition',
    origin: 'San Francisco (SFO)',
    destination: 'Tokyo, Japan',
    startDate: '2026-04-02',
    endDate: '2026-04-09',
    totalDays: 7,
    travelType: 'SOLO',
    status: 'PLANNED',
    heroImageUrl: '/images/tokyo.svg',
    budgetLimit: 3200,
    currency: 'USD',
    totalEstimatedCost: 2850,
    totalActivitiesCount: 22,
    shareToken: 'tokyo-share-2026',
  },
  {
    id: 'trip-bali-3',
    title: 'Bali Tropical Wellness Retreat',
    origin: 'London (LHR)',
    destination: 'Bali, Indonesia',
    startDate: '2026-08-14',
    endDate: '2026-08-22',
    totalDays: 8,
    travelType: 'RELAXATION',
    status: 'PLANNED',
    heroImageUrl: '/images/bali.svg',
    budgetLimit: 2800,
    currency: 'USD',
    totalEstimatedCost: 2470,
    totalActivitiesCount: 18,
    shareToken: 'bali-share-2026',
  }
];

export default function TripsPage() {
  const { toast } = useToast();
  const [trips, setTrips] = useState<TripSummary[]>(INITIAL_TRIPS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getTrips();
        setTrips(data);
      } catch (e) {
        console.error('Failed to load trips', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDeleteTrip = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.deleteTrip(id);
      setTrips(trips.filter((t) => t.id !== id));
      toast.info('Trip itinerary removed.');
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = trips.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.origin.toLowerCase().includes(search.toLowerCase());
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && t.status === statusFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
            Trip Management
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Trips & Expeditions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your AI-crafted journeys, review past vacations, and track upcoming travels.
          </p>
        </div>

        <Link
          href="/planner"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-rose-950/20 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-rose-300" /> Plan New Trip
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by destination or title..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-none">
          {['ALL', 'PLANNED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white shadow-md shadow-rose-950/20'
                  : 'bg-slate-100 dark:bg-[#200d14] text-slate-600 dark:text-slate-400 hover:border-rose-300'
              }`}
            >
              {st === 'ALL' ? 'All Trips' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading trips...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-[#160a0f] border border-dashed border-slate-300 dark:border-[#33151f] rounded-3xl p-8">
          <Compass className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No trips found</h3>
          <p className="text-xs text-slate-500">
            Create your first trip with the multi-agent wizard or AI prompt planner.
          </p>
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white rounded-xl text-xs font-bold shadow hover:from-rose-800 hover:to-rose-900 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-rose-300" /> Start Planning
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((trip) => (
            <div
              key={trip.id}
              className="group bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-800/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-100 dark:bg-[#0d0608] overflow-hidden">
                  <DestinationArtwork
                    destination={trip.destination}
                    title={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 dark:bg-[#160a0f]/95 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900/40 backdrop-blur-md">
                    {trip.totalDays} Days
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {trip.status}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-rose-900 dark:group-hover:text-rose-300 transition-colors">
                    {trip.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
                    {trip.origin} &rarr; {trip.destination}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {trip.startDate} - {trip.endDate} • {(trip as any).travelersCount || 2} travelers
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 dark:border-[#33151f] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Cost</span>
                  <span className="text-lg font-black text-rose-950 dark:text-rose-200">
                    ${(trip.totalEstimatedCost ?? (trip as any).estimatedCost ?? 1850).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleDeleteTrip(trip.id, e)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                    title="Delete trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/itinerary/${trip.id}`}
                    className="px-4 py-2 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-950/20 transition flex items-center gap-1 cursor-pointer"
                  >
                    View Plan <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
