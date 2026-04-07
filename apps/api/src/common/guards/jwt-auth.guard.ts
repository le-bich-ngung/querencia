ï»¿/**
 * JWT Auth Guard â access token 15m + refresh rotation
 * Tá»± Äá»ng reject token ÄÃ£ bá» revoke (logout tá»« thiáº¿t bá» khÃ¡c)
 */
import {
  Injectable, ExecutionContext,
  UnauthorizedException, Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) { super(); }

  canActivate(ctx: ExecutionContext) {
    // @Public() decorator bypass
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(), ctx.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(ctx);
  }

  handleRequest(err: any, user: any, info: any, ctx: ExecutionContext) {
    if (err || !user) {
      // Log loáº¡i lá»i Äá» debug (khÃ´ng expose ra client)
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('TOKEN_EXPIRED');
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('TOKEN_INVALID');
      }
      throw err || new UnauthorizedException('UNAUTHENTICATED');
    }
    return user;
  }
}
