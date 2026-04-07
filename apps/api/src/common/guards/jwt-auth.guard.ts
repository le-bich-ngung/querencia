/**
 * JWT Auth Guard — access token 15m + refresh rotation
 * Tự động reject token đã bị revoke (logout từ thiết bị khác)
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
      // Log loại lỗi để debug (không expose ra client)
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
