'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bot
} from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

const SAMPLE_PROMPTS = [
  'Romantic 5-day getaway to Paris under $2,500 for a couple, focusing on museums, fine dining, and boutique hotels.',
  'I want to travel from Mumbai to Goa for 5 days with my family, budget ₹50,000, and prefer beaches, sightseeing, and vegetarian food.',
  'Tokyo 7-day solo adventure focusing on tech, anime, sushi, and historic temples with a budget of $3,200.',
  'Bali 7-day tropical retreat with 4 friends, beach club relaxation, villa with pool, budget $1,800 per person.',
];

const TRAVEL_TYPES = [
  { id: 'SOLO', label: 'Solo Trip', icon: '🎒' },
  { id: 'COUPLE', label: 'Couple', icon: '💑' },
  { id: 'FAMILY', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'FRIENDS', label: 'Friends', icon: '🥂' },
  { id: 'ADVENTURE', label: 'Adventure', icon: '🧗‍♂️' },
  { id: 'HONEYMOON', label: 'Honeymoon', icon: '💍' },
];

export default function AIPlannerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [origin, setOrigin] = useState('New York');
  const [destination, setDestination] = useState('Paris');
  const [startDate, setStartDate] = useState('2026-06-10');
  const [endDate, setEndDate] = useState('2026-06-15');
  const [travelType, setTravelType] = useState('COUPLE');
  const [budget, setBudget] = useState(2500);
  const [currency, setCurrency] = useState('USD');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Orchestration state
  const [isPlanning, setIsPlanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [planResultTripId, setPlanResultTripId] = useState<string | null>(null);

  const orchestrationSteps = [
    { name: 'Intent Analyzer', desc: 'Extracting origin, destination, dates, budget & preferences' },
    { name: 'Parallel Discovery', desc: 'Research, Flight, Hotel, Weather, Safety & Food Agents executing' },
    { name: 'Itinerary Planner', desc: 'Geospatially clustering sights and calculating transit times' },
    { name: 'Budget Management', desc: 'Calculating expense caps, exchange rates and daily allowances' },
    { name: 'Travel Critic Agent', desc: 'Verifying schedule feasibility, opening hours and safety scores' },
  ];

  const handleStartPlanning = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsPlanning(true);
    setCurrentStep(0);
    toast.info('Orchestrating 11 AI Agents for travel synthesis...');

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < orchestrationSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1100);

    try {
      let trip;
      if (prompt.trim()) {
        trip = await api.planTripNaturalLanguage({
          prompt,
          userId: 'u-demo',
        });
      } else {
        trip = await api.createTrip({
          title: `${destination} Getaway`,
          origin,
          destination,
          startDate,
          endDate,
          adultsCount: adults,
          childrenCount: children,
          travelType,
          budgetLimit: budget,
          currency,
          preferences: ['culture', 'sightseeing', 'local_food'],
        });
      }

      clearInterval(stepInterval);
      setCurrentStep(orchestrationSteps.length);
      setPlanResultTripId(trip.id);
      toast.success('Trip plan successfully constructed and verified by Critic Agent!');
    } catch (err) {
      console.error('Trip planning failed', err);
      toast.error('Agent synthesis failed. Please try again.');
      clearInterval(stepInterval);
      setIsPlanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 text-xs font-bold border border-rose-200/80 dark:border-rose-900/60 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>Autonomous Multi-Agent Travel Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-rose-950 dark:text-rose-50 tracking-tight">
          Tell us your dream trip. Let 11 AI Agents build it.
        </h1>
        <p className="text-rose-900/70 dark:text-rose-400/70 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-medium">
          Describe your itinerary in natural language or configure the parameters below. Our specialized agents coordinate flights, boutique stays, day-wise itineraries, and budget limits.
        </p>
      </div>

      {/* Natural Language Prompt Area */}
      <div className="bg-white dark:bg-[#160a0f] border border-rose-100/90 dark:border-rose-950/80 rounded-3xl p-5 sm:p-6 shadow-xl shadow-rose-950/5 space-y-4 transition-colors">
        <label className="block text-xs sm:text-sm font-black text-rose-950 dark:text-rose-100 flex items-center gap-2">
          <Bot className="w-4 h-4 text-rose-700 dark:text-rose-400" />
          <span>Describe your trip naturally</span>
        </label>
        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I want to travel from Mumbai to Goa for 5 days with my family, budget ₹50,000, and prefer beaches, sightseeing, and vegetarian food."
            className="w-full rounded-2xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] p-4 text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100 placeholder-rose-900/30 focus:outline-none focus:border-rose-700 transition-colors"
          />
        </div>

        {/* Suggested Prompts */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-rose-900/50 dark:text-rose-400/50">Or pick an inspiration:</span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(sample)}
                className="text-left text-xs bg-rose-50/60 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-900 dark:text-rose-200 px-3 py-1.5 rounded-xl transition font-medium line-clamp-1"
              >
                &ldquo;{sample}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Configuration Form */}
      <div className="bg-white dark:bg-[#160a0f] border border-rose-100/90 dark:border-rose-950/80 rounded-3xl p-5 sm:p-6 shadow-xl shadow-rose-950/5 space-y-6 transition-colors">
        <h2 className="text-sm sm:text-base font-black text-rose-950 dark:text-rose-100 flex items-center gap-2">
          <Compass className="w-4 h-4 text-rose-700 dark:text-rose-400" />
          <span>Trip Parameters & Preferences</span>
        </h2>

        {/* Travel Type Select */}
        <div>
          <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-2">
            Travel Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {TRAVEL_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setTravelType(type.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition ${
                  travelType === type.id
                    ? 'border-rose-700 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 shadow-2xs'
                    : 'border-rose-100 dark:border-rose-950/60 text-rose-900/70 dark:text-rose-400/70 hover:bg-rose-50/50'
                }`}
              >
                <span className="text-xl mb-1">{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Origin & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
              <span>Origin (Departure City)</span>
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. New York, London, Mumbai"
              className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100 focus:outline-none focus:border-rose-700 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
              <span>Destination</span>
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Paris, Tokyo, Bali, Goa"
              className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100 focus:outline-none focus:border-rose-700 transition-colors"
            />
          </div>
        </div>

        {/* Dates & Travelers */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
              <span>Start Date</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
              <span>End Date</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
              <span>Adults</span>
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={adults}
              onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
              <span>Children</span>
            </label>
            <input
              type="number"
              min={0}
              max={8}
              value={children}
              onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100"
            />
          </div>
        </div>

        {/* Budget & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Budget Limit</span>
              </label>
              <span className="text-xs sm:text-sm font-black text-rose-950 dark:text-rose-100">
                {currency} {budget.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={25000}
              step={100}
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full h-2 bg-rose-100 dark:bg-rose-950 rounded-lg appearance-none cursor-pointer accent-rose-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="AUD">AUD (A$)</option>
            </select>
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => handleStartPlanning()}
            disabled={isPlanning}
            className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-800 hover:from-rose-900 hover:to-rose-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-rose-950/20 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>Launch Multi-Agent Planning Orchestration</span>
          </button>
        </div>
      </div>

      {/* Live Agent Orchestration Modal / Card */}
      {isPlanning && (
        <div className="bg-white dark:bg-[#160a0f] border-2 border-rose-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-950 to-rose-800 text-white flex items-center justify-center animate-spin">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-rose-950 dark:text-rose-100">
                  Multi-Agent Swarm Orchestrating Plan...
                </h3>
                <p className="text-xs text-rose-900/60 dark:text-rose-400/60 font-medium">11 Specialized agents collaborating via shared context</p>
              </div>
            </div>
            {currentStep >= orchestrationSteps.length && (
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Plan Complete
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {orchestrationSteps.map((step, idx) => {
              const isDone = currentStep > idx;
              const isCurrent = currentStep === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-2xl transition ${
                    isCurrent
                      ? 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800'
                      : isDone
                      ? 'bg-rose-50/40 dark:bg-[#1e0e14]/40 text-rose-900/60 dark:text-rose-300/60'
                      : 'opacity-40'
                  }`}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-rose-800 border-t-transparent animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4 text-rose-900/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-rose-950 dark:text-rose-100">{step.name}</p>
                    <p className="text-[11px] text-rose-900/60 dark:text-rose-400/60 font-medium">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {currentStep >= orchestrationSteps.length && planResultTripId && (
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => router.push(`/itinerary/${planResultTripId}`)}
                className="flex-1 py-3 bg-gradient-to-r from-rose-950 to-rose-800 hover:from-rose-900 hover:to-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-rose-950/20"
              >
                <span>View Generated Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => router.push(`/map/${planResultTripId}`)}
                className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-900"
              >
                Open Map View
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
