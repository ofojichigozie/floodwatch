import { z } from 'zod';

export const createReadingSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  rainIntensity: z
    .number()
    .min(0, 'Rain intensity cannot be negative')
    .max(1024, 'Rain intensity must be less than or equal to 1024'),
  distanceCm: z.number().min(0, 'Distance (cm) cannot be negative'),
  containerHeightCm: z.number().min(1, 'Container height (cm) is required'),
});

export type CreateReadingInput = z.infer<typeof createReadingSchema>;
