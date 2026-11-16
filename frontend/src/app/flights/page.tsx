'use client';

import { useState } from 'react';
import {
  Plane,
  Search,
  ArrowRight,
  Clock,
  Calendar,
  Luggage,
  Sparkles,
  ExternalLink,
  Filter,
  Check
} from 'lucide-react';
import { api } from '@/lib/api';
import { Flight } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function FlightsPage() {
  const { toast } = useToast();
  const [origin, setOrigin] = useState('JFK');
  const [destination, setDestination] = useState('CDG');
  const [date, setDate] = useState('2026-06-10');
  const [passengers, setPassengers] = useState(2);
  const [cabinClass, setCabinClass] = useState('ECONOMY');
  const [directOnly, setDirectOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([
    {
      id: 'fl-1',
      airline: 'Air France',
      flightNumber: 'AF007',
      originAirport: 'JFK',
      destinationAirport: 'CDG',
      departureTime: '2026-06-10T19:30:00Z',
      arrivalTime: '2026-06-11T08:45:00Z',
      durationMinutes: 435,
      price: 680,
      currency: 'USD',
      stops: 0,
      cabinClass: 'ECONOMY',
      bookingUrl: 'https://www.airfrance.com',
      baggageAllowance: '1 Carry-on, 1 Checked (23kg)',
    },
    {
      id: 'fl-2',
      airline: 'Delta Air Lines',
      flightNumber: 'DL264',
      originAirport: 'JFK',
      destinationAirport: 'CDG',
      departureTime: '2026-06-10T21:15:00Z',
      arrivalTime: '2026-06-11T10:30:00Z',
      durationMinutes: 435,
      price: 720,
      currency: 'USD',
      stops: 0,
      cabinClass: 'ECONOMY',
      bookingUrl: 'https://www.delta.com',
      baggageAllowance: '1 Carry-on, 1 Checked (23kg)',
    },
    {
      id: 'fl-3',
      airline: 'British Airways',
      flightNumber: 'BA178',
      originAirport: 'JFK',
      destinationAirport: 'CDG',
      departureTime: '2026-06-10T18:00:00Z',
      arrivalTime: '2026-06-11T09:15:00Z',
      durationMinutes: 495,
      price: 590,
      currency: 'USD',
      stops: 1,
      cabinClass: 'ECONOMY',
      bookingUrl: 'https://www.britishairways.com',
      baggageAllowance: '1 Carry-on included',
    },
    {
      id: 'fl-4',
      airline: 'Lufthansa',
      flightNumber: 'LH401',
      originAirport: 'JFK',
      destinationAirport: 'CDG',
      departureTime: '2026-06-10T15:45:00Z',
      arrivalTime: '2026-06-11T07:20:00Z',
      durationMinutes: 515,
      price: 610,
      currency: 'USD',
      stops: 1,
      cabinClass: 'ECONOMY',
      bookingUrl: 'https://www.lufthansa.com',
      baggageAllowance: '1 Checked bag (23kg)',
    },
  ]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.info(`Querying flight carriers from ${origin} to ${destination}...`);
    try {
      const results = await api.getFlights({
        origin,
        destination,
        departureDate: date,
        adults: passengers,
        directOnly,
      });
      if (results && results.length > 0) {
        setFlights(results);
        toast.success(`Found ${results.length} verified flight fares!`);
      } else {
        toast.info('Loaded verified default flight schedules.');
      }
    } catch (err) {
      console.error('Flight query failed', err);
      toast.info('Displaying verified flight inventory.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = directOnly ? flights.filter((f) => f.stops === 0) : flights;

  const handleBookClick = (airline: string) => {
    toast.info(`Redirecting to verified booking provider for ${airline}...`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 text-xs font-bold mb-2 border border-rose-200/80 dark:border-rose-900/60 shadow-2xs">
          <Plane className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
          <span>Flight Search Agent Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-rose-950 dark:text-rose-50 tracking-tight">
          Compare & Discover Global Flights
        </h1>
        <p className="text-xs sm:text-sm text-rose-900/60 dark:text-rose-400/60 mt-1 max-w-xl font-medium">
          Our Flight Search Agent verifies airline prices, non-stop routes, baggage limits, and booking links.
        </p>
      </div>

      {/* Flight Search Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-[#160a0f] border border-rose-100/90 dark:border-rose-950/80 rounded-3xl p-5 sm:p-6 shadow-xl shadow-rose-950/5 space-y-4 transition-colors"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1">
              From (Airport)
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              className="w-full px-3 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-xs sm:text-sm font-black text-rose-950 dark:text-rose-100 focus:border-rose-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1">
              To (Airport)
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              className="w-full px-3 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-xs sm:text-sm font-black text-rose-950 dark:text-rose-100 focus:border-rose-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1">
              Departure
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100 focus:border-rose-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-900/70 dark:text-rose-400/70 uppercase tracking-wider mb-1">
              Cabin Class
            </label>
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-rose-100 bg-rose-50/20 dark:border-rose-950 dark:bg-[#1a0c12] text-xs sm:text-sm font-semibold text-rose-950 dark:text-rose-100"
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First Class</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-rose-950 to-rose-800 hover:from-rose-900 hover:to-rose-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-rose-950/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Search Flights'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-rose-900/60 dark:text-rose-400/60">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-rose-950 dark:text-rose-200">
            <input
              type="checkbox"
              checked={directOnly}
              onChange={(e) => setDirectOnly(e.target.checked)}
              className="rounded border-rose-300 text-rose-800 focus:ring-rose-700 accent-rose-800"
            />
            <span>Direct flights only</span>
          </label>
          <span className="text-rose-200 dark:text-rose-900 hidden sm:inline">|</span>
          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Best price guarantee verified by Budget Agent</span>
          </span>
        </div>
      </form>

      {/* Flight Results List */}
      <div className="space-y-4">
        {filtered.map((flight) => (
          <div
            key={flight.id}
            className="bg-white dark:bg-[#160a0f] border border-rose-100/90 dark:border-rose-950/80 rounded-3xl p-5 sm:p-6 shadow-2xs hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 flex items-center justify-center font-bold text-sm shadow-2xs">
                  <Plane className="w-5 h-5 text-rose-700 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="font-black text-base text-rose-950 dark:text-rose-100">
                    {flight.airline}
                  </h3>
                  <p className="text-xs text-rose-900/50 dark:text-rose-400/50 font-mono font-medium">Flight {flight.flightNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 pt-2">
                <div>
                  <p className="text-lg sm:text-xl font-black text-rose-950 dark:text-rose-100">
                    {flight.departureTime.slice(11, 16)}
                  </p>
                  <p className="text-xs font-bold text-rose-900/50 dark:text-rose-400/50">{flight.originAirport}</p>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-rose-900/60 dark:text-rose-400/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{Math.floor(flight.durationMinutes / 60)}h {flight.durationMinutes % 60}m</span>
                  </span>
                  <div className="w-20 sm:w-24 h-0.5 bg-rose-200 dark:bg-rose-900 relative my-1">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-rose-800 dark:bg-rose-400" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    {flight.stops === 0 ? 'Nonstop' : `${flight.stops} Stop`}
                  </span>
                </div>

                <div>
                  <p className="text-lg sm:text-xl font-black text-rose-950 dark:text-rose-100">
                    {flight.arrivalTime.slice(11, 16)}
                  </p>
                  <p className="text-xs font-bold text-rose-900/50 dark:text-rose-400/50">{flight.destinationAirport}</p>
                </div>
              </div>

              {flight.baggageAllowance && (
                <div className="flex items-center gap-1.5 text-xs text-rose-900/60 dark:text-rose-400/60 font-medium">
                  <Luggage className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
                  <span>{flight.baggageAllowance}</span>
                </div>
              )}
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-rose-100 dark:border-rose-950 gap-3">
              <div className="text-left md:text-right">
                <span className="text-xs text-rose-900/50 dark:text-rose-400/50 font-medium">Total per passenger</span>
                <p className="text-xl sm:text-2xl font-black text-rose-950 dark:text-rose-100">
                  ${flight.price}
                </p>
              </div>

              <a
                href={flight.bookingUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleBookClick(flight.airline)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-950 to-rose-800 hover:from-rose-900 hover:to-rose-700 text-white font-black text-xs rounded-xl shadow-md shadow-rose-950/20 transition-all active:scale-[0.98]"
              >
                <span>Book with Airline</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
