// Question: Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse: Créer un module séparé pour les connexions aux bases de données permet de centraliser la logique de connexion, ce qui facilite la maintenance et la réutilisation du code. Cela permet également de gérer les erreurs et les retries de manière cohérente. En isolant cette logique dans un module dédié, vous pouvez facilement modifier les configurations de connexion ou ajouter de nouvelles bases de données sans affecter le reste de l'application.

// Question: Comment gérer proprement la fermeture des connexions ?
// Réponse: Pour gérer proprement la fermeture des connexions, il est important de s'assurer que toutes les connexions sont fermées lorsque l'application se termine. Cela peut être fait en utilisant des gestionnaires d'événements pour les signaux de terminaison (comme SIGINT et SIGTERM) et en appelant les méthodes de fermeture appropriées pour chaque client de base de données.

const { MongoClient, Db } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

// Connects to the MongoDB server.
async function connectMongo() {
  try {
    mongoClient = new MongoClient(config.mongodb.uri);
    await mongoClient.connect();
    db = mongoClient.db(config.mongodb.dbName);
    console.log("MongoDB connected successfully");
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw err;
  }
}

// Retrieves the MongoDB database instance.
function getDb() {
  if (!db) throw new Error("Database not initialized. Call connectMongo first");
  return db;
}

// Connects to the Redis server.
async function connectRedis() {
  try {
    redisClient = redis.createClient({ url: config.redis.uri });
    await redisClient.connect();
    await redisClient.ping();
    console.log("Redis connected successfully");
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
}

// Retrieves the Redis client instance.
function getRedisClient() {
  if (!redisClient) throw new Error("Redis not connected yet. Call connectRedis first");
  return redisClient;
}

// Handle proper closure of connections
process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing connections...');
  await mongoClient.close();
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing connections...');
  await mongoClient.close();
  await redisClient.quit();
  process.exit(0);
});

module.exports = {
  getDb,
  connectMongo,
  connectRedis,
  getRedisClient,
};
