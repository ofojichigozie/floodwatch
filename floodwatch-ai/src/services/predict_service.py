"""
Loads the trained model once and exposes a predict() function.
"""

import os
import joblib
import pandas as pd

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
MODEL_PATH = os.path.join(ROOT, "model", "flood_model.pkl")
FEATURES = ["rain_intensity", "water_level_cm", "container_height_cm", "water_fill_ratio"]

_model = None


def _load_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model not found at {MODEL_PATH}. "
                "Run: python src/data/generate_data.py && python src/model/train.py"
            )
        _model = joblib.load(MODEL_PATH)
    return _model


def predict(rain_intensity: float, water_level_cm: float, container_height_cm: float) -> dict:
    """
    Returns flood risk label and confidence.

    Parameters
    ----------
    rain_intensity     : 0–1024 ADC value from rain sensor
    water_level_cm     : computed water level (containerHeight - distance)
    container_height_cm: total height of the container

    Returns
    -------
    { "floodRisk": "low"|"moderate"|"high", "riskConfidence": float }
    """
    model = _load_model()

    water_fill_ratio = water_level_cm / container_height_cm if container_height_cm > 0 else 0.0

    features = pd.DataFrame(
        [[rain_intensity, water_level_cm, container_height_cm, water_fill_ratio]],
        columns=FEATURES,
    )
    label = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]
    classes = list(model.classes_)
    confidence = float(probabilities[classes.index(label)])

    return {
        "floodRisk": label,
        "riskConfidence": round(confidence, 4),
    }