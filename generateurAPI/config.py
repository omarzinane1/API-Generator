import os
from datetime import timedelta
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv()


class Config:
    # ===============================
    # Flask
    # ===============================
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")

    # ===============================
    # MongoDB
    # ===============================
    MONGO_URI = os.getenv(
        "MONGO_URI",
        "mongodb://localhost:27017/flask_app"
    )

    # ===============================
    # JWT
    # ===============================
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "jwt-super-secret"
    )

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.getenv("JWT_EXPIRES_HOURS", 24))
    )

    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)

    # ===============================
    # CORS (Next.js / React)
    # ===============================
    CORS_HEADERS = "Content-Type"

    # ===============================
    # Environment
    # ===============================
    ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = ENV == "development"

    # ===============================
    # IA / LLM (Groq)
    # ===============================
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    #OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    
