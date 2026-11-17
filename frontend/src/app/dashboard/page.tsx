'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

export default function DashboardPage() {
  const { toast } = useToast();
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [stats, setStats] = useState<AgentMonitoringStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [tripsData, statsData] = await Promise.all([
          api.getTrips(),
          api.getAgentStats(),
        ]);
        setTrips(tripsData);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
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
        <div className="bg-white dark:bg-[#160a0f] border border-rose-100/90 dark:border-rose-950/80 rounded-2xl p-5 shadow-2xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-900/60 dark:text-rose-400/60 uppercase tracking-wider">Active Trips</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 flex items-center justify-center shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-950 dark:text-rose-100">
              {loading ? '...' : trips.length}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +1 this month
            </span>
          </div>
          <p className="mt-1 text-xs text-rose-900/50 dark:text-rose-400/50 font-medium">Across global destinations</p>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-rose-100/90 dark:border-rose-950/80 rounded-2xl p-5 shadow-2xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-900/60 dark:text-rose-400/60 uppercase tracking-wider">Budget Managed</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-2xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-950 dark:text-rose-100">
              ${loading ? '...' : totalBudget.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ${savings.toLocaleString()} saved
            </span>
          </div>
          <p className="mt-1 text-xs text-rose-900/50 dark:text-rose-400/50 font-medium">Optimized by Critic Agent</p>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-rose-100/90 dark:border-rose-950/80 rounded-2xl p-5 shadow-2xs transition-colors">
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

        <div className="bg-white dark:bg-[#160a0f] border border-rose-100/90 dark:border-rose-950/80 rounded-2xl p-5 shadow-2xs transition-colors">
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
          className="group p-4 bg-white dark:bg-[#160a0f] hover:border-rose-400 dark:hover:border-rose-700 border border-rose-100/90 dark:border-rose-950/80 rounded-2xl transition-all shadow-2xs hover:shadow-md flex flex-col items-start"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-rose-700 dark:text-rose-400" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-rose-950 dark:text-rose-100">AI Quick Planner</span>
          <span className="text-[11px] text-rose-900/60 dark:text-rose-400/60 mt-0.5">Prompt to 5-day itinerary</span>
        </Link>

        <Link
          href="/destinations"
          className="group p-4 bg-white dark:bg-[#160a0f] hover:border-rose-400 dark:hover:border-rose-700 border border-rose-100/90 dark:border-rose-950/80 rounded-2xl transition-all shadow-2xs hover:shadow-md flex flex-col items-start"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5 text-rose-700 dark:text-rose-400" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-rose-950 dark:text-rose-100">Explore Destinations</span>
          <span className="text-[11px] text-rose-900/60 dark:text-rose-400/60 mt-0.5">8 verified global spots</span>
        </Link>

        <Link
          href="/flights"
          className="group p-4 bg-white dark:bg-[#160a0f] hover:border-rose-400 dark:hover:border-rose-700 border border-rose-100/90 dark:border-rose-950/80 rounded-2xl transition-all shadow-2xs hover:shadow-md flex flex-col items-start"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plane className="w-5 h-5 text-rose-700 dark:text-rose-400" />
          </div>
          <span className="font-bold text-xs sm:text-sm text-rose-950 dark:text-rose-100">Flight Discovery</span>
          <span className="text-[11px] text-rose-900/60 dark:text-rose-400/60 mt-0.5">Compare prices & routes</span>
        </Link>

        <Link
          href="/hotels"
          className="group p-4 bg-white dark:bg-[#160a0f] hover:border-rose-400 dark:hover:border-rose-700 border border-rose-100/90 dark:border-rose-950/80 rounded-2xl transition-all shadow-2xs hover:shadow-md flex flex-col items-start"
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
            {loading ? (
              <div className="p-12 text-center text-rose-900/50 dark:text-rose-400/50 font-medium">Loading trips...</div>
            ) : trips.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#160a0f] border border-dashed border-rose-200 dark:border-rose-900 rounded-3xl p-6">
                <Compass className="w-12 h-12 text-rose-800/40 dark:text-rose-400/40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-rose-950 dark:text-rose-100">No trips planned yet</h3>
                <p className="text-xs sm:text-sm text-rose-900/60 dark:text-rose-400/60 max-w-sm mx-auto mt-1 mb-4">
                  Let our 11 AI agents craft your dream itinerary in under 60 seconds.
                </p>
                <Link
                  href="/planner"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-950 to-rose-800 text-white rounded-xl text-xs font-bold shadow hover:from-rose-900 hover:to-rose-700"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Start Planning</span>
                </Link>
              </div>
            ) : (
              trips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white dark:bg-[#160a0f] border border-rose-100/90 dark:border-rose-950/80 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col sm:flex-row"
                >
                  <div className="sm:w-48 h-36 sm:h-auto relative bg-rose-50 dark:bg-[#1c0d13] shrink-0">
                    {trip.heroImageUrl ? (
                      <Image
                        src={trip.heroImageUrl}
                        alt={trip.destination}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 192px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-rose-900/40 dark:text-rose-400/40">
                        <MapPin className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white/90 dark:bg-[#160a0f]/90 text-rose-950 dark:text-rose-200 backdrop-blur-sm shadow-2xs">
                      {trip.totalDays} Days
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-black text-sm sm:text-base text-rose-950 dark:text-rose-100">
                          {trip.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {trip.status}
                        </span>
                      </div>
                      <p className="text-xs text-rose-900/60 dark:text-rose-400/60 mt-1 flex flex-wrap items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400 shrink-0" />
                        <span>{trip.origin} &rarr; {trip.destination}</span>
                        <span className="mx-0.5">•</span>
                        <Clock className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400 shrink-0" />
                        <span>{trip.startDate} to {trip.endDate}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-rose-100 dark:border-rose-950 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs">
                        <span className="text-rose-900/60 dark:text-rose-400/60 font-medium">Est. Budget: </span>
                        <span className="font-black text-rose-950 dark:text-rose-100">
                          ${trip.totalEstimatedCost?.toLocaleString()}
                        </span>
                        <span className="text-rose-900/40 dark:text-rose-400/40 text-[10px]"> / ${trip.budgetLimit?.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/itinerary/${trip.id}`}
                          className="px-3 py-1.5 text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                        >
                          Itinerary
                        </Link>
                        <Link
                          href={`/map/${trip.id}`}
                          className="px-3 py-1.5 text-xs font-bold bg-rose-50/50 dark:bg-rose-950/30 text-rose-900/80 dark:text-rose-300 rounded-lg hover:bg-rose-100/50 transition-colors"
                        >
                          Map
                        </Link>
                        <Link
                          href={`/budget/${trip.id}`}
                          className="px-3 py-1.5 text-xs font-bold bg-rose-50/50 dark:bg-rose-950/30 text-rose-900/80 dark:text-rose-300 rounded-lg hover:bg-rose-100/50 transition-colors"
                        >
                          Budget
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: AI Multi-Agent Engine Telemetry & Chat Quick Launch */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#160a0f] border border-rose-100/90 dark:border-rose-950/80 rounded-2xl p-5 shadow-2xs space-y-4 transition-colors">
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
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-rose-50/50 dark:bg-[#1e0e14]/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-semibold text-rose-950 dark:text-rose-200">{agent.name}</span>
                  </div>
                  <span className="text-[11px] text-rose-900/50 dark:text-rose-400/50 font-mono font-medium">{agent.speed}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-rose-100 dark:border-rose-950 flex items-center justify-between text-xs text-rose-900/60 dark:text-rose-400/60 font-medium">
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
