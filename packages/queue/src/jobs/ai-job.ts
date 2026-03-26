import { Queue } from 'bullmq';
import { bullMQConnection } from '@querencia/redis';

export const AI_QUEUE = 'ai-tasks';

export const aiQueue = new Queue(AI_QUEUE, { connection: bullMQConnection.connection });

export interface AiJobData {
  userId: string;
  toolId: string;
  input: string;
  callbackUrl?: string;
}

export async function dispatchAiJob(data: AiJobData, opts?: { priority?: number }) {
  return aiQueue.add('process', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    priority: opts?.priority ?? 0,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 500 },
  });
}
