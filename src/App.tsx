import React, { useState, useEffect } from 'react';
import { 
  INITIAL_LOCATIONS, 
  INITIAL_INCIDENTS, 
  INITIAL_CITIZEN_REPORTS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_AGENT_ANALYSIS 
} from './data/initialState';
import { 
  LocationData, 
  IncidentRecord, 
  CitizenReportItem, 
  ActivityLogItem, 
  AgentAnalysisData 
} from './types/airguard';
import { Header } from './components/Header';
import { CommandCenterKpis } from './components/CommandCenterKpis';
import { PollutionMap } from './components/PollutionMap';
import { AgentWorkflowVisualizer } from './components/AgentWorkflowVisualizer';
import { PredictionPanel } from './components/PredictionPanel';
import { CitizenReportSection } from './components/CitizenReportSection';
import { AuthorityActionCenter } from './components/AuthorityActionCenter';
import { MultiSourceDataPanel } from './components/MultiSourceDataPanel';
import { AgentActivityLog } from './components/AgentActivityLog';
import { FeedbackLoopModal } from './components/FeedbackLoopModal';
import { AiCommandBar } from './components/AiCommandBar';

export default function App() {
  const [locations, setLocations] = useState<LocationData[]>(INITIAL_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(INITIAL_LOCATIONS[0]);
  const [incidents, setIncidents] = useState<IncidentRecord[]>(INITIAL_INCIDENTS);
  const [citizenReports, setCitizenReports] = useState<CitizenReportItem[]>(INITIAL_CITIZEN_REPORTS);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOGS);
  const [agentAnalysis, setAgentAnalysis] = useState<AgentAnalysisData>(INITIAL_AGENT_ANALYSIS);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSimulatedActive, setIsSimulatedActive] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isLiveGemini, setIsLiveGemini] = useState(false);

  // Helper to add activity log item
  const addLog = (
    agent: ActivityLogItem['agent'],
    message: string,
    type: ActivityLogItem['type'] = 'info'
  ) => {
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
      agent,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Run Gemini Agent Workflow for a location
  const runAgentAnalysis = async (targetLoc = selectedLocation, customScenario?: any) => {
    setIsAnalyzing(true);
    addLog('System', `Initiating autonomous agentic workflow for ${targetLoc.name}...`, 'action');

    try {
      const res = await fetch('/api/gemini/agent-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId: targetLoc.id,
          simulatedScenario: customScenario,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAgentAnalysis(json.data);
        setIsLiveGemini(Boolean(json.isLiveGemini));

        addLog('Detection', `Sensor & satellite telemetry synthesized: ${json.data.perceivedData.sensors.slice(0, 75)}...`, 'info');
        addLog('Detection', `Hotspot confirmed with ${json.data.severity} severity status.`, 'alert');
        addLog('Forecast', `Projected peak AQI: ${json.data.forecast.peakAqi} (Next ${json.data.forecast.peakWindowHours}h window).`, 'info');
        addLog('RootCause', `Probable Cause: ${json.data.rootCauseAnalysis.primaryProbableCause}`, 'info');
        addLog('Action', `Dispatched Directive: ${json.data.actionPlan[0]?.action}`, 'action');
        addLog('Action', `Authority dispatch memo ${json.data.authorityAlert.dispatchCode} broadcasted.`, 'success');
      }
    } catch (err) {
      console.error(err);
      addLog('System', 'Analysis pipeline encountered an error; falling back to local reasoning model.', 'alert');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 🔥 SIMULATE POLLUTION EVENT (Key Hackathon Requirement)
  const handleSimulatePollutionEvent = async () => {
    setIsSimulating(true);
    addLog('System', '🔥 INITIATING SIMULATED SUDDEN POLLUTION SPIKE EVENT...', 'alert');

    // 1. Pick Ambad Industrial or Agricultural zone
    const targetLoc = locations[0]; // Ambad Industrial Corridor

    // 2. Modify values: Surge PM2.5, spike citizen reports, lower wind speed to 2 km/h
    const spikedAqi = 238;
    const spikedPm25 = 189;
    const spikedPm10 = 310;
    const spikedReports = targetLoc.citizenReports + 12;
    const stagnantWind = 2;

    const updatedLoc: LocationData = {
      ...targetLoc,
      aqi: spikedAqi,
      pm25: spikedPm25,
      pm10: spikedPm10,
      windSpeed: stagnantWind,
      status: 'CRITICAL',
      citizenReports: spikedReports,
      satelliteAnomaly: 'URGENT: Intense thermal hotspot & severe aerosol plume (AOD 0.94) detected over sector 12',
      probableCause: 'Probable cause: Uncontrolled nocturnal boiler emissions compounding with severe atmospheric inversion stagnation',
      recommendedAction: 'Immediate Tier-3 Industrial Shutdown Advisory + emergency misting cannon deployment',
    };

    // Update locations state
    setLocations((prev) =>
      prev.map((l) => (l.id === targetLoc.id ? updatedLoc : l))
    );
    setSelectedLocation(updatedLoc);
    setIsSimulatedActive(true);

    // 3. Add to Citizen Incident Feed
    const simulatedCitizenIncident: CitizenReportItem = {
      id: `cit-sim-${Date.now()}`,
      location: 'Ambad MIDC Sector 12 (Furnace Zone)',
      pollutionType: 'Industrial smoke',
      description: 'Massive plume of black suffocating smoke erupted from foundry stack. Zero visibility on road, burning eyes across whole colony.',
      timestamp: 'Just now',
      severity: 'CRITICAL',
      potentialCategory: 'Industrial emissions',
      aiReasoning: 'Rapid multi-point citizen reports corroborate sharp surge in local IoT optical particle count.',
      recommendedAction: 'Order immediate stack shutdown inspection.',
      confidenceScore: 96,
      status: 'VERIFIED',
    };
    setCitizenReports((prev) => [simulatedCitizenIncident, ...prev]);

    // 4. Add to Authority Incidents Table
    const simulatedAuthorityIncident: IncidentRecord = {
      id: `inc-sim-${Date.now()}`,
      title: 'CRITICAL NOCTURNAL BOILER PLUME SPIKE',
      location: 'Ambad MIDC Sector 12',
      severity: 'CRITICAL',
      probableCause: 'Probable cause: Unauthorized boiler blowout under atmospheric thermal inversion',
      recommendation: 'Immediate Tier-3 Flying Squad dispatch + emergency misting cannon deployment',
      status: 'PENDING',
      timestamp: 'Just now',
      reportsCount: spikedReports,
      source: 'AGENT_DETECTED',
    };
    setIncidents((prev) => [simulatedAuthorityIncident, ...prev]);

    // 5. Trigger Gemini Agent Workflow with spiked scenario
    await runAgentAnalysis(updatedLoc, {
      aqi: spikedAqi,
      pm25: spikedPm25,
      pm10: spikedPm10,
      citizenReports: spikedReports,
      windSpeed: stagnantWind,
      windDirection: 'CALM',
    });

    setIsSimulating(false);
  };

  // Submit new Citizen Report
  const handleSubmitCitizenReport = async (reportData: Omit<CitizenReportItem, 'id' | 'timestamp' | 'status'>) => {
    const newReport: CitizenReportItem = {
      ...reportData,
      id: `cit-${Date.now()}`,
      timestamp: 'Just now',
      status: 'VERIFIED',
    };

    setCitizenReports((prev) => [newReport, ...prev]);

    // Also add to incidents if High or Critical
    if (newReport.severity === 'HIGH' || newReport.severity === 'CRITICAL') {
      const newInc: IncidentRecord = {
        id: `inc-${Date.now()}`,
        title: `${newReport.potentialCategory} Incident`,
        location: newReport.location,
        severity: newReport.severity,
        probableCause: `Probable cause: ${newReport.potentialCategory}`,
        recommendation: newReport.recommendedAction,
        status: 'PENDING',
        timestamp: 'Just now',
        reportsCount: 1,
        source: 'CITIZEN_REPORT',
      };
      setIncidents((prev) => [newInc, ...prev]);
    }

    addLog('Detection', `New citizen report verified at ${newReport.location} [Severity: ${newReport.severity}].`, 'alert');
  };

  // Update incident status
  const handleUpdateIncidentStatus = (id: string, status: IncidentRecord['status']) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status } : inc))
    );
    addLog('Action', `Incident ${id} status updated to ${status}.`, 'action');
  };

  // Apply Replanned Directive from Feedback Loop
  const handleApplyReplan = (replannedAction: string, newAqi: number) => {
    addLog('System', `FEEDBACK LOOP TRIGGERED: Reevaluating previous model predictions against incoming AQI (${newAqi})...`, 'action');
    addLog('Action', `Replanned Directive Applied: ${replannedAction}`, 'success');

    // Update current location with new state
    const updated = {
      ...selectedLocation,
      aqi: newAqi,
      recommendedAction: replannedAction,
    };
    setSelectedLocation(updated);
    setLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Sticky Header with Brand, Hackathon Action Buttons & Judge Ribbon */}
      <Header
        onSimulateEvent={handleSimulatePollutionEvent}
        onRunAnalysis={() => runAgentAnalysis(selectedLocation)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        isSimulating={isSimulating}
        isAnalyzing={isAnalyzing}
        isSimulatedActive={isSimulatedActive}
        selectedLocation={selectedLocation}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Section A: COMMAND CENTER KPIS */}
        <CommandCenterKpis
          locations={locations}
          selectedLocation={selectedLocation}
          alertsCount={incidents.filter((i) => i.status === 'DISPATCHED' || i.status === 'ACTIONED').length + 3}
        />

        {/* Section B & D: LIVE MAP & PREDICTION FORECAST GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <PollutionMap
              locations={locations}
              selectedLocation={selectedLocation}
              onSelectLocation={(loc) => {
                setSelectedLocation(loc);
                runAgentAnalysis(loc);
              }}
              onRunAnalysis={(loc) => runAgentAnalysis(loc)}
              isSimulatedActive={isSimulatedActive}
            />
          </div>

          <div className="lg:col-span-5">
            <PredictionPanel analysis={agentAnalysis} />
          </div>
        </div>

        {/* Section C: AI AGENT REASONING ENGINE (Central Agentic Workflow) */}
        <AgentWorkflowVisualizer
          analysis={agentAnalysis}
          location={selectedLocation}
          isLoading={isAnalyzing}
          onTriggerFeedbackLoop={() => setIsFeedbackModalOpen(true)}
          isLiveGemini={isLiveGemini}
        />

        {/* Section E: CITIZEN REPORT FEATURE */}
        <CitizenReportSection
          reports={citizenReports}
          onSubmitReport={handleSubmitCitizenReport}
          isSubmitting={isAnalyzing}
        />

        {/* Section F: AUTHORITY ACTION CENTER */}
        <AuthorityActionCenter
          incidents={incidents}
          onUpdateStatus={handleUpdateIncidentStatus}
          analysis={agentAnalysis}
        />

        {/* Section G & H: MULTI-SOURCE DATA & AGENT ACTIVITY LOG */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <MultiSourceDataPanel />
          </div>

          <div className="lg:col-span-5">
            <AgentActivityLog logs={activityLogs} />
          </div>
        </div>

        {/* Section J: ASK AIRGUARD AI (Interactive Command Interface) */}
        <AiCommandBar
          locations={locations}
          selectedLocation={selectedLocation}
        />
      </main>

      {/* Feedback Loop Modal */}
      <FeedbackLoopModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        location={selectedLocation}
        analysis={agentAnalysis}
        onApplyReplan={handleApplyReplan}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-5 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AIRGUARD AI · Track 2 Clean Air & Climate Resilience · Hackathon Edition</span>
          <span>Powered by Gemini 3.8 Flash · Federated Climate Action Framework</span>
        </div>
      </footer>
    </div>
  );
}
