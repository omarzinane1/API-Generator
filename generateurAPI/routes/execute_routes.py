from flask import Blueprint, request, jsonify
from models.function_model import FunctionModel
from security.api_key_middleware import api_key_required
from executor.sandbox import execute_safely

execute_bp = Blueprint("execute_bp", __name__)

# ==========================
# EXECUTE FUNCTION / API
# ==========================
@execute_bp.route("/<function_id>", methods=["POST"])
@api_key_required
def execute_function(function_id):
    """
    Exécute une fonction générée via API Key.
    - L'utilisateur fournit l'API Key dans header "x-api-key"
    - Le payload JSON doit contenir un objet "parameters" avec les arguments
    """
    fn = request.function  # injecté par api_key_required

    try:
        payload = request.json or {}
        params = payload.get("parameters", {})  # <-- récupère seulement le dictionnaire "parameters"
        result = execute_safely(fn["code"], params)  # passe les arguments individuellement
        return jsonify({
            "success": True,
            "result": result
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Error executing function: {str(e)}"
        }), 400
