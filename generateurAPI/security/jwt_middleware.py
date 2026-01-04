from functools import wraps
from flask import request, jsonify
from utils.token import decode_jwt

def jwt_required(fn):
    """
    Middleware Flask pour protéger une route avec JWT.
    Vérifie l'en-tête Authorization: Bearer <token>
    """

    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401

        # Vérifier le format Bearer
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"error": "Invalid Authorization header"}), 401

        token = parts[1]

        try:
            payload = decode_jwt(token)
            request.user_id = payload.get("user_id")
        except ValueError as e:
            return jsonify({"error": str(e)}), 401
        except Exception:
            return jsonify({"error": "Invalid token"}), 401

        return fn(*args, **kwargs)

    return wrapper
