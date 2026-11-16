'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  User,
  Mail,
  Phone,
  DollarSign,
  Compass,
  Utensils,
  MapPin,
  Save,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function ProfilePage() {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Morgan');
  const [email, setEmail] = useState('demo@travelplanner.ai');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [bio, setBio] = useState('Passionate globetrotter, landscape photographer, and culinary enthusiast.');
  const [currency, setCurrency] = useState('USD');
  const [travelPace, setTravelPace] = useState('MODERATE');
  const [stayStyle, setStayStyle] = useState('BOUTIQUE');
  const [homeAirport, setHomeAirport] = useState('JFK');
  const [dietary, setDietary] = useState('Vegetarian');

  useEffect(() => {
    async function load() {
      try {
        const u = await api.getCurrentUser();
        if (u) {
          if (u.firstName) setFirstName(u.firstName);
          if (u.lastName) setLastName(u.lastName);
          if (u.email) setEmail(u.email);
          if (u.bio) setBio(u.bio);
          if (u.preferredCurrency) setCurrency(u.preferredCurrency);
          if (u.travelPace) setTravelPace(u.travelPace);
          if (u.accommodationStyle) setStayStyle(u.accommodationStyle);
        }
      } catch (e) {
        console.error('Failed to load user', e);
      }
    }
    load();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Travel DNA and profile preferences saved!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold mb-2">
          <User className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
          Profile
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          User Profile & Travel DNA
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your default travel parameters so AI agents personalize every generated itinerary automatically.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-950 via-rose-900 to-rose-700 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-rose-950/20">
              {firstName[0]}{lastName[0]}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {firstName} {lastName}
              </h2>
              <p className="text-xs text-rose-900/70 dark:text-rose-200/70">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-white dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-white dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608]/50 text-sm text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
              Short Bio / Travel Style
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-white dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
            />
          </div>
        </div>

        {/* Travel Preferences */}
        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-800 dark:text-rose-400" />
            Travel Intelligence Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-white dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
                Preferred Travel Pace
              </label>
              <select
                value={travelPace}
                onChange={(e) => setTravelPace(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-white dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              >
                <option value="RELAXED">Relaxed (1-2 main activities/day)</option>
                <option value="MODERATE">Moderate (2-3 activities/day)</option>
                <option value="FAST">Intense / Fast-Paced (4+ activities/day)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
                Home Departure Airport
              </label>
              <input
                type="text"
                value={homeAirport}
                onChange={(e) => setHomeAirport(e.target.value)}
                placeholder="e.g. JFK, LHR, CDG"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-white dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
                Dietary Requirements
              </label>
              <input
                type="text"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="e.g. Vegetarian, Halal, Gluten-free"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-white dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-rose-950/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
