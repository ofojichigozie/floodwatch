"""
FloodWatch — Training Data Generator
=====================================
Generates synthetic labelled training samples for the flood risk classifier.

CONFIGURATION
-------------
Edit CONTAINER_HEIGHT_CM to match your physical container/monitored area.
The flood threshold logic is based on what percentage of the container
is filled with water and how intense the rain is.

    CONTAINER_HEIGHT_CM : total height of the monitored container in cm.
    FLOOD_THRESHOLD_PCT : water fill % above which risk becomes "high".
    MODERATE_THRESHOLD_PCT : water fill % above which risk becomes "moderate".
"""

import os
import numpy as np
import pandas as pd

# ── EDIT THESE TO MATCH YOUR PHYSICAL SETUP ─────────────────────────────────
CONTAINER_HEIGHT_CM = 30      # Total height of your container/monitored area
FLOOD_THRESHOLD_PCT = 0.75    # 75% full → high risk
MODERATE_THRESHOLD_PCT = 0.45 # 45% full → moderate risk
# ─────────────────────────────────────────────────────────────────────────────

def label(rain_intensity: int, water_level_cm: float, container_height_cm: float) -> str:
    fill_ratio = water_level_cm / container_height_cm
    rain_norm = 1.0 - (rain_intensity / 1024.0)

    if fill_ratio >= FLOOD_THRESHOLD_PCT or (fill_ratio >= 0.60 and rain_norm >= 0.7):
        return "high"
    elif fill_ratio >= MODERATE_THRESHOLD_PCT or (fill_ratio >= 0.30 and rain_norm >= 0.5):
        return "moderate"
    else:
        return "low"


# ── SYNTHETIC THRESHOLD-BASED DATA GENERATION ────────────────────────────
# This keeps the AI pipeline fully automatic: you do not need to maintain
# a hand-written raw dataset. The thresholds below define the risk logic.

H = CONTAINER_HEIGHT_CM


def build_training_samples(sample_count: int = 300, seed: int = 42) -> list[dict]:
    """Build balanced synthetic training samples from flood-risk thresholds."""
    rng = np.random.default_rng(seed)
    groups = [
        ("low",      0.00, 0.35, 700, 1023),
        ("moderate", 0.25, 0.65, 300, 700),
        ("high",     0.55, 1.00, 0,   300),
    ]

    base = sample_count // 3
    remainder = sample_count % 3
    counts = [base + (1 if i < remainder else 0) for i in range(3)]

    records = []
    for (risk_label, fill_min, fill_max, rain_min, rain_max), count in zip(groups, counts):
        for _ in range(count):
            water_level_cm = float(rng.uniform(fill_min * H, fill_max * H))
            rain_intensity = int(rng.integers(rain_min, rain_max + 1))

            if risk_label == "low" and rng.random() < 0.10:
                water_level_cm = float(rng.uniform(0.10 * H, 0.40 * H))
                rain_intensity = int(rng.integers(800, 1024))
            elif risk_label == "moderate" and rng.random() < 0.10:
                water_level_cm = float(rng.uniform(0.30 * H, 0.70 * H))
                rain_intensity = int(rng.integers(300, 700))
            elif risk_label == "high" and rng.random() < 0.10:
                water_level_cm = float(rng.uniform(0.65 * H, H))
                rain_intensity = int(rng.integers(0, 180))

            records.append({
                "rain_intensity": rain_intensity,
                "water_level_cm": round(water_level_cm, 2),
                "container_height_cm": H,
                "water_fill_ratio": round(water_level_cm / H, 4),
                "flood_risk": label(rain_intensity, water_level_cm, H),
            })

    return records


def save_training_dataset():
    records = build_training_samples()

    df = pd.DataFrame(records)

    out_dir = os.path.join(os.path.dirname(__file__), "..", "..", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "training_data.csv")
    df.to_csv(out_path, index=False)

    print(f"Generated {len(df)} samples → {out_path}")
    print(df["flood_risk"].value_counts().to_string())
    return df


if __name__ == "__main__":
    save_training_dataset()