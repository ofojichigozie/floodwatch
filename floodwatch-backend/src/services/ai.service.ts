import { env } from '../config/env';
import { AIPredictionInput, AIPredictionOutput } from '../types';

export const getPrediction = async (input: AIPredictionInput): Promise<AIPredictionOutput> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const response = await fetch(`${env.AI_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.AI_SERVICE_API_KEY,
      },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) throw new Error(`AI responded with status ${response.status}`);

    const result = (await response.json()) as {
      status: string;
      message: string;
      data: AIPredictionOutput;
    };

    if (result.status !== 'success' || !result.data)
      throw new Error('AI returned invalid response');

    console.log('[Prediction] source: AI');
    return result.data;
  } catch {
    console.warn('[Prediction] source: rule-based (AI unavailable)');

    const { rainIntensity, waterLevelCm, containerHeightCm } = input;
    const fillRatio = containerHeightCm > 0 ? waterLevelCm / containerHeightCm : 0;

    // Rain sensor reads 1024 (dry) → 0 (fully wet)
    const rainWetness = 1 - rainIntensity / 1024;

    let floodRisk: 'low' | 'moderate' | 'high';
    let riskConfidence: number;

    if (fillRatio >= 0.75 || (fillRatio >= 0.6 && rainWetness >= 0.7)) {
      floodRisk = 'high';
      riskConfidence = 0.85;
    } else if (fillRatio >= 0.45 || (fillRatio >= 0.3 && rainWetness >= 0.5)) {
      floodRisk = 'moderate';
      riskConfidence = 0.75;
    } else {
      floodRisk = 'low';
      riskConfidence = 0.9;
    }

    return { floodRisk, riskConfidence };
  }
};
