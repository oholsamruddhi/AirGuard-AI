import React, { useState } from 'react';
import { LocationData, SeverityLevel } from '../types/airguard';
import { 
  Wind, 
  Layers, 
  Radio, 
  Users, 
  Sparkles, 
  Maximize2, 
  RotateCw, 
  MapPin, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface PollutionMapProps {
  locations: LocationData[];
  selectedLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  onRunAnalysis: (loc: LocationData) => void;
  isSimulatedActive: boolean;
}

export const PollutionMap: React.FC<PollutionMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onRunAnalysis,
  isSimulatedActive,
}) => {
  const [activeLayers, setActiveLayers] = useState({
    heatmap: true,
    wind: true,
    satellite: true,
    citizens: true,
    sensors: true,
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/40', glow: 'rgba(16, 185, 129, 0.4)' };
    if (aqi <= 100) return { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500/40', glow: 'rgba(34, 197, 94, 0.4)' };
    if (aqi <= 150) return { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/40', glow: 'rgba(245, 158, 11, 0.4)' };
    if (aqi <= 200) return { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/40', glow: 'rgba(249, 115, 22, 0.4)' };
    return { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/40', glow: 'rgba(239, 68, 68, 0.4)' };
  };

  // Convert lat/lng to SVG percentage coordinates
  // Lat range: 19.92 to 20.16 -> SVG Y 90% to 10%
  // Lng range: 73.66 to 73.86 -> SVG X 10% to 90%
  const getMapCoordinates = (lat: number, lng: number) => {
    const minLat = 19.93;
    const maxLat = 20.16;
    const minLng = 73.66;
    const maxLng = 73.86;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Map Header / Layer Bar */}
      <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h3 className="text-sm font-semibold text-slate-100 tracking-wide">
              GIS LIVE POLLUTION MATRIX
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">·</span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Nashik Metropole Grid · 19.997° N, 73.789° E
          </span>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs">
          <button
            onClick={() => toggleLayer('heatmap')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeLayers.heatmap
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Heatmap</span>
          </button>

          <button
            onClick={() => toggleLayer('wind')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeLayers.wind
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3 h-3" />
            <span>Wind Vectors</span>
          </button>

          <button
            onClick={() => toggleLayer('satellite')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeLayers.satellite
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Satellite Plumes</span>
          </button>

          <button
            onClick={() => toggleLayer('citizens')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeLayers.citizens
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Reports</span>
          </button>
        </div>
      </div>

      {/* Main Map Body: Canvas Grid + SVG overlays */}
      <div className="relative w-full h-[460px] bg-slate-950 overflow-hidden select-none">
        {/* Subtle topographical GIS grid background */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.25) 1px, transparent 0),
              linear-gradient(to right, rgba(51, 65, 85, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(51, 65, 85, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px, 72px 72px, 72px 72px',
          }}
        />

        {/* SVG GIS Layer: Roads, River Basin, Heatmap Polygons */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            {/* Radial Gradients for Heat Zones */}
            <radialGradient id="heat-red" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heat-orange" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#f97316" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heat-yellow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heat-green" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="75%" stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>

            {/* Satellite plume pattern */}
            <linearGradient id="satellite-plume" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#ec4899" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Godavari River Spine (Subtle Blue GIS feature) */}
          <path
            d="M 10 240 Q 140 220 280 250 T 480 290 T 700 270 T 980 340"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3.5"
            strokeOpacity="0.35"
            strokeDasharray="8 3"
          />
          <text x="210" y="240" fill="#38bdf8" fillOpacity="0.5" fontSize="10" fontFamily="monospace">
            Godavari River Basin
          </text>

          {/* Major Highway Arterials (NH-3 Mumbai-Agra Highway) */}
          <path
            d="M 150 440 L 460 260 L 680 180 L 920 80"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.5"
            strokeOpacity="0.4"
          />
          <text x="540" y="210" fill="#94a3b8" fillOpacity="0.6" fontSize="9" fontFamily="monospace">
            NH-3 Freight Arterial Corridor
          </text>

          {/* Ring Road Feeder */}
          <circle
            cx="520"
            cy="270"
            r="160"
            fill="none"
            stroke="#475569"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            strokeOpacity="0.3"
          />

          {/* Heatmap Overlay Circles */}
          {activeLayers.heatmap && (
            <>
              {/* Ambad Industrial (Orange/Red) */}
              <circle cx="360" cy="340" r="110" fill="url(#heat-orange)" />
              {/* Highway Corridor (Red) */}
              <ellipse cx="640" cy="220" rx="130" ry="85" transform="rotate(-20 640 220)" fill="url(#heat-red)" />
              {/* City Center (Yellow) */}
              <circle cx="530" cy="245" r="75" fill="url(#heat-yellow)" />
              {/* Dindori Agri Belt (Yellow/Green) */}
              <ellipse cx="760" cy="110" rx="95" ry="60" fill={isSimulatedActive ? 'url(#heat-red)' : 'url(#heat-yellow)'} />
              {/* Gangapur Reservoir (Green buffer) */}
              <ellipse cx="180" cy="220" rx="85" ry="70" fill="url(#heat-green)" />
            </>
          )}

          {/* Satellite Plume Overlay */}
          {activeLayers.satellite && (
            <path
              d="M 360 340 Q 420 310 520 330 T 680 320"
              fill="url(#satellite-plume)"
              stroke="#a855f7"
              strokeWidth="1.5"
              strokeOpacity="0.6"
              strokeDasharray="6 3"
            />
          )}

          {/* Wind Streamline Vectors */}
          {activeLayers.wind && (
            <g stroke="#06b6d4" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="6 8">
              <path d="M 120 80 L 260 140" className="animate-pulse" />
              <path d="M 320 90 L 460 150" className="animate-pulse" />
              <path d="M 520 100 L 660 160" className="animate-pulse" />
              <path d="M 220 240 L 360 300" className="animate-pulse" />
              <path d="M 440 250 L 580 310" className="animate-pulse" />
              <path d="M 620 270 L 760 330" className="animate-pulse" />
            </g>
          )}
        </svg>

        {/* Interactive Clickable Hotspot Markers */}
        {locations.map((loc) => {
          const coords = getMapCoordinates(loc.lat, loc.lng);
          const aqiStyle = getAqiColor(loc.aqi);
          const isSelected = selectedLocation.id === loc.id;
          const isCritical = loc.status === 'CRITICAL' || loc.aqi >= 200;

          return (
            <div
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 focus:outline-none"
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
            >
              {/* Outer pulsing ping for high risk */}
              {(isCritical || loc.status === 'HIGH') && (
                <span
                  className="absolute -inset-3 rounded-full opacity-75 animate-ping pointer-events-none"
                  style={{ backgroundColor: aqiStyle.glow }}
                />
              )}

              {/* Main Pin Container */}
              <div
                className={`relative px-2.5 py-1.5 rounded-lg border backdrop-blur-md transition-all duration-200 flex items-center gap-2 shadow-lg ${
                  isSelected
                    ? 'bg-slate-900 border-white ring-2 ring-emerald-400 scale-110 z-30'
                    : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 hover:scale-105'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${aqiStyle.bg} shrink-0 animate-pulse`}
                />

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-100 tracking-tight leading-tight">
                      {loc.shortName}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${aqiStyle.bg}/20 ${aqiStyle.text}`}
                    >
                      AQI {loc.aqi}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span>PM2.5: {loc.pm25}</span>
                    <span>·</span>
                    <span>{loc.status}</span>
                  </div>
                </div>
              </div>

              {/* Citizen count beacon badge */}
              {activeLayers.citizens && loc.citizenReports > 0 && (
                <div className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {loc.citizenReports}
                </div>
              )}
            </div>
          );
        })}

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 backdrop-blur-md z-10 text-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            AQI Severity Legend
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300">0-50 Good</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-300">101-150 Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-slate-300">151-200 Poor (High)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-slate-300">201+ Critical</span>
            </div>
          </div>
        </div>

        {/* Live Weather Indicator on Map */}
        <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 backdrop-blur-md z-10 text-xs flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Wind className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-mono text-[11px]">5 km/h NW</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-300 text-[11px] font-mono">
            31°C · Inversion: 310m
          </div>
        </div>
      </div>

      {/* Selected Hotspot Deep-Dive Drawer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-100">{selectedLocation.name}</h4>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {selectedLocation.zone}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                  selectedLocation.status === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : selectedLocation.status === 'HIGH'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {selectedLocation.status} RISK
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1 font-mono">
              <span>AQI: <strong className="text-slate-100">{selectedLocation.aqi}</strong></span>
              <span>PM2.5: <strong className="text-slate-100">{selectedLocation.pm25} µg/m³</strong></span>
              <span>PM10: <strong className="text-slate-100">{selectedLocation.pm10} µg/m³</strong></span>
              <span>Citizen Reports: <strong className="text-amber-400">{selectedLocation.citizenReports}</strong></span>
              <span>Wind: <strong className="text-cyan-400">{selectedLocation.windSpeed} km/h {selectedLocation.windDirection}</strong></span>
            </div>

            <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">
              <span className="text-slate-300 font-medium">{selectedLocation.probableCause}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={() => onRunAnalysis(selectedLocation)}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>RUN AI ANALYSIS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
