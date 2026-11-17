'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Calendar,
  DollarSign,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Plus,
  Plane,
  Building,
  Sparkles,
  MapPin,
  TrendingUp,
  Clock,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { api } from '@/lib/api';
import { TripSummary, AgentMonitoringStats } from '@/types';
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

export default function DashboardPage() {
  const { toast } = useToast();
  const [trips, setTrips] = useState<TripSummary[]>(INITIAL_TRIPS);
  const [stats, setStats] = useState<AgentMonitoringStats | null>({
    totalAgents: 11,
    activeAgents: 11,
    totalTasksExecuted: 842,
    completedTasks: 825,
    failedTasks: 2,
    runningTasks: 0,
    averageExecutionDurationMs: 420,
    totalTokensConsumed: 1240000,
    totalEstimatedCostUsd: 0.32,
    tasksByAgent: {},
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [tripsData, statsData] = await Promise.all([
          api.getTrips(),
          api.getAgentStats(),
        ]);
        if (tripsData && tripsData.length > 0) {
          // Ensure trips with valid images
          const formatted = tripsData.map((t, idx) => ({
            ...t,
            heroImageUrl: t.heroImageUrl?.startsWith('/images/')
              ? t.heroImageUrl
              : idx === 0
              ? '/images/paris.svg'
              : idx === 1
              ? '/images/tokyo.svg'
              : '/images/bali.svg',
          }));
          setTrips(formatted);
        }
        if (statsData) setStats(statsData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    }
    loadData();
  }, []);

  const totalBudget = trips.reduce((acc, t) => acc + (t.budgetLimit || 0), 0);
  const totalCost = trips.reduce((acc, t) => acc + (t.totalEstimatedCost || 0), 0);
  const savings = Math.max(0, totalBudget - totalCost);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner & Header - Luxury Maroon Theme */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-rose-950/20 border border-rose-900/40 transition-colors">
        <div className="space-y-2.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-rose-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>11 Autonomous AI Agents Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Welcome back, Explorer!
          </h1>
          <p className="text-rose-100/80 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
            Where would you like your AI multi-agent crew to take you next? Discover destinations, compare flights and hotels, and orchestrate optimized itineraries.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white text-rose-950 hover:bg-rose-50 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-rose-700" />
            <span>AI Quick Planner</span>
          </Link>
          <Link
            href="/wizard"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-rose-800/60 hover:bg-rose-700/60 border border-rose-400/30 text-white font-bold text-xs sm:text-sm rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Trip Wizard</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-2xl p-5 shadow-2xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-900/60 dark:text-rose-400/60 uppercase tracking-wider">Active Trips</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 flex items-center justify-center shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-950 dark:text-rose-100">
              {trips.length}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +1 this month
            </span>
          </div>
          <p className="mt-1 text-xs text-rose-900/50 dark:text-rose-400/50 font-medium">Across global destinations</p>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-2xl p-5 shadow-2xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-900/60 dark:text-rose-400/60 uppercase tracking-wider">Budget Managed</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-2xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-950 dark:text-rose-100">
              ${totalBudget.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ${savings.toLocaleString()} saved
            </span>
          </div>
          <p className="mt-1 text-xs text-rose-900/50 dark:text-rose-400/50 font-medium">Optimized by Critic Agent</p>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-2xl p-5 shadow-2xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-900/60 dark:text-rose-400/60 uppercase tracking-wider">Confirmed Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100/60 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-950 dark:text-rose-100">4</span>
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300">All synced</span>
          </div>
          <p className="mt-1 text-xs text-rose-900/50 dark:text-rose-400/50 font-medium">Flights, hotels & activities</p>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-2xl p-5 shadow-2xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-900/60 dark:text-rose-400/60 uppercase tracking-wider">Multi-Agent Engine</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 flex items-center justify-center shadow-2xs">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-950 dark:text-rose-100">
              {stats?.activeAgents ?? 11}/11
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              100% Health
            </span>
          </div>
          <p className="mt-1 text-xs text-rose-900/50 dark:text-rose-400/50 font-medium">Gemini 2.5 Flash active</p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/planner"
          className="group p-4 bg-white dark:bg-[#160a0f] hover:border-rose-400 dark:hover:border-rose-700 border border-slate-200 dark:border-[#33151f] rounded-2xl transition-all shadow-2xs hover:shadow-md flex flex-col items-start"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-rose-700 dark:text-rose-400" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-rose-950 dark:text-rose-100">AI Quick Planner</span>
          <span className="text-[11px] text-rose-900/60 dark:text-rose-400/60 mt-0.5">Prompt to 5-day itinerary</span>
        </Link>

        <Link
          href="/destinations"
          className="group p-4 bg-white dark:bg-[#160a0f] hover:border-rose-400 dark:hover:border-rose-700 border border-slate-200 dark:border-[#33151f] rounded-2xl transition-all shadow-2xs hover:shadow-md flex flex-col items-start"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5 text-rose-700 dark:text-rose-400" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-rose-950 dark:text-rose-100">Explore Destinations</span>
          <span className="text-[11px] text-rose-900/60 dark:text-rose-400/60 mt-0.5">8 verified global spots</span>
        </Link>

        <Link
          href="/flights"
          className="group p-4 bg-white dark:bg-[#160a0f] hover:border-rose-400 dark:hover:border-rose-700 border border-slate-200 dark:border-[#33151f] rounded-2xl transition-all shadow-2xs hover:shadow-md flex flex-col items-start"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plane className="w-5 h-5 text-rose-700 dark:text-rose-400" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-rose-950 dark:text-rose-100">Flight Discovery</span>
          <span className="text-[11px] text-rose-900/60 dark:text-rose-400/60 mt-0.5">Compare prices & routes</span>
        </Link>

        <Link
          href="/hotels"
          className="group p-4 bg-white dark:bg-[#160a0f] hover:border-rose-400 dark:hover:border-rose-700 border border-slate-200 dark:border-[#33151f] rounded-2xl transition-all shadow-2xs hover:shadow-md flex flex-col items-start"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Building className="w-5 h-5 text-rose-700 dark:text-rose-400" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-rose-950 dark:text-rose-100">Hotel Search</span>
          <span className="text-[11px] text-rose-900/60 dark:text-rose-400/60 mt-0.5">Stays, villas & boutique</span>
        </Link>
      </div>

      {/* Main Content Split: Upcoming Trips & Agent Live Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Trips List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-rose-950 dark:text-rose-50 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-800 dark:text-rose-400" />
              <span>Your Active & Planned Trips</span>
            </h2>
            <Link
              href="/trips"
              className="text-xs font-bold text-rose-800 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col sm:flex-row group"
              >
                <div className="sm:w-52 h-44 sm:h-auto relative bg-rose-950 dark:bg-[#1c0d13] shrink-0 overflow-hidden">
                  <DestinationArtwork
                    destination={trip.destination}
                    title={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white/95 dark:bg-[#160a0f]/95 text-rose-950 dark:text-rose-200 border border-rose-200/80 dark:border-rose-900/50 backdrop-blur-sm shadow-2xs">
                    {trip.totalDays} Days
                  </span>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black text-base sm:text-lg text-rose-950 dark:text-rose-100 group-hover:text-rose-800 dark:group-hover:text-rose-300 transition-colors">
                        {trip.title}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {trip.status}
                      </span>
                    </div>
                    <p className="text-xs text-rose-900/70 dark:text-rose-400/70 mt-1.5 flex flex-wrap items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400 shrink-0" />
                      <span>{trip.origin} &rarr; {trip.destination}</span>
                      <span className="mx-1">•</span>
                      <Clock className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400 shrink-0" />
                      <span>{trip.startDate} to {trip.endDate}</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#33151f] flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="text-rose-900/60 dark:text-rose-400/60 font-medium">Est. Budget: </span>
                      <span className="font-black text-rose-950 dark:text-rose-100 text-sm">
                        ${trip.totalEstimatedCost?.toLocaleString()}
                      </span>
                      <span className="text-rose-900/40 dark:text-rose-400/40 text-[10px]"> / ${trip.budgetLimit?.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/itinerary/${trip.id}`}
                        className="px-3.5 py-1.5 text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors border border-rose-200/50 dark:border-rose-900/30"
                      >
                        Itinerary
                      </Link>
                      <Link
                        href={`/map/${trip.id}`}
                        className="px-3.5 py-1.5 text-xs font-bold bg-slate-100 dark:bg-[#200d14] text-slate-700 dark:text-slate-300 rounded-lg hover:bg-rose-50 dark:hover:bg-[#33151f] transition-colors"
                      >
                        Map
                      </Link>
                      <Link
                        href={`/budget/${trip.id}`}
                        className="px-3.5 py-1.5 text-xs font-bold bg-slate-100 dark:bg-[#200d14] text-slate-700 dark:text-slate-300 rounded-lg hover:bg-rose-50 dark:hover:bg-[#33151f] transition-colors"
                      >
                        Budget
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Multi-Agent Engine Telemetry & Chat Quick Launch */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-2xl p-5 shadow-2xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs sm:text-sm text-rose-950 dark:text-rose-100 flex items-center gap-2">
                <Bot className="w-4 h-4 text-rose-700 dark:text-rose-400" />
                <span>Multi-Agent Swarm Status</span>
              </h3>
              <Link
                href="/agents/monitoring"
                className="text-xs font-bold text-rose-800 dark:text-rose-400 hover:underline"
              >
                Telemetry &rarr;
              </Link>
            </div>

            <div className="space-y-2">
              {[
                { name: 'Travel Research Agent', status: 'IDLE', speed: '320ms' },
                { name: 'Flight Search Agent', status: 'IDLE', speed: '410ms' },
                { name: 'Hotel Recommender', status: 'IDLE', speed: '380ms' },
                { name: 'Itinerary Planner', status: 'IDLE', speed: '550ms' },
                { name: 'Budget Optimization Agent', status: 'IDLE', speed: '290ms' },
                { name: 'Travel Critic & Validator', status: 'IDLE', speed: '430ms' },
              ].map((agent, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-rose-50/50 dark:bg-[#1e0e14]/60 border border-rose-100/60 dark:border-rose-950/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-semibold text-rose-950 dark:text-rose-200">{agent.name}</span>
                  </div>
                  <span className="text-[11px] text-rose-900/50 dark:text-rose-400/50 font-mono font-medium">{agent.speed}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-[#33151f] flex items-center justify-between text-xs text-rose-900/60 dark:text-rose-400/60 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Critic audit active</span>
              </span>
              <span>Gemini 2.5 Flash</span>
            </div>
          </div>

          {/* Quick Chat Assistant Card */}
          <div className="bg-gradient-to-br from-rose-50/80 to-rose-100/40 dark:from-rose-950/30 dark:to-[#180e12] border border-rose-200/90 dark:border-rose-900/60 rounded-2xl p-5 space-y-3 shadow-2xs transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-950 to-rose-800 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-rose-950 dark:text-rose-100">AI Travel Concierge</h4>
                <p className="text-[11px] text-rose-900/60 dark:text-rose-400/60 font-medium">Ask anything about your destination</p>
              </div>
            </div>
            <p className="text-xs text-rose-950/80 dark:text-rose-200/80 leading-relaxed font-medium">
              &quot;Can you suggest 3 vegetarian dinners near Shibuya crossing under $40?&quot;
            </p>
            <Link
              href="/chat"
              className="block w-full text-center py-2.5 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-800 hover:from-rose-900 hover:to-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-950/20 transition-all active:scale-[0.98]"
            >
              Open AI Chatbot
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
