ï»¿import { Redis } from 'ioredis';

// DB1 â Q Quota engine (atomic INCR â trÃ¡nh race condition)
// TTL 24h tá»± reset má»i ngÃ y
export const quotaRedis = new Redis(
  process.env.REDIS_DB1_QUOTA_URL!,
  { db: 1, lazyConnect: true, maxRetriesPerRequest: 3 }
);

const today = () => new Date().toISOString().split('T')[0]; // YYYY-MM-DD

export async function incrementQuota(userId: string, cost = 1): Promise<number> {
  const key = `quota:${userId}:${today()}`;
  const used = await quotaRedis.incrby(key, cost);
  if (used === cost) {
    // First call today â set TTL 24h + buffer
    await quotaRedis.expire(key, 86400 + 3600);
  }
  return used;
}

export async function getQuotaUsed(userId: string): Promise<number> {
  const val = await quotaRedis.get(`quota:${userId}:${today()}`);
  return val ? parseInt(val, 10) : 0;
}

export async function resetQuota(userId: string) {
  return quotaRedis.del(`quota:${userId}:${today()}`);
}
