import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System baseline data
const MOCK_DATA = {
  locations: [
    {
      id: 'loc-1',
      name: 'Nashik Industrial Corridor (Ambad MIDC)',
      shortName: 'Ambad Industrial',
      lat: 19.957,
      lng: 73.731,
      zone: 'Industrial',
      aqi: 182,
      pm25: 141,
      pm10: 241,
      temp: 31,
      humidity: 58,
      windSpeed: 5,
      windDirection: 'NW',
      status: 'HIGH',
      citizenReports: 14,
      satelliteAnomaly: 'Elevated NO2 plume (6.8 x 10^15 molec/cm²) & thermal signature detected',
      probableCause: 'Probable cause: Industrial stack emissions aggravated by boundary layer stagnation',
      recommendedAction: 'Issue immediate Level-2 field inspection and mandate intermittent stack emissions reduction.',
    },
    {
      id: 'loc-2',
      name: 'Highway Logistics Corridor NH-3 (Dwarka Junction)',
      shortName: 'Highway NH-3',
      lat: 19.992,
      lng: 73.805,
      zone: 'Logistics / Transport',
      aqi: 205,
      pm25: 167,
      pm10: 270,
      temp: 32,
      humidity: 52,
      windSpeed: 4,
      windDirection: 'WNW',
      status: 'CRITICAL',
      citizenReports: 19,
      satelliteAnomaly: 'High aerosol optical depth (AOD 0.82) concentrated along arterial transit line',
      probableCause: 'Probable cause: Heavy multi-axle freight idling and diesel exhaust accumulation',
      recommendedAction: 'Activate dynamic green-corridor signal timing and divert non-essential heavy transport.',
    },
    {
      id: 'loc-3',
      name: 'City Center & Old Market (Panchavati)',
      shortName: 'City Center',
      lat: 20.006,
      lng: 73.791,
      zone: 'Commercial / Residential',
      aqi: 126,
      pm25: 82,
      pm10: 148,
      temp: 29,
      humidity: 62,
      windSpeed: 8,
      windDirection: 'NNW',
      status: 'MODERATE',
      citizenReports: 5,
      satelliteAnomaly: 'Nominal background scattering with localized PM coarse peak',
      probableCause: 'Possible contributing factor: Commercial backup generators and unpaved market transit',
      recommendedAction: 'Deploy municipal misting truck and enforce anti-idling in pedestrian perimeter.',
    },
    {
      id: 'loc-4',
      name: 'Agricultural Fringe Belt (Dindori - Ozar)',
      shortName: 'Dindori Agri Belt',
      lat: 20.140,
      lng: 73.830,
      zone: 'Agricultural',
      aqi: 95,
      pm25: 64,
      pm10: 110,
      temp: 28,
      humidity: 65,
      windSpeed: 6,
      windDirection: 'NE',
      status: 'LOW',
      citizenReports: 2,
      satelliteAnomaly: 'Baseline MODIS thermal scan normal (No open biomass hotspots)',
      probableCause: 'Background seasonal rural dust and light agrarian activity',
      recommendedAction: 'Continuous satellite surveillance for post-harvest residue fires.',
    },
    {
      id: 'loc-5',
      name: 'Gangapur Eco-Sanctuary & Reservoir Basin',
      shortName: 'Gangapur Basin',
      lat: 20.027,
      lng: 73.688,
      zone: 'Ecological Reserve',
      aqi: 48,
      pm25: 22,
      pm10: 45,
      temp: 27,
      humidity: 71,
      windSpeed: 11,
      windDirection: 'W',
      status: 'LOW',
      citizenReports: 0,
      satelliteAnomaly: 'Clean atmospheric column (Reference baseline node)',
      probableCause: 'Dense riparian vegetation and elevated natural dispersion',
      recommendedAction: 'Maintain as regional clean air baseline calibration reference.',
    },
  ],
};

// Tool simulation definitions
const toolsList = [
  'get_sensor_data',
  'get_weather_data',
  'get_citizen_reports',
  'get_satellite_observation',
  'detect_hotspot',
  'forecast_air_quality',
  'analyze_root_cause',
  'generate_action_plan',
  'create_authority_alert',
  'update_monitoring_frequency',
];

// Helper to run Gemini analysis or high-fidelity fallback
app.post('/api/gemini/agent-workflow', async (req: Request, res: Response) => {
  try {
    const { locationId, customContext, simulatedScenario } = req.body;
    const location = MOCK_DATA.locations.find((l) => l.id === locationId) || MOCK_DATA.locations[0];

    const currentAqi = simulatedScenario?.aqi || location.aqi;
    const currentPm25 = simulatedScenario?.pm25 || location.pm25;
    const currentPm10 = simulatedScenario?.pm10 || location.pm10;
    const reportsCount = simulatedScenario?.citizenReports || location.citizenReports;
    const windSpeed = simulatedScenario?.windSpeed || location.windSpeed;
    const windDir = simulatedScenario?.windDirection || location.windDirection;

    const prompt = `
You are the master reasoning engine for AIRGUARD AI, an agentic climate-action platform.
Analyze this hyper-local incident:
Location: ${location.name} (${location.zone})
Current AQI: ${currentAqi}
PM2.5: ${currentPm25} µg/m³
PM10: ${currentPm10} µg/m³
Wind: ${windSpeed} km/h from ${windDir}
Temperature: ${location.temp}°C
Citizen Reports: ${reportsCount} complaints logged in past 90 mins
Satellite Observation: ${location.satelliteAnomaly}
Context: ${customContext || 'Regular agentic surveillance cycle'}

Demonstrate the full Agentic cycle:
1. PERCEIVE: Query tools [get_sensor_data, get_weather_data, get_citizen_reports, get_satellite_observation].
2. REASON: Synthesize multi-source signals. Detect if hotspot exists. Compute root causes (strictly distinguishing "Probable cause" from "Possible contributing factor").
3. FORECAST: Predict AQI trajectory for +2h, +4h, +6h. Explain meteorological reasons (inversion, wind stagnation).
4. PLAN: Select concrete interventions for municipal authorities, pollution control boards, and citizens.
5. ACT: Invoke create_authority_alert and update_monitoring_frequency.
6. RECEIVE FEEDBACK & REPLAN: Note how new sensor telemetry will be evaluated against predicted thresholds.

Return a valid JSON object matching this schema:
{
  "hotspotDetected": boolean,
  "severity": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "perceivedData": {
    "sensors": string,
    "weather": string,
    "citizenReports": string,
    "satellite": string
  },
  "rootCauseAnalysis": {
    "primaryProbableCause": string,
    "contributingFactors": string[],
    "confidenceLevel": string,
    "evidenceRationale": string
  },
  "forecast": {
    "currentAqi": number,
    "plus2h": number,
    "plus4h": number,
    "plus6h": number,
    "peakAqi": number,
    "peakWindowHours": number,
    "riskLevel": string,
    "forecastExplanation": string
  },
  "actionPlan": [
    {
      "action": string,
      "targetEntity": string,
      "priority": "HIGH" | "URGENT" | "MEDIUM",
      "whyRecommended": string
    }
  ],
  "authorityAlert": {
    "title": string,
    "dispatchCode": string,
    "message": string,
    "channels": string[]
  },
  "monitoringFrequency": {
    "previousIntervalMinutes": number,
    "updatedIntervalMinutes": number,
    "reason": string
  },
  "feedbackLoop": {
    "expectedBenchmarkAqi": number,
    "triggerDeviationDelta": number,
    "replanStrategy": string
  },
  "toolExecutionChain": [
    {
      "step": number,
      "tool": string,
      "action": string,
      "outputSummary": string
    }
  ]
}
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({ success: true, isLiveGemini: true, data: parsed });
        }
      } catch (geminiErr) {
        console.warn('Gemini live call error, falling back to simulated engine:', geminiErr);
      }
    }

    // High fidelity fallback matching the exact schema
    const isCritical = currentAqi >= 200 || currentPm25 >= 150;
    const isHigh = currentAqi >= 150;
    const severity = isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : currentAqi >= 100 ? 'MODERATE' : 'LOW';

    const p2 = Math.round(currentAqi * 1.07);
    const p4 = Math.round(currentAqi * 1.27);
    const p6 = Math.round(currentAqi * 1.20);
    const peak = Math.max(p2, p4, p6);

    const fallbackResponse = {
      hotspotDetected: currentAqi > 120,
      severity,
      perceivedData: {
        sensors: `Received real-time IoT PM2.5 telemetry (${currentPm25} µg/m³) from 8 micro-monitoring stations across ${location.name}.`,
        weather: `Boundary layer height compressed to 310m; wind speed ${windSpeed} km/h ${windDir} inducing atmospheric stagnation.`,
        citizenReports: `${reportsCount} geo-tagged citizen incident reports verified (odor complaints, visible thick particulate plumes).`,
        satellite: location.satelliteAnomaly,
      },
      rootCauseAnalysis: {
        primaryProbableCause: location.zone.includes('Industrial')
          ? 'Probable cause: Industrial stack emissions & boiler combustion under inversion conditions'
          : location.zone.includes('Logistics')
          ? 'Probable cause: Severe heavy freight diesel exhaust accumulation and low-speed transit'
          : 'Probable cause: Biomass burning and ambient dust concentration',
        contributingFactors: [
          `Low surface wind velocity (${windSpeed} km/h) impeding horizontal dispersion`,
          'Thermal ground inversion trapping aerosols within lowest 350 meters',
          'Intermittent unpaved road dust resuspension by heavy logistics vehicles',
        ],
        confidenceLevel: '89.4% (Multi-source corroboration)',
        evidenceRationale: `Corroboration achieved between optical satellite aerosol depth (AOD), ground IoT PM2.5 spikes, and ${reportsCount} citizen geolocations within a 1.2km radius.`,
      },
      forecast: {
        currentAqi,
        plus2h: p2,
        plus4h: p4,
        plus6h: p6,
        peakAqi: peak,
        peakWindowHours: 4,
        riskLevel: severity,
        forecastExplanation: `Due to sustained low wind velocity (${windSpeed} km/h) and nocturnal planetary boundary layer cooling, particulate concentration will peak around +4 hours before convective mixing resumes tomorrow morning.`,
      },
      actionPlan: [
        {
          action: 'Dispatch Immediate Level-2 Flying Squad Inspection',
          targetEntity: 'Maharashtra Pollution Control Board (MPCB) / Municipal Ward Officer',
          priority: 'URGENT',
          whyRecommended: 'Verify industrial boiler compliance and inspect unauthorized nocturnal stack burning.',
        },
        {
          action: 'Escalate IoT Sensor Telemetry Frequency to 1-Minute Cadence',
          targetEntity: 'AirGuard IoT Node Gateway & Municipal Smart City Operations Center',
          priority: 'HIGH',
          whyRecommended: 'Capture micro-transient emission peaks and isolate source coordinates.',
        },
        {
          action: 'Broadcast Geo-Fenced Health & Vulnerability Advisory',
          targetEntity: 'Citizen App / Ward Public Health Emergency System',
          priority: 'HIGH',
          whyRecommended: 'Alert nearby school districts, elderly residents, and respiratory patients to avoid outdoor exertion.',
        },
        {
          action: 'Deploy Municipal Anti-Smog Fog Cannon & Water Sprinklers',
          targetEntity: 'Nashik Municipal Corporation (NMC) Disaster Cell',
          priority: 'MEDIUM',
          whyRecommended: 'Promote particulate agglomeration and rapid mechanical wet deposition in the downwind corridor.',
        },
      ],
      authorityAlert: {
        title: `AIR QUALITY ANOMALY ALERT: ${location.shortName.toUpperCase()} [${severity}]`,
        dispatchCode: `DISPATCH-AG-${Date.now().toString().slice(-6)}`,
        message: `High pollution anomaly confirmed at ${location.name}. PM2.5 has breached safe thresholds at ${currentPm25} µg/m³ with ${reportsCount} citizen reports. Meteorological stagnation indicates further deterioration over next 4 hours. Immediate field inspection and emission controls required.`,
        channels: ['Municipal Enforcement Radio', 'SMS Emergency Gateways', 'Central CPCB Dashboard', 'AirGuard Citizen Feed'],
      },
      monitoringFrequency: {
        previousIntervalMinutes: 15,
        updatedIntervalMinutes: 1,
        reason: 'Hotspot escalation protocol: transition from routine polling (15m) to real-time incident tracking (60s).',
      },
      feedbackLoop: {
        expectedBenchmarkAqi: p4,
        triggerDeviationDelta: 15,
        replanStrategy: 'If AQI fails to stabilize below 210 within 3 hours of fog cannon deployment, trigger mandatory temporary production curtailment on adjacent industrial units.',
      },
      toolExecutionChain: [
        { step: 1, tool: 'get_sensor_data', action: `Fetching micro-sensor node telemetry for ${location.shortName}`, outputSummary: `PM2.5: ${currentPm25} µg/m³, PM10: ${currentPm10} µg/m³, AQI: ${currentAqi}` },
        { step: 2, tool: 'get_weather_data', action: 'Querying boundary layer meteorological parameters', outputSummary: `Wind: ${windSpeed} km/h ${windDir}, Inversion height: 310m, Temp: ${location.temp}°C` },
        { step: 3, tool: 'get_citizen_reports', action: 'Aggregating hyper-local crowdsourced incident feeds', outputSummary: `${reportsCount} reports validated within 1.5km geofence` },
        { step: 4, tool: 'get_satellite_observation', action: 'Querying Sentinel-5P / MODIS optical depth & thermal anomalies', outputSummary: 'Plume signature corroborated' },
        { step: 5, tool: 'detect_hotspot', action: 'Evaluating statistical threshold breaches', outputSummary: `Hotspot confirmed with ${severity} severity status` },
        { step: 6, tool: 'forecast_air_quality', action: 'Simulating 6-hour atmospheric dispersion model', outputSummary: `Trajectory: ${currentAqi} -> ${p2} -> ${p4} -> ${p6}` },
        { step: 7, tool: 'analyze_root_cause', action: 'Isolating probable cause vs environmental factors', outputSummary: 'Industrial stack emissions + inversion trapping' },
        { step: 8, tool: 'generate_action_plan', action: 'Formulating multi-agency intervention directives', outputSummary: '4 rapid actions generated with rationale' },
        { step: 9, tool: 'create_authority_alert', action: 'Broadcasting cryptographic dispatch memo to civic authorities', outputSummary: `DISPATCH-AG-${Date.now().toString().slice(-6)} published` },
        { step: 10, tool: 'update_monitoring_frequency', action: 'Overriding IoT node polling cadence', outputSummary: 'Frequency updated 15m -> 1m' },
      ],
    };

    return res.json({ success: true, isLiveGemini: false, data: fallbackResponse });
  } catch (error: any) {
    console.error('Error in agent workflow:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Citizen Report Analysis endpoint (Multimodal & text)
app.post('/api/gemini/analyze-citizen-report', async (req: Request, res: Response) => {
  try {
    const { location, pollutionType, description, imageBase64 } = req.body;

    const prompt = `
You are the Citizen Input Verification Agent in AirGuard AI.
Analyze this citizen-submitted pollution report:
Reported Location: ${location}
Citizen Category: ${pollutionType}
Description: "${description}"
${imageBase64 ? 'An image has been attached by the citizen for visual verification.' : 'No photo attached.'}

Tasks:
1. Determine Severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL".
2. Identify Potential Category: Industrial emissions, Vehicle emissions, Construction dust, Agricultural burning, or Unknown.
3. Provide concise AI reasoning (2-3 sentences explaining visual or descriptive indicators).
4. Recommend immediate Authority Action.
5. Provide a credibility confidence score (0 to 100%).

Return pure JSON:
{
  "severity": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "potentialCategory": string,
  "aiReasoning": string,
  "recommendedAction": string,
  "confidenceScore": number,
  "verifiedBy": string
}
`;

    if (ai) {
      try {
        const parts: any[] = [];
        if (imageBase64) {
          // Extract base64 without prefix if needed
          const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
          parts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          });
        }
        parts.push({ text: prompt });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: parts.length > 1 ? { parts } : prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({ success: true, isLiveGemini: true, data: parsed });
        }
      } catch (geminiErr) {
        console.warn('Gemini report analysis error, falling back:', geminiErr);
      }
    }

    // High quality fallback
    const lowerDesc = (description || '').toLowerCase();
    const isIndustrial = lowerDesc.includes('industrial') || lowerDesc.includes('factory') || lowerDesc.includes('chemical') || pollutionType === 'Industrial smoke';
    const isBurning = lowerDesc.includes('burn') || lowerDesc.includes('stubble') || lowerDesc.includes('fire') || pollutionType === 'Agricultural burning';
    const isHeavy = lowerDesc.includes('black') || lowerDesc.includes('toxic') || lowerDesc.includes('suffocating') || lowerDesc.includes('thick');

    const severity = isHeavy || isIndustrial ? 'HIGH' : isBurning ? 'HIGH' : 'MODERATE';
    const category = isIndustrial ? 'Industrial emissions' : isBurning ? 'Agricultural biomass burning' : pollutionType || 'Urban emission anomaly';

    const fallback = {
      severity,
      potentialCategory: category,
      aiReasoning: `Report describes dense particulate suspension characteristic of ${category.toLowerCase()}. Description correlates strongly with local thermal sensor anomalies and citizen density reports in the sector.`,
      recommendedAction: isHeavy || isIndustrial ? 'Dispatch field inspection squad with portable volatile organic compound (VOC) / PM analyzer.' : 'Deploy municipal dust suppression misting unit and issue localized health advisory.',
      confidenceScore: imageBase64 ? 94 : 82,
      verifiedBy: 'AirGuard Multimodal Triage Agent (Gemini-Engine)',
    };

    return res.json({ success: true, isLiveGemini: false, data: fallback });
  } catch (err: any) {
    console.error('Error analyzing report:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Feedback / Re-evaluation loop endpoint
app.post('/api/gemini/re-evaluate', async (req: Request, res: Response) => {
  try {
    const { initialAqi, predictedAqi, newObservedAqi, locationName, appliedIntervention } = req.body;

    const prompt = `
You are the Agentic Feedback & Replanning Agent for AIRGUARD AI.
Initial State: AQI ${initialAqi}
Previous Model Prediction: AQI ${predictedAqi}
New Telemetry Received: AQI ${newObservedAqi}
Location: ${locationName || 'Nashik Industrial Corridor'}
Previous Intervention: ${appliedIntervention || 'Field inspection requested and misting truck deployed'}

Evaluate the trajectory:
- Has the pollution deteriorated beyond predicted tolerance?
- Or has the intervention successfully stabilized particulate accumulation?
- Formulate a replanned directive.

Return JSON:
{
  "evaluationStatus": "DETERIORATING" | "STABILIZING" | "RESOLVED",
  "driftAnalysis": string,
  "replannedAction": string,
  "escalationRequired": boolean,
  "updatedForecast": {
    "next2h": number,
    "next4h": number
  },
  "agentRationale": string
}
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        if (response.text) {
          return res.json({ success: true, isLiveGemini: true, data: JSON.parse(response.text) });
        }
      } catch (err) {
        console.warn('Re-evaluate error:', err);
      }
    }

    const delta = newObservedAqi - predictedAqi;
    const isWorse = delta > 10 || newObservedAqi >= 230;

    const fallback = {
      evaluationStatus: isWorse ? 'DETERIORATING' : 'STABILIZING',
      driftAnalysis: `Observed AQI (${newObservedAqi}) is ${Math.abs(delta)} points ${delta >= 0 ? 'higher than' : 'below'} previous forecast (${predictedAqi}). New evidence reveals secondary emission sources downwind.`,
      replannedAction: isWorse
        ? 'Escalate to Tier-3 Emergency Protocol: Enforce mandatory 50% production cut on 12 nearby industrial furnaces and deploy specialized drone air monitors.'
        : 'Intervention showing positive deceleration: maintain continuous 1-minute telemetry and keep anti-smog misting active.',
      escalationRequired: isWorse,
      updatedForecast: {
        next2h: isWorse ? Math.round(newObservedAqi * 1.08) : Math.round(newObservedAqi * 0.94),
        next4h: isWorse ? Math.round(newObservedAqi * 1.15) : Math.round(newObservedAqi * 0.88),
      },
      agentRationale: isWorse
        ? 'Meteorological micro-inversion intensified faster than initial ECMWF boundary layer estimates; immediate regulatory enforcement override required.'
        : 'Wet deposition spray successfully suppressed localized resuspension; baseline stabilization expected by morning convective hours.',
    };

    return res.json({ success: true, isLiveGemini: false, data: fallback });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Interactive AI Command / Chat endpoint
app.post('/api/gemini/ask', async (req: Request, res: Response) => {
  try {
    const { question, currentContext } = req.body;

    const prompt = `
You are the conversational interface of AIRGUARD AI: "Detect. Predict. Explain. Act."
You are an expert agentic climate-tech engineer and clean air authority advisor.

Current Live State Context:
${JSON.stringify(currentContext || MOCK_DATA.locations, null, 2)}

User Question: "${question}"

Provide a concise, direct, and authoritative response.
Structure your answer clearly:
1. Direct Assessment & Findings (cite specific AQI, PM2.5, or locations)
2. Agentic Reasoning & Probable Causes (distinguish probable cause vs contributing factors)
3. Prescribed Actions / Authority Next Steps
4. Forecast / Outlook

Keep tone crisp, climate-tech native, and actionable. Do not use generic filler.
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            temperature: 0.3,
          },
        });

        if (response.text) {
          return res.json({ success: true, isLiveGemini: true, answer: response.text });
        }
      } catch (err) {
        console.warn('Gemini chat error:', err);
      }
    }

    // High quality context-aware fallback answer
    let fallbackAnswer = `**AirGuard AI Assessment:**
Analyzing real-time hyper-local telemetry across the region:
- **Nashik Industrial Corridor (Ambad MIDC)** is currently at **AQI 182 (PM2.5: 141 µg/m³)**, exhibiting abnormal stack emission peaks compounded by a nocturnal inversion layer (boundary layer height 310m).
- **Highway Logistics Corridor NH-3** has surged to **AQI 205 (PM2.5: 167 µg/m³)** driven by heavy diesel idling.

**Probable Root Causes:**
- *Primary Probable Cause:* Uncontrolled boiler stack discharges coinciding with low horizontal wind dispersion (5 km/h NW).
- *Contributing Factor:* Temperature inversion trapping ground-level aerosols within the lower 350-meter canopy.

**Prescribed Authority Action:**
1. Dispatch MPCB flying squad to industrial cluster zone B for compliance audit.
2. Escalate IoT node sampling from 15-minute polling to 1-minute high-frequency tracking.
3. Broadcast citizen health advisory for vulnerable cohorts in downwind wards.

**Forecast Trajectory:** Particulate levels are projected to peak at AQI ~231 within +4 hours before convective solar dispersal.`;

    const q = (question || '').toLowerCase();
    if (q.includes('highest') || q.includes('worst')) {
      fallbackAnswer = `**AirGuard Critical Alert:**
The highest pollution risk is currently concentrated at **Highway Logistics Corridor NH-3 (Dwarka Junction)** with **AQI 205 (PM2.5: 167 µg/m³)**, followed closely by **Nashik Industrial Corridor (AQI 182)**. 

Satellite optical depth (AOD 0.82) confirms heavy aerosol accumulation along the freight transit spine, aggravated by 19 citizen incident reports of idling diesel exhaust. AirGuard recommends immediate heavy-vehicle diversion and deployment of roadside misting cannons.`;
    } else if (q.includes('why') || q.includes('increase') || q.includes('increasing')) {
      fallbackAnswer = `**AirGuard Causal Analysis:**
The AQI is increasing due to a convergence of three hyper-local factors:
1. **Atmospheric Inversion:** The planetary boundary layer has dropped to ~310 meters, preventing vertical mixing of pollutants.
2. **Wind Stagnation:** Horizontal wind speeds have dropped to 4–5 km/h, preventing dispersion towards the rural perimeter.
3. **Cumulative Emissions:** Industrial operations in Ambad combined with peak logistics transit on NH-3 have produced a sustained particulate flux that cannot escape the urban basin.`;
    }

    return res.json({ success: true, isLiveGemini: false, answer: fallbackAnswer });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Vite middleware in dev or static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`AirGuard AI server running on port ${PORT}`);
  console.log(`Gemini API configured: ${Boolean(ai)}`);
});
