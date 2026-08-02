import { Queue, QueueEvents } from 'bullmq';
import { bullMQConnection } from '@querencia/redis';
import { AI_QUEUE } from '../jobs/ai-job';

// Dead Letter Queue processor - alert khi job fail sau 3 lần retry
const queueEvents = new QueueEvents(AI_QUEUE, {
  connection: bullMQConnection.connection,
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`🚨 DLQ: Job ${jobId} failed permanently: ${failedReason}`);
  // TODO: send alert → Better Stack / Slack
});
