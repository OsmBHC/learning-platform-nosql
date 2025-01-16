// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : Gérer efficacement le cache avec Redis implique plusieurs pratiques :
// 1. Utiliser des TTL (Time-To-Live) appropriés : Définir des durées de vie appropriées pour les données en cache afin de s'assurer qu'elles ne deviennent pas obsolètes.
// 2. Éviter les clés trop longues : Utiliser des clés courtes et descriptives pour améliorer les performances et la lisibilité.
// 3. Utiliser des structures de données appropriées : Redis supporte plusieurs structures de données (strings, hashes, lists, sets, sorted sets), et il est important de choisir la structure la plus adaptée à l'usage.
// 4. Gérer les erreurs et les retries : Implémenter une gestion des erreurs et des retries pour les opérations de cache afin de garantir la robustesse de l'application.
// 5. Surveiller et analyser les performances : Utiliser des outils de monitoring pour surveiller les performances du cache et ajuster les configurations en conséquence.

// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : Les bonnes pratiques pour les clés Redis incluent :
// 1. Utiliser des clés courtes et descriptives : Les clés doivent être suffisamment descriptives pour être compréhensibles mais assez courtes pour être efficaces.
// 2. Éviter les caractères spéciaux : Utiliser des caractères alphanumériques et éviter les caractères spéciaux pour les clés.
// 3. Utiliser des namespaces : Utiliser des namespaces pour organiser les clés et éviter les collisions de noms. Par exemple, `user:123:profile` pour les données de profil de l'utilisateur avec l'ID 123.
// 4. Éviter les clés trop longues : Les clés trop longues peuvent affecter les performances. Essayez de garder les clés aussi courtes que possible tout en restant descriptives.
// 5. Utiliser des conventions de nommage cohérentes : Adopter une convention de nommage cohérente pour les clés afin de faciliter la gestion et la compréhension des données en cache.

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
