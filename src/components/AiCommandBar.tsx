import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, CornerDownLeft, X, MessageSquare, ChevronUp, ChevronDown } from 'lucide-react';
import { LocationData } from '../types/airguard';

interface AiCommandBarProps {
  locations: LocationData[];
  selectedLocation: LocationData;
}

interface Message {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

export const AiCommandBar: React.FC<AiCommandBarProps> = ({ locations, selectedLocation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'gemini',
      text: `Hello! I am **AirGuard AI**, your autonomous clean air & climate resilience reasoning agent. I continuously synthesize ground IoT sensors, satellite optical depth, weather stagnation profiles, and citizen reports.\n\nAsk me anything about current hotspots, root causes, forecasts, or authority action directives.`,
      timestamp: '10:14',
    },
  ]);

  const presetQuestions = [
    'Analyze the current industrial zone.',
    'Which area has the highest pollution risk?',
    'Why is AQI increasing?',
    'What action should authorities take?',
    'Show me the next predicted pollution spike.',
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          currentContext: {
            selected: selectedLocation,
            allHotspots: locations,
          },
        }),
      });

      const json = await res.json();
      const botMsg: Message = {
        id: `g-${Date.now()}`,
        sender: 'gemini',
        text: json.answer || 'Unable to retrieve analysis from agentic reasoning engine.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-950 transition-colors select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 tracking-wide">
                ASK AIRGUARD AI — COGNITIVE CLIMATE ASSISTANT
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                GEMINI 3.8 FLASH
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Interactive multi-source interrogation & rapid authority policy synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs hidden sm:inline">{isOpen ? 'Collapse Console' : 'Expand Interrogation Console'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Main Body */}
      {isOpen && (
        <div className="p-5 flex flex-col gap-4">
          {/* Preset question pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Suggested Inquiries:</span>
            {presetQuestions.map((pq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(pq)}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              >
                {pq}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl text-xs flex gap-3 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 ml-8'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 mr-8'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {m.sender === 'user' ? (
                    <User className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="font-bold text-slate-400">
                      {m.sender === 'user' ? 'Civic Authority / User' : 'AirGuard AI Agent'}
                    </span>
                    <span>{m.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-line font-sans text-xs">
                    {m.text}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 font-mono">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Gemini Agent querying sensor vectors & formulating policy response...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AirGuard AI: 'Why is AQI increasing?', 'Recommend mitigation for NH-3'..."
              className="flex-1 py-2.5 px-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SEND</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
