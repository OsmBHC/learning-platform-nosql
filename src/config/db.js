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
