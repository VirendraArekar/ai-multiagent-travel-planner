'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Compass,
  ArrowLeft,
  Navigation,
  Layers,
  Sparkles,
  Clock,
  DollarSign
} from 'lucide-react';
import InteractiveTravelMap from '@/components/map/InteractiveTravelMap';
import { api } from '@/lib/api';
import { Itinerary, ItineraryActivity } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function TripMapPage({ params }: { params: Promise<{ tripId: string }> }) {
  const resolvedParams = use(params);
  const { tripId } = resolvedParams;
  const { toast } = useToast();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | 'ALL'>('ALL');
  const [selectedActivity, setSelectedActivity] = useState<ItineraryActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getItinerary(tripId);
        setItinerary(data);
      } catch (e) {
        console.error('Failed to load map data', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tripId]);

  // Aggregate all activities or filter by day
  const allActivities: ItineraryActivity[] =
    itinerary?.days?.flatMap((d) => (selectedDay === 'ALL' || d.dayNumber === selectedDay ? d.activities : [])) || [];

  // Generate map markers
  const markers = allActivities.map((act, i) => {
    const baseLat = 48.8566;
    const baseLng = 2.3522;
    const lat = act.latitude || baseLat + ((i * 7) % 5 - 2) * 0.015;
    const lng = act.longitude || baseLng + ((i * 11) % 5 - 2) * 0.02;
    const cat = act.category?.toUpperCase() || 'ATTRACTION';
    const type: 'ATTRACTION' | 'HOTEL' | 'RESTAURANT' =
      cat.includes('HOTEL') ? 'HOTEL' : cat.includes('DINING') || cat.includes('RESTAURANT') ? 'RESTAURANT' : 'ATTRACTION';

    return {
      id: act.id,
      name: act.title,
      type,
      day: 1,
      latitude: lat,
      longitude: lng,
      description: act.description,
      cost: act.estimatedCost ? `$${act.estimatedCost}` : 'Free',
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href={`/itinerary/${tripId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 dark:text-rose-300 hover:text-rose-950 dark:hover:text-rose-100 mb-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-rose-800 dark:text-rose-400" />
            Interactive Route & Geospatial Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Waypoints sequenced by Transportation Agent to minimize transit latency and optimize walking loops.
          </p>
        </div>

        {/* Day Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setSelectedDay('ALL');
              toast.info('Viewing full trip route across all days.');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedDay === 'ALL'
                ? 'bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white shadow-md shadow-rose-950/20'
                : 'bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] text-slate-600 dark:text-slate-400 hover:border-rose-300'
            }`}
          >
            All Days
          </button>
          {itinerary?.days?.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setSelectedDay(d.dayNumber);
                toast.info(`Filtered map to Day ${d.dayNumber} waypoint sequence.`);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedDay === d.dayNumber
                  ? 'bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white shadow-md shadow-rose-950/20'
                  : 'bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] text-slate-600 dark:text-slate-400 hover:border-rose-300'
              }`}
            >
              Day {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3 h-[520px] sm:h-[600px] rounded-3xl overflow-hidden border border-slate-200 dark:border-[#33151f] shadow-sm relative">
          <InteractiveTravelMap
            destinationName="Paris"
            markers={markers}
          />
        </div>

        {/* Waypoints List Sidebar */}
        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm space-y-4 max-h-[600px] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-rose-800 dark:text-rose-400" />
              Route Sequence ({markers.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {allActivities.map((act, i) => (
              <div
                key={act.id}
                onClick={() => {
                  setSelectedActivity(act);
                  toast.info(`Selected: ${act.title}`);
                }}
                className={`p-3 rounded-2xl border transition cursor-pointer ${
                  selectedActivity?.id === act.id
                    ? 'border-rose-800 bg-rose-50/50 dark:bg-rose-950/30 dark:border-rose-700'
                    : 'border-slate-100 dark:border-[#33151f] hover:border-rose-200 dark:hover:border-rose-900/40 bg-slate-50/50 dark:bg-[#0d0608]/40'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {act.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {act.startTime} • {act.category}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
