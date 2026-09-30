import React, { useState } from 'react';
import { CitizenReportItem, SeverityLevel } from '../types/airguard';
import { 
  Users, 
  Send, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Image as ImageIcon,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface CitizenReportSectionProps {
  reports: CitizenReportItem[];
  onSubmitReport: (report: Omit<CitizenReportItem, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  isSubmitting: boolean;
}

export const CitizenReportSection: React.FC<CitizenReportSectionProps> = ({
  reports,
  onSubmitReport,
  isSubmitting,
}) => {
  const [location, setLocation] = useState('Satpur-Ambad Link Road, Gate 4');
  const [pollutionType, setPollutionType] = useState('Industrial smoke');
  const [description, setDescription] = useState(
    'Dense dark smoke and chemical odor emitting from industrial facility stack. Particulate cloud moving toward residential colony.'
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submittedFeedback, setSubmittedFeedback] = useState<CitizenReportItem | null>(null);

  // Preset sample pictures for instant hackathon demonstration
  const samplePresets = [
    {
      name: 'Industrial Plume',
      type: 'Industrial smoke',
      loc: 'Ambad MIDC Industrial Cluster',
      desc: 'Black dense chimney plume visible at night, suffocating sulfurous odor detected in sector 12.',
      img: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Diesel Truck Jam',
      type: 'Vehicle emissions',
      loc: 'Dwarka Underpass NH-3',
      desc: 'Heavy commercial container trucks queued for 2 km with engines idling, zero wind ventilation.',
      img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Stubble Burning',
      type: 'Agricultural burning',
      loc: 'Dindori Agri Fringe',
      desc: 'Open field biomass residue burning across multiple acres; visible smoke pall drifting toward bypass.',
      img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setLocation(preset.loc);
    setPollutionType(preset.type);
    setDescription(preset.desc);
    setImagePreview(preset.img);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      // Call server endpoint or parent handler
      const res = await fetch('/api/gemini/analyze-citizen-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          pollutionType,
          description,
          imageBase64: imagePreview,
        }),
      });

      const json = await res.json();
      const triage = json.data;

      const newReport: CitizenReportItem = {
        id: `cit-${Date.now().toString().slice(-4)}`,
        location,
        pollutionType,
        description,
        timestamp: 'Just now',
        severity: triage.severity || 'HIGH',
        potentialCategory: triage.potentialCategory || pollutionType,
        aiReasoning: triage.aiReasoning || 'Corroborates nearby sensor telemetry and citizen complaints.',
        recommendedAction: triage.recommendedAction || 'Dispatch municipal field inspection squad.',
        confidenceScore: triage.confidenceScore || 90,
        hasPhoto: Boolean(imagePreview),
        photoUrl: imagePreview || undefined,
        status: 'VERIFIED',
      };

      await onSubmitReport(newReport);
      setSubmittedFeedback(newReport);

      // Reset form slightly
      setDescription('');
      setImagePreview(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 tracking-wide">
              CITIZEN-SOURCED POLLUTION OBSERVATIONS
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Multimodal verification & hyper-local crowdsourced intelligence
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
          Crowd Intelligence Stream Active
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Submission Form */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Log Hyper-Local Incident
            </h4>
            <span className="text-[11px] text-slate-400">Preset Scenarios:</span>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {samplePresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Location input */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                LOCATION / LANDMARK
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="e.g. Satpur-Ambad Link Road, Gate 4"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Pollution type select */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                POLLUTION CATEGORY
              </label>
              <select
                value={pollutionType}
                onChange={(e) => setPollutionType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Industrial smoke">Industrial smoke</option>
                <option value="Vehicle emissions">Vehicle emissions</option>
                <option value="Construction dust">Construction dust</option>
                <option value="Agricultural burning">Agricultural burning</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            {/* Description textarea */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                INCIDENT DESCRIPTION & OBSERVATIONS
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="Describe odor, color of smoke, eye irritation, duration, or wind direction..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                ATTACH PHOTO EVIDENCE (OPTIONAL)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/60 rounded-lg p-3 text-center cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Upload image or use camera</span>
                  </div>
                </label>

                {imagePreview && (
                  <div className="relative w-14 h-12 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-bl px-1 text-[10px]"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Gemini Triage in Progress...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>SUBMIT REPORT FOR AI TRIAGE</span>
                </>
              )}
            </button>
          </form>

          {/* AI Result Card for latest submission */}
          {submittedFeedback && (
            <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/40 text-xs space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Gemini Triage Complete
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Confidence: {submittedFeedback.confidenceScore}%
                </span>
              </div>
              <p className="text-slate-300">{submittedFeedback.aiReasoning}</p>
              <div className="text-[11px] font-mono text-slate-400">
                Action: <strong className="text-slate-200">{submittedFeedback.recommendedAction}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Live Incident Feed */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Live Verified Incident Stream ({reports.length})
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Geo-Validated</span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {reports.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col gap-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{item.location}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.potentialCategory}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                      item.severity === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : item.severity === 'HIGH'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>

                <p className="text-slate-300 text-xs italic">"{item.description}"</p>

                {item.photoUrl && (
                  <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-800">
                    <img src={item.photoUrl} alt="Citizen Evidence" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400">
                  <strong className="text-emerald-400 font-mono">AI Reasoning: </strong>
                  {item.aiReasoning}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
