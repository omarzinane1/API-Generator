usecaseDiagram
    actor "Utilisateur (Développeur)" as User
    actor "Système (Générateur/Flask)" as System

    package "Application Générateur d'API" {
        usecase "S'inscrire" as UC1
        usecase "Se connecter" as UC2
        usecase "Créer une fonction" as UC3
        usecase "Générer une API" as UC4
        usecase "Lister les fonctions" as UC5
        usecase "Voir info API" as UC6
        usecase "Tester une API" as UC7
        usecase "Supprimer une fonction" as UC8
    }

    %% Relations Utilisateur
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8

    %% Relations Système
    %% Le système génère l'API automatiquement quand une fonction est créée
    UC3 ..> UC4 : <<include>> 
    UC4 --- System