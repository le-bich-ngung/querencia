import { Redis } from 'ioredis';

// DB3 - App cache (feed, leaderboard, hot data) + Cloudflare CDN layer
export const appCacheRedis = new Redis(
  process.env.REDIS_DB3_APP_CACHE_URL!,
  { db: 3, lazyConnect: true, maxRetriesPerRequest: 3 }
);

export async function cacheGet(key: string) {
  return appCacheRedis.get(key);
}

export async function cacheSet(key: string, value: string, ttlSeconds = 300) {
  return appCacheRedis.set(key, value, 'EX', ttlSeconds);
}

export async function cacheInvalidate(pattern: string) {
  const keys = await appCacheRedis.keys(pattern);
  if (keys.length) await appCacheRedis.del(...keys);
}
