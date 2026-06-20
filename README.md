# FloodWatch

FloodWatch is an end-to-end flood monitoring and early-warning system that combines an ESP8266 sensor node, a Node.js backend, an AI-powered risk service, and a React dashboard. The project is designed to collect water-level readings, forward them to a backend API, score flood risk using a trained model, and present the results in a live web interface.

## Project structure

- floodwatch-ai/: Flask service for training and serving the flood-risk prediction model
- floodwatch-backend/: TypeScript API with authentication, MongoDB storage, and Socket.IO updates
- floodwatch-frontend/: React + Vite dashboard for viewing readings and risk information
- floodwatch-firmware/: ESP8266 firmware for the physical sensor node

## Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB running locally or reachable through a connection string
- Arduino CLI (optional, required for firmware upload)

## Quick start

### 1. Backend API

```bash
cd floodwatch-backend
npm install
# copy the provided .env.example file to .env and update the values, then start the server
npm run dev
```

The API runs on http://localhost:5000.

### 2. AI service

```bash
cd ../floodwatch-ai
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
python src/data/generate_data.py
python src/model/train.py
python app.py
```

The AI service runs on http://localhost:8000.

### 3. Frontend dashboard

```bash
cd ../floodwatch-frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173.

### 4. Firmware

```bash
cd ../floodwatch-firmware
# edit config.h first with your Wi-Fi credentials, API host, and API key
```

For full firmware build and upload instructions, see the firmware README.

## Repository

https://github.com/ofojichigozie/floodwatch
