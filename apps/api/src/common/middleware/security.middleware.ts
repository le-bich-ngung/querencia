/**
 * Security Middleware - CORS, headers bảo mật, captcha trigger
 * Gắn vào app.module.ts qua NestMiddleware
 */
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type { Redis } from 'ioredis';

// Danh sách domain được phép - chặt, không wildcard
const ALLOWED_ORIGINS = [
  'https://querencia.com.vn',
  'https://www.querencia.com.vn',
  'https://querencia-api.fly.dev',   // internal
  'http://localhost:3000',            // dev
  'http://localhost:3001',            // dev
];

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin ?? '';

    // ── CORS ──────────────────────────────────────────────────
    if (ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin',      origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods',     'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers',     'Content-Type,Authorization,X-Requested-With');
      res.setHeader('Access-Control-Max-Age',           '86400');
    }

    // Pre-flight
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    // ── Security headers ─────────────────────────────────────
    res.setHeader('X-Content-Type-Options',   'nosniff');
    res.setHeader('X-Frame-Options',          'SAMEORIGIN');
    res.setHeader('X-XSS-Protection',         '1; mode=block');
    res.setHeader('Referrer-Policy',          'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy',       'camera=(), microphone=(), geolocation=()');
    // Chỉ cho Cloudflare + Fly.io proxy
    res.setHeader('Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; " +
      "frame-src https://challenges.cloudflare.com; " +
      "img-src 'self' data: https://files.querencia.com.vn; " +
      "connect-src 'self' https://querencia-api.fly.dev https://querencia-ai.fly.dev"
    );

    // ── Remove fingerprinting headers ────────────────────────
    res.removeHeader('X-Powered-By'); // không để lộ NestJS/Express

    next();
  }
}
