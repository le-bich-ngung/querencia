ï»¿import { Queue, QueueEvents } from 'bullmq';
import { bullMQConnection } from '@querencia/redis';
import { AI_QUEUE } from '../jobs/ai-job';

// Dead Letter Queue processor â alert khi job fail sau 3 láº§n retry
const queueEvents = new QueueEvents(AI_QUEUE, {
  connection: bullMQConnection.connection,
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`ð¨ DLQ: Job ${jobId} failed permanently: ${failedReason}`);
  // TODO: send alert â Better Stack / Slack
});
