# FloodWatch Frontend

This frontend provides the web dashboard for FloodWatch. It shows live readings, risk status, charts, and admin authentication for monitoring flood conditions.

## Prerequisites

- Node.js 18+

## Install dependencies

```bash
npm install
```

## Run locally

```bash
npm run dev
```

The development server will start at http://localhost:5173.

## Configuration

Copy the provided .env.example file to .env and adjust the values for your local setup. If your backend is not running on the default port, set the API base URL before starting the app:

```bash
VITE_API_URL=http://localhost:5000/api/v1 npm run dev
```
