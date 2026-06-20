import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

from src.routes.predict_route import predict_bp

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['AI_SERVICE_API_KEY'] = os.getenv('AI_SERVICE_API_KEY', 'dev_ai_service_key')
app.register_blueprint(predict_bp)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "FloodWatch AI service is running"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
