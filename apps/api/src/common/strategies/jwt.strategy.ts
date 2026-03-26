import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import { DB_TOKEN } from '../../database/database.module';
import { REDIS_SESSION } from '../../redis/redis.module';
import { users } from '@querencia/db';
import type { DB } from '@querencia/db';
import type { Redis } from 'ioredis';

export interface JwtPayload { sub: string; iat: number; exp: number; jti?: string; }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @Inject(DB_TOKEN)      private readonly db: DB,
    @Inject(REDIS_SESSION) private readonly redis: Redis,
  ) {
    super({
      jwtFromRequest:   ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:      config.get('JWT_ACCESS_SECRET')!,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.jti) {
      const revoked = await this.redis.get(`revoked:${payload.jti}`);
      if (revoked) throw new UnauthorizedException('TOKEN_REVOKED');
    }
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, payload.sub),
      columns: { id: true, email: true, name: true, plan: true, isVerified: true },
    });
    if (!user) throw new UnauthorizedException('USER_NOT_FOUND');
    if (!user.isVerified) throw new UnauthorizedException('EMAIL_NOT_VERIFIED');
    return user;
  }
}
