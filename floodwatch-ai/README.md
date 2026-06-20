# FloodWatch AI Service

This component hosts the Flask API and the training workflow for the FloodWatch flood-risk prediction model. It generates synthetic training data, trains a scikit-learn model, and serves predictions for the backend.

## Setup

```bash
# 1. Create and activate a virtual environment
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# Mac/Linux
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Generate training data
python src/data/generate_data.py

# 4. Train the model
python src/model/train.py

# 5. Start the API
python app.py
```

The API will run at **http://localhost:8000**

## Configuration

Before generating data, open `src/data/generate_data.py` and edit:

```python
CONTAINER_HEIGHT_CM = 30      # ← set to your actual container height
FLOOD_THRESHOLD_PCT = 0.75    # 75% full = high risk
MODERATE_THRESHOLD_PCT = 0.45 # 45% full = moderate risk
```

Then re-run steps 3 and 4 to regenerate data and retrain.

## Endpoints

### `POST /predict`
**Headers:**
- `Content-Type: application/json`
- `x-api-key: <AI_SERVICE_API_KEY>`

**Body:**
```json
{
  "rainIntensity": 750,
  "waterLevelCm": 24.5,
  "containerHeightCm": 30
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Prediction successful",
  "data": {
    "floodRisk": "high",
    "riskConfidence": 0.97
  }
}
```

### `GET /health`
Returns API health status.