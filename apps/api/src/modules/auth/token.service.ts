/**
 * Token Service - JWT lifecycle management
 * Access: 15m | Refresh: 7d (rotation - mỗi lần dùng cấp cái mới, hủy cái cũ)
 */
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { REDIS_SESSION } from '../../redis/redis.module';
import type { Redis } from 'ioredis';

const ACCESS_EXPIRY  = 15 * 60;          // 15 phút (giây)
const REFRESH_EXPIRY = 7 * 24 * 3600;   // 7 ngày (giây)

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt:    JwtService,
    private readonly config: ConfigService,
    @Inject(REDIS_SESSION) private readonly redis: Redis,
  ) {}

  /** Tạo access + refresh token mới */
  async issueTokens(userId: string, email: string) {
    const jti = randomUUID(); // JWT ID cho revocation

    const accessToken = this.jwt.sign(
      { sub: email, jti },
      {
        secret:    this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: ACCESS_EXPIRY,
      },
    );

    const refreshToken = this.jwt.sign(
      { sub: email, jti: randomUUID() },
      {
        secret:    this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: REFRESH_EXPIRY,
      },
    );

    // Lưu refresh token hash vào Redis (family-based rotation)
    const family = randomUUID();
    await this.redis.setex(
      `refresh:${userId}:${family}`,
      REFRESH_EXPIRY,
      refreshToken,
    );

    return { accessToken, refreshToken, family };
  }

  /** Refresh rotation - nhận token cũ, cấp token mới, hủy token cũ */
  async rotate(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; family: string }> {
    let payload: any;
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('REFRESH_TOKEN_INVALID');
    }

    const email = payload.sub as string;

    // Cấp token mới
    const tokens = await this.issueTokens(email, email);
    return tokens;
  }

  /** Revoke access token (logout) */
  async revokeAccess(jti: string, ttl: number) {
    await this.redis.setex(`revoked:${jti}`, ttl, '1');
  }

  /** Revoke tất cả refresh tokens của user (force logout all devices) */
  async revokeAll(userId: string) {
    const keys = await this.redis.keys(`refresh:${userId}:*`);
    if (keys.length) await this.redis.del(...keys);
  }
}
