# API Generator

## Présentation

API Generator est une application web Fullstack qui permet de **générer automatiquement des endpoints REST** à partir de descriptions en langage naturel.  
Tu écris ce que tu veux que ta fonction fasse, l’IA génère le code et crée un endpoint API utilisable immédiatement.

Le frontend est développé avec **Next.js**, permettant une interface interactive et réactive pour créer, lister et tester les fonctions.

---

## Fonctionnalités principales

- **Création automatique de fonctions via IA**  
  Décris une fonction (nom, inputs, description, type de retour), l’IA génère le code Python correspondant.

- **Endpoints REST dynamiques**  
  Chaque fonction devient un endpoint POST qui accepte les inputs en JSON et renvoie les résultats.

- **Interface de test intégrée (Next.js)**  
  Tester directement les endpoints depuis l’application avec des formulaires intelligents selon le type de paramètre.

- **Accès externe aux API**  
  Tes endpoints suivent le standard REST et sont sécurisés par une **clé API unique**.

- **Stockage persistant**  
  Toutes les fonctions sont sauvegardées dans MongoDB et disponibles après redémarrage.

- **Suppression de fonction**  
  Supprime facilement une fonction créée par l’utilisateur propriétaire.

---

## Tech Stack

- **Backend** : Flask (Python)
  - Routes : `/api/functions`, `/api/auth`, `/api/functions/execute`
  - Authentification JWT
  - Gestion des fonctions CRUD
- **Frontend** : Next.js (React)
  - Pages pour créer, lister et tester les fonctions
  - Formulaires dynamiques selon les types d’input
- **Base de données** : MongoDB (PyMongo)
- **IA** : Module interne `ai.generator` pour générer du code Python à partir de texte
- **Sécurité** : clé API unique par fonction, JWT pour utilisateurs

---

## Installation

### Backend (Flask)

1. Cloner le projet :  
bash
git clone <ton-repo>
cd generateurAPI

2. Créer un environnement Python et installer les dépendances :

python -m venv venv
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt


3. Créer un fichier .env à la racine :

SECRET_KEY=super-secret-key
MONGO_URI=mongodb://localhost:27017/generateur_api


4. Lancer le serveur Flask :

python app.py


L’API sera disponible sur http://localhost:5000

Health check : GET /api/health

Frontend (Next.js)

5. Aller dans le dossier frontend :

cd frontend


6. Installer les dépendances :

npm install


7. Lancer le serveur de développement :

npm run dev
