from flask_pymongo import PyMongo

mongo = PyMongo()


def init_mongo(app):
    """
    Initialise la connexion MongoDB avec Flask
    """
    mongo.init_app(app)
