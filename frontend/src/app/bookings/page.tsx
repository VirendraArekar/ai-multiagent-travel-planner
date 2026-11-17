'use client';

import { useEffect, useState } from 'react';
import {
  Ticket,
  Plus,
  Plane,
  Building,
  Compass,
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  X,
  Sparkles
} from 'lucide-react';
import { api } from '@/lib/api';
import { Booking } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function BookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New booking state
  const [bookingType, setBookingType] = useState('FLIGHT');
  const [provider, setProvider] = useState('Air France');
  const [refNumber, setRefNumber] = useState('');
  const [totalCost, setTotalCost] = useState('680');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getBookings();
        setBookings(data);
      } catch (e) {
        console.error('Failed to load bookings', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNumber.trim()) return;

    try {
      const newBooking = await api.createBooking({
        tripId: 'trip-paris-1',
        bookingType,
        providerName: provider,
        bookingReference: refNumber,
        totalCost: parseFloat(totalCost) || 0,
        currency: 'USD',
        status: 'CONFIRMED',
        notes,
      });

      setBookings([newBooking, ...bookings]);
      setRefNumber('');
      setNotes('');
      setShowAddModal(false);
      toast.success(`Reservation [${refNumber}] saved successfully!`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to save reservation.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteBooking(id);
      setBookings(bookings.filter((b) => b.id !== id));
      toast.info('Booking record deleted.');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold mb-2">
            <Ticket className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
            Booking Assistant Agent
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reservations & Travel Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Store and track confirmed reservations for flights, hotels, and activities with verified provider codes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-rose-950/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Reservation
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-[#160a0f] border border-dashed border-slate-300 dark:border-[#33151f] rounded-3xl p-8">
          <Ticket className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No bookings logged yet</h3>
          <p className="text-xs text-slate-500">
            Keep all your airline PNRs, hotel vouchers, and attraction tickets organized in one place.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-rose-800/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center shrink-0">
                  {booking.bookingType === 'FLIGHT' ? (
                    <Plane className="w-6 h-6" />
                  ) : booking.bookingType === 'HOTEL' ? (
                    <Building className="w-6 h-6" />
                  ) : (
                    <Compass className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/30">
                      {booking.bookingType}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {booking.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {booking.provider}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Booking Ref / PNR:{' '}
                    <strong className="font-mono text-rose-900 dark:text-rose-300">
                      {booking.bookingReference}
                    </strong>
                  </p>

                  {booking.notes && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                      Note: {booking.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-[#33151f] gap-2 shrink-0">
                <span className="text-lg font-black text-rose-950 dark:text-rose-200">
                  ${booking.totalPrice ?? (booking as any).totalCost ?? 0}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(booking.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                    title="Delete booking record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Add Travel Reservation
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBooking} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 mb-1">
                  Type
                </label>
                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                >
                  <option value="FLIGHT">Flight</option>
                  <option value="HOTEL">Hotel</option>
                  <option value="ACTIVITY">Activity / Tour</option>
                  <option value="CAR_RENTAL">Car Rental</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 mb-1">
                  Provider Name
                </label>
                <input
                  type="text"
                  required
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g. Air France, Marriott, Viator"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 mb-1">
                    Booking Reference / PNR
                  </label>
                  <input
                    type="text"
                    required
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    placeholder="e.g. AF8299K"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 mb-1">
                    Total Cost ($)
                  </label>
                  <input
                    type="number"
                    value={totalCost}
                    onChange={(e) => setTotalCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Seat assignments, room type, or cancellation deadline..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#200d14] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-950/20 cursor-pointer"
                >
                  Save Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
