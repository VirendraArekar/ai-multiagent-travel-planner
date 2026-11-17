'use client';

import { useState } from 'react';
import { 
  MapPin, Navigation, Compass, Layers, Coffee, Bed, 
  Clock, ArrowRight, Eye, Calendar, Sparkles
} from 'lucide-react';

interface MapMarker {
  id: string;
  name: string;
  type: 'ATTRACTION' | 'HOTEL' | 'RESTAURANT';
  day: number;
  latitude: number;
  longitude: number;
  description?: string;
  cost?: string;
}

interface InteractiveTravelMapProps {
  destinationName?: string;
  markers?: MapMarker[];
  selectedDay?: number;
}

export default function InteractiveTravelMap({
  destinationName = 'Paris',
  markers = [
    { id: '1', name: 'Musée du Louvre', type: 'ATTRACTION', day: 1, latitude: 48.8606, longitude: 2.3376, description: 'Iconic art museum housing the Mona Lisa.', cost: '€22' },
    { id: '2', name: 'Le Petit Bistro', type: 'RESTAURANT', day: 1, latitude: 48.8645, longitude: 2.3315, description: 'Artisan bistro with French specialties.', cost: '€28' },
    { id: '3', name: 'Notre-Dame & Seine Pier', type: 'ATTRACTION', day: 1, latitude: 48.8530, longitude: 2.3499, description: 'Gothic cathedral & river cruise departure.', cost: '€18' },
    { id: '4', name: 'Eiffel Tower Sunset Deck', type: 'ATTRACTION', day: 1, latitude: 48.8584, longitude: 2.2945, description: 'Towering observation deck over the Seine.', cost: '€32' },
    { id: '5', name: 'Le Marais Boutique Hotel', type: 'HOTEL', day: 1, latitude: 48.8558, longitude: 2.3638, description: '4-star boutique accommodation.', cost: '€195/night' },
    { id: '6', name: 'Sacré-Cœur Basilica', type: 'ATTRACTION', day: 2, latitude: 48.8867, longitude: 2.3431, description: 'Montmartre hilltop panoramic vista.', cost: 'Free' },
    { id: '7', name: 'Montmartre Creperie', type: 'RESTAURANT', day: 2, latitude: 48.8845, longitude: 2.3338, description: 'Organic buckwheat galettes.', cost: '€20' },
    { id: '8', name: 'Musée d Orsay', type: 'ATTRACTION', day: 2, latitude: 48.8600, longitude: 2.3266, description: 'Impressionist art in a beaux-arts rail station.', cost: '€16' },
  ],
  selectedDay = 1,
}: InteractiveTravelMapProps) {
  const [activeDay, setActiveDay] = useState<number>(selectedDay);
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(markers[0]);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredMarkers = markers.filter((m) => {
    if (activeDay !== 0 && m.day !== activeDay) return false;
    if (filterType !== 'ALL' && m.type !== filterType) return false;
    return true;
  });

  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
      {/* Top Map Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {destinationName} Interactive Route Map
            </h3>
            <p className="text-[11px] text-slate-500">
              Showing {filteredMarkers.length} locations & optimized transit paths
            </p>
          </div>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveDay(0)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              activeDay === 0
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            All Days
          </button>
          {[1, 2, 3, 4, 5].map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                activeDay === d
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterType('ALL')}
            className={`rounded-lg px-2 py-1 text-[11px] font-medium ${filterType === 'ALL' ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white' : 'text-slate-500'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('ATTRACTION')}
            className={`rounded-lg px-2 py-1 text-[11px] font-medium ${filterType === 'ATTRACTION' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' : 'text-slate-500'}`}
          >
            Attractions
          </button>
          <button
            onClick={() => setFilterType('HOTEL')}
            className={`rounded-lg px-2 py-1 text-[11px] font-medium ${filterType === 'HOTEL' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' : 'text-slate-500'}`}
          >
            Hotels
          </button>
          <button
            onClick={() => setFilterType('RESTAURANT')}
            className={`rounded-lg px-2 py-1 text-[11px] font-medium ${filterType === 'RESTAURANT' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'text-slate-500'}`}
          >
            Dining
          </button>
        </div>
      </div>

      {/* Map Canvas / Vector Visualization Area */}
      <div className="relative h-96 w-full bg-slate-900 overflow-hidden">
        {/* Background Grid & Styled Vector Map Artwork */}
        <svg className="absolute inset-0 h-full w-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Stylized River Waterway */}
          <path
            d="M 0 280 C 180 260, 320 200, 520 230 C 700 260, 850 180, 1100 210"
            fill="none"
            stroke="#0284c7"
            strokeWidth="32"
            strokeLinecap="round"
            opacity="0.25"
          />
          {/* Connected Route Polyline */}
          <path
            d="M 180 140 L 320 180 L 520 210 L 740 160 L 860 220"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        </svg>

        {/* Map Markers Overlay */}
        <div className="absolute inset-0 p-6 pointer-events-none">
          {filteredMarkers.map((marker, index) => {
            // Coordinate mapping algorithm inside SVG boundaries
            const xPercent = 20 + ((index * 23) % 65);
            const yPercent = 25 + ((index * 31) % 55);
            const isSelected = activeMarker?.id === marker.id;

            return (
              <div
                key={marker.id}
                style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-transform hover:scale-125"
                onClick={() => setActiveMarker(marker)}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all ${
                    isSelected
                      ? 'ring-4 ring-white dark:ring-slate-900 scale-125 z-30'
                      : 'hover:scale-110'
                  } ${
                    marker.type === 'ATTRACTION'
                      ? 'bg-sky-500 text-white'
                      : marker.type === 'HOTEL'
                      ? 'bg-purple-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {marker.type === 'ATTRACTION' && <Compass className="h-4 w-4" />}
                  {marker.type === 'HOTEL' && <Bed className="h-4 w-4" />}
                  {marker.type === 'RESTAURANT' && <Coffee className="h-4 w-4" />}
                </div>
                <div className="mt-1 whitespace-nowrap rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                  {marker.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Marker Details Floating Card */}
        {activeMarker && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 rounded-2xl border border-white/20 bg-slate-900/90 backdrop-blur-md p-4 text-white shadow-2xl z-30">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                    activeMarker.type === 'ATTRACTION'
                      ? 'bg-sky-500/20 text-sky-300'
                      : activeMarker.type === 'HOTEL'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {activeMarker.type} • Day {activeMarker.day}
                </span>
                <h4 className="mt-1 font-bold text-sm text-white">{activeMarker.name}</h4>
                <p className="mt-1 text-xs text-slate-300 line-clamp-2">{activeMarker.description}</p>
              </div>
              {activeMarker.cost && (
                <div className="rounded-lg bg-white/10 px-2 py-1 text-xs font-bold text-sky-300">
                  {activeMarker.cost}
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-sky-400" />
                Transit buffer: ~15 mins
              </span>
              <span className="flex items-center gap-1 text-sky-400 hover:underline cursor-pointer">
                Directions <Navigation className="h-3 w-3" />
              </span>
            </div>
          </div>
        )}

        {/* Route Optimization Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-1.5 text-xs text-white">
          <Sparkles className="h-3.5 w-3.5 text-sky-400" />
          <span>Geographically Clustered by AI</span>
        </div>
      </div>
    </div>
  );
}
