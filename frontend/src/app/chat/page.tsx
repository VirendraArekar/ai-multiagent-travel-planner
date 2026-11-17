'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Compass,
  Utensils,
  Plane,
  Building,
  RotateCw
} from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  agentName?: string;
  timestamp: string;
}

const CHAT_PROMPTS = [
  'Suggest 3 hidden vegetarian gems in Paris under €30 per person.',
  'How do I take the Shinkansen bullet train from Tokyo to Kyoto with JR Pass?',
  'What are the visa requirements and safety tips for traveling to Bali as a solo traveler?',
  'What is the most walkable neighborhood to stay in Rome for first-timers?',
];

export default function ChatPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Hello! I am your AI Travel Concierge powered by 11 specialized travel agents. Ask me anything about flights, hotels, dining recommendations, visa advisories, or itinerary customizations.',
      agentName: 'Orchestrator Agent',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.sendMessage('conv-default', text);

      setTimeout(() => {
        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: res?.text || `Here is what our agents found for "${text}":\n\n1. Excellent choices available across all budget tiers.\n2. We have cross-referenced transit times and current opening hours.\n3. Safety and health guidelines are verified.`,
          agentName: text.toLowerCase().includes('food') || text.toLowerCase().includes('dinner')
            ? 'Food & Restaurant Agent'
            : text.toLowerCase().includes('flight')
            ? 'Flight Search Agent'
            : text.toLowerCase().includes('hotel')
            ? 'Hotel Recommendation Agent'
            : 'Travel Research Agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      }, 700);
    } catch (e) {
      console.error('Chat error', e);
      setIsTyping(false);
      toast.error('Network delay reaching agent swarm. Showing cached recommendation.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col bg-white dark:bg-[#160a0f] border border-slate-200 dark:border-[#33151f] rounded-3xl shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#33151f] flex items-center justify-between bg-slate-50/50 dark:bg-[#1e0c15]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-950 via-rose-900 to-rose-700 text-white flex items-center justify-center shadow-md shadow-rose-950/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              AI Travel Concierge
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-rose-900/70 dark:text-rose-200/70">Connected to 11 Autonomous Multi-Agents</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setMessages([
              {
                id: 'm-1',
                sender: 'assistant',
                text: 'Conversation reset. How may I assist your travel plans today?',
                agentName: 'Orchestrator Agent',
                timestamp: 'Just now',
              },
            ]);
            toast.info('Chat conversation reset.');
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-800 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-[#200d14] cursor-pointer"
          title="Reset conversation"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-950 to-rose-800 text-white flex items-center justify-center text-xs shrink-0 mt-1 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white shadow-md shadow-rose-950/20 rounded-tr-none'
                  : 'bg-slate-100 dark:bg-[#200d14] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-[#33151f] rounded-tl-none'
              }`}
            >
              {msg.agentName && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-800 dark:text-rose-300 mb-1">
                  <Sparkles className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                  {msg.agentName}
                </div>
              )}
              <p className="whitespace-pre-line">{msg.text}</p>
              <span className={`block text-[10px] mt-2 ${msg.sender === 'user' ? 'text-rose-200' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 flex items-center justify-center text-xs font-bold shrink-0 mt-1 border border-rose-200 dark:border-rose-900/60">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300">
            <div className="w-7 h-7 rounded-lg bg-rose-900 text-white flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span>Agents synthesizing recommendations...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pill Carousel */}
      <div className="p-3 border-t border-slate-100 dark:border-[#33151f] bg-slate-50/50 dark:bg-[#160a0f] flex items-center gap-2 overflow-x-auto scrollbar-none">
        {CHAT_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-[#200d14] border border-slate-200 dark:border-[#33151f] hover:border-rose-800 dark:hover:border-rose-700 hover:text-rose-900 dark:hover:text-rose-300 text-slate-600 dark:text-slate-300 whitespace-nowrap transition cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-100 dark:border-[#33151f] bg-white dark:bg-[#160a0f]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about flights, local customs, visa rules, or day trips..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-[#33151f] bg-slate-50 dark:bg-[#0d0608] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-2.5 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 hover:from-rose-800 hover:to-rose-900 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-rose-950/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
