import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'success', message: 'FloodWatch API is running', data: null });
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
