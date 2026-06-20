import { Request } from 'express';

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}

export interface AIPredictionInput {
  rainIntensity: number;
  waterLevelCm: number;
  containerHeightCm: number;
}

export interface AIPredictionOutput {
  floodRisk: 'low' | 'moderate' | 'high';
  riskConfidence: number;
}
