import React from 'react';
import { Shield, Sparkles, Flame, RotateCcw, Activity, Play, CheckCircle2 } from 'lucide-react';
import { LocationData } from '../types/airguard';

interface HeaderProps {
  onSimulateEvent: () => void;
  onRunAnalysis: () => void;
  onOpenFeedback: () => void;
  isSimulating: boolean;
  isAnalyzing: boolean;
  isSimulatedActive: boolean;
  selectedLocation: LocationData;
}

export const Header: React.FC<HeaderProps> = ({
  onSimulateEvent,
  onRunAnalysis,
  onOpenFeedback,
  isSimulating,
  isAnalyzing,
  isSimulatedActive,
  selectedLocation,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Banner: Brand + 10-second Judge Comprehension Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Brand & Subtitle */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10 shrink-0">
              <Shield className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-100 font-mono">
                  AIRGUARD AI
                </h1>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Track 2 — Clean Air & Climate Resilience
                </span>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>AI AGENT STATUS: ACTIVE</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-0.5">
                "Detect. Predict. Explain. Act." — Agentic Intelligence for Hyper-Local Climate Action
              </p>
            </div>
          </div>

          {/* Key Hackathon Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* The primary Hackathon simulation trigger */}
            <button
              onClick={onSimulateEvent}
              disabled={isSimulating}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                isSimulatedActive
                  ? 'bg-red-500 hover:bg-red-400 text-slate-950 shadow-red-500/30 ring-2 ring-red-400 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              <Flame className={`w-4 h-4 ${isSimulating ? 'animate-bounce' : ''}`} />
              <span>{isSimulating ? 'TRIGGERING EVENT...' : isSimulatedActive ? '🔥 POLLUTION EVENT SIMULATED' : '🔥 SIMULATE POLLUTION EVENT'}</span>
            </button>

            {/* Run Full Agent Workflow */}
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'REASONING...' : 'RUN AI ANALYSIS'}</span>
            </button>

            {/* Agent Feedback Loop Modal Trigger */}
            <button
              onClick={onOpenFeedback}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">AGENT FEEDBACK LOOP</span>
              <span className="sm:hidden">FEEDBACK</span>
            </button>
          </div>
        </div>

        {/* Instant 10-Second Comprehension Ribbon for Judges */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 overflow-x-auto text-xs font-mono">
          <div className="flex items-center gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 uppercase text-[10px]">LIVE HOTSPOTS:</span>
              <span className="text-red-400 font-bold">3 Detected</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 uppercase text-[10px]">REGIONAL AQI:</span>
              <span className="text-orange-400 font-bold">{selectedLocation.aqi}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 uppercase text-[10px]">AI RISK LEVEL:</span>
              <span className="text-red-400 font-bold">{selectedLocation.status}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 uppercase text-[10px]">PREDICTED SPIKE:</span>
              <span className="text-amber-300 font-bold">+4h Crest (AQI 231)</span>
            </div>
          </div>

          <div className="text-emerald-400 font-semibold flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Autonomous Closed-Loop Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
