from database.mongodb import mongo
from datetime import datetime
from bson.objectid import ObjectId


class UserModel:
    COLLECTION = "users"

    @staticmethod
    def create_user(name: str, email: str, password: str):
        """
        Crée un nouvel utilisateur
        """
        user = {
            "name": name,
            "email": email,
            "password": password,  # hashé avant d'être passé ici
            "created_at": datetime.utcnow()
        }
        result = mongo.db[UserModel.COLLECTION].insert_one(user)
        user["_id"] = result.inserted_id
        return user

    @staticmethod
    def get_by_email(email: str):
        """
        Récupère un utilisateur via email
        """
        return mongo.db[UserModel.COLLECTION].find_one({"email": email})

    @staticmethod
    def get_by_id(user_id: str):
        """
        Récupère un utilisateur via son ObjectId
        """
        if not ObjectId.is_valid(user_id):
            return None
        return mongo.db[UserModel.COLLECTION].find_one({"_id": ObjectId(user_id)})
