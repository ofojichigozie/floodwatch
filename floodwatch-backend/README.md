# FloodWatch Backend

This service provides the core API for FloodWatch. It handles authentication, stores sensor readings in MongoDB, exposes REST endpoints for the frontend, and broadcasts live updates with Socket.IO.

## Prerequisites

- Node.js 18+
- MongoDB running locally or reachable via URI

## Install dependencies

```bash
npm install
```

## Environment variables

Copy the provided .env.example file to .env in this folder and update the values as needed:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/floodwatch
JWT_SECRET=your_super_secret_key
HARDWARE_API_KEY=dev_api_key
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=dev_ai_service_key
```

## Run locally

```bash
npm run dev
```

The server will start at http://localhost:5000.

## Seed an admin user

```bash
npm run seed
```
