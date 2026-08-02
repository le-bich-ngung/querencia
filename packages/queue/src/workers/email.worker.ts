/**
 * Email Worker - BullMQ
 * Xử lý gửi email qua Resend (verify, reset password, notification)
 */
import { Worker, Queue } from 'bullmq';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const emailQueue = new Queue('email', {
  connection: { url: process.env.UPSTASH_REDIS_URL! },
  defaultJobOptions: {
    attempts:      3,
    backoff:       { type: 'exponential', delay: 5000 },
    removeOnComplete: 100,
    removeOnFail:     50,
  },
});

export const emailWorker = new Worker('email', async (job) => {
  const { to, subject, html, from } = job.data;

  await resend.emails.send({
    from: from ?? 'Querencia <no-reply@querencia.com.vn>',
    to,
    subject,
    html,
  });
}, { connection: { url: process.env.UPSTASH_REDIS_URL! } });

// Helpers
export const emailJobs = {
  sendVerification: (to: string, token: string) =>
    emailQueue.add('verify', {
      to, subject: 'Xác nhận email - Querencia',
      html: `<a href="https://querencia.com.vn/auth/verify?token=${token}">Xác nhận email</a>`,
    }),
  sendPasswordReset: (to: string, token: string) =>
    emailQueue.add('reset', {
      to, subject: 'Đặt lại mật khẩu - Querencia',
      html: `<a href="https://querencia.com.vn/auth/reset-password?token=${token}">Đặt lại mật khẩu</a>`,
    }),
};
