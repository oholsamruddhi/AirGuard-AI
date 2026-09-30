import React, { useState } from 'react';
import { IncidentRecord, SeverityLevel, AgentAnalysisData } from '../types/airguard';
import { 
  Building2, 
  AlertTriangle, 
  Send, 
  CheckCircle, 
  Radio, 
  FileText, 
  ExternalLink, 
  ShieldAlert,
  X,
  Copy,
  Printer,
  BellRing
} from 'lucide-react';

interface AuthorityActionCenterProps {
  incidents: IncidentRecord[];
  onUpdateStatus: (id: string, status: IncidentRecord['status']) => void;
  analysis: AgentAnalysisData;
}

export const AuthorityActionCenter: React.FC<AuthorityActionCenterProps> = ({
  incidents,
  onUpdateStatus,
  analysis,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [activeAlertIncident, setActiveAlertIncident] = useState<IncidentRecord | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateAlert = (inc: IncidentRecord) => {
    setActiveAlertIncident(inc);
    setIsAlertModalOpen(true);
  };

  const handleCopyAlert = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">
              AUTHORITY INTERVENTION & DISPATCH CONSOLE
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Maharashtra Pollution Control Board (MPCB) & Municipal Disaster Management Cell
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Active Directives:</span>
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {incidents.filter((i) => i.status !== 'ACTIONED').length} Pending / Dispatched
          </span>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
              <th className="py-3 px-4 font-semibold">INCIDENT / DETAILS</th>
              <th className="py-3 px-4 font-semibold">LOCATION</th>
              <th className="py-3 px-4 font-semibold">SEVERITY</th>
              <th className="py-3 px-4 font-semibold">PROBABLE CAUSE</th>
              <th className="py-3 px-4 font-semibold">AI RECOMMENDATION</th>
              <th className="py-3 px-4 font-semibold">STATUS</th>
              <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {incidents.map((inc) => (
              <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-100">{inc.title}</div>
                  <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{inc.timestamp}</span>
                    <span>·</span>
                    <span>{inc.reportsCount} citizen logs</span>
                  </div>
                </td>

                <td className="py-3 px-4 font-mono text-slate-300">
                  {inc.location}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      inc.severity === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : inc.severity === 'HIGH'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {inc.severity}
                  </span>
                </td>

                <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate" title={inc.probableCause}>
                  {inc.probableCause}
                </td>

                <td className="py-3 px-4 text-emerald-400 font-mono max-w-[220px] truncate" title={inc.recommendation}>
                  {inc.recommendation}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      inc.status === 'PENDING'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : inc.status === 'DISPATCHED'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {inc.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setSelectedIncident(inc)}
                      title="View AI Analysis"
                      className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleGenerateAlert(inc)}
                      className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-[11px] font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <BellRing className="w-3 h-3" />
                      <span>ALERT</span>
                    </button>

                    {inc.status !== 'ACTIONED' && (
                      <button
                        onClick={() => onUpdateStatus(inc.id, 'ACTIONED')}
                        className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>ACTIONED</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: VIEW ANALYSIS DIALOG */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-slate-100">
                  Incident Deep-Dive: {selectedIncident.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">LOCATION</span>
                  <span className="text-slate-100 font-bold">{selectedIncident.location}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">SEVERITY CLASSIFICATION</span>
                  <span className="text-red-400 font-bold">{selectedIncident.severity}</span>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">
                  Identified Probable Cause
                </span>
                <p className="mt-1 text-slate-200 font-medium">{selectedIncident.probableCause}</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">
                  Autonomous AI Action Directive
                </span>
                <p className="mt-1 text-emerald-300">{selectedIncident.recommendation}</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
                <span>Origin: {selectedIncident.source} · Verified by multi-source correlation engine</span>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex justify-end gap-2">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleGenerateAlert(selectedIncident);
                  setSelectedIncident(null);
                }}
                className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Broadcast Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GENERATE OFFICIAL AUTHORITY ALERT */}
      {isAlertModalOpen && activeAlertIncident && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h4 className="text-sm font-bold text-slate-100">
                  OFFICIAL CIVIC DISPATCH MEMO GENERATOR
                </h4>
              </div>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Dispatch Metadata header */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[9px]">DISPATCH REF</span>
                  <span className="text-slate-200 font-bold">DISPATCH-AG-{Date.now().toString().slice(-6)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">PRIORITY</span>
                  <span className="text-red-400 font-bold">LEVEL-2 URGENT</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">JURISDICTION</span>
                  <span className="text-slate-200">Nashik Division</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">ISSUING ENGINE</span>
                  <span className="text-emerald-400 font-bold">AirGuard AI</span>
                </div>
              </div>

              {/* Memo Body text */}
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-slate-200 leading-relaxed space-y-2">
                <div className="text-red-400 font-bold">
                  *** URGENT AIR QUALITY ANOMALY DIRECTIVE ***
                </div>
                <p>
                  High pollution anomaly detected in <strong>{activeAlertIncident.location}</strong>. 
                  PM2.5 and PM10 levels have breached statutory critical thresholds. Multiple ({activeAlertIncident.reportsCount}) verified citizen complaints confirm dense particulate haze.
                </p>
                <p className="text-amber-300">
                  <strong>Probable Root Cause:</strong> {activeAlertIncident.probableCause}.
                </p>
                <p className="text-emerald-400">
                  <strong>Mandated Action:</strong> {activeAlertIncident.recommendation}. Immediate field inspection team dispatch authorized under Clean Air Mandate Act.
                </p>
              </div>

              {/* Channels List */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Target Broadcast Destinations:
                </span>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    📡 Municipal Field Radio
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    📱 MPCB Inspector SMS Gateway
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    🖥️ Central CPCB Portal
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    🔔 AirGuard Public Citizen App
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Ready for instantaneous dispatch
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyAlert(`High pollution anomaly detected in ${activeAlertIncident.location}. PM2.5 levels are elevated and multiple citizen reports have been received. Immediate field inspection is recommended.`)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Alert'}</span>
                </button>

                <button
                  onClick={() => {
                    onUpdateStatus(activeAlertIncident.id, 'DISPATCHED');
                    setIsAlertModalOpen(false);
                  }}
                  className="px-4 py-1.5 rounded bg-red-500 hover:bg-red-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT DISPATCH NOW</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
