'use client';

import { 
  Sparkles, Compass, Plane, Hotel, CloudSun, Shield, 
  Utensils, Navigation, Calendar, Wallet, CheckCircle2, 
  ArrowRight, ShieldCheck, BookmarkCheck, Activity
} from 'lucide-react';

interface AgentWorkflowGraphProps {
  currentStage?: string;
  criticScore?: number;
}

export default function AgentWorkflowGraph({ currentStage = 'COMPLETED', criticScore = 9.2 }: AgentWorkflowGraphProps) {
  const pipeline = [
    { name: 'User Request', icon: Sparkles, desc: 'Intent & Preferences' },
    { name: 'Orchestrator', icon: Activity, desc: 'Context & Delegation' },
    { name: 'Research & Weather', icon: Compass, desc: 'Parallel Discovery' },
    { name: 'Flights & Hotels', icon: Plane, desc: 'Verified Provider Data' },
    { name: 'Transit & Food', icon: Utensils, desc: 'Culinary & Routing' },
    { name: 'Itinerary Planner', icon: Calendar, desc: 'Geographic Clusters' },
    { name: 'Budget Analyst', icon: Wallet, desc: 'Line-Item Calculations' },
    { name: 'Travel Critic', icon: ShieldCheck, desc: `Quality Audit (${criticScore}/10)` },
    { name: 'Final Travel Plan', icon: CheckCircle2, desc: 'Booking Deep-Links' },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Multi-Agent Orchestration Architecture
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            11 specialized AI agents executing in state-machine parallel & staged pipelines
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Pipeline Verified
        </div>
      </div>

      {/* Horizontal Flow Pipeline */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-center min-w-[760px] justify-between">
          {pipeline.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === pipeline.length - 1;

            return (
              <div key={step.name} className="flex items-center">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-950 via-rose-900 to-rose-700 text-white shadow-md shadow-rose-950/25 transition-transform hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {step.name}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[90px]">
                    {step.desc}
                  </span>
                </div>

                {!isLast && (
                  <div className="mx-2 flex items-center justify-center text-slate-300 dark:text-slate-700">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
