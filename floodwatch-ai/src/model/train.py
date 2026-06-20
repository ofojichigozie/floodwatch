"""
FloodWatch — Model Training
============================
Trains a Random Forest classifier on the generated dataset and saves
the model to /model/flood_model.pkl.

Run:  python src/model/train.py
"""

import os
import sys
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Resolve paths relative to project root
ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
DATA_PATH = os.path.join(ROOT, "data", "training_data.csv")
MODEL_DIR = os.path.join(ROOT, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "flood_model.pkl")

FEATURES = ["rain_intensity", "water_level_cm", "container_height_cm", "water_fill_ratio"]
TARGET = "flood_risk"


def train():
    if not os.path.exists(DATA_PATH):
        print(f"Training data not found at {DATA_PATH}")
        print("Run:  python src/data/generate_data.py  first.")
        sys.exit(1)

    df = pd.read_csv(DATA_PATH)
    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print("=== Classification Report ===")
    print(classification_report(y_test, y_pred))

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved → {MODEL_PATH}")


if __name__ == "__main__":
    train()