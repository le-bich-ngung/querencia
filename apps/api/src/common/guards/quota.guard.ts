ï»¿/**
 * Quota Guard â kiá»m tra vÃ  trá»« Q trÆ°á»c khi dÃ¹ng tool cÃ³ phÃ­
 * DÃ¹ng vá»i @QuotaCost(n) decorator
 */
import {
  Injectable, CanActivate, ExecutionContext,
  ForbiddenException, Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REDIS_QUOTA } from '../../redis/redis.module';
import type { Redis } from 'ioredis';

export const QUOTA_COST_KEY = 'quota_cost';
export const QuotaCost = (cost: number) =>
  (target: any, key?: string, desc?: any) => {
    Reflect.defineMetadata(QUOTA_COST_KEY, cost, desc?.value ?? target);
    return desc ?? target;
  };

@Injectable()
export class QuotaGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(REDIS_QUOTA) private readonly redis: Redis,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const cost = this.reflector.get<number>(QUOTA_COST_KEY, ctx.getHandler());
    if (!cost || cost <= 0) return true; // free tool

    const user = ctx.switchToHttp().getRequest().user;
    if (!user) throw new ForbiddenException('UNAUTHENTICATED');

    // Pipeline: kiá»m tra Q expiring trÆ°á»c, náº¿u Äá»§ thÃ¬ trá»«
    const expiringKey  = `q:expiring:${user.id}`;
    const permanentKey = `q:permanent:${user.id}`;

    const [expiring, permanent] = await Promise.all([
      this.redis.get(expiringKey).then(v => parseInt(v ?? '0')),
      this.redis.get(permanentKey).then(v => parseInt(v ?? '0')),
    ]);

    const total = expiring + permanent;
    if (total < cost) {
      throw new ForbiddenException({
        code:    'INSUFFICIENT_Q',
        message: `Cáº§n ${cost} Q, báº¡n cÃ³ ${total} Q`,
        needed:  cost,
        have:    total,
      });
    }

    // Trá»« Q expiring trÆ°á»c, rá»i má»i trá»« permanent
    if (expiring >= cost) {
      await this.redis.decrby(expiringKey, cost);
    } else {
      const fromExpiring  = expiring;
      const fromPermanent = cost - fromExpiring;
      const pipeline = this.redis.pipeline();
      if (fromExpiring > 0)  pipeline.set(expiringKey,  0);
      if (fromPermanent > 0) pipeline.decrby(permanentKey, fromPermanent);
      await pipeline.exec();
    }

    return true;
  }
}
