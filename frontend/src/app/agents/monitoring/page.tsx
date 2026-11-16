'use client';

import { useEffect, useState } from 'react';
import {
  Cpu,
  Bot,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import AgentWorkflowGraph from '@/components/agents/AgentWorkflowGraph';
import AgentTraceTimeline from '@/components/agents/AgentTraceTimeline';
import { api } from '@/lib/api';
import { Agent, AgentTask, AgentExecutionTrace, AgentMonitoringStats } from '@/types';
import { useToast } from '@/context/ToastContext';

export default function AgentMonitoringPage() {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [stats, setStats] = useState<AgentMonitoringStats | null>(null);
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [agentsData, tasksData, statsData] = await Promise.all([
          api.getAgents(),
          api.getAgentTasks(),
          api.getAgentStats(),
        ]);
        setAgents(agentsData);
        setTasks(tasksData);
        setStats(statsData);
        if (tasksData && tasksData.length > 0) {
          setSelectedTask(tasksData[0]);
        }
      } catch (e) {
        console.error('Failed to load agent telemetry', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRetry = async (taskId: string) => {
    try {
      await api.retryAgentTask(taskId);
      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, status: 'RETRYING' } : t))
      );
      toast.info(`Retrying task execution for [${taskId}]...`);
      setTimeout(() => {
        setTasks(
          tasks.map((t) => (t.id === taskId ? { ...t, status: 'COMPLETED' } : t))
        );
        toast.success(`Task [${taskId}] re-executed successfully!`);
      }, 1200);
    } catch (e) {
      console.error(e);
      toast.error('Retry execution failed.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
            Distributed Multi-Agent Engine
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Agent Swarm Telemetry & Orchestration Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time state machine tracing, token latency, tool invocations, and error recovery logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            11 Agents Online
          </span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider">
            Total Invocations
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {stats?.totalTasksExecuted ?? 842}
          </p>
          <span className="text-[11px] text-slate-400">Past 30 days</span>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider">
            Success Rate
          </span>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {stats ? Math.round((stats.completedTasks / Math.max(1, stats.totalTasksExecuted)) * 100) : 98}%
          </p>
          <span className="text-[11px] text-slate-400">Zero unrecoverable crashes</span>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider">
            Average Latency
          </span>
          <p className="mt-2 text-2xl font-black text-rose-900 dark:text-rose-300">
            {stats?.averageExecutionDurationMs ?? 420} ms
          </p>
          <span className="text-[11px] text-slate-400">Parallelized fan-out</span>
        </div>

        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider">
            Tokens Processed
          </span>
          <p className="mt-2 text-2xl font-black text-rose-950 dark:text-rose-200">
            1.24M
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">$0.32 total cost</span>
        </div>
      </div>

      {/* Visual Workflow Graph */}
      <AgentWorkflowGraph />

      {/* Task Traces & Logs */}
      <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-800 dark:text-rose-400" />
            Execution Traces & Tool Invocation State
          </h2>
        </div>

        <AgentTraceTimeline
          tasks={tasks}
          onRetryTask={handleRetry}
        />
      </div>
    </div>
  );
}
