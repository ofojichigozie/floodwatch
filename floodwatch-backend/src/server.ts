import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { initSocket } from './config/socket';
import { env } from './config/env';

const server = http.createServer(app);
initSocket(server);

const start = async () => {
  await connectDB();
  server.listen(env.PORT, () => {
    console.log(`FloodWatch API running on port ${env.PORT}`);
  });
};

start();
