export interface Reading {
  _id: string;
  location: string;
  rainIntensity: number;
  distanceCm: number;
  containerHeightCm: number;
  waterLevelCm: number;
  floodRisk: 'low' | 'moderate' | 'high';
  riskConfidence: number;
  timestamp: string;
  createdAt: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  admin: Admin;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}

export interface DashboardStats {
  totalReadings: number;
  latestRisk: Reading['floodRisk'] | null;
  avgWaterLevel: number;
  avgRainIntensity: number;
}
