import Reading from '../models/reading.model';
import { getPrediction } from './ai.service';
import { CreateReadingInput } from '../validations/reading.validation';

export const createReading = async (input: CreateReadingInput) => {
  // waterLevelCm = containerHeightCm - distanceCm (distance sensor measures from top)
  const waterLevelCm = Math.max(0, input.containerHeightCm - input.distanceCm);

  const prediction = await getPrediction({
    rainIntensity: input.rainIntensity,
    waterLevelCm,
    containerHeightCm: input.containerHeightCm,
  });

  const reading = await Reading.create({
    ...input,
    waterLevelCm,
    floodRisk: prediction.floodRisk,
    riskConfidence: prediction.riskConfidence,
  });

  return reading;
};

export const getAllReadings = async () => {
  return Reading.find().sort({ timestamp: -1 });
};

export const deleteReading = async (id: string) => {
  const reading = await Reading.findByIdAndDelete(id);
  if (!reading) throw { statusCode: 404, message: 'Reading not found' };
  return reading;
};
