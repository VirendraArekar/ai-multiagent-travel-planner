'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Users,
  Compass,
  Heart,
  DollarSign,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Utensils,
  Hotel
} from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

const INTERESTS = [
  'Historical Monuments', 'Art Museums', 'Local Street Food', 'Fine Dining',
  'Beaches & Coastal', 'Hiking & Trekking', 'Nightlife & Bars', 'Shopping & Boutiques',
  'Hidden Gems', 'Photography Spots', 'Family Theme Parks', 'Wellness & Spas'
];

const DIETARY_OPTIONS = [
  'No Restrictions', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Nut Allergy'
];

export default function TravelWizardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [origin, setOrigin] = useState('New York (JFK)');
  const [destination, setDestination] = useState('Paris, France');
  const [startDate, setStartDate] = useState('2026-06-10');
  const [endDate, setEndDate] = useState('2026-06-16');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [travelType, setTravelType] = useState('COUPLE');
  const [accommodationStyle, setAccommodationStyle] = useState('BOUTIQUE');
  const [travelPace, setTravelPace] = useState('MODERATE');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Art Museums', 'Fine Dining', 'Hidden Gems']);
  const [dietary, setDietary] = useState('Vegetarian');
  const [budget, setBudget] = useState(3000);
  const [currency, setCurrency] = useState('USD');

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleFinish = async () => {
    setLoading(true);
    toast.info('Coordinating 11 AI Agents for itinerary synthesis...');
    try {
      const trip = await api.createTrip({
        title: `${destination.split(',')[0]} Exploration`,
        origin,
        destination: destination.split(',')[0].trim(),
        startDate,
        endDate,
        adultsCount: adults,
        childrenCount: children,
        travelType,
        budgetLimit: budget,
        currency,
        preferences: selectedInterests,
      });
      toast.success('Itinerary generated successfully!');
      router.push(`/itinerary/${trip.id}`);
    } catch (err: any) {
      console.error('Wizard submission failed', err);
      toast.error('Failed to create trip plan. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      {/* Step Indicator Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-rose-900/60 dark:text-rose-400/60 uppercase tracking-widest">
          <span>Step {step} of 5</span>
          <span>{Math.round((step / 5) * 100)}% Complete</span>
        </div>
        <div className="w-full h-2 bg-rose-100 dark:bg-rose-950/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-950 to-rose-700 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Steps */}
      <div className="bg-white dark:bg-[#160a0f] border border-rose-100/90 dark:border-rose-950/80 rounded-3xl p-5 sm:p-8 shadow-xl shadow-rose-950/5 transition-colors">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-rose-950 dark:text-rose-50">
                Where are you heading?
              </h2>
              <p className="text-xs sm:text-sm text-rose-900/60 dark:text-rose-400/60 mt-1 font-medium">
                Tell us your starting city and where you want your adventure to take place.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-700 dark:text-rose-400" /> Origin (Departure City / Airport)
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. New York (JFK), London (LHR)"
                  className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-rose-950 dark:text-rose-100 text-xs sm:text-sm font-semibold focus:border-rose-700 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-rose-700 dark:text-rose-400" /> Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Paris, Tokyo, Bali, Rome, Dubai"
                  className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-rose-950 dark:text-rose-100 text-xs sm:text-sm font-semibold focus:border-rose-700 focus:outline-none transition-colors"
                />
              </div>

              {/* Popular quick-select pills */}
              <div className="pt-2">
                <span className="text-xs font-bold text-rose-900/50 dark:text-rose-400/50 block mb-2">Popular destinations:</span>
                <div className="flex flex-wrap gap-2">
                  {['Paris, France', 'Tokyo, Japan', 'Bali, Indonesia', 'Rome, Italy', 'Goa, India', 'Dubai, UAE'].map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setDestination(dest)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition font-bold ${
                        destination === dest
                          ? 'border-rose-700 bg-rose-50 dark:bg-rose-950 text-rose-900 dark:text-rose-200'
                          : 'border-rose-100 dark:border-rose-950/60 text-rose-900/70 dark:text-rose-400/70 hover:bg-rose-50/60 dark:hover:bg-rose-950/40'
                      }`}
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-rose-950 dark:text-rose-50">
                When are you traveling?
              </h2>
              <p className="text-xs sm:text-sm text-rose-900/60 dark:text-rose-400/60 mt-1 font-medium">
                Our Weather Agent will verify seasonal patterns and optimize outdoor attractions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-700 dark:text-rose-400" /> Departure Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-rose-950 dark:text-rose-100 text-xs sm:text-sm font-semibold focus:border-rose-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-700 dark:text-rose-400" /> Return Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-rose-950 dark:text-rose-100 text-xs sm:text-sm font-semibold focus:border-rose-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Travelers counts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5">
                  Adults (18+)
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setAdults(num)}
                      className={`flex-1 py-2.5 rounded-xl border font-bold text-xs transition ${
                        adults === num
                          ? 'border-rose-700 bg-rose-50 dark:bg-rose-950 text-rose-900 dark:text-rose-200'
                          : 'border-rose-100 dark:border-rose-950 text-rose-800/60 dark:text-rose-400/60'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5">
                  Children (0-17)
                </label>
                <div className="flex items-center gap-3">
                  {[0, 1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setChildren(num)}
                      className={`flex-1 py-2.5 rounded-xl border font-bold text-xs transition ${
                        children === num
                          ? 'border-rose-700 bg-rose-50 dark:bg-rose-950 text-rose-900 dark:text-rose-200'
                          : 'border-rose-100 dark:border-rose-950 text-rose-800/60 dark:text-rose-400/60'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-rose-950 dark:text-rose-50">
                Style & Accommodations
              </h2>
              <p className="text-xs sm:text-sm text-rose-900/60 dark:text-rose-400/60 mt-1 font-medium">
                Help our Hotel Recommender pick stays tailored to your group dynamic.
              </p>
            </div>

            {/* Travel Type Cards */}
            <div>
              <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-2">
                Trip Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'SOLO', label: 'Solo Trip', icon: Compass },
                  { id: 'COUPLE', label: 'Couples / Romantic', icon: Heart },
                  { id: 'FAMILY', label: 'Family Vacation', icon: Users },
                  { id: 'FRIENDS', label: 'Friends Getaway', icon: Sparkles },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = travelType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setTravelType(type.id)}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col items-start ${
                        isSelected
                          ? 'border-rose-700 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200'
                          : 'border-rose-100 dark:border-rose-950 bg-white dark:bg-[#1a0c12] text-rose-900/70 dark:text-rose-400/70'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-rose-700 dark:text-rose-400' : 'text-rose-800/40'}`} />
                      <span className="text-xs font-bold leading-tight">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accommodation Tier */}
            <div>
              <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Hotel className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" /> Accommodation Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'BUDGET', label: 'Hostel / Budget Hotel', desc: 'Affordable, clean, vibrant' },
                  { id: 'BOUTIQUE', label: 'Boutique & 4-Star', desc: 'Character, design, prime location' },
                  { id: 'LUXURY', label: '5-Star Luxury Resort', desc: 'Full service, spa, concierge' },
                ].map((tier) => {
                  const isSelected = accommodationStyle === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setAccommodationStyle(tier.id)}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        isSelected
                          ? 'border-rose-700 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200'
                          : 'border-rose-100 dark:border-rose-950 bg-white dark:bg-[#1a0c12] text-rose-900/70 dark:text-rose-400/70'
                      }`}
                    >
                      <span className="block text-xs font-bold">{tier.label}</span>
                      <span className="block text-[11px] opacity-70 mt-0.5">{tier.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Travel Pace */}
            <div>
              <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-2">
                Itinerary Pace
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'RELAXED', label: 'Relaxed (1-2 sights/day)' },
                  { id: 'MODERATE', label: 'Balanced (3-4 sights/day)' },
                  { id: 'INTENSE', label: 'Fast-Paced (5+ sights/day)' },
                ].map((pace) => {
                  const isSelected = travelPace === pace.id;
                  return (
                    <button
                      key={pace.id}
                      type="button"
                      onClick={() => setTravelPace(pace.id)}
                      className={`p-3 rounded-xl border text-center transition ${
                        isSelected
                          ? 'border-rose-700 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold'
                          : 'border-rose-100 dark:border-rose-950 text-rose-800/60 dark:text-rose-400/60'
                      }`}
                    >
                      <span className="text-xs font-bold">{pace.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-rose-950 dark:text-rose-50">
                Interests & Culinary Desires
              </h2>
              <p className="text-xs sm:text-sm text-rose-900/60 dark:text-rose-400/60 mt-1 font-medium">
                Our Food and Research Agents will personalize dining and daily activities.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-2">
                What interests you most? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                        isSelected
                          ? 'border-rose-700 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200'
                          : 'border-rose-100 dark:border-rose-950 bg-white dark:bg-[#1a0c12] text-rose-900/70 dark:text-rose-400/70'
                      }`}
                    >
                      <span>{interest}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dietary */}
            <div>
              <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" /> Dietary Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDietary(opt)}
                    className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition ${
                      dietary === opt
                        ? 'border-rose-700 bg-rose-50 dark:bg-rose-950 text-rose-900 dark:text-rose-200'
                        : 'border-rose-100 dark:border-rose-950 text-rose-800/60 dark:text-rose-400/60'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-rose-950 dark:text-rose-50">
                Budget & Final Constraints
              </h2>
              <p className="text-xs sm:text-sm text-rose-900/60 dark:text-rose-400/60 mt-1 font-medium">
                Our Budget Management Agent will allocate expenses with emergency cushions.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider">
                    Total Estimated Budget
                  </label>
                  <span className="text-xl font-black text-rose-950 dark:text-rose-100">
                    ${budget.toLocaleString()} {currency}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="250"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-rose-100 dark:bg-rose-950 rounded-lg appearance-none cursor-pointer accent-rose-800"
                />
                <div className="flex justify-between text-[11px] font-bold text-rose-800/50 dark:text-rose-400/50 mt-1">
                  <span>$500 (Budget)</span>
                  <span>$5,000 (Comfortable)</span>
                  <span>$15,000+ (Luxury)</span>
                </div>
              </div>

              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1.5">
                  Display Currency
                </label>
                <div className="flex gap-2">
                  {['USD', 'EUR', 'GBP', 'JPY', 'INR'].map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setCurrency(curr)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition ${
                        currency === curr
                          ? 'border-rose-700 bg-rose-50 dark:bg-rose-950 text-rose-900 dark:text-rose-200'
                          : 'border-rose-100 dark:border-rose-950 text-rose-800/60 dark:text-rose-400/60'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Review Card */}
              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 dark:border-rose-950/60 dark:bg-rose-950/20 space-y-2 text-xs">
                <h4 className="font-bold text-rose-950 dark:text-rose-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Trip Blueprint Ready for Multi-Agent Dispatch
                </h4>
                <div className="grid grid-cols-2 gap-2 text-rose-900/70 dark:text-rose-300/70 font-medium">
                  <div>• Route: {origin} &rarr; {destination}</div>
                  <div>• Duration: 6 Days ({startDate} to {endDate})</div>
                  <div>• Travelers: {adults} Adults, {children} Children</div>
                  <div>• Style: {travelType} ({accommodationStyle})</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="mt-8 pt-5 border-t border-rose-100 dark:border-rose-950 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-950 to-rose-800 hover:from-rose-900 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-rose-950/20 transition-all active:scale-[0.98]"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-800 hover:from-rose-900 hover:to-rose-700 text-white font-black text-xs shadow-md shadow-rose-950/20 transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Synthesizing Agents...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Deploy Multi-Agent Planner</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
