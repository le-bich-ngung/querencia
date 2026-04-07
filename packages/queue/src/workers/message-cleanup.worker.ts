/**
 * Message Cleanup Worker — BullMQ
 * Chạy mỗi 5 phút: xóa tin nhắn self-destruct đã hết hạn
 * Schedule: cron '*/5 * * * *'
 */
import { Worker, Queue } from 'bullmq';
import { drizzle }       from 'drizzle-orm/node-postgres';
import { Pool }          from 'pg';
import { lt, and, isNotNull } from 'drizzle-orm';
import { cbMessages, cbGroupMessages } from '../../../db/src/schema/cui-bap';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db   = drizzle(pool);

export const cleanupQueue = new Queue('message-cleanup', {
  connection: { url: process.env.UPSTASH_REDIS_URL! },
});

// Schedule job
export async function scheduleCleanup() {
  await cleanupQueue.upsertJobScheduler(
    'auto-delete-messages',
    { pattern: '*/5 * * * *' }, // mỗi 5 phút
    { name: 'cleanup', data: {} },
  );
}

// Worker
export const cleanupWorker = new Worker('message-cleanup', async (job) => {
  const now = new Date();

  // Soft delete messages đã hết hạn
  await db.update(cbMessages)
    .set({ isDeleted: true, content: null })
    .where(and(
      isNotNull(cbMessages.autoDeleteAt),
      lt(cbMessages.autoDeleteAt, now),
    ));

  await db.update(cbGroupMessages)
    .set({ isDeleted: true, content: null })
    .where(and(
      isNotNull(cbGroupMessages.autoDeleteAt),
      lt(cbGroupMessages.autoDeleteAt, now),
    ));
}, { connection: { url: process.env.UPSTASH_REDIS_URL! } });
