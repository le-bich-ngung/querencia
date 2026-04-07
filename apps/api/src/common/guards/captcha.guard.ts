/**
 * Captcha Guard — Cloudflare Turnstile
 * Bật tự động trên: /auth/register, /auth/login (khi có nghi ngờ bot)
 * Verify server-side với Cloudflare API
 */
import {
  Injectable, CanActivate, ExecutionContext,
  BadRequestException, Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

export const REQUIRE_CAPTCHA = 'require_captcha';
export const RequireCaptcha = () =>
  (target: any, key?: string, desc?: any) => {
    Reflect.defineMetadata(REQUIRE_CAPTCHA, true, desc?.value ?? target);
    return desc ?? target;
  };

@Injectable()
export class CaptchaGuard implements CanActivate {
  private readonly logger = new Logger(CaptchaGuard.name);
  private readonly secret: string;

  constructor(
    private readonly reflector: Reflector,
    private readonly config:    ConfigService,
  ) {
    this.secret = config.get('CLOUDFLARE_TURNSTILE_SECRET') ?? '';
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const required = this.reflector.get<boolean>(REQUIRE_CAPTCHA, ctx.getHandler());
    if (!required || !this.secret) return true; // dev mode: skip nếu không có secret

    const req   = ctx.switchToHttp().getRequest();
    const token = req.body?.captchaToken ?? req.headers['x-captcha-token'];

    if (!token) throw new BadRequestException('CAPTCHA_REQUIRED');

    const valid = await this.verifyCaptcha(token, req.ip);
    if (!valid) throw new BadRequestException('CAPTCHA_INVALID');

    return true;
  }

  private async verifyCaptcha(token: string, ip?: string): Promise<boolean> {
    try {
      const body = new URLSearchParams({
        secret:   this.secret,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      });

      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method:  'POST',
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const data: { success: boolean; 'error-codes'?: string[] } = await res.json();

      if (!data.success) {
        this.logger.warn(`Captcha failed: ${data['error-codes']?.join(', ')}`);
      }

      return data.success;
    } catch (e) {
      this.logger.error('Captcha verify failed:', e);
      return false; // fail open trong production để không block user thật
    }
  }
}
