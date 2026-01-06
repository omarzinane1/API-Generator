import os
from groq import Groq
from config import Config

# ==========================
# Initialisation du client Groq
# ==========================
client = Groq(api_key=Config.GROQ_API_KEY)

# Modèle Groq par défaut
MODEL = "llama-3.3-70b-versatile"  # Alternatives : "mixtral-8x7b-32768", "llama-3.1-70b-versatile"


def generate_code(name: str, inputs: list, description: str, output_type: str) -> str:
    """
    Génère le code Python d'une fonction via Groq.

    Args:
        name (str): Nom de la fonction
        inputs (list): Liste des noms des paramètres
        description (str): Description de la logique de la fonction
        output_type (str): Type de retour attendu

    Returns:
        str: Code Python généré prêt à exécuter
    """

    # Transformer la liste inputs en string "param1, param2, ..."
    inputs_str = ", ".join(inputs)

    prompt = f"""
Génère uniquement une fonction Python sécurisée nommée '{name}'.

Règles strictes :
- Arguments : {inputs_str}
- Logique : {description}
- Type de retour : {output_type}
- Pas d'importations
- Pas de print
- Retourne uniquement le code Python prêt à exec(), sans markdown ni backticks
- Ajoute un docstring clair décrivant les paramètres et le retour
- N'inclut pas de code global, seulement la fonction
"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=MODEL,
            temperature=0,  # deterministic
            max_tokens=1024,
        )

        code = chat_completion.choices[0].message.content.strip()

        # Nettoyer le code de tout markdown accidentel
        if code.startswith("```python"):
            code = code.replace("```python", "").replace("```", "").strip()
        elif code.startswith("```"):
            code = code.replace("```", "").strip()

        return code

    except Exception as e:
        # Retourne un code d'exception prêt à exécuter si Groq échoue
        print(f"[Groq Error] {e}")
        return (
            f"def {name}({inputs_str}):\n"
            f"    raise Exception('Erreur Groq : {str(e)}')"
        )
