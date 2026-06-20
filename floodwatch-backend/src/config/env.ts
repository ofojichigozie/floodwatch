import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/floodwatch',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN ?? '604800', 10),
  HARDWARE_API_KEY: process.env.HARDWARE_API_KEY || 'dev_api_key',
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  AI_SERVICE_API_KEY: process.env.AI_SERVICE_API_KEY || 'dev_ai_service_key',
};
