'use client';

import { useState } from 'react';
import {
  Settings,
  Cpu,
  Key,
  Database,
  ExternalLink,
  ShieldCheck,
  Save,
  CheckCircle2,
  Server,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function SettingsPage() {
  const { toast } = useToast();
  const [provider, setProvider] = useState('GEMINI');
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [openaiModel, setOpenaiModel] = useState('gpt-4o');
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [useFallback, setUseFallback] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('AI engine configuration saved successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
          Settings
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          System & AI Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure model providers, fallback engines, API credentials, and database connectivity.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI Provider Config */}
        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-rose-800 dark:text-rose-400" />
            Primary LLM Provider
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'GEMINI', name: 'Google Gemini', sub: 'Recommended (2.5 Flash)' },
              { id: 'OPENAI', name: 'OpenAI', sub: 'GPT-4o Mini / 4o' },
              { id: 'OLLAMA', name: 'Ollama Local', sub: 'Zero cloud latency' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setProvider(p.id);
                  toast.info(`Switched active provider to ${p.name}`);
                }}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                  provider === p.id
                    ? 'border-rose-800 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-100 shadow-sm'
                    : 'border-slate-200 dark:border-[#33151f] hover:border-rose-300 dark:hover:border-rose-900/40'
                }`}
              >
                <span className="font-bold text-xs block">{p.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{p.sub}</span>
              </button>
            ))}
          </div>

          {provider === 'GEMINI' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
                  Gemini Model Tier
                </label>
                <select
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-white dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Sub-500ms speed, low cost)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep complex reasoning)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#0d0608] border border-slate-100 dark:border-[#33151f] rounded-xl text-xs text-slate-500 flex items-center justify-between">
                <span>API Key Status:</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Deterministic Mock Engine Ready (No Key Required)
                </span>
              </div>
            </div>
          )}

          {provider === 'OPENAI' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
                  OpenAI Model
                </label>
                <select
                  value={openaiModel}
                  onChange={(e) => setOpenaiModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-white dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                >
                  <option value="gpt-4o-mini">GPT-4o Mini (Fast & economical)</option>
                  <option value="gpt-4o">GPT-4o (High-fidelity planning)</option>
                </select>
              </div>
            </div>
          )}

          {provider === 'OLLAMA' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-rose-900/70 dark:text-rose-200/70 uppercase tracking-wider mb-1">
                  Ollama Local Host Endpoint
                </label>
                <input
                  type="text"
                  value={ollamaEndpoint}
                  onChange={(e) => setOllamaEndpoint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#33151f] bg-white dark:bg-[#0d0608] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
                />
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-[#33151f] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Automatic Agent Fallback
              </span>
              <span className="text-[11px] text-slate-400">
                Fallback to high-availability mock models if external LLM provider throttles
              </span>
            </div>
            <input
              type="checkbox"
              checked={useFallback}
              onChange={(e) => setUseFallback(e.target.checked)}
              className="w-4 h-4 accent-rose-900 cursor-pointer"
            />
          </div>
        </div>

        {/* Database & Infrastructure Status */}
        <div className="bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-rose-800 dark:text-rose-400" />
            Infrastructure Health Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0d0608] border border-slate-100 dark:border-[#33151f]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                PostgreSQL + pgvector
              </span>
              <span className="font-bold text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Healthy (Port 5432)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0d0608] border border-slate-100 dark:border-[#33151f]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Redis Cache
              </span>
              <span className="font-bold text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected (Port 6379)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0d0608] border border-slate-100 dark:border-[#33151f]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Spring Boot Actuator
              </span>
              <span className="font-bold text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Status UP (Port 8081)
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-rose-950/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
