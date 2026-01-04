from flask import jsonify

def success(message: str = "Success", data: dict = None, status_code: int = 200):
    """
    Réponse JSON standard pour succès

    Args:
        message (str): Message de succès
        data (dict): Données à retourner
        status_code (int): Code HTTP

    Returns:
        Response: Flask JSON response
    """
    payload = {
        "success": True,
        "message": message,
        "data": data or {}
    }
    return jsonify(payload), status_code


def error(message: str = "Error", data: dict = None, status_code: int = 400):
    """
    Réponse JSON standard pour erreur

    Args:
        message (str): Message d'erreur
        data (dict): Données supplémentaires
        status_code (int): Code HTTP

    Returns:
        Response: Flask JSON response
    """
    payload = {
        "success": False,
        "message": message,
        "data": data or {}
    }
    return jsonify(payload), status_code
