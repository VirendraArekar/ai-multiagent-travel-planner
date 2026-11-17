'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  Heart,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { api } from '@/lib/api';
import { Destination } from '@/types';
import { useToast } from '@/context/ToastContext';
import DestinationArtwork from '@/components/common/DestinationArtwork';

const INITIAL_DESTINATIONS: Destination[] = [
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
  },
  {
    id: 'dest-rome',
    name: 'Rome',
    country: 'Italy',
    city: 'Rome',
    heroImageUrl: '/images/paris.svg',
    averageDailyBudgetUsd: 160,
    currency: 'EUR',
    bestTimeToVisit: 'April - June',
    safetyRating: 'VERY_SAFE',
    popular: true,
    featured: true,
    description: 'The Eternal City with gladiatorial amphitheaters, Renaissance wonders, and vibrant piazzas.',
    tags: ['history', 'architecture', 'italy'],
    safetyScore: 92
  },
  {
    id: 'dest-dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    city: 'Dubai',
    heroImageUrl: '/images/tokyo.svg',
    averageDailyBudgetUsd: 210,
    currency: 'AED',
    bestTimeToVisit: 'November - March',
    safetyRating: 'VERY_SAFE',
    popular: true,
    featured: true,
    description: 'Futuristic architectural records, golden sand dunes, luxury shopping, and marina promenades.',
    tags: ['luxury', 'shopping', 'uae'],
    safetyScore: 96
  },
  {
    id: 'dest-goa',
    name: 'Goa',
    country: 'India',
    city: 'Panaji',
    heroImageUrl: '/images/bali.svg',
    averageDailyBudgetUsd: 60,
    currency: 'INR',
    bestTimeToVisit: 'November - February',
    safetyRating: 'SAFE',
    popular: true,
    featured: true,
    description: 'Sun-drenched coastal haven with Portuguese heritage churches and bohemian beach shacks.',
    tags: ['beach', 'party', 'india'],
    safetyScore: 89
  }
];

export default function DestinationsPage() {
  const { toast } = useToast();
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (e) {
        console.error('Failed to load destinations', e);
      } finally {
        setLoading(false);
      }
    }
    load();
    const saved = localStorage.getItem('fav_destinations');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: string, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const exists = favorites.includes(id);
    const updated = exists
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('fav_destinations', JSON.stringify(updated));
    if (exists) {
      toast.info(`Removed ${name} from saved destinations`);
    } else {
      toast.success(`Saved ${name} to your travel wishlist!`);
    }
  };

  const filtered = destinations.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase());
    if (selectedTag === 'ALL') return matchesSearch;
    return matchesSearch && (d.tags?.includes(selectedTag.toLowerCase()) || d.country.toLowerCase().includes(selectedTag.toLowerCase()));
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 text-xs font-bold mb-2 border border-rose-200/80 dark:border-rose-900/60 shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
            <span>Curated Global Destinations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-rose-950 dark:text-rose-50 tracking-tight">
            Discover Your Next Destination
          </h1>
          <p className="text-xs sm:text-sm text-rose-900/60 dark:text-rose-400/60 mt-1 max-w-xl font-medium">
            Explore world-class destinations vetted by our Travel Safety, Weather, and Research Agents.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-rose-800/40 dark:text-rose-400/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city, country or vibe..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-rose-100 bg-white dark:border-rose-950 dark:bg-[#1a0c12] text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100 placeholder-rose-900/30 focus:outline-none focus:border-rose-700 shadow-2xs transition-colors"
          />
        </div>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-rose-700/60 dark:text-rose-400/60 shrink-0 mr-1" />
        {[
          { id: 'ALL', label: 'All Destinations' },
          { id: 'FRANCE', label: 'France' },
          { id: 'JAPAN', label: 'Japan' },
          { id: 'INDONESIA', label: 'Indonesia' },
          { id: 'ITALY', label: 'Italy' },
          { id: 'INDIA', label: 'India' },
          { id: 'UAE', label: 'UAE' },
          { id: 'BEACH', label: 'Beach & Coastal' },
        ].map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => setSelectedTag(tag.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedTag === tag.id
                ? 'bg-gradient-to-r from-rose-950 to-rose-800 text-white shadow-xs'
                : 'bg-white dark:bg-[#160a0f] border border-rose-100 dark:border-rose-950/80 text-rose-900/70 dark:text-rose-300/70 hover:bg-rose-50/50'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-rose-900/50 dark:text-rose-400/50 font-medium">Loading destinations...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-rose-900/50 dark:text-rose-400/50 font-medium">
          No destinations matched your search query. Try another keyword.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filtered.map((dest) => {
            const isFav = favorites.includes(dest.id);
            return (
              <div
                key={dest.id}
                className="group bg-white dark:bg-[#160a0f] border border-rose-100/90 dark:border-rose-950/80 rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-800 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-rose-50 dark:bg-[#1a0c12] overflow-hidden">
                    <DestinationArtwork
                      destination={dest.name}
                      title={dest.description}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(dest.id, dest.name, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-[#160a0f]/80 backdrop-blur-md flex items-center justify-center text-rose-950 dark:text-rose-200 hover:text-rose-600 transition shadow cursor-pointer"
                      title={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
                    </button>
                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-white backdrop-blur-md">
                      {dest.country}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-base sm:text-lg text-rose-950 dark:text-rose-100 group-hover:text-rose-700 dark:group-hover:text-rose-400 transition">
                        {dest.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{dest.safetyScore ? `${dest.safetyScore}/100` : 'Safe'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-rose-900/60 dark:text-rose-400/60 line-clamp-2 leading-relaxed font-medium">
                      {dest.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-rose-900/50 dark:text-rose-400/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
                        <span>{dest.bestTimeToVisit || 'Spring & Autumn'}</span>
                      </span>
                      <span className="font-bold text-rose-950 dark:text-rose-200">
                        ~${dest.averageDailyCostUsd || 150}/day
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0 flex items-center gap-2">
                  <Link
                    href={`/destinations/${dest.id}`}
                    className="flex-1 text-center py-2 bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-950 dark:text-rose-200 text-xs font-bold rounded-xl transition border border-rose-100 dark:border-rose-900/60"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/planner?destination=${encodeURIComponent(dest.name)}`}
                    className="flex-1 text-center py-2 bg-gradient-to-r from-rose-950 to-rose-800 hover:from-rose-900 hover:to-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 shadow-md shadow-rose-950/20"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Plan Trip</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
