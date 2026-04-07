import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { REDIS_QUOTA } from '../../redis/redis.module';
import type { Redis } from 'ioredis';

@Injectable()
export class QuotaService {
  constructor(@Inject(REDIS_QUOTA) private readonly redis: Redis) {}

  async checkAndDeduct(userId: string, plan: string, cost: number) {
    const exp = await this.redis.get(`q:expiring:${userId}`);
    const perm = await this.redis.get(`q:permanent:${userId}`);
    const expiring  = parseInt(exp  ?? '0');
    const permanent = parseInt(perm ?? '0');
    if (expiring + permanent < cost) {
      throw new ForbiddenException({ code: 'INSUFFICIENT_Q', needed: cost, have: expiring + permanent });
    }
    if (expiring >= cost) {
      await this.redis.decrby(`q:expiring:${userId}`, cost);
    } else {
      const fromPerm = cost - expiring;
      const pipe = this.redis.pipeline();
      if (expiring > 0) pipe.set(`q:expiring:${userId}`, 0);
      pipe.decrby(`q:permanent:${userId}`, fromPerm);
      await pipe.exec();
    }
  }

  async getUsage(userId: string) {
    const [exp, perm] = await Promise.all([
      this.redis.get(`q:expiring:${userId}`),
      this.redis.get(`q:permanent:${userId}`),
    ]);
    return { expiring: parseInt(exp ?? '0'), permanent: parseInt(perm ?? '0') };
  }

  async grantQ(userId: string, expiring: number, permanent: number, ttl = 86400) {
    const pipe = this.redis.pipeline();
    if (expiring  > 0) pipe.incrby(`q:expiring:${userId}`,  expiring).expire(`q:expiring:${userId}`, ttl);
    if (permanent > 0) pipe.incrby(`q:permanent:${userId}`, permanent);
    await pipe.exec();
  }

  async resetQuota(userId: string) {
    await Promise.all([
      this.redis.del(`q:expiring:${userId}`),
      this.redis.del(`q:permanent:${userId}`),
    ]);
  }
}
