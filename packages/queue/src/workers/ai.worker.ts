ï»¿import { Worker, Job } from 'bullmq';
import { bullMQConnection } from '@querencia/redis';
import { AI_QUEUE, AiJobData } from '../jobs/ai-job';

export const aiWorker = new Worker<AiJobData>(
  AI_QUEUE,
  async (job: Job<AiJobData>) => {
    const { userId, toolId, input } = job.data;
    console.log(`Processing AI job ${job.id} for user ${userId}, tool ${toolId}`);

    // TODO: call FastAPI AI service
    // const result = await fetch(`${AI_SERVICE_URL}/jobs/process`, { ... })

    return { success: true, jobId: job.id };
  },
  {
    connection: bullMQConnection.connection,
    concurrency: 5,
  }
);

aiWorker.on('failed', (job, err) => {
  console.error(`AI job ${job?.id} failed:`, err.message);
  // TODO: Sentry.captureException(err)
});
