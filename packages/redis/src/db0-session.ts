ï»¿import { Redis } from 'ioredis';

// DB0 â Session / Auth tokens
// TTL = token lifetime (thÆ°á»ng 15m access, 7d refresh)
export const sessionRedis = new Redis(
  process.env.REDIS_DB0_SESSION_URL!,
  { db: 0, lazyConnect: true, maxRetriesPerRequest: 3 }
);

export async function setSession(key: string, value: string, ttlSeconds: number) {
  return sessionRedis.set(`session:${key}`, value, 'EX', ttlSeconds);
}

export async function getSession(key: string) {
  return sessionRedis.get(`session:${key}`);
}

export async function deleteSession(key: string) {
  return sessionRedis.del(`session:${key}`);
}
