import mongoose, { Document, Schema } from 'mongoose';

export type FloodRisk = 'low' | 'moderate' | 'high';

export interface IReading extends Document {
  location: string;
  rainIntensity: number;
  distanceCm: number;
  containerHeightCm: number;
  waterLevelCm: number;
  floodRisk: FloodRisk;
  riskConfidence: number;
  timestamp: Date;
}

const ReadingSchema = new Schema<IReading>(
  {
    location: { type: String, required: true, trim: true },
    rainIntensity: { type: Number, required: true, min: 0, max: 1024 },
    distanceCm: { type: Number, required: true, min: 0 },
    containerHeightCm: { type: Number, required: true, min: 1 },
    waterLevelCm: { type: Number, required: true, min: 0 },
    floodRisk: { type: String, enum: ['low', 'moderate', 'high'], required: true },
    riskConfidence: { type: Number, required: true, min: 0, max: 1 },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model<IReading>('Reading', ReadingSchema);
