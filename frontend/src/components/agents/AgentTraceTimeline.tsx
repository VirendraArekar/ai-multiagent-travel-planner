'use client';

import { useState } from 'react';
import { 
  CheckCircle2, Clock, Cpu, DollarSign, Wrench, ChevronDown, 
  ChevronUp, AlertCircle, RefreshCw, Terminal
} from 'lucide-react';
import { AgentTask } from '@/types';

interface AgentTraceTimelineProps {
  tasks: AgentTask[];
  onRetryTask?: (taskId: string) => void;
}

export default function AgentTraceTimeline({ tasks, onRetryTask }: AgentTraceTimelineProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(tasks[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const isExpanded = expandedTaskId === task.id;
        const isCompleted = task.status === 'COMPLETED';
        const isFailed = task.status === 'FAILED';

        return (
          <div
            key={task.id}
            className={`rounded-2xl border transition-all ${
              isExpanded
                ? 'border-rose-300 bg-rose-50/20 dark:border-rose-900/60 dark:bg-rose-950/20 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            {/* Header row */}
            <div
              onClick={() => toggleExpand(task.id)}
              className="flex items-center justify-between p-4 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-white ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isFailed
                      ? 'bg-rose-500'
                      : 'bg-amber-500 animate-pulse'
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                  {isFailed && <AlertCircle className="h-4 w-4" />}
                  {!isCompleted && !isFailed && <Clock className="h-4 w-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {task.agentName}
                    </h4>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : isFailed
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{task.taskName}</p>
                </div>
              </div>

              {/* Metrics Pills */}
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {task.durationMs || 320}ms
                </span>
                <span className="hidden md:flex items-center gap-1 text-xs text-slate-500">
                  <Cpu className="h-3.5 w-3.5 text-slate-400" />
                  {task.tokensUsed || 310} tokens
                </span>
                <span className="hidden lg:flex items-center gap-1 text-xs text-slate-500">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                  ${Number(task.costUsd || 0.00003).toFixed(5)}
                </span>

                {isFailed && onRetryTask && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRetryTask(task.id);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300"
                  >
                    <RefreshCw className="h-3 w-3" /> Retry
                  </button>
                )}

                <button className="text-slate-400 hover:text-slate-600">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Expanded Details Drawer */}
            {isExpanded && (
              <div className="border-t border-slate-100 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
                {/* Output Summary */}
                {task.outputPayload && (
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Agent Synthesis & Output
                    </h5>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 font-mono">
                      {task.outputPayload}
                    </div>
                  </div>
                )}

                {/* Tool Calls */}
                {task.toolCalls && task.toolCalls.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Wrench className="h-3 w-3" /> Tool Executions ({task.toolCalls.length})
                    </h5>
                    <div className="space-y-1.5">
                      {task.toolCalls.map((tc) => (
                        <div
                          key={tc.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-950"
                        >
                          <span className="font-mono text-sky-600 dark:text-sky-400">{tc.toolName}</span>
                          <span className="text-slate-500 text-[11px]">{tc.result} ({tc.durationMs}ms)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Execution Logs */}
                {task.logs && task.logs.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Terminal className="h-3 w-3" /> Execution Log Stream
                    </h5>
                    <div className="rounded-xl bg-slate-900 p-3 text-[11px] font-mono text-slate-300 space-y-1">
                      {task.logs.map((log) => (
                        <div key={log.id} className="flex items-start gap-2">
                          <span className="text-emerald-400">[{log.logLevel}]</span>
                          <span>{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
