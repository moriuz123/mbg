import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

// Gunakan connection pooling/singleton pattern untuk Next.js
// Pada development, ini mencegah pembuatan koneksi berulang setiap kali hot reload
export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// Helper function untuk Cache Sederhana (Read-Through Cache Pattern)
export async function getCachedData<T>(key: string, fetcher: () => Promise<T>, ttlSeconds: number = 60): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      console.log(`[CACHE HIT] Returning data from Redis for key: ${key}`);
      return JSON.parse(cached) as T;
    }
    
    console.log(`[CACHE MISS] Fetching fresh data for key: ${key}`);
    const freshData = await fetcher();
    
    // Set to Redis asynchronously (fire & forget)
    redis.set(key, JSON.stringify(freshData), 'EX', ttlSeconds).catch(err => {
      console.error(`[CACHE ERROR] Failed to write cache for key: ${key}`, err);
    });
    
    return freshData;
  } catch (error) {
    console.error(`[REDIS ERROR] Failed reading cache for key: ${key}`, error);
    // Fallback to fetch directly if Redis is down
    return fetcher();
  }
}
