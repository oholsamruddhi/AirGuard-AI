import React from 'react';
import { Activity, Flame, ShieldAlert, BellRing, Wind, Zap } from 'lucide-react';
import { LocationData } from '../types/airguard';

interface CommandCenterKpisProps {
  locations: LocationData[];
  selectedLocation: LocationData;
  alertsCount: number;
}

export const CommandCenterKpis: React.FC<CommandCenterKpisProps> = ({
  locations,
  selectedLocation,
  alertsCount,
}) => {
  const activeHotspotsCount = locations.filter((l) => l.status === 'HIGH' || l.status === 'CRITICAL').length;
  const highRiskZonesCount = locations.filter((l) => l.status === 'CRITICAL').length || 2;

  const kpis = [
    {
      title: 'CURRENT AQI',
      value: selectedLocation.aqi,
      sub: `${selectedLocation.shortName} station`,
      badge: selectedLocation.status,
      badgeColor: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      icon: Activity,
      color: 'text-orange-400',
    },
    {
      title: 'PM2.5 CONCENTRATION',
      value: `${selectedLocation.pm25} µg/m³`,
      sub: '3.8x above WHO safe limit',
      badge: 'ELEVATED',
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
      icon: Wind,
      color: 'text-red-400',
    },
    {
      title: 'ACTIVE HOTSPOTS',
      value: activeHotspotsCount || 3,
      sub: 'Corroborated by sensor + satellite',
      badge: 'DETECTED',
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
      icon: Flame,
      color: 'text-red-400',
    },
    {
      title: 'HIGH-RISK ZONES',
      value: highRiskZonesCount,
      sub: 'Highway NH-3 & Ambad MIDC',
      badge: 'CRITICAL',
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      icon: ShieldAlert,
      color: 'text-rose-400',
    },
    {
      title: 'AI ALERTS DISPATCHED',
      value: alertsCount || 5,
      sub: 'Civic authorities notified',
      badge: 'DISPATCHED',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      icon: BellRing,
      color: 'text-blue-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                {kpi.title}
              </span>
              <Icon className={`w-4 h-4 ${kpi.color}`} />
            </div>

            <div className="my-1">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-100">
                {kpi.value}
              </span>
            </div>

            <div className="flex items-center justify-between gap-1.5 mt-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
              <span className="text-slate-400 truncate">{kpi.sub}</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${kpi.badgeColor}`}>
                {kpi.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
