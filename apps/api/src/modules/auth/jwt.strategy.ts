/**
 * JWT Strategy — validate token, attach user to request
 * sub = email (giữ tương thích với code cũ)
 */
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';

import { DB_TOKEN } from '../../database/database.module';
import { users } from '@querencia/db';
import type { DB } from '@querencia/db';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @Inject(DB_TOKEN) private readonly db: DB,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: { sub: string }) {
    // payload.sub = email
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, payload.sub),
      columns: {
        id: true, email: true, name: true,
        avatarUrl: true, plan: true, isActive: true,
      },
    });

    if (!user || !user.isActive) throw new UnauthorizedException('Token không hợp lệ');

    // Gắn vào request.user — dùng với @CurrentUser()
    return user;
  }
}
