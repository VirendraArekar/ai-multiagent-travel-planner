'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building,
  Search,
  MapPin,
  Star,
  DollarSign,
  Wifi,
  Coffee,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Compass,
  ArrowRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { Hotel } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function HotelsPage() {
  const { toast } = useToast();
  const [city, setCity] = useState('Paris');
  const [tier, setTier] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([
    {
      id: 'hot-1',
      name: 'Le Grand Quartier Boutique Hotel',
      destinationId: 'dest-paris',
      city: 'Paris',
      address: '15 Rue de Nancy, 75010 Paris',
      starRating: 4,
      reviewScore: 9.1,
      reviewsCount: 1420,
      pricePerNight: 210,
      currency: 'EUR',
      tier: 'BOUTIQUE',
      amenities: ['Free WiFi', 'Rooftop Bar', 'Fitness Center', 'Coffee Shop', 'Garden'],
      heroImageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      cancellationPolicy: 'Free cancellation until 48 hours before check-in',
      distanceToCenterKm: 1.8,
      bookingUrl: 'https://booking.com',
    },
    {
      id: 'hot-2',
      name: 'Hôtel Plaza Athénée Luxury Palace',
      destinationId: 'dest-paris',
      city: 'Paris',
      address: '25 Avenue Montaigne, 75008 Paris',
      starRating: 5,
      reviewScore: 9.7,
      reviewsCount: 2890,
      pricePerNight: 850,
      currency: 'EUR',
      tier: 'LUXURY',
      amenities: ['Michelin Dining', 'Dior Spa', 'Free WiFi', 'Chauffeured Limousine', 'Balcony Eiffel Views'],
      heroImageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      cancellationPolicy: 'Non-refundable special rate',
      distanceToCenterKm: 0.9,
      bookingUrl: 'https://booking.com',
    },
    {
      id: 'hot-3',
      name: 'Generator Paris Design Hostel & Rooms',
      destinationId: 'dest-paris',
      city: 'Paris',
      address: '9-11 Place du Colonel Fabien, 75010 Paris',
      starRating: 3,
      reviewScore: 8.4,
      reviewsCount: 4210,
      pricePerNight: 75,
      currency: 'EUR',
      tier: 'BUDGET',
      amenities: ['Free WiFi', 'Rooftop Terrace', 'Bar & Cafe', 'Bicycle Rental'],
      heroImageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      cancellationPolicy: 'Free cancellation until 24 hours before check-in',
      distanceToCenterKm: 2.5,
      bookingUrl: 'https://booking.com',
    },
  ]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await api.searchHotels({ destination: city, tier: tier === 'ALL' ? undefined : tier });
      if (results && results.length > 0) {
        setHotels(results);
        toast.success(`Found ${results.length} accommodations in ${city}!`);
      } else {
        toast.info(`Showing curated accommodations for ${city}`);
      }
    } catch (err) {
      console.error('Hotel search failed', err);
      toast.error('Could not fetch external rates. Showing local properties.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (hotel: Hotel) => {
    toast.success(`Redirecting to verified reservation partner for ${hotel.name}!`);
  };

  const filtered = hotels.filter((h) => (tier === 'ALL' ? true : h.tier === tier));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold mb-2">
          <Building className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
          Hotel Recommendation Agent
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Discover Accommodations & Boutique Stays
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Our Hotel Recommendation Agent filters verified reviews, distance to landmarks, and amenities with real-time room availability.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1">
          <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
            Destination City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Paris, Tokyo, Bali"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
          />
        </div>

        <div className="sm:w-56">
          <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
            Tier
          </label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
          >
            <option value="ALL">All Tiers</option>
            <option value="BUDGET">Budget</option>
            <option value="BOUTIQUE">Boutique</option>
            <option value="LUXURY">5-Star Luxury</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-950/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" /> {loading ? 'Searching...' : 'Find Stays'}
          </button>
        </div>
      </form>

      {/* Hotel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((hotel) => (
          <div
            key={hotel.id}
            className="group bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-800/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-52 w-full bg-slate-100 dark:bg-[#0d0608]">
                <Image
                  src={hotel.heroImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-[#160a0f]/95 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900/40 backdrop-blur-md">
                  {hotel.tier}
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg text-xs font-bold bg-gradient-to-r from-rose-900 to-rose-700 text-white shadow">
                  ★ {hotel.reviewScore} / 10
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-rose-900 dark:group-hover:text-rose-300 transition-colors">
                  {hotel.name}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
                  {hotel.address} ({hotel.distanceToCenterKm}km to center)
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
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
                    : ['Free WiFi', 'Breakfast', 'Air Conditioning']
                  ).slice(0, 3).map((am: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-[10px] font-semibold text-rose-900 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/30"
                    >
                      {am}
                    </span>
                  ))}
                </div>

                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ {hotel.cancellationPolicy}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 dark:border-[#33151f] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Starting from</span>
                <span className="text-xl font-black text-rose-950 dark:text-rose-200">
                  ${hotel.pricePerNight}
                </span>
                <span className="text-[10px] text-slate-400"> / night</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/hotels/${hotel.id}`}
                  className="px-3 py-2 bg-slate-100 hover:bg-rose-50 dark:bg-[#200d14] dark:hover:bg-[#33151f] text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50"
                >
                  Details
                </Link>
                <a
                  href={hotel.bookingUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleBookClick(hotel)}
                  className="px-4 py-2 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-950/20 transition flex items-center gap-1"
                >
                  Book <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
