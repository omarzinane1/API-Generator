import os
import openai
from openai.error import RateLimitError, OpenAIError
from config import Config

# ==========================
# Initialisation OpenAI
# ==========================
openai.api_key = Config.OPENAI_API_KEY

# Modèle compatible avec openai==0.28.1
MODEL = "gemini-2.5-flash"


def generate_code(name: str, inputs: dict, description: str, output_type: str) -> str:
    """
    Génère le code Python d'une fonction via OpenAI
    """

    prompt = f"""
Génère uniquement une fonction Python nommée {name}.

Règles :
- Arguments : {inputs}
- Logique : {description}
- Type de retour : {output_type}
- Pas d'importations
- Pas de print
- Retourne uniquement le code Python

Exemple :
def {name}(...):
    return ...
"""

    try:
        response = openai.ChatCompletion.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        return response.choices[0].message["content"].strip()

    except RateLimitError:
        # Quota dépassée
        return (
            f"def {name}():\n"
            f"    raise Exception('Quota OpenAI dépassée. Vérifiez votre billing.')"
        )

    except OpenAIError as e:
        # Erreur OpenAI générique
        return (
            f"def {name}():\n"
            f"    raise Exception('Erreur OpenAI : {str(e)}')"
        )

    except Exception as e:
        # Erreur backend
        return (
            f"def {name}():\n"
            f"    raise Exception('Erreur serveur : {str(e)}')"
        )
