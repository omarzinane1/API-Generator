from database.mongodb import mongo


def create_indexes():
    """
    Crée les indexes MongoDB nécessaires
    À appeler une seule fois au démarrage de l'application
    """

    # Users
    mongo.db.users.create_index(
        "email",
        unique=True,
        name="idx_unique_user_email"
    )

    # API Keys
    mongo.db.api_keys.create_index(
        "key",
        unique=True,
        name="idx_unique_api_key"
    )

    # Functions
    mongo.db.functions.create_index(
        "name",
        unique=True,
        name="idx_unique_function_name"
    )

    mongo.db.functions.create_index(
        "created_at",
        name="idx_function_created_at"
    )
