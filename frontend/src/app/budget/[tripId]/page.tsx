'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  PieChart,
  Plus,
  Trash2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';
import BudgetCharts from '@/components/budget/BudgetCharts';
import { api } from '@/lib/api';
import { TripExpense } from '@/types';
import { useToast } from '@/context/ToastContext';

interface TripBudgetOverview {
  totalBudget: number;
  totalEstimatedCost: number;
  totalActualCost: number;
  remainingBudget: number;
  emergencyFund: number;
  flightBudget: number;
  hotelBudget: number;
  foodBudget: number;
  activityBudget: number;
  transportBudget: number;
  expenses: TripExpense[];
}

export default function TripBudgetPage({ params }: { params: Promise<{ tripId: string }> }) {
  const resolvedParams = use(params);
  const { tripId } = resolvedParams;
  const { toast } = useToast();

  const [budgetData, setBudgetData] = useState<TripBudgetOverview | null>(null);
  const [loading, setLoading] = useState(true);

  // Add expense modal/form
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('45');
  const [category, setCategory] = useState('FOOD');
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getBudget(tripId);
        setBudgetData(data);
      } catch (e) {
        console.error('Failed to load budget', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tripId]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetData || !title.trim()) return;

    try {
      const parsedAmount = parseFloat(amount) || 0;
      const newExp = await api.addExpense(tripId, {
        title,
        amount: parsedAmount,
        currency,
        category,
        paymentMethod,
        expenseDate: new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0],
      });

      setBudgetData({
        ...budgetData,
        totalActualCost: budgetData.totalActualCost + parsedAmount,
        remainingBudget: budgetData.totalBudget - (budgetData.totalActualCost + parsedAmount),
        expenses: [newExp, ...budgetData.expenses],
      });

      setTitle('');
      setShowAddForm(false);
      toast.success(`Expense of $${parsedAmount} logged successfully!`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to log expense.');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!budgetData) return;
    try {
      const exp = budgetData.expenses.find((e) => e.id === id);
      const amountToSubtract = exp ? exp.amount : 0;

      await api.deleteExpense(tripId, id);

      setBudgetData({
        ...budgetData,
        totalActualCost: Math.max(0, budgetData.totalActualCost - amountToSubtract),
        remainingBudget: budgetData.remainingBudget + amountToSubtract,
        expenses: budgetData.expenses.filter((e) => e.id !== id),
      });
      toast.info('Expense entry removed.');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-slate-400">Loading budget analytics...</div>;
  }

  if (!budgetData) {
    return <div className="py-24 text-center text-slate-400">Budget data not found.</div>;
  }

  const categoryBreakdown = [
    { category: 'Flights', planned: budgetData.flightBudget, actual: 680 },
    { category: 'Hotels', planned: budgetData.hotelBudget, actual: 840 },
    { category: 'Food & Dining', planned: budgetData.foodBudget, actual: 320 },
    { category: 'Activities', planned: budgetData.activityBudget, actual: 160 },
    { category: 'Transport', planned: budgetData.transportBudget, actual: 110 },
  ];

  return (
    <div className="space-y-8">
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
            <PieChart className="w-6 h-6 text-rose-800 dark:text-rose-400" />
            Budget Optimization & Expense Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Line-item calculations synthesized by Budget Management Agent with real-time currency conversion.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-rose-950/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Log Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider">
            Total Allocated
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            ${budgetData.totalBudget.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">Original target ceiling</span>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider">
            Total Spent
          </span>
          <p className="mt-2 text-2xl font-black text-rose-900 dark:text-rose-300">
            ${budgetData.totalActualCost.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">
            {Math.round((budgetData.totalActualCost / Math.max(1, budgetData.totalBudget)) * 100)}% of total budget
          </span>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider">
            Remaining Buffer
          </span>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ${budgetData.remainingBudget.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">Safe spend runway</span>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider">
            Emergency Reserve
          </span>
          <p className="mt-2 text-2xl font-black text-rose-950 dark:text-rose-200">
            ${budgetData.emergencyFund.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">10% buffer locked</span>
        </div>
      </div>

      {/* Recharts Analytics Component */}
      <BudgetCharts
        allocated={{
          FLIGHT: budgetData.flightBudget,
          HOTEL: budgetData.hotelBudget,
          FOOD: budgetData.foodBudget,
          TRANSPORT: budgetData.transportBudget,
          ACTIVITY: budgetData.activityBudget,
          EMERGENCY: budgetData.emergencyFund,
        }}
        actual={{
          FLIGHT: 680,
          HOTEL: 840,
          FOOD: 320,
          TRANSPORT: 110,
          ACTIVITY: 160,
          EMERGENCY: 0,
        }}
        currency="USD"
      />

      {/* Expenses History Table */}
      <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Logged Trip Expenses ({budgetData.expenses?.length || 0})
          </h2>
        </div>

        {budgetData.expenses?.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No expenses logged yet. Tap &apos;Log Expense&apos; above to record spending.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-[#33151f]">
            {budgetData.expenses?.map((exp) => (
              <div
                key={exp.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-rose-50/30 dark:hover:bg-[#200d14]/40 px-2 rounded-xl transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{exp.title}</h4>
                    <span className="text-[11px] text-slate-400">
                      {exp.category} • {exp.date || (exp as any).expenseDate || 'Today'} • {exp.paymentMethod || 'Card'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    ${exp.amount.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteExpense(exp.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Log New Expense
              </h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dinner at Le Jules Verne"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                  >
                    <option value="FLIGHT">Flight</option>
                    <option value="HOTEL">Accommodation</option>
                    <option value="FOOD">Food & Dining</option>
                    <option value="TRANSPORT">Transit & Taxi</option>
                    <option value="ACTIVITY">Activities & Tickets</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#200d14] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-950/20 cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
