import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest } from '../types';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res
      .status(401)
      .json({ status: 'error', message: 'Unauthorized: no token provided', data: null });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      username: string;
      email: string;
    };
    req.admin = decoded;
    next();
  } catch {
    res
      .status(401)
      .json({ status: 'error', message: 'Unauthorized: invalid or expired token', data: null });
  }
};

export const validateApiKey = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== env.HARDWARE_API_KEY) {
    res.status(401).json({ status: 'error', message: 'Unauthorized: invalid API key', data: null });
    return;
  }

  next();
};
