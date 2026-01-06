from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()

# Import des routes
from routes.auth_routes import auth_bp
from routes.function_routes import function_bp
from routes.execute_routes import execute_bp

# Import MongoDB
from database.mongodb import init_mongo

def create_app():
    app = Flask(__name__)

    # =========================
    # CONFIGURATION
    # =========================
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "super-secret-key")
    app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/generateur_api")

    # =========================
    # INITIALISER MONGO
    # =========================
    init_mongo(app)

    # =========================
    # CORS (Important pour Next.js)
    # =========================
    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://localhost:3000"]}},  # Frontend Next.js
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization","x-api-key"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    # =========================
    # REGISTER BLUEPRINTS
    # =========================
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(function_bp, url_prefix="/api/functions")
    app.register_blueprint(execute_bp, url_prefix="/api/functions")

    # =========================
    # HEALTH CHECK
    # =========================
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "OK", "message": "Flask API is running"})

    # =========================
    # Gestion des erreurs globales (pré-requête OPTIONS et auth)
    # =========================
    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"error": "Unauthorized"}), 401

    @app.before_request
    def handle_options_request():
        from flask import request
        if request.method == "OPTIONS":
            return jsonify({}), 200

    return app


# =========================
# POINT D'ENTRÉE
# =========================
app = create_app()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
