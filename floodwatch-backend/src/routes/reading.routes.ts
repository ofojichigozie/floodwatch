import { Router } from 'express';
import { create, getAll, remove } from '../controllers/reading.controller';
import { validateApiKey } from '../middlewares/auth.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Hardware posts a reading using x-api-key
router.post('/', validateApiKey, create);

// Admin dashboard reads and deletes — requires JWT
router.get('/', authenticate, getAll);
router.delete('/:id', authenticate, remove);

export default router;
