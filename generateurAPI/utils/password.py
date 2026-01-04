import bcrypt

def hash_password(plain_password: str) -> str:
    """
    Hash un mot de passe en utilisant bcrypt.

    Args:
        plain_password (str): Mot de passe en clair

    Returns:
        str: Mot de passe hashé
    """
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Vérifie qu'un mot de passe correspond au hash stocké.

    Args:
        plain_password (str): Mot de passe en clair
        hashed_password (str): Mot de passe hashé

    Returns:
        bool: True si correct, False sinon
    """
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
