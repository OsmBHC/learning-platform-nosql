const { getRedisClient } = require('../config/db');

let ttl = 3600; // TTL (1 hour) in seconds

// Functions to cache data in Redis

// Cache data with a specific key and TTL
async function cacheData(key, data) {
  try {
    const client = getRedisClient();
    await client.set(key, JSON.stringify(data), 'EX', ttl);
    console.log(`Data cached with key: ${key}`);
  } catch (err) {
    console.error('Error caching data:', err);
    throw err;
  }
}

// Retrieve cached data with a specific key
async function getCachedData(key) {
  try {
    const client = getRedisClient();
    const data = await client.get(key);
    if (data) {
      console.log(`Data retrieved with key: ${key}`);
      return JSON.parse(data);
    } else {
      console.log(`No data found with key: ${key}`);
      return null;
    }
  } catch (err) {
    console.error('Error getting data:', err);
    throw err;
  }
}

// Delete cached data with a specific key
async function deleteCachedData(key) {
  try {
    const client = getRedisClient();
    await client.del(key);
    console.log(`Data deleted with key: ${key}`);
  } catch (err) {
    console.error('Error deleting data:', err);
    throw err;
  }
}

module.exports = {
  cacheData,
  getCachedData,
  deleteCachedData,
};
