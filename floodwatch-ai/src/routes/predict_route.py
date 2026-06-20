from flask import Blueprint, current_app, jsonify, request
from src.services.predict_service import predict

predict_bp = Blueprint("predict", __name__)


@predict_bp.route("/predict", methods=["POST"])
def predict_route():
    expected_key = current_app.config.get("AI_SERVICE_API_KEY", "dev_ai_service_key")
    provided_key = request.headers.get("x-api-key")

    if not provided_key or provided_key != expected_key:
        return jsonify({
            "status": "error",
            "message": "Unauthorized: invalid API key",
            "data": None,
        }), 401

    body = request.get_json(silent=True)

    if not body:
        return jsonify({"status": "error", "message": "Request body is required", "data": None}), 400

    required = ["rainIntensity", "waterLevelCm", "containerHeightCm"]
    missing = [f for f in required if f not in body]
    if missing:
        return jsonify({
            "status": "error",
            "message": f"Missing fields: {', '.join(missing)}",
            "data": None,
        }), 400

    try:
        result = predict(
            rain_intensity=float(body["rainIntensity"]),
            water_level_cm=float(body["waterLevelCm"]),
            container_height_cm=float(body["containerHeightCm"]),
        )
        return jsonify({"status": "success", "message": "Prediction successful", "data": result}), 200

    except FileNotFoundError as e:
        return jsonify({"status": "error", "message": str(e), "data": None}), 503

    except Exception as e:
        return jsonify({"status": "error", "message": "Prediction failed", "data": None}), 500