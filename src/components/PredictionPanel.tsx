import React, { useState } from 'react';
import { AgentAnalysisData } from '../types/airguard';
import { TrendingUp, AlertTriangle, CloudSun, Wind, ArrowUpRight, Clock, HelpCircle } from 'lucide-react';

interface PredictionPanelProps {
  analysis: AgentAnalysisData;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({ analysis }) => {
  const forecast = analysis.forecast;
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const points = [
    { label: 'Current', aqi: forecast.currentAqi, time: 'Now', note: 'Observed Baseline' },
    { label: '+2 hours', aqi: forecast.plus2h, time: 'T+2h', note: 'Aerosol Trapping' },
    { label: '+4 hours', aqi: forecast.plus4h, time: 'T+4h', note: 'Peak Anomaly Spike' },
    { label: '+6 hours', aqi: forecast.plus6h, time: 'T+6h', note: 'Convective Recovery' },
  ];

  // SVG Chart Geometry
  const chartWidth = 520;
  const chartHeight = 180;
  const paddingX = 45;
  const paddingY = 25;

  const minAqi = 120;
  const maxAqi = 260;

  const getCoordinates = (index: number, aqi: number) => {
    const x = paddingX + (index / (points.length - 1)) * (chartWidth - 2 * paddingX);
    const normalizedY = (aqi - minAqi) / (maxAqi - minAqi);
    const y = chartHeight - paddingY - normalizedY * (chartHeight - 2 * paddingY);
    return { x, y };
  };

  const coords = points.map((p, i) => getCoordinates(i, p.aqi));

  // Construct SVG Path
  const pathD = coords.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = coords[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  // Fill area under curve
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${chartHeight - paddingY} L ${coords[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">
              PREDICTED AQI TRAJECTORY
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              AI Forecast — Prototype Simulation
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
          CURRENT RISK: {forecast.riskLevel}
        </span>
      </div>

      {/* Main Body */}
      <div className="p-5 flex flex-col gap-5">
        {/* KPI Strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Current AQI</span>
            <span className="text-xl font-bold font-mono text-slate-100">{forecast.currentAqi}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Real-time ground sensor</span>
          </div>

          <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30">
            <span className="text-[10px] text-red-400 font-mono block uppercase">Predicted Peak</span>
            <span className="text-xl font-bold font-mono text-red-400">{forecast.peakAqi}</span>
            <span className="text-[10px] text-red-300 block mt-0.5">+4h atmospheric crest</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Expected Window</span>
            <span className="text-xl font-bold font-mono text-amber-400">Next {forecast.peakWindowHours}h</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Peak vulnerability slot</span>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-3 pt-6 select-none overflow-hidden">
          {/* Background grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-20">
            <div className="border-b border-dashed border-slate-700 w-full text-[9px] font-mono text-slate-500 text-right">AQI 250 (Critical)</div>
            <div className="border-b border-dashed border-slate-700 w-full text-[9px] font-mono text-slate-500 text-right">AQI 200 (Severe)</div>
            <div className="border-b border-dashed border-slate-700 w-full text-[9px] font-mono text-slate-500 text-right">AQI 150 (Poor)</div>
          </div>

          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Filled Area */}
            <path d={areaD} fill="url(#curveGradient)" />

            {/* Stroke Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#f97316"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Coordinate Points */}
            {coords.map((pt, i) => {
              const isPeak = points[i].aqi === forecast.peakAqi;
              const isHovered = hoveredPoint === i;

              return (
                <g 
                  key={i} 
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Outer pulse on peak */}
                  {isPeak && (
                    <circle cx={pt.x} cy={pt.y} r="10" fill="#ef4444" opacity="0.3" className="animate-ping" />
                  )}

                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isPeak ? 6 : 5}
                    fill={isPeak ? '#ef4444' : '#f97316'}
                    stroke="#0f172a"
                    strokeWidth="2.5"
                  />

                  {/* AQI text badge */}
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fill={isPeak ? '#f87171' : '#fdba74'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {points[i].aqi}
                  </text>

                  {/* Time label below */}
                  <text
                    x={pt.x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {points[i].time}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover / Tooltip status note */}
          <div className="mt-2 text-center text-[11px] font-mono text-slate-400">
            {hoveredPoint !== null ? (
              <span className="text-emerald-400">
                {points[hoveredPoint].label}: AQI {points[hoveredPoint].aqi} — {points[hoveredPoint].note}
              </span>
            ) : (
              <span>Hover over forecast milestones to view meteorological stage breakdown</span>
            )}
          </div>
        </div>

        {/* Gemini Causal Explanation */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
          <span className="text-slate-100 font-semibold block mb-1">
            Gemini Atmospheric Dispersion Analysis:
          </span>
          <p className="leading-relaxed">
            {forecast.forecastExplanation}
          </p>
        </div>
      </div>
    </div>
  );
};
