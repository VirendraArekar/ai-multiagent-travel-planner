'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Compass, MapPin, Calendar, Users, ArrowRight, 
  ShieldCheck, Plane, Hotel, Wallet, CheckCircle2, Star, 
  MessageSquare, Wand2, Activity
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function LandingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [travelers, setTravelers] = useState('2');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const dest = destination || 'Paris';
    toast.success(`Launching AI Multi-Agent Planner for ${dest}...`);
    router.push(`/wizard?dest=${encodeURIComponent(dest)}&travelers=${travelers}`);
  };

  const featured = [
    { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', rating: 4.9, cost: '€180/day', tag: 'Romantic & Culture' },
    { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80', rating: 4.9, cost: '$150/day', tag: 'Neon & Heritage' },
    { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', rating: 4.8, cost: '$70/day', tag: 'Tropical Sanctuary' },
    { name: 'Swiss Alps', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80', rating: 4.9, cost: '$240/day', tag: 'Mountain Majesty' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-rose-50/30 dark:from-[#160a0e] dark:via-[#0e0608] dark:to-[#160a0e] pt-12 pb-20 lg:pt-24 lg:pb-32 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/90 bg-rose-50/80 px-4 py-1.5 text-xs font-bold text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-200 shadow-2xs mb-6">
              <Sparkles className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 animate-spin" />
              <span>Enterprise Multi-Agent AI Travel Architecture</span>
            </div>

            {/* Responsive Main Heading with Maroon Variation Gradient */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-rose-950 dark:text-rose-50 leading-[1.15]">
              Plan Personalized Trips with{' '}
              <span className="bg-gradient-to-r from-rose-900 via-rose-700 to-rose-900 dark:from-rose-400 dark:via-rose-200 dark:to-rose-400 bg-clip-text text-transparent">
                Multi-Agent AI
              </span>
            </h1>

            <p className="mt-5 text-sm sm:text-base lg:text-lg text-rose-900/70 dark:text-rose-300/80 leading-relaxed font-medium max-w-2xl mx-auto">
              11 specialized AI agents collaborate in real-time to discover destinations, compare verified flights and hotels, optimize budgets, and engineer day-by-day itineraries.
            </p>

            {/* Quick Trip Search Bar */}
            <form
              onSubmit={handleQuickSearch}
              className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl border border-rose-200/90 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 shadow-xl shadow-rose-950/5 dark:border-rose-900/60 dark:bg-[#180e12]/95 max-w-3xl mx-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2.5 px-3 py-2 border-b sm:border-b-0 sm:border-r border-rose-100 dark:border-rose-950">
                  <MapPin className="h-5 w-5 text-rose-700 dark:text-rose-400 shrink-0" />
                  <div className="text-left w-full">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-800/60 dark:text-rose-400/60">Destination</label>
                    <input
                      type="text"
                      placeholder="e.g. Paris, Tokyo, Bali"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full text-xs font-bold text-rose-950 dark:text-rose-100 bg-transparent focus:outline-hidden placeholder:text-rose-900/30"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-3 py-2 border-b sm:border-b-0 sm:border-r border-rose-100 dark:border-rose-950">
                  <Calendar className="h-5 w-5 text-rose-700 dark:text-rose-400 shrink-0" />
                  <div className="text-left w-full">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-800/60 dark:text-rose-400/60">Departure</label>
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full text-xs font-bold text-rose-950 dark:text-rose-100 bg-transparent focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 px-3 py-1">
                  <div className="flex items-center gap-2.5 text-left">
                    <Users className="h-5 w-5 text-rose-700 dark:text-rose-400 shrink-0" />
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-800/60 dark:text-rose-400/60">Travelers</label>
                      <select
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        className="text-xs font-bold text-rose-950 dark:text-rose-100 bg-transparent focus:outline-hidden cursor-pointer"
                      >
                        <option value="1" className="text-rose-950 dark:bg-rose-950">1 Solo</option>
                        <option value="2" className="text-rose-950 dark:bg-rose-950">2 Couple</option>
                        <option value="3" className="text-rose-950 dark:bg-rose-950">3-4 Family</option>
                        <option value="5" className="text-rose-950 dark:bg-rose-950">5+ Group</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-950 to-rose-800 text-white hover:from-rose-900 hover:to-rose-700 shadow-md shadow-rose-950/25 shrink-0 transition-all active:scale-95 cursor-pointer"
                    title="Plan Trip Now"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Assurances */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-medium text-rose-900/70 dark:text-rose-400/80">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Real-time provider pricing</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Zero hallucinated schedules</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Travel Critic feasibility check</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-14 sm:py-20 bg-white dark:bg-[#140a0e] border-y border-rose-100/90 dark:border-rose-950/80 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-rose-800 dark:text-rose-400">Curated Explorer</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-rose-950 dark:text-rose-50 mt-1">
                Featured Global Destinations
              </h2>
            </div>
            <Link
              href="/destinations"
              className="text-xs sm:text-sm font-bold text-rose-800 dark:text-rose-400 hover:underline mt-2 sm:mt-0 flex items-center gap-1.5"
            >
              <span>Explore all destinations</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {featured.map((dest) => (
              <div
                key={dest.name}
                className="group relative rounded-3xl overflow-hidden border border-rose-100 bg-white shadow-xs hover:shadow-xl transition-all duration-300 dark:border-rose-950/80 dark:bg-[#180e12] flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-rose-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold text-white">
                    {dest.tag}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2 py-0.5 text-xs font-bold text-rose-950">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {dest.rating}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-base text-rose-950 dark:text-rose-100">{dest.name}</h3>
                    <p className="text-xs text-rose-900/60 dark:text-rose-400/60 font-medium">{dest.country}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-rose-100 dark:border-rose-950">
                    <span className="text-xs font-bold text-rose-900/80 dark:text-rose-300/80">
                      Avg. {dest.cost}
                    </span>
                    <Link
                      href={`/wizard?dest=${encodeURIComponent(dest.name)}`}
                      className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-900 hover:bg-rose-900 hover:text-white transition-colors dark:bg-rose-950/80 dark:text-rose-200 dark:hover:bg-rose-900"
                    >
                      Plan Trip
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11 Agents Showcase */}
      <section className="py-16 sm:py-24 bg-[#fdfafb] dark:bg-[#0d0608] transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-rose-800 dark:text-rose-400">Multi-Agent Intelligence</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-rose-950 dark:text-rose-50 mt-1">
              Meet Your 11 Specialized AI Agents
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-rose-900/70 dark:text-rose-400/70 leading-relaxed font-medium">
              Each autonomous agent possesses specialized prompts, tool integrations, and verification routines for comprehensive trip architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {[
              { name: 'Orchestrator Agent', role: 'Central Coordinator', icon: Activity, desc: 'Controls state-machine workflow, handles agent failover, and synthesizes final plans.' },
              { name: 'Travel Research Agent', role: 'Destination Specialist', icon: Compass, desc: 'Discovers verified cultural landmarks, hidden gems, and local customs.' },
              { name: 'Flight Search Agent', role: 'Aviation Specialist', icon: Plane, desc: 'Compares real airlines, direct routes, layovers, and baggage allowances.' },
              { name: 'Hotel Recommendation Agent', role: 'Hospitality Specialist', icon: Hotel, desc: 'Curates verified accommodations matching rating, tier, and proximity.' },
              { name: 'Weather Agent', role: 'Meteorologist', icon: Sparkles, desc: 'Forecasts meteorological conditions and prepares rain-proof indoor alternates.' },
              { name: 'Transportation Agent', role: 'Transit & Route Specialist', icon: ArrowRight, desc: 'Optimizes airport transfers, metro passes, and walking itineraries.' },
              { name: 'Food & Restaurant Agent', role: 'Culinary Specialist', icon: Star, desc: 'Finds iconic regional dishes and vegetarian/vegan dining near sights.' },
              { name: 'Travel Safety Agent', role: 'Advisory Specialist', icon: ShieldCheck, desc: 'Authoritative visa rules, emergency numbers, and tourist scam precautions.' },
              { name: 'Itinerary Planning Agent', role: 'Schedule Architect', icon: Calendar, desc: 'Synthesizes morning, afternoon, and evening slots with geographic clusters.' },
              { name: 'Budget Management Agent', role: 'Financial Analyst', icon: Wallet, desc: 'Granular line-item calculations, multi-currency conversion, and 15% savings.' },
              { name: 'Travel Critic Agent', role: 'Feasibility Auditor', icon: ShieldCheck, desc: 'Audits draft plans for transit fatigue, timing conflicts, and scores feasibility.' },
              { name: 'Booking Assistant Agent', role: 'Reservation Specialist', icon: CheckCircle2, desc: 'Prepares verified booking deep-links and reservation reference trackers.' },
            ].map((agent) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.name}
                  className="rounded-2xl border border-rose-100/90 bg-white p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all hover:border-rose-300 dark:border-rose-950/80 dark:bg-[#160a0f] dark:hover:border-rose-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-300 mb-3.5 shadow-2xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm text-rose-950 dark:text-rose-100">{agent.name}</h3>
                  <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400">{agent.role}</span>
                  <p className="text-xs text-rose-900/60 dark:text-rose-400/60 mt-2 leading-relaxed">{agent.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/agents/monitoring"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-800 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-950/20 hover:from-rose-900 hover:to-rose-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Open Agent Monitoring Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
