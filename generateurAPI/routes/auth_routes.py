from flask import Blueprint, request, jsonify
from models.user_model import UserModel
from utils.password import hash_password, verify_password
from utils.token import generate_jwt
import uuid

auth_bp = Blueprint("auth_bp", __name__)


# ==========================
# REGISTER
# ==========================
@auth_bp.route("/signup", methods=["POST"])
def register():
    data = request.json

    # Validation basique
    if not data.get("name") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "All fields are required"}), 400

    # Vérifier si email existe déjà
    existing_user = UserModel.get_by_email(data["email"])
    if existing_user:
        return jsonify({"error": "Email already registered"}), 400

    # Hash du mot de passe
    hashed_pwd = hash_password(data["password"])

    # Création user
    user = UserModel.create_user(
        name=data["name"],
        email=data["email"],
        password=hashed_pwd
    )

    # Générer JWT
    token = generate_jwt(str(user["_id"]))

    return jsonify({
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }), 201


# ==========================
# LOGIN
# ==========================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    user = UserModel.get_by_email(data["email"])
    if not user or not verify_password(data["password"], user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    # Générer JWT
    token = generate_jwt(str(user["_id"]))

    return jsonify({
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }), 200
