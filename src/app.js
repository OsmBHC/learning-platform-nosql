// Question: Comment organiser le point d'entrée de l'application ?
// Réponse: Organiser le point d'entrée de l'application implique de structurer le code de manière à ce que les différentes parties de l'application soient clairement séparées et faciles à gérer. Cela inclut l'initialisation des connexions aux bases de données, la configuration des middlewares, le montage des routes, et le démarrage du serveur. En suivant une structure claire et modulaire, vous pouvez faciliter la maintenance et l'évolution de l'application.

// Question : Quelle est la meilleure façon de gérer le démarrage de l'application ?
// Réponse : La meilleure façon de gérer le démarrage de l'application est de suivre une séquence d'initialisation bien définie. Cela inclut l'initialisation des connexions aux bases de données, la configuration des middlewares, le montage des routes, et enfin le démarrage du serveur. En utilisant des fonctions asynchrones et en gérant les erreurs de manière appropriée, vous pouvez vous assurer que l'application démarre correctement et que toutes les dépendances sont correctement initialisées.

const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

async function startServer() {
  try {
    // Initialiser les connexions aux bases de données
    await db.connectMongo();
    await db.connectRedis();

    // Configurer les middlewares Express
    app.use(express.json());

    // Monter les routes
    app.use('/api/courses', courseRoutes);
    app.use('/api/students', studentRoutes);

    // Démarrer le serveur
    const PORT = config.port || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing connections...');
  await db.mongoClient.close();
  await db.redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing connections...');
  await db.mongoClient.close();
  await db.redisClient.quit();
  process.exit(0);
});

startServer();
