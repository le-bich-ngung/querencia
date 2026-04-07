ï»¿import { Redis } from 'ioredis';
import { createHash } from 'crypto';

// DB2 â AI result cache (TTL 1h, hash key tá»« prompt)
export const aiCacheRedis = new Redis(
  process.env.REDIS_DB2_AI_CACHE_URL!,
  { db: 2, lazyConnect: true, maxRetriesPerRequest: 2 }
);

const CACHE_TTL = 3600; // 1 hour

export function makeCacheKey(input: Record<string, unknown>): string {
  const hash = createHash('sha256').update(JSON.stringify(input)).digest('hex').slice(0, 16);
  return `ai:${hash}`;
}

export async function getCachedResult(key: string): Promise<string | null> {
  return aiCacheRedis.get(key);
}

export async function setCachedResult(key: string, value: string, ttl = CACHE_TTL) {
  return aiCacheRedis.set(key, value, 'EX', ttl);
}
