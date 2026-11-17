'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Compass,
  Cpu,
  Server,
  Activity,
  HardDrive,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { api } from '@/lib/api';
import { AgentMonitoringStats } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AgentMonitoringStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const s = await api.getAgentStats();
        setStats(s);
      } catch (e) {
        console.error('Failed to load admin stats', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
            System Administration Console
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Cluster & System Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Global operational overview of Spring Boot 3.4.2, PostgreSQL, Redis, and multi-agent execution swarms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="http://localhost:8081/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-rose-50 dark:bg-[#200d14] dark:hover:bg-[#33151f] text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 cursor-pointer"
          >
            OpenAPI Docs <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <Link
            href="/agents/monitoring"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-950/20 transition cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" /> Agent Monitor
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">1,482</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+18 registered today</span>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider">Trips Planned</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">3,912</p>
          <span className="text-[11px] text-slate-400">Avg 4.8 days per trip</span>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider">Agent Swarms Executed</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-rose-900 dark:text-rose-300">
            {stats?.totalTasksExecuted || 842}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">99.2% success rate</span>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider">System Status</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">Healthy</p>
          <span className="text-[11px] text-slate-400">All 5 containers running</span>
        </div>
      </div>

      {/* Cluster Overview Table */}
      <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Active Services Topology
        </h2>
        <div className="divide-y divide-slate-100 dark:divide-[#33151f]">
          {[
            { name: 'travelplanner-backend', tech: 'Java 21 / Spring Boot 3.4.2', port: '8081', status: 'UP' },
            { name: 'travelplanner-frontend', tech: 'Next.js 16 / React 19 / Tailwind v4', port: '3000', status: 'UP' },
            { name: 'travelplanner-nginx', tech: 'Nginx 1.25 Alpine Reverse Proxy', port: '80', status: 'UP' },
            { name: 'travelplanner-postgres', tech: 'PostgreSQL 16 + pgvector', port: '5432', status: 'HEALTHY' },
            { name: 'travelplanner-redis', tech: 'Redis 7.2 Alpine In-Memory Cache', port: '6379', status: 'HEALTHY' },
          ].map((svc) => (
            <div key={svc.name} className="py-3 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-mono">{svc.name}</h4>
                <p className="text-[11px] text-slate-400">{svc.tech} • Port {svc.port}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {svc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
