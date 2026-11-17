'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { api } from '@/lib/api';
import { Destination } from '@/types';
import { useToast } from '@/context/ToastContext';
import DestinationArtwork from '@/components/common/DestinationArtwork';

const INITIAL_SAVED: Destination[] = [
  {
    id: 'dest-paris',
    name: 'Paris',
    country: 'France',
    city: 'Paris',
    heroImageUrl: '/images/paris.svg',
    averageDailyBudgetUsd: 180,
    currency: 'EUR',
    bestTimeToVisit: 'April - October',
    safetyRating: 'VERY_SAFE',
    popular: true,
    featured: true,
    description: 'Iconic world capital of art, gastronomy, and historic architectural majesty.',
    tags: ['culture', 'romantic', 'art', 'france'],
    safetyScore: 94
  },
  {
    id: 'dest-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    city: 'Tokyo',
    heroImageUrl: '/images/tokyo.svg',
    averageDailyBudgetUsd: 150,
    currency: 'JPY',
    bestTimeToVisit: 'March - May & Sept - Nov',
    safetyRating: 'VERY_SAFE',
    popular: true,
    featured: true,
    description: 'Ultramodern neon skyscrapers juxtaposed with historic temples and Michelin dining.',
    tags: ['modern', 'tech', 'culture', 'japan'],
    safetyScore: 98
  },
  {
    id: 'dest-bali',
    name: 'Bali',
    country: 'Indonesia',
    city: 'Denpasar',
    heroImageUrl: '/images/bali.svg',
    averageDailyBudgetUsd: 70,
    currency: 'IDR',
    bestTimeToVisit: 'May - September',
    safetyRating: 'SAFE',
    popular: true,
    featured: true,
    description: 'Tropical paradise of tiered emerald rice paddies, spiritual sea temples, and surf beaches.',
    tags: ['beach', 'wellness', 'nature', 'indonesia'],
    safetyScore: 91
  }
];

export default function SavedDestinationsPage() {
  const { toast } = useToast();
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_SAVED);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['dest-paris', 'dest-tokyo', 'dest-bali']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const all = await api.getDestinations();
        setDestinations(all);
        const saved = localStorage.getItem('fav_destinations');
        if (saved) {
          setFavoriteIds(JSON.parse(saved));
        } else {
          setFavoriteIds(['dest-paris', 'dest-tokyo', 'dest-bali']);
        }
      } catch (e) {
        console.error('Failed to load saved destinations', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const removeFavorite = (id: string, name: string) => {
    const updated = favoriteIds.filter((f) => f !== id);
    setFavoriteIds(updated);
    localStorage.setItem('fav_destinations', JSON.stringify(updated));
    toast.info(`Removed ${name} from your saved wishlist.`);
  };

  const savedList = destinations.filter((d) => favoriteIds.includes(d.id));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold mb-2">
          <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
          Wishlist & Saved Places
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Saved Destinations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your bookmarked cities and territories waiting to be explored with AI multi-agent orchestration.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading saved places...</div>
      ) : savedList.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-[#160a0f] border border-dashed border-slate-300 dark:border-[#33151f] rounded-3xl p-8">
          <Heart className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No saved destinations yet</h3>
          <p className="text-xs text-slate-500">
            Browse our global catalog and tap the heart icon to save places for your next trip.
          </p>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white rounded-xl text-xs font-bold shadow hover:from-rose-800 hover:to-rose-900 cursor-pointer"
          >
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-800/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full bg-slate-100 dark:bg-[#0d0608] overflow-hidden">
                  <DestinationArtwork
                    destination={dest.name}
                    title={dest.description}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeFavorite(dest.id, dest.name)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-[#160a0f]/90 text-rose-600 hover:scale-110 transition shadow cursor-pointer"
                    title="Remove from saved"
                  >
                    <Heart className="w-4 h-4 fill-rose-600" />
                  </button>
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-[#160a0f]/95 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900/40 backdrop-blur-md">
                    {dest.country}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-rose-900 dark:group-hover:text-rose-300 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {dest.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 dark:border-[#33151f] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Avg. Daily Budget</span>
                  <span className="text-base font-black text-rose-950 dark:text-rose-200">
                    ${dest.averageDailyCostUsd} / day
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/destinations/${dest.id}`}
                    className="px-4 py-2 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-950/20 transition flex items-center gap-1 cursor-pointer"
                  >
                    Details <ArrowRight className="w-3.5 h-3.5" />
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
