import jwt
import datetime
import os

# Charger la clé secrète depuis les variables d'environnement
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-jwt-key")

def generate_jwt(user_id: str, expires_hours: int = 24) -> str:
    """
    Génère un token JWT pour un utilisateur.

    Args:
        user_id (str): ID de l'utilisateur
        expires_hours (int): Durée de validité en heures (défaut 24h)

    Returns:
        str: JWT encodé
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=expires_hours)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


def decode_jwt(token: str) -> dict:
    """
    Décode un token JWT et retourne le payload.

    Args:
        token (str): JWT encodé

    Returns:
        dict: Payload décodé
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
