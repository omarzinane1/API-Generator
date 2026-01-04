from flask import Blueprint, request, jsonify
from models.function_model import FunctionModel
from security.jwt_middleware import jwt_required
from ai.generator import generate_code
import uuid

function_bp = Blueprint("function_bp", __name__)


# ==========================
# CREATE FUNCTION / API
# ==========================
@function_bp.route("/", methods=["POST"])
@jwt_required
def create_function():
    data = request.json

    # Validation minimale
    if not data.get("name") or not data.get("inputs") or not data.get("description") or not data.get("output_type"):
        return jsonify({"error": "Missing required fields"}), 400

    # Génération API Key unique
    api_key = str(uuid.uuid4())

    # Génération code Python via IA
    code = generate_code(
        name=data["name"],
        inputs=data["inputs"],
        description=data["description"],
        output_type=data["output_type"]
    )

    # Sauvegarde dans MongoDB
    function = FunctionModel.create_function(
        name=data["name"],
        description=data["description"],
        inputs=data["inputs"],
        output_type=data["output_type"],
        code=code,
        api_key=api_key,
        user_id=request.user_id  # depuis jwt_required
    )

    return jsonify({
        "id": str(function["_id"]),
        "name": function["name"],
        "api_key": function["api_key"]
    }), 201


# ==========================
# LIST FUNCTIONS / APIs
# ==========================
@function_bp.route("/", methods=["GET"])
@jwt_required
def list_functions():
    functions = FunctionModel.list_functions(request.user_id)
    result = []
    for fn in functions:
        # Récupérer et formater les paramètres depuis "inputs"
        parameters = []
        if "inputs" in fn and fn["inputs"]:
            # inputs est un dictionnaire: {"str1": "str", "str2": "str"}
            for param_name, param_type in fn["inputs"].items():
                parameters.append({
                    "name": param_name,
                    "type": param_type,
                    "required": True  # On suppose que tous les inputs sont requis
                })
        
        result.append({
            "id": str(fn["_id"]),
            "name": fn["name"],
            "description": fn.get("description", ""),
            "parameters": parameters,
            "returnType": fn.get("output_type", ""),
            "api_key": fn.get("api_key", ""),
            "createdAt": fn.get("created_at")
        })
    return jsonify(result), 200

# ========================== 
# GET FUNCTION BY ID
# ==========================
@function_bp.route("/<function_id>", methods=["GET"])
@jwt_required
def get_function(function_id):
    fn = FunctionModel.get_by_id(function_id)
    if not fn or str(fn["user_id"]) != request.user_id:
        return jsonify({"error": "Function not found"}), 404

    # Formater les paramètres depuis "inputs" (qui est un dictionnaire)
    parameters = []
    inputs = fn.get("inputs")
    
    if inputs and isinstance(inputs, dict):
        # inputs = {"a": "number", "b": "number"}
        for param_name, param_type in inputs.items():
            parameters.append({
                "name": param_name,
                "type": param_type,
                "required": True
            })

    return jsonify({
        "function": {
            "id": str(fn["_id"]),
            "name": fn["name"],
            "description": fn.get("description", ""),
            "parameters": parameters,
            "returnType": fn.get("output_type", ""),
            "api_key": fn.get("api_key", ""),
            "createdAt": fn.get("created_at")
        }
    }), 200


# ==========================
# DELETE FUNCTION
# ==========================

@function_bp.route("/<function_id>", methods=["DELETE"])
@jwt_required
def delete_function(function_id):
    """
    Supprime une fonction/API générée par IA
    Vérifie que l'utilisateur est propriétaire de la fonction
    """
    try:
        # Vérifier que user_id est défini
        user_id = getattr(request, "user_id", None)
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401

        # Récupérer la fonction depuis la DB
        fn = FunctionModel.get_by_id(function_id)
        if not fn:
            return jsonify({"error": "Function not found"}), 404

        # Vérifier que l'utilisateur est bien le propriétaire
        if str(fn["user_id"]) != user_id:
            return jsonify({"error": "Unauthorized"}), 403

        # Supprimer la fonction
        deleted = FunctionModel.delete_function(function_id)
        if not deleted:
            return jsonify({"error": "Failed to delete function"}), 500

        return jsonify({"message": f"Function '{fn['name']}' deleted successfully."}), 200

    except Exception as e:
        # Retourner toujours un JSON
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500