import { Router } from 'express';
import authRoutes from './auth.routes';
import readingRoutes from './reading.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/readings', readingRoutes);

export default router;
