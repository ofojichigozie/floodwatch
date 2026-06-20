import { env } from '../config/env';
import { AIPredictionInput, AIPredictionOutput } from '../types';

export const getPrediction = async (input: AIPredictionInput): Promise<AIPredictionOutput> => {
  const response = await fetch(`${env.AI_SERVICE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.AI_SERVICE_API_KEY,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw { statusCode: 502, message: 'AI service unavailable' };
  }

  const result = (await response.json()) as {
    status: string;
    message: string;
    data: AIPredictionOutput;
  };

  if (result.status !== 'success' || !result.data) {
    throw { statusCode: 502, message: 'AI service returned an invalid response' };
  }

  return result.data;
};
