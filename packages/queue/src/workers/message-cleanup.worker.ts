ï»¿/**
 * Message Cleanup Worker â BullMQ
 * Cháº¡y má»i 5 phÃºt: xÃ³a tin nháº¯n self-destruct ÄÃ£ háº¿t háº¡n
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
    { pattern: '*/5 * * * *' }, // má»i 5 phÃºt
    { name: 'cleanup', data: {} },
  );
}

// Worker
export const cleanupWorker = new Worker('message-cleanup', async (job) => {
  const now = new Date();

  // Soft delete messages ÄÃ£ háº¿t háº¡n
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
