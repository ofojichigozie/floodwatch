import { Request, Response, NextFunction } from 'express';
import { loginSchema } from '../validations/auth.validation';
import { loginAdmin } from '../services/auth.service';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = loginSchema.parse(req.body);
    const data = await loginAdmin(input);
    res.status(200).json({ status: 'success', message: 'Login successful', data });
  } catch (err) {
    next(err);
  }
};
