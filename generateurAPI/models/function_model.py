from database.mongodb import mongo
from datetime import datetime
from bson.objectid import ObjectId


class FunctionModel:
    COLLECTION = "functions"

    @staticmethod
    def create_function(name: str, description: str, inputs: dict, output_type: str, code: str, api_key: str, user_id: str):
        """
        Crée une nouvelle fonction/API générée par IA
        """
        function = {
            "name": name,
            "description": description,
            "inputs": inputs,              # dict exemple: {"price": "number"}
            "output_type": output_type,    # string: "number", "string", etc.
            "code": code,                  # code Python généré
            "api_key": api_key,            # clé unique pour l’API
            "user_id": ObjectId(user_id),  # lien vers user
            "created_at": datetime.utcnow()
        }
        result = mongo.db[FunctionModel.COLLECTION].insert_one(function)
        function["_id"] = result.inserted_id
        return function

    @staticmethod
    def get_by_id(function_id: str):
        """
        Récupère une fonction via son ObjectId
        """
        if not ObjectId.is_valid(function_id):
            return None
        return mongo.db[FunctionModel.COLLECTION].find_one({"_id": ObjectId(function_id)})

    @staticmethod
    def get_by_api_key(api_key: str):
        """
        Récupère une fonction via sa clé API
        """
        return mongo.db[FunctionModel.COLLECTION].find_one({"api_key": api_key})

    @staticmethod
    def list_functions(user_id: str):
        """
        Liste toutes les fonctions créées par un utilisateur
        """
        return list(
            mongo.db[FunctionModel.COLLECTION]
            .find({"user_id": ObjectId(user_id)})
            .sort("created_at", -1)
        )
    
    @staticmethod
    def delete_function(function_id: str) -> bool:
        """
        Supprime une fonction via son ObjectId
        Retourne True si suppression réussie, False sinon
        """
        if not ObjectId.is_valid(function_id):
            return False
        try:
            result = mongo.db[FunctionModel.COLLECTION].delete_one({"_id": ObjectId(function_id)})
            return result.deleted_count > 0
        except Exception as e:
            print("Erreur lors de la suppression:", e)
            return False
