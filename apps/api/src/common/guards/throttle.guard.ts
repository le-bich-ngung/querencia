/**
 * Rate Limiting - Redis sliding window
 * Khác nhau theo endpoint và plan:
 *   - Auth endpoints:  20 req/15 phút (chống brute force)
 *   - AI endpoints:    free=10/h, pro=60/h
 *   - API chung:       free=200/h, pro=1000/h
 *   - Upload:          10 files/phút
 */
import {
  Injectable, CanActivate, ExecutionContext,
  HttpException, HttpStatus, Inject, Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REDIS_QUOTA } from '../../redis/redis.module';
import type { Redis } from 'ioredis';

export const THROTTLE_KEY = 'throttle';
export interface ThrottleConfig {
  limit:    number; // max requests
  window:   number; // seconds
  keyExtra?: string; // thêm vào key để tách biệt endpoint
}

/** Decorator cho từng endpoint */
export const Throttle = (config: ThrottleConfig) =>
  (target: any, key?: string, desc?: any) => {
    Reflect.defineMetadata(THROTTLE_KEY, config, desc?.value ?? target);
    return desc ?? target;
  };

@Injectable()
export class ThrottleGuard implements CanActivate {
  private readonly logger = new Logger(ThrottleGuard.name);

  // Default limits theo plan
  private readonly DEFAULT: Record<string, ThrottleConfig> = {
    free: { limit: 200,  window: 3600 },
    pro:  { limit: 1000, window: 3600 },
  };

  constructor(
    private readonly reflector: Reflector,
    @Inject(REDIS_QUOTA) private readonly redis: Redis,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req  = ctx.switchToHttp().getRequest();
    const user = req.user; // từ JwtAuthGuard
    const ip   = req.ip ?? req.headers['x-forwarded-for'] ?? 'unknown';

    // Endpoint-specific config
    const config: ThrottleConfig | undefined = this.reflector.get(
      THROTTLE_KEY, ctx.getHandler(),
    );

    // Fallback to plan-based default
    const plan   = user?.plan ?? 'free';
    const limits = config ?? this.DEFAULT[plan] ?? this.DEFAULT.free;

    // Key: kết hợp user/IP + endpoint
    const identifier = user?.id ?? `ip:${ip}`;
    const extra      = config?.keyExtra ?? ctx.getHandler().name;
    const key        = `rl:${identifier}:${extra}`;
    const now        = Math.floor(Date.now() / 1000);
    const windowStart = now - limits.window;

    // Sliding window với Redis sorted set
    const pipeline = this.redis.pipeline();
    pipeline.zremrangebyscore(key, '-inf', windowStart); // xóa entries cũ
    pipeline.zadd(key, now, `${now}-${Math.random()}`); // thêm request hiện tại
    pipeline.zcard(key);                                 // đếm total trong window
    pipeline.expire(key, limits.window + 1);             // TTL

    const results = await pipeline.exec();
    const count   = (results?.[2]?.[1] as number) ?? 0;

    if (count > limits.limit) {
      this.logger.warn(`Rate limit exceeded: ${identifier} on ${extra} (${count}/${limits.limit})`);
      throw new HttpException(
        {
          statusCode: 429,
          error:      'Too Many Requests',
          message:    `Quá nhiều request. Thử lại sau ${limits.window} giây.`,
          retryAfter: limits.window,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Thêm headers chuẩn
    const res = ctx.switchToHttp().getResponse();
    res.setHeader('X-RateLimit-Limit',     limits.limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limits.limit - count));
    res.setHeader('X-RateLimit-Reset',     now + limits.window);

    return true;
  }
}
