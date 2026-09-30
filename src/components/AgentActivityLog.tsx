import React from 'react';
import { ActivityLogItem } from '../types/airguard';
import { Activity, CheckCircle2, AlertTriangle, ShieldCheck, Terminal } from 'lucide-react';

interface AgentActivityLogProps {
  logs: ActivityLogItem[];
  onClearLogs?: () => void;
}

export const AgentActivityLog: React.FC<AgentActivityLogProps> = ({ logs }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">
              AUTONOMOUS AGENT ACTIVITY FEED
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Real-time cognitive event pipeline & trace records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">
            STREAMING LIVE
          </span>
        </div>
      </div>

      {/* Activity Log List */}
      <div className="p-4 space-y-2.5 max-h-[360px] overflow-y-auto">
        {logs.map((log) => {
          const isAlert = log.type === 'alert';
          const isAction = log.type === 'action';
          const isSuccess = log.type === 'success';

          return (
            <div
              key={log.id}
              className={`p-2.5 rounded-lg border text-xs font-mono flex items-start gap-3 transition-all duration-300 animate-slide-in ${
                isAlert
                  ? 'bg-red-950/20 border-red-500/30 text-red-300'
                  : isAction
                  ? 'bg-blue-950/20 border-blue-500/30 text-blue-300'
                  : isSuccess
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isAlert ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                ) : isAction ? (
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
                      log.agent === 'Detection'
                        ? 'bg-orange-500/20 text-orange-400'
                        : log.agent === 'Forecast'
                        ? 'bg-amber-500/20 text-amber-400'
                        : log.agent === 'RootCause'
                        ? 'bg-purple-500/20 text-purple-400'
                        : log.agent === 'Action'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {log.agent} Agent
                  </span>
                  <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                </div>
                <p className="text-slate-200 leading-snug">{log.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
