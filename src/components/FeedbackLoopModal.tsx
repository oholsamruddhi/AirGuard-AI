import React, { useState } from 'react';
import { RotateCcw, ArrowRight, ShieldAlert, CheckCircle2, Sparkles, X, Activity } from 'lucide-react';
import { LocationData, AgentAnalysisData } from '../types/airguard';

interface FeedbackLoopModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationData;
  analysis: AgentAnalysisData;
  onApplyReplan: (replannedAction: string, newAqi: number) => void;
}

export const FeedbackLoopModal: React.FC<FeedbackLoopModalProps> = ({
  isOpen,
  onClose,
  location,
  analysis,
  onApplyReplan,
}) => {
  if (!isOpen) return null;

  const [simulatedIncomingAqi, setSimulatedIncomingAqi] = useState(248);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    evaluationStatus: string;
    driftAnalysis: string;
    replannedAction: string;
    escalationRequired: boolean;
    agentRationale: string;
  } | null>(null);

  const handleSimulateNewTelemetry = async (targetAqi: number) => {
    setSimulatedIncomingAqi(targetAqi);
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/gemini/re-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initialAqi: location.aqi,
          predictedAqi: analysis.forecast.peakAqi,
          newObservedAqi: targetAqi,
          locationName: location.name,
          appliedIntervention: analysis.actionPlan[0]?.action,
        }),
      });

      const json = await res.json();
      setEvaluationResult(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-rose-400 animate-spin" style={{ animationDuration: '10s' }} />
            <div>
              <h4 className="text-sm font-bold text-slate-100">
                AGENTIC FEEDBACK & REPLANNING COGNITIVE LOOP
              </h4>
              <p className="text-[11px] font-mono text-slate-400">
                Adaptive closed-loop reevaluation against incoming telemetry drift
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-xs text-slate-300">
          {/* Timeline Comparison */}
          <div className="grid grid-cols-3 gap-3 text-center font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">1. Initial Baseline</span>
              <span className="text-lg font-bold text-slate-100 block mt-0.5">AQI {location.aqi}</span>
              <span className="text-[10px] text-slate-400">Initial Observed</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">2. Predicted Peak</span>
              <span className="text-lg font-bold text-orange-400 block mt-0.5">AQI {analysis.forecast.peakAqi}</span>
              <span className="text-[10px] text-slate-400">+4h Forecast</span>
            </div>

            <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30">
              <span className="text-[10px] text-red-400 block uppercase">3. New Sensor Telemetry</span>
              <span className="text-lg font-bold text-red-400 block mt-0.5">AQI {simulatedIncomingAqi}</span>
              <span className="text-[10px] text-red-300">Incoming Drift</span>
            </div>
          </div>

          {/* Scenarios selector */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Simulate Incoming Sensor Reading:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSimulateNewTelemetry(248)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  simulatedIncomingAqi === 248
                    ? 'bg-red-500/10 border-red-500/50 ring-1 ring-red-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-red-400 mb-1">
                  <span>Scenario A: Further Spike</span>
                  <span className="font-mono">AQI 248</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Sensor detects unexpected secondary nocturnal stack discharge; exceeds initial forecast tolerance.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSimulateNewTelemetry(192)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  simulatedIncomingAqi === 192
                    ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                  <span>Scenario B: Early Stabilization</span>
                  <span className="font-mono">AQI 192</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Misting cannons & wind shift induce earlier particulate deposition than anticipated.
                </p>
              </button>
            </div>
          </div>

          {/* Autonomous Reevaluation Card */}
          {isEvaluating ? (
            <div className="p-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center gap-3 font-mono text-emerald-400">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Gemini Agent Reevaluating Dispatched Directives...</span>
            </div>
          ) : evaluationResult ? (
            <div className="p-4 rounded-lg bg-slate-950 border border-rose-500/40 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-rose-400 font-bold text-xs uppercase flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  New Evidence Received · Re-Evaluating Previous Prediction
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    evaluationResult.escalationRequired
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  STATUS: {evaluationResult.evaluationStatus}
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                {evaluationResult.driftAnalysis}
              </div>

              <div className="p-3 rounded bg-rose-950/20 border border-rose-500/30 text-xs">
                <span className="text-rose-300 font-bold block mb-1">
                  UPDATED REPLANNED ACTION DIRECTIVE:
                </span>
                <p className="text-slate-100 font-medium">{evaluationResult.replannedAction}</p>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed italic">
                Reasoning: {evaluationResult.agentRationale}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono text-slate-500">
              Select a telemetry drift scenario above to trigger the autonomous replanning engine.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">
            Autonomous closed-loop feedback pipeline
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
            >
              Cancel
            </button>

            {evaluationResult && (
              <button
                onClick={() => {
                  onApplyReplan(evaluationResult.replannedAction, simulatedIncomingAqi);
                  onClose();
                }}
                className="px-4 py-1.5 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>APPLY REPLANNED DIRECTIVE</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
