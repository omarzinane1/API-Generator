def execute_safely(code: str, payload: dict):
    """
    Exécute une fonction Python générée de manière sécurisée.

    Args:
        code (str): Le code Python généré (string)
        payload (dict): Les entrées pour la fonction

    Returns:
        any: Le résultat de la fonction exécutée
    """
    # Définir un environnement sécurisé limité
    safe_globals = {
        "__builtins__": {
            "len": len,
            "sum": sum,
            "min": min,
            "max": max,
            "round": round,
            "abs": abs,
            "all": all,
            "any": any,
            "range": range,
            "enumerate": enumerate,
            "zip": zip,
            "Exception": Exception,
            "ValueError": ValueError,
            "TypeError": TypeError,
        }
    }

    # Espace local pour l'exécution
    local_vars = {}

    try:
        # Exécuter le code dans l'environnement sécurisé
        exec(code, safe_globals, local_vars)

        # Récupérer la première fonction définie dans le code
        func = next((v for v in local_vars.values() if callable(v)), None)
        if not func:
            raise RuntimeError("No callable function found in the provided code.")

        # Vérifier que payload est bien un dict
        if not isinstance(payload, dict):
            raise ValueError("Payload must be a dictionary.")

        # --- Conversion automatique des valeurs numériques si elles ressemblent à des nombres ---
        converted_payload = {}
        for k, v in payload.items():
            if isinstance(v, str):
                try:
                    if "." in v:
                        converted_payload[k] = float(v)
                    else:
                        converted_payload[k] = int(v)
                except ValueError:
                    # Si ce n'est pas un nombre, garder la valeur telle quelle
                    converted_payload[k] = v
            else:
                converted_payload[k] = v

        # Appeler la fonction avec le payload fourni
        result = func(**converted_payload)
        return result

    except Exception as e:
        # Lever l'exception avec un message clair
        raise RuntimeError(f"Error executing function: {str(e)}")
