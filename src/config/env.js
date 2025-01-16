// Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
// Réponse : Valider les variables d'environnement au démarrage est important pour s'assurer que l'application dispose de toutes les informations nécessaires pour fonctionner correctement. Cela permet de détecter rapidement les erreurs de configuration et d'éviter des comportements inattendus ou des pannes en cours d'exécution.

// Question: Que se passe-t-il si une variable requise est manquante ?
// Réponse : Si une variable requise est manquante, l'application peut ne pas fonctionner correctement ou peut échouer à démarrer. Il est donc crucial de lever une erreur explicative pour informer l'utilisateur de la configuration manquante et permettre une correction rapide.

const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  });
}

validateEnv(); // Appeler la fonction de validation au démarrage

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000
};
