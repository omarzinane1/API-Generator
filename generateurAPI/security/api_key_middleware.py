from functools import wraps
from flask import request, jsonify
from database.mongodb import mongo

def api_key_required(fn):
    """
    Middleware pour protéger les routes qui nécessitent une API Key.
    Usage : ajouter @api_key_required au-dessus de la route Flask
    """

    @wraps(fn)
    def wrapper(*args, **kwargs):
        # Récupérer la clé depuis le header
        api_key = request.headers.get("x-api-key")
        if not api_key:
            return jsonify({"error": "API key missing"}), 401

        # Vérifier la clé dans MongoDB (collection functions)
        function = mongo.db.functions.find_one({"api_key": api_key})
        if not function:
            return jsonify({"error": "Invalid API key"}), 403

        # Injecter la fonction dans request pour exécution
        request.function = function

        return fn(*args, **kwargs)

    return wrapper
