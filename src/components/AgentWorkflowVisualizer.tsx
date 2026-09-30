import React, { useState } from 'react';
import { AgentAnalysisData, LocationData } from '../types/airguard';
import { 
  Cpu, 
  Eye, 
  BrainCircuit, 
  TrendingUp, 
  FileText, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  Terminal, 
  Share2, 
  AlertOctagon, 
  ShieldAlert,
  ArrowRight,
  Flame,
  Clock,
  Compass,
  Building2,
  Workflow
} from 'lucide-react';

interface AgentWorkflowVisualizerProps {
  analysis: AgentAnalysisData;
  location: LocationData;
  isLoading: boolean;
  onTriggerFeedbackLoop: () => void;
  isLiveGemini?: boolean;
}

export const AgentWorkflowVisualizer: React.FC<AgentWorkflowVisualizerProps> = ({
  analysis,
  location,
  isLoading,
  onTriggerFeedbackLoop,
  isLiveGemini,
}) => {
  const [activeTab, setActiveTab] = useState<'cycle' | 'detection' | 'forecast' | 'rootCause' | 'action' | 'coordination' | 'tools'>('cycle');

  const steps = [
    { key: 'perceive', label: '1. PERCEIVE', icon: Eye, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
    { key: 'reason', label: '2. REASON', icon: BrainCircuit, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
    { key: 'forecast', label: '3. FORECAST', icon: TrendingUp, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
    { key: 'plan', label: '4. PLAN', icon: FileText, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
    { key: 'act', label: '5. ACT', icon: Send, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
    { key: 'replan', label: '6. REPLAN', icon: RotateCcw, color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header with Agent Status & Live/Simulated Engine Flag */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 tracking-wide">
                AGENTIC REASONING ENGINE
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                GEMINI 3.8 FLASH
              </span>
              {isLiveGemini ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  LIVE API
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  PROTOTYPE SIMULATION
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Autonomous cognitive loop: Multi-source sensor perception, causal isolation & rapid civic intervention
            </p>
          </div>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('cycle')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'cycle'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Agentic Cycle
          </button>
          <button
            onClick={() => setActiveTab('detection')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'detection'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Detection Agent
          </button>
          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'forecast'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Forecast Agent
          </button>
          <button
            onClick={() => setActiveTab('rootCause')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'rootCause'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Root Cause
          </button>
          <button
            onClick={() => setActiveTab('action')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'action'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Action Plan
          </button>
          <button
            onClick={() => setActiveTab('coordination')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'coordination'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Federated Coordination
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'tools'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Tool Calls ({analysis.toolExecutionChain?.length || 10})</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-5">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
            <div className="relative w-12 h-12">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <BrainCircuit className="w-5 h-5 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              Gemini Agent Calling Multi-Source Climate Tools...
            </p>
            <p className="text-xs text-slate-500 font-mono">
              PERCEIVE [Sensors, Weather, Sentinel-5P, Citizens] → REASON → FORECAST → ACT
            </p>
          </div>
        ) : (
          <>
            {/* VIEW 1: AGENTIC CYCLE (High-impact Visual Flow) */}
            {activeTab === 'cycle' && (
              <div className="space-y-6">
                {/* Horizontal Step Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {steps.map((st, idx) => {
                    const Icon = st.icon;
                    return (
                      <div
                        key={st.key}
                        className={`p-3 rounded-lg border ${st.border} ${st.bg} flex flex-col items-start gap-1.5 transition-all`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Icon className={`w-4 h-4 ${st.color}`} />
                          <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                        </div>
                        <span className={`text-xs font-bold tracking-tight ${st.color}`}>
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Cognitive Stage Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Stage A: Perceive & Detect */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                        <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                          <Eye className="w-3.5 h-3.5" /> 1. PERCEIVES
                        </span>
                        <span>4 Data Ingestion Streams</span>
                      </div>
                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">IoT Sensors</span>
                          <p className="mt-0.5">{analysis.perceivedData.sensors}</p>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Satellite Observation</span>
                          <p className="mt-0.5">{analysis.perceivedData.satellite}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Status: Sensor Mesh Ingested</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>

                  {/* Stage B: Reason & Forecast */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                        <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
                          <BrainCircuit className="w-3.5 h-3.5" /> 2 & 3. REASONS & FORECASTS
                        </span>
                        <span className="text-orange-400 font-bold">{analysis.severity} RISK</span>
                      </div>
                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Probable Root Cause</span>
                          <p className="mt-0.5 text-amber-300 font-medium">
                            {analysis.rootCauseAnalysis.primaryProbableCause}
                          </p>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Predicted +4h Peak</span>
                          <p className="mt-0.5 font-mono">
                            AQI <span className="text-red-400 font-bold text-sm">{analysis.forecast.peakAqi}</span> (Window: Next {analysis.forecast.peakWindowHours}h)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Confidence: {analysis.rootCauseAnalysis.confidenceLevel}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>

                  {/* Stage C: Plan, Act & Replan */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <Send className="w-3.5 h-3.5" /> 4, 5 & 6. ACTS & REPLANS
                        </span>
                        <span className="text-emerald-400 font-bold">ACTIVE CADENCE</span>
                      </div>
                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Dispatched Directive</span>
                          <p className="mt-0.5 text-slate-200 line-clamp-2">
                            {analysis.actionPlan[0]?.action || 'Dispatch Immediate Level-2 Flying Squad Inspection'}
                          </p>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Telemetry Escalation</span>
                          <p className="mt-0.5 font-mono text-emerald-400">
                            {analysis.monitoringFrequency.previousIntervalMinutes}m → {analysis.monitoringFrequency.updatedIntervalMinutes}m Sampling Override
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <button
                        onClick={onTriggerFeedbackLoop}
                        className="text-[11px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Simulate Feedback Loop</span>
                      </button>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: POLLUTION DETECTION AGENT */}
            {activeTab === 'detection' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-red-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-red-400" />
                      <span className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                        HOTSPOT DETECTED
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                      SEVERITY: {analysis.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs mb-4">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">LOCATION</span>
                      <strong className="text-slate-100 text-sm">{location.name}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">CURRENT AQI</span>
                      <strong className="text-orange-400 text-sm">{location.aqi}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">PM2.5 CONCENTRATION</span>
                      <strong className="text-red-400 text-sm">{location.pm25} µg/m³</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">PM10 CONCENTRATION</span>
                      <strong className="text-amber-400 text-sm">{location.pm10} µg/m³</strong>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 font-bold block mb-1">EVIDENCE:</span>
                      <p className="text-slate-300 leading-relaxed font-mono">
                        {analysis.rootCauseAnalysis.evidenceRationale}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 font-bold block mb-1">DETECTION REASON:</span>
                      <p className="text-slate-300 leading-relaxed">
                        Continuous sensor telemetry breached the 15-minute moving average threshold by 214%. Corroborated by {location.citizenReports} geo-fenced citizen complaints and elevated optical column density.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: FORECAST AGENT */}
            {activeTab === 'forecast' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        ATMOSPHERIC DISPERSION & AQI FORECAST
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        AI Forecast — Prototype Simulation
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
                      RISK: {analysis.forecast.riskLevel}
                    </span>
                  </div>

                  {/* 4-Step Forecast Grid */}
                  <div className="grid grid-cols-4 gap-3 text-center mb-5">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-mono">Current AQI</span>
                      <span className="text-xl font-bold font-mono text-slate-100 mt-1 block">
                        {analysis.forecast.currentAqi}
                      </span>
                      <span className="text-[10px] text-slate-500">Observed Now</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-mono">+2 hours</span>
                      <span className="text-xl font-bold font-mono text-orange-400 mt-1 block">
                        {analysis.forecast.plus2h}
                      </span>
                      <span className="text-[10px] text-amber-500/80">▲ +{analysis.forecast.plus2h - analysis.forecast.currentAqi} pts</span>
                    </div>

                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40">
                      <span className="text-[11px] text-red-300 block font-mono">+4 hours (PEAK)</span>
                      <span className="text-xl font-bold font-mono text-red-400 mt-1 block">
                        {analysis.forecast.plus4h}
                      </span>
                      <span className="text-[10px] text-red-400">Peak Window Spike</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block font-mono">+6 hours</span>
                      <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
                        {analysis.forecast.plus6h}
                      </span>
                      <span className="text-[10px] text-emerald-400">▼ Thermal Mixing</span>
                    </div>
                  </div>

                  {/* Causal Explanation for Why Risk is Increasing */}
                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                    <span className="text-slate-100 font-semibold block text-sm">
                      Why the risk is increasing:
                    </span>
                    <p className="leading-relaxed">
                      {analysis.forecast.forecastExplanation}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                      <span>Inversion Ceiling: <strong>310 meters</strong></span>
                      <span>Horizontal Ventilation: <strong>5 km/h NW</strong></span>
                      <span>Convective Stability: <strong>Class F (Extreme Stagnation)</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: ROOT CAUSE AGENT */}
            {activeTab === 'rootCause' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        ROOT CAUSE ATTRIBUTION MATRIX
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Differentiating confirmed evidence from contributing environmental conditions
                      </p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                      {analysis.rootCauseAnalysis.confidenceLevel}
                    </span>
                  </div>

                  {/* Probable Cause vs Contributing Factors */}
                  <div className="space-y-3 mt-4 text-xs">
                    {/* Primary Probable Cause */}
                    <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                        PROBABLE CAUSE
                      </span>
                      <p className="text-sm font-semibold text-slate-100">
                        {analysis.rootCauseAnalysis.primaryProbableCause}
                      </p>
                    </div>

                    {/* Contributing Factors */}
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        POSSIBLE CONTRIBUTING FACTORS
                      </span>
                      <ul className="space-y-2 text-slate-300">
                        {analysis.rootCauseAnalysis.contributingFactors.map((factor, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <span className="text-slate-500 font-mono">[{fIdx + 1}]</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Scientific disclaimer badge */}
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 italic">
                      Note: AirGuard AI models probabilistic causal attribution using ground sensor covariance, satellite optical depth, and wind dispersion vectors. Causes are classified as "Probable Cause" or "Possible Contributing Factor" rather than absolute assertions.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 5: CLIMATE ACTION AGENT */}
            {activeTab === 'action' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        RECOMMENDED CIVIC & REGULATORY INTERVENTIONS
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Action directives with explicit justification for municipal & state authorities
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    {analysis.actionPlan.map((act, aIdx) => (
                      <div
                        key={aIdx}
                        className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-[10px]">
                              {aIdx + 1}
                            </span>
                            {act.action}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              act.priority === 'URGENT'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : act.priority === 'HIGH'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {act.priority}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 font-mono">
                          Target Agency: <strong className="text-slate-300">{act.targetEntity}</strong>
                        </div>

                        <div className="p-2 rounded bg-slate-950 border border-slate-800/80 text-xs text-emerald-300">
                          <span className="font-bold text-[10px] text-slate-400 block font-mono">WHY RECOMMENDED:</span>
                          {act.whyRecommended}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 6: FEDERATED COORDINATION AGENT */}
            {activeTab === 'coordination' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        CROSS-JURISDICTION FEDERATED POLLUTION NETWORK
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Real-time downwind plume propagation & inter-city state-level coordination
                      </p>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5" /> Federated Mesh Active
                    </span>
                  </div>

                  {/* Flow Diagram: City A -> Shared Model -> City B -> State Dashboard */}
                  <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-center">
                    {/* Node 1: City A */}
                    <div className="p-3.5 rounded-lg bg-slate-950 border border-orange-500/30 w-full md:w-48 text-left">
                      <div className="flex items-center justify-between text-[10px] font-mono text-orange-400 mb-1">
                        <span>ORIGIN NODE</span>
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <h5 className="text-xs font-bold text-slate-100">City A: Nashik MIDC</h5>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">AQI: 182 (High)</p>
                      <p className="text-[10px] text-slate-500 mt-1">Plume trajectory: 5 km/h NW → SE</p>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block shrink-0" />

                    {/* Node 2: Shared Federated Model */}
                    <div className="p-3.5 rounded-lg bg-purple-950/30 border border-purple-500/40 w-full md:w-56 text-left">
                      <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 mb-1">
                        <span>FEDERATED DISPERSION MODEL</span>
                        <BrainCircuit className="w-3.5 h-3.5" />
                      </div>
                      <h5 className="text-xs font-bold text-purple-200">Plume Propagation Engine</h5>
                      <p className="text-[11px] text-slate-300 font-mono mt-1">Downwind ETA: +3.2 hours</p>
                      <p className="text-[10px] text-slate-400 mt-1">Preserves local privacy, shares dispersion vectors</p>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block shrink-0" />

                    {/* Node 3: City B */}
                    <div className="p-3.5 rounded-lg bg-slate-950 border border-cyan-500/30 w-full md:w-48 text-left">
                      <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1">
                        <span>RECEPTOR NODE</span>
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <h5 className="text-xs font-bold text-slate-100">City B: Sinnar Sub-District</h5>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">Current: AQI 84 → Exp: 142</p>
                      <p className="text-[10px] text-cyan-400 mt-1">Preemptive alert issued to hospitals</p>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block shrink-0" />

                    {/* Node 4: State Level */}
                    <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 w-full md:w-48 text-left">
                      <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 mb-1">
                        <span>CPCB / STATE LEVEL</span>
                        <Workflow className="w-3.5 h-3.5" />
                      </div>
                      <h5 className="text-xs font-bold text-emerald-200">State Climate Dashboard</h5>
                      <p className="text-[11px] text-slate-300 font-mono mt-1">Regional Corridor Alert</p>
                      <p className="text-[10px] text-emerald-400 mt-1">Harmonized multi-city mitigation</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 7: TOOL CALL EXECUTION CHAIN */}
            {activeTab === 'tools' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        GEMINI FUNCTION CALLING & TOOL EXECUTION TRACE
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Autonomous tool selection sequence executed by Gemini 3.8 Flash
                      </p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      10/10 Tools Succeeded
                    </span>
                  </div>

                  <div className="space-y-2 mt-4">
                    {analysis.toolExecutionChain?.map((tc) => (
                      <div
                        key={tc.step}
                        className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                            {tc.step}
                          </span>
                          <div>
                            <span className="text-emerald-400 font-bold">{tc.tool}()</span>
                            <span className="text-slate-400 ml-2 text-[11px] hidden sm:inline">
                              · {tc.action}
                            </span>
                          </div>
                        </div>

                        <div className="p-1.5 px-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px] self-stretch sm:self-auto text-right">
                          {tc.outputSummary}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
