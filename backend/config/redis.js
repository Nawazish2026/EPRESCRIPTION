// config/redis.js
const Redis = require('ioredis');

let redis = null;
let isRedisAvailable = false;

// Only connect if REDIS_URL is provided
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) return null; // Stop retrying
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  redis.connect()
    .then(() => {
      isRedisAvailable = true;
      console.log('🔴 Redis connected');
    })
    .catch((err) => {
      isRedisAvailable = false;
      console.warn('Redis unavailable — caching disabled:', err.message);
    });

  redis.on('error', () => {
    isRedisAvailable = false;
  });

  redis.on('connect', () => {
    isRedisAvailable = true;
  });
} else {
  console.warn('Warning: REDIS_URL not set — caching disabled');
}

/**
 * Get a cached value. Returns null on miss or if Redis unavailable.
 */
async function getCache(key) {
  if (!isRedisAvailable || !redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Set a cache value with TTL (seconds).
 */
async function setCache(key, data, ttlSeconds = 300) {
  if (!isRedisAvailable || !redis) return;
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch {
    // Silently fail — cache is non-critical
  }
}

/**
 * Delete a cache key (for invalidation).
 */
async function delCache(key) {
  if (!isRedisAvailable || !redis) return;
  try {
    await redis.del(key);
  } catch {
    // Silently fail
  }
}

/**
 * Clear all keys matching a pattern.
 */
async function clearCachePattern(pattern) {
  if (!isRedisAvailable || !redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Silently fail
  }
}

module.exports = { getCache, setCache, delCache, clearCachePattern, redis };
