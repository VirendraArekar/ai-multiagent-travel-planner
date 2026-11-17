'use client';

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

interface BudgetChartsProps {
  allocated: Record<string, number>;
  actual: Record<string, number>;
  currency?: string;
}

const COLORS = ['#881337', '#9f1239', '#be123c', '#e11d48', '#fb7185', '#fda4af'];

export default function BudgetCharts({
  allocated = { FLIGHT: 850, HOTEL: 780, FOOD: 380, TRANSPORT: 150, ACTIVITY: 210, EMERGENCY: 130 },
  actual = { FLIGHT: 680, HOTEL: 390, FOOD: 45, TRANSPORT: 25, ACTIVITY: 0, EMERGENCY: 0 },
  currency = 'EUR',
}: BudgetChartsProps) {
  // Pie chart data: Allocation breakdown
  const pieData = Object.entries(allocated).map(([category, value]) => ({
    name: category,
    value,
  }));

  // Bar chart data: Planned vs Actual comparison
  const barData = Object.keys(allocated).map((category) => ({
    category,
    Planned: allocated[category] || 0,
    Actual: actual[category] || 0,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Allocation Pie Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1">
          Budget Allocation by Category
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Synthesized by the Budget Management Agent
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number) => [`${currency} ${val.toLocaleString()}`, 'Allocated']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {pieData.map((item, idx) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              <span className="font-medium truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Planned vs Actual Bar Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1">
          Planned vs. Actual Spend
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Real-time expense tracking across active categories
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(val: number, name: string) => [`${currency} ${val.toLocaleString()}`, name]}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Planned" fill="#881337" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual" fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
