export type SeverityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface LocationData {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  zone: string;
  aqi: number;
  pm25: number;
  pm10: number;
  temp: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  status: SeverityLevel;
  citizenReports: number;
  satelliteAnomaly: string;
  probableCause: string;
  recommendedAction: string;
  isCustomHotspot?: boolean;
}

export interface ToolExecutionStep {
  step: number;
  tool: string;
  action: string;
  outputSummary: string;
  timestamp?: string;
}

export interface AgentAnalysisData {
  hotspotDetected: boolean;
  severity: SeverityLevel;
  perceivedData: {
    sensors: string;
    weather: string;
    citizenReports: string;
    satellite: string;
  };
  rootCauseAnalysis: {
    primaryProbableCause: string;
    contributingFactors: string[];
    confidenceLevel: string;
    evidenceRationale: string;
  };
  forecast: {
    currentAqi: number;
    plus2h: number;
    plus4h: number;
    plus6h: number;
    peakAqi: number;
    peakWindowHours: number;
    riskLevel: string;
    forecastExplanation: string;
  };
  actionPlan: Array<{
    action: string;
    targetEntity: string;
    priority: 'HIGH' | 'URGENT' | 'MEDIUM';
    whyRecommended: string;
  }>;
  authorityAlert: {
    title: string;
    dispatchCode: string;
    message: string;
    channels: string[];
  };
  monitoringFrequency: {
    previousIntervalMinutes: number;
    updatedIntervalMinutes: number;
    reason: string;
  };
  feedbackLoop: {
    expectedBenchmarkAqi: number;
    triggerDeviationDelta: number;
    replanStrategy: string;
  };
  toolExecutionChain: ToolExecutionStep[];
}

export interface IncidentRecord {
  id: string;
  title: string;
  location: string;
  severity: SeverityLevel;
  probableCause: string;
  recommendation: string;
  status: 'PENDING' | 'DISPATCHED' | 'ACTIONED' | 'RESOLVED';
  timestamp: string;
  reportsCount: number;
  source: 'AGENT_DETECTED' | 'CITIZEN_REPORT' | 'SATELLITE_FLAG';
}

export interface CitizenReportItem {
  id: string;
  location: string;
  pollutionType: string;
  description: string;
  timestamp: string;
  severity: SeverityLevel;
  potentialCategory: string;
  aiReasoning: string;
  recommendedAction: string;
  confidenceScore: number;
  hasPhoto?: boolean;
  photoUrl?: string;
  status: 'VERIFIED' | 'INVESTIGATING' | 'ACTIONED';
}

export interface ActivityLogItem {
  id: string;
  agent: 'Detection' | 'Forecast' | 'RootCause' | 'Action' | 'Coordination' | 'System';
  message: string;
  timestamp: string;
  type: 'info' | 'alert' | 'success' | 'action';
}
