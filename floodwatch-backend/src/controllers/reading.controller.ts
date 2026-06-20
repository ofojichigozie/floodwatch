import { Request, Response, NextFunction } from 'express';
import { createReadingSchema } from '../validations/reading.validation';
import { createReading, getAllReadings, deleteReading } from '../services/reading.service';
import { getIO } from '../config/socket';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = createReadingSchema.parse(req.body);
    const reading = await createReading(input);

    // Broadcast new reading to all connected dashboard clients
    getIO().emit('new_reading', reading);

    res.status(201).json({ status: 'success', message: 'Reading recorded', data: reading });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const readings = await getAllReadings();
    res.status(200).json({ status: 'success', message: 'Readings fetched', data: readings });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reading = await deleteReading(req.params.id);
    res.status(200).json({ status: 'success', message: 'Reading deleted', data: reading });
  } catch (err) {
    next(err);
  }
};
