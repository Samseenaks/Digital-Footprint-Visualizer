
export enum ExposureLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface FootprintData {
  identity: {
    name: string;
    role: string;
    location: string;
  };
  capabilities: string[];
  activitySignals: string[];
  detectedSources: string[];
  exposureLevel: ExposureLevel;
  riskReasoning: string;
  tips: string[];
  metrics: {
    professionalDensity: number; // 0-100
    socialConnectivity: number; // 0-100
    activityFrequency: number; // 0-100
    privacyResilience: number; // 0-100
  };
}

export interface AnalysisResponse {
  data: FootprintData | null;
  loading: boolean;
  error: string | null;
}
