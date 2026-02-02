import { createClient } from 'redis';

// Initialize Redis client
let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
    console.log('APP_LOG:: Initializing Redis client');
    console.log('APP_LOG:: REDIS_URL:', redisUrl);
    
    redisClient = createClient({
      url: redisUrl,
    });

    redisClient.on('error', (err) => {
      console.error('APP_LOG:: Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('APP_LOG:: Redis Client Connected');
    });

    redisClient.on('ready', () => {
      console.log('APP_LOG:: Redis Client Ready');
    });

    redisClient.on('reconnecting', () => {
      console.log('APP_LOG:: Redis Client Reconnecting');
    });

    try {
      await redisClient.connect();
      console.log('APP_LOG:: Redis client connected successfully');
    } catch (error) {
      console.error('APP_LOG:: Failed to connect to Redis:', error);
      // Don't throw - allow app to continue without cache
      redisClient = null;
    }
  }
  
  return redisClient;
}

// Cache utility functions with logging
export const cache = {
  /**
   * Get value from cache
   */
  async get(key: string): Promise<string | null> {
    try {
      const client = await getRedisClient();
      if (!client) {
        console.log('APP_LOG:: Cache GET skipped - Redis not available');
        return null;
      }

      const start = Date.now();
      const value = await client.get(key);
      const duration = Date.now() - start;

      if (value) {
        console.log('APP_LOG:: Cache HIT:', {
          key,
          valueLength: value.length,
          duration: `${duration}ms`,
        });
      } else {
        console.log('APP_LOG:: Cache MISS:', {
          key,
          duration: `${duration}ms`,
        });
      }

      return value;
    } catch (error) {
      console.error('APP_LOG:: Cache GET error:', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  },

  /**
   * Set value in cache
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    try {
      const client = await getRedisClient();
      if (!client) {
        console.log('APP_LOG:: Cache SET skipped - Redis not available');
        return false;
      }

      const start = Date.now();
      if (ttlSeconds) {
        await client.setEx(key, ttlSeconds, value);
      } else {
        await client.set(key, value);
      }
      const duration = Date.now() - start;

      console.log('APP_LOG:: Cache SET:', {
        key,
        valueLength: value.length,
        ttl: ttlSeconds ? `${ttlSeconds}s` : 'no expiry',
        duration: `${duration}ms`,
      });

      return true;
    } catch (error) {
      console.error('APP_LOG:: Cache SET error:', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  },

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<boolean> {
    try {
      const client = await getRedisClient();
      if (!client) {
        console.log('APP_LOG:: Cache DEL skipped - Redis not available');
        return false;
      }

      const start = Date.now();
      const result = await client.del(key);
      const duration = Date.now() - start;

      console.log('APP_LOG:: Cache DEL:', {
        key,
        deleted: result > 0,
        duration: `${duration}ms`,
      });

      return result > 0;
    } catch (error) {
      console.error('APP_LOG:: Cache DEL error:', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  },

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      const client = await getRedisClient();
      if (!client) {
        return false;
      }

      const result = await client.exists(key);
      console.log('APP_LOG:: Cache EXISTS:', {
        key,
        exists: result > 0,
      });

      return result > 0;
    } catch (error) {
      console.error('APP_LOG:: Cache EXISTS error:', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  },

  /**
   * Get multiple keys from cache
   */
  async mGet(keys: string[]): Promise<(string | null)[]> {
    try {
      const client = await getRedisClient();
      if (!client) {
        console.log('APP_LOG:: Cache MGET skipped - Redis not available');
        return keys.map(() => null);
      }

      const start = Date.now();
      const values = await client.mGet(keys);
      const duration = Date.now() - start;

      const hits = values.filter(v => v !== null).length;
      console.log('APP_LOG:: Cache MGET:', {
        keyCount: keys.length,
        hits,
        misses: keys.length - hits,
        duration: `${duration}ms`,
      });

      return values;
    } catch (error) {
      console.error('APP_LOG:: Cache MGET error:', {
        keyCount: keys.length,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return keys.map(() => null);
    }
  },

  /**
   * Set multiple key-value pairs in cache
   */
  async mSet(keyValues: Record<string, string>, ttlSeconds?: number): Promise<boolean> {
    try {
      const client = await getRedisClient();
      if (!client) {
        console.log('APP_LOG:: Cache MSET skipped - Redis not available');
        return false;
      }

      const start = Date.now();
      const entries = Object.entries(keyValues);
      
      if (ttlSeconds) {
        // Set with TTL using pipeline
        const pipeline = client.multi();
        for (const [key, value] of entries) {
          pipeline.setEx(key, ttlSeconds, value);
        }
        await pipeline.exec();
      } else {
        await client.mSet(keyValues);
      }
      const duration = Date.now() - start;

      console.log('APP_LOG:: Cache MSET:', {
        keyCount: entries.length,
        ttl: ttlSeconds ? `${ttlSeconds}s` : 'no expiry',
        duration: `${duration}ms`,
      });

      return true;
    } catch (error) {
      console.error('APP_LOG:: Cache MSET error:', {
        keyCount: Object.keys(keyValues).length,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  },

  /**
   * Get all keys matching a pattern
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      const client = await getRedisClient();
      if (!client) {
        return [];
      }

      const start = Date.now();
      const keys = await client.keys(pattern);
      const duration = Date.now() - start;

      console.log('APP_LOG:: Cache KEYS:', {
        pattern,
        count: keys.length,
        duration: `${duration}ms`,
      });

      return keys;
    } catch (error) {
      console.error('APP_LOG:: Cache KEYS error:', {
        pattern,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return [];
    }
  },

  /**
   * Clear all cache entries (use with caution)
   */
  async flushAll(): Promise<boolean> {
    try {
      const client = await getRedisClient();
      if (!client) {
        return false;
      }

      console.warn('APP_LOG:: Cache FLUSHALL - Clearing all cache entries');
      await client.flushAll();
      console.log('APP_LOG:: Cache FLUSHALL completed');

      return true;
    } catch (error) {
      console.error('APP_LOG:: Cache FLUSHALL error:', error);
      return false;
    }
  },
};

// Close Redis connection
export async function closeRedisConnection() {
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log('APP_LOG:: Redis connection closed');
      redisClient = null;
    } catch (error) {
      console.error('APP_LOG:: Error closing Redis connection:', error);
    }
  }
}
