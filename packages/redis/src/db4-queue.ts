ï»¿import { Redis } from 'ioredis';

// DB4 â BullMQ queue backend (isolated â sá»± cá» queue khÃ´ng áº£nh hÆ°á»ng cache/session)
export const queueRedis = new Redis(
  process.env.REDIS_DB4_QUEUE_URL!,
  {
    db: 4,
    lazyConnect: true,
    maxRetriesPerRequest: null, // BullMQ yÃªu cáº§u null
    enableReadyCheck: false,    // BullMQ yÃªu cáº§u false
  }
);
// Export connection cho BullMQ
export const bullMQConnection = { connection: queueRedis };
