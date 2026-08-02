import { Redis } from 'ioredis';

// DB4 - BullMQ queue backend (isolated - sự cố queue không ảnh hưởng cache/session)
export const queueRedis = new Redis(
  process.env.REDIS_DB4_QUEUE_URL!,
  {
    db: 4,
    lazyConnect: true,
    maxRetriesPerRequest: null, // BullMQ yêu cầu null
    enableReadyCheck: false,    // BullMQ yêu cầu false
  }
);
// Export connection cho BullMQ
export const bullMQConnection = { connection: queueRedis };
