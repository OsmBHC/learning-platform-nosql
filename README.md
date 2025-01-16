 # Learning Platform NoSQL

## Table des matières

- [Introduction](#introduction)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [Choix techniques](#choix-techniques)
- [Utilisation](#utilisation)
- [Réflexions et captures d'écran](#réflexions-et-captures-décran)

## Introduction

Ce projet est une plateforme d'apprentissage en ligne qui utilise une base de données NoSQL (MongoDB) et un cache Redis pour gérer les cours et les étudiants. L'application est construite avec Node.js et Express.js.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)
- [Git](https://git-scm.com/)

## Installation

1. **Cloner le dépôt :**
```bash
git clone https://github.com/[votre-compte]/learning-platform-nosql.git
```
2. **Accéder au répertoire du projet :**
```bash
cd learning-platform-nosql
```
3. **Installer les dépendances :**
```bash
npm install
```
4. **Configurer les variables d'environnement :**

Créez un fichier .env à la racine du projet et ajoutez les variables d'environnement nécessaires :
```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=learning_platform
REDIS_URI=redis://localhost:6379
PORT=3000

REDIS_KEY_ALL_COURSES=course\:all
REDIS_KEY_COURSE_PREFIX=course:
REDIS_KEY_COURSE_STATS=stats\:course

REDIS_KEY_ALL_STUDENTS=student\:all
REDIS_KEY_STUDENT_PREFIX=student:
REDIS_KEY_STUDENT_STATS=stats\:student
```
5. **Démarrer le serveur :**
```bash
npm start
```
## Structure du projet
```
learning-platform-nosql/
│
├── README.md
├── package-lock.json
├── package.json
├── node_modules
└── src
    ├── app.js
    ├── config
    │   ├── db.js
    │   └── env.js
    ├── controllers
    │   ├── courseController.js
    │   └── studentController.js
    ├── routes
    │   ├── courseRoutes.js
    │   └── studentRoutes.js
    └── services
        ├── mongoService.js
        └── redisService.js
```
### src/config
* **db.js :** Ce fichier contient les fonctions pour initialiser et gérer les connexions aux bases de données MongoDB et Redis. Il utilise les variables d'environnement définies dans env.js pour se connecter aux bases de données.
* **env.js :** Ce fichier charge les variables d'environnement à partir du fichier .env et les valide pour s'assurer que toutes les informations nécessaires sont présentes.

### src/controllers
* **courseController.js :** Ce fichier contient les contrôleurs pour gérer les opérations CRUD (Create, Read, Update, Delete) pour les cours. Il utilise les services MongoDB et Redis pour interagir avec la base de données et le cache.
* **studentController.js :** Ce fichier contient les contrôleurs pour gérer les opérations CRUD pour les étudiants. Il utilise les services MongoDB et Redis pour interagir avec la base de données et le cache.

### src/routes
* **courseRoutes.js :** Ce fichier définit les routes pour les opérations CRUD sur les cours. Il utilise les contrôleurs définis dans courseController.js pour gérer les requêtes HTTP.
* **studentRoutes.js :** Ce fichier définit les routes pour les opérations CRUD sur les étudiants. Il utilise les contrôleurs définis dans studentController.js pour gérer les requêtes HTTP.

### src/services
* **mongoService.js :** Ce fichier contient les fonctions utilitaires pour interagir avec la base de données MongoDB. Il fournit des fonctions génériques pour les opérations CRUD.
* **redisService.js :** Ce fichier contient les fonctions utilitaires pour interagir avec le cache Redis. Il fournit des fonctions pour mettre en cache et récupérer des données.

### app.js
* **app.js :** Ce fichier est le point d'entrée de l'application. Il configure les connexions aux bases de données, les middlewares Express, monte les routes et démarre le serveur. Il gère également la fermeture propre des connexions aux bases de données lors de l'arrêt du serveur.

## Choix techniques
### Base de données
* **MongoDB :** Choisi pour sa flexibilité et sa capacité à gérer des données non structurées. MongoDB est bien adapté pour les applications nécessitant une grande évolutivité et des performances élevées.
* **Redis :** Utilisé pour le caching afin d'améliorer les performances de l'application en réduisant les temps de réponse pour les requêtes fréquentes.
### Framework
* **Express.js :** Choisi pour sa simplicité et sa flexibilité. Express.js est un framework minimaliste pour Node.js qui permet de créer des applications web et des API de manière rapide et efficace.
### Gestion des connexions
* **Modules séparés :** Les connexions aux bases de données sont gérées dans des modules séparés (db.js et env.js) pour faciliter la maintenance et la réutilisation du code.
### Caching avec Redis
Pour améliorer les performances de notre application, nous utilisons Redis comme cache côté serveur. Voici un schéma décrivant la logique de caching depuis MongoDB avec Redis :
![schéma descriptive du caching](./images/schema.png)
1. **Cache Read :** Lorsque l'application reçoit une requête de données, elle vérifie d'abord si les données sont disponibles dans le cache.
2. **Cache Hit / Miss :** Si les données sont trouvées dans le cache (cache hit), elles sont retournées immédiatement à l'application. Si les données ne sont pas trouvées dans le cache (cache miss), l'application passe à l'étape suivante.
3. **DB Read :** Si les données ne sont pas dans le cache, l'application lit les données directement depuis la base de données MongoDB.
4. **Return Data :** Les données lues depuis la base de données sont retournées à l'application.
5. **Update Cache :** Les données lues depuis la base de données sont mises en cache pour les requêtes futures.

En utilisant cette approche, nous pouvons réduire significativement les temps de réponse pour les requêtes fréquentes et améliorer les performances globales de l'application.

## Utilisation
### Routes disponibles
#### Courses :
* **POST /api/courses :** Créer un nouveau cours.
* **GET /api/courses :** Récupérer tous les cours.
* **GET /api/courses/:id :** Récupérer un cours par son ID.
* **PUT /api/courses/:id :** Mettre à jour un cours par son ID.
* **DELETE /api/courses/:id :** Supprimer un cours par son ID.
* **GET /api/courses/stats :** Récupérer les statistiques des cours.

#### Students :
* **POST /api/students :** Créer un nouvel étudiant.
* **GET /api/students :** Récupérer tous les étudiants.
* **GET /api/students/:id :** Récupérer un étudiant par son ID.
* **PUT /api/students/:id :** Mettre à jour un étudiant par son ID.
* **DELETE /api/students/:id :** Supprimer un étudiant par son ID.
* **GET /api/students/stats :** Récupérer les statistiques des étudiants.

## Réflexions et captures d'écran
### Réflexions
* **Séparation des responsabilités :** En séparant les contrôleurs, les routes et les services, nous avons pu structurer le code de manière modulaire, ce qui facilite la maintenance et la réutilisation du code.
* **Gestion des erreurs :** La gestion des erreurs a été implémentée de manière cohérente pour garantir la robustesse de l'application.
* **Utilisation du cache :** L'utilisation de Redis pour le caching a permis d'améliorer les performances de l'application en réduisant les temps de réponse pour les requêtes fréquentes.

### Captures d'écran
#### Capture d'écran de la structure du projet :
<img src="./images/structure.png" alt="structure du projet" height="500"/>

#### Capture d'écran de l'application en cours d'exécution :
  ![l'application en cours d'exécution](./images/app.png)
#### Capture d'écran des tests avec Postman :
 - **Créer un nouveau cours** :
 
![Créer un nouveau cours](./images/create.png)

 - **Récupérer tous les cours** :

![Récupérer tous les cours](./images/get.png)

 - **Récupérer un cours par son ID** :

![Récupérer un cours par son ID](./images/getbyid.png)
