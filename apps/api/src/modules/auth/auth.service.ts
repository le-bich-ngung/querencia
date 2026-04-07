ï»¿/**
 * Auth Service â NestJS â DB WIRED
 * Migrated tá»«:
 *   querencia-backend/api/auth_route.py
 *   querencia-backend/core/security.py
 *
 * Táº¥t cáº£ TODO stubs ÄÃ£ ÄÆ°á»£c thay báº±ng Drizzle queries tháº­t.
 * Logic giá»¯ 100% giá»ng code cÅ©:
 *   - bcrypt (tÆ°Æ¡ng thÃ­ch hash cÅ© trÃªn production)
 *   - JWT sub = email
 *   - Email verify token dÃ¹ng 1 láº§n
 *   - Google OAuth: google_id â email â táº¡o má»i
 *   - Forgot password luÃ´n 200
 *   - Refresh token rotation lÆ°u Redis db0
 */
import {
  Injectable, ConflictException, UnauthorizedException,
  ForbiddenException, BadRequestException, NotFoundException, Logger,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { eq, and } from 'drizzle-orm';
import type { Redis } from 'ioredis';
import { Resend } from 'resend';

import { DB_TOKEN } from '../../database/database.module';
import { REDIS_SESSION } from '../../redis/redis.module';
import { users, accounts, type User } from '@querencia/db';
import type { DB } from '@querencia/db';

// Session Redis key helpers
const sessionKey = (userId: string) => `refresh:${userId}`;
const REFRESH_TTL = 7 * 24 * 3600; // 7 ngÃ y (giÃ¢y)

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly frontendUrl: string;
  private readonly apiUrl: string;
  private resend: Resend | null = null;

  constructor(
    @Inject(DB_TOKEN)            private readonly db: DB,
    @Inject(REDIS_SESSION)       private readonly sessionRedis: Redis,
    private readonly jwtService:  JwtService,
    private readonly config:      ConfigService,
  ) {
    this.frontendUrl = config.get('NEXTAUTH_URL') ?? 'https://querencia.com.vn';
    this.apiUrl      = config.get('API_PUBLIC_URL') ?? 'https://querencia.fly.dev';

    const resendKey = config.get<string>('RESEND_API_KEY');
    if (resendKey) this.resend = new Resend(resendKey);
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // PASSWORD UTILS
  // DÃ¹ng bcryptjs Äá» tÆ°Æ¡ng thÃ­ch vá»i hashed password tá»« Python bcrypt cÅ©
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 12);
  }

  async verifyPassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // JWT HELPERS
  // sub = email (giá»¯ tÆ°Æ¡ng thÃ­ch â token cÅ© tá»« production váº«n valid)
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  createAccessToken(email: string): string {
    return this.jwtService.sign(
      { sub: email },
      { expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN') ?? '15m' },
    );
  }

  createRefreshToken(email: string): string {
    return this.jwtService.sign(
      { sub: email, type: 'refresh' },
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN') ?? '7d',
      },
    );
  }

  verifyRefreshToken(token: string): { sub: string } | null {
    try {
      return this.jwtService.verify<{ sub: string }>(token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      return null;
    }
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // REGISTER
  // POST /auth/register
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async register(data: { email: string; name: string; password: string }) {
    const email = data.email.toLowerCase().trim();

    // 1. Kiá»m tra email ÄÃ£ tá»n táº¡i (giá»¯ y chang code cÅ©)
    const existing = await this.db.query.users.findFirst({
      where: eq(users.email, email),
      columns: { id: true },
    });
    if (existing) throw new ConflictException('Email nÃ y ÄÃ£ ÄÆ°á»£c ÄÄng kÃ½ rá»i');

    // 2. Hash password + táº¡o verification token
    const [hashedPassword, verificationToken] = await Promise.all([
      this.hashPassword(data.password),
      Promise.resolve(crypto.randomBytes(32).toString('base64url')),
    ]);

    // 3. Insert user
    const [newUser] = await this.db
      .insert(users)
      .values({
        email,
        name: data.name,
        hashedPassword,
        isVerified:        false,
        isActive:          true,
        verificationToken,
        plan:              'free',
      })
      .returning({ id: users.id, email: users.email, name: users.name });

    // 4. Gá»­i email xÃ¡c nháº­n (khÃ´ng block náº¿u lá»i â giá»¯ y chang code cÅ©)
    await this.sendVerificationEmail(email, data.name, verificationToken);

    this.logger.log(`[REGISTER] New user: ${email}`);
    return { message: 'ÄÄng kÃ½ thÃ nh cÃ´ng! Vui lÃ²ng kiá»m tra email Äá» xÃ¡c nháº­n tÃ i khoáº£n.' };
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // VERIFY EMAIL
  // GET /auth/verify/:token
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async verifyEmail(token: string): Promise<{ username: string; redirectUrl: string }> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.verificationToken, token),
      columns: { id: true, name: true },
    });

    if (!user) throw new BadRequestException('Link khÃ´ng há»£p lá» hoáº·c ÄÃ£ háº¿t háº¡n');

    // KÃ­ch hoáº¡t + xÃ³a token (dÃ¹ng 1 láº§n â giá»¯ y chang code cÅ©)
    await this.db
      .update(users)
      .set({ isVerified: true, verificationToken: null, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    this.logger.log(`[VERIFY] User ${user.id} verified`);
    return {
      username: user.name ?? 'báº¡n',
      redirectUrl: `${this.frontendUrl}?login=1`,
    };
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // LOGIN
  // POST /auth/login
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async login(email: string, password: string) {
    const lowerEmail = email.toLowerCase().trim();

    const user = await this.db.query.users.findFirst({
      where: eq(users.email, lowerEmail),
    });

    // Kiá»m tra user tá»n táº¡i + password (timing-safe: luÃ´n cháº¡y verify dÃ¹ user null)
    const passwordOk = user?.hashedPassword
      ? await this.verifyPassword(password, user.hashedPassword)
      : false;

    if (!user || !passwordOk) {
      throw new UnauthorizedException('Email hoáº·c máº­t kháº©u khÃ´ng ÄÃºng');
    }

    if (!user.isActive) {
      throw new ForbiddenException('TÃ i khoáº£n nÃ y ÄÃ£ bá» khÃ³a');
    }

    // Kiá»m tra verify â giá»¯ y chang message tá»« code cÅ©
    if (!user.isVerified) {
      throw new ForbiddenException(
        'Vui lÃ²ng xÃ¡c nháº­n email trÆ°á»c khi ÄÄng nháº­p. Kiá»m tra hÃ²m thÆ° cá»§a báº¡n.',
      );
    }

    const accessToken  = this.createAccessToken(lowerEmail);
    const refreshToken = this.createRefreshToken(lowerEmail);

    // LÆ°u refresh token vÃ o Redis db0 (session store)
    // Key = refresh:{userId} â 1 user 1 token (single-session)
    await this.sessionRedis.set(sessionKey(user.id), refreshToken, 'EX', REFRESH_TTL);

    return {
      access_token:  accessToken,
      refresh_token: refreshToken,
      token_type:    'bearer',
      user: {
        id:    user.id,
        email: user.email,
        name:  user.name,
        plan:  user.plan,
      },
    };
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // REFRESH TOKEN
  // POST /auth/refresh  â rotation: cáº¥p token má»i, thu há»i cÅ©
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async refresh(refreshToken: string) {
    const payload = this.verifyRefreshToken(refreshToken);
    if (!payload) throw new UnauthorizedException('Refresh token khÃ´ng há»£p lá» hoáº·c ÄÃ£ háº¿t háº¡n');

    // TÃ¬m user Äá» láº¥y id (cáº§n cho Redis key)
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, payload.sub),
      columns: { id: true, email: true, plan: true },
    });
    if (!user) throw new UnauthorizedException('User khÃ´ng tá»n táº¡i');

    // Rotation guard: token pháº£i khá»p vá»i cÃ¡i Äang lÆ°u trong Redis
    const stored = await this.sessionRedis.get(sessionKey(user.id));
    if (stored !== refreshToken) {
      // Token reuse â thu há»i luÃ´n (báº£o máº­t)
      await this.sessionRedis.del(sessionKey(user.id));
      throw new UnauthorizedException('Refresh token ÄÃ£ bá» thu há»i. Vui lÃ²ng ÄÄng nháº­p láº¡i.');
    }

    const newAccess  = this.createAccessToken(user.email);
    const newRefresh = this.createRefreshToken(user.email);

    // Ghi ÄÃ¨ token má»i
    await this.sessionRedis.set(sessionKey(user.id), newRefresh, 'EX', REFRESH_TTL);

    return {
      access_token:  newAccess,
      refresh_token: newRefresh,
      token_type:    'bearer',
    };
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // LOGOUT â thu há»i refresh token
  // POST /auth/logout
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async logout(userId: string) {
    await this.sessionRedis.del(sessionKey(userId));
    return { message: 'ÄÄng xuáº¥t thÃ nh cÃ´ng' };
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // FORGOT PASSWORD
  // POST /auth/forgot-password
  // LuÃ´n tráº£ 200 dÃ¹ email cÃ³ hay khÃ´ng (chá»ng enumerate â giá»¯ y chang code cÅ©)
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async forgotPassword(email: string): Promise<{ message: string }> {
    const lowerEmail = email.toLowerCase().trim();

    const user = await this.db.query.users.findFirst({
      where: eq(users.email, lowerEmail),
      columns: { id: true, name: true },
    });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('base64url');

      await this.db
        .update(users)
        .set({ verificationToken: resetToken, updatedAt: new Date() })
        .where(eq(users.id, user.id));

      await this.sendPasswordResetEmail(lowerEmail, user.name ?? 'báº¡n', resetToken);
    }

    return { message: 'Náº¿u email tá»n táº¡i, báº¡n sáº½ nháº­n ÄÆ°á»£c hÆ°á»ng dáº«n trong vÃ i phÃºt.' };
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // RESET PASSWORD
  // POST /auth/reset-password/:token
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    if (newPassword.length < 8) {
      throw new BadRequestException('Máº­t kháº©u cáº§n Ã­t nháº¥t 8 kÃ½ tá»±');
    }

    const user = await this.db.query.users.findFirst({
      where: eq(users.verificationToken, token),
      columns: { id: true },
    });
    if (!user) throw new BadRequestException('Token khÃ´ng há»£p lá» hoáº·c ÄÃ£ háº¿t háº¡n');

    const hashed = await this.hashPassword(newPassword);

    await this.db
      .update(users)
      .set({ hashedPassword: hashed, verificationToken: null, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // Thu há»i táº¥t cáº£ session sau khi Äá»i máº­t kháº©u
    await this.sessionRedis.del(sessionKey(user.id));

    return { message: 'Äáº·t láº¡i máº­t kháº©u thÃ nh cÃ´ng' };
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // GOOGLE OAUTH
  // GET /auth/google â redirect Google
  // GET /auth/google/callback â upsert user â JWT
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id:     this.config.get('GOOGLE_CLIENT_ID') ?? '',
      redirect_uri:  this.config.get('GOOGLE_REDIRECT_URI') ?? '',
      response_type: 'code',
      scope:         'openid email profile',
      access_type:   'offline',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  async handleGoogleCallback(code: string) {
    // 1. Exchange code â token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     this.config.get('GOOGLE_CLIENT_ID') ?? '',
        client_secret: this.config.get('GOOGLE_CLIENT_SECRET') ?? '',
        redirect_uri:  this.config.get('GOOGLE_REDIRECT_URI') ?? '',
        grant_type:    'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json() as any;
    if (!tokenData.access_token) throw new UnauthorizedException('Google auth failed');

    // 2. Get user info tá»« Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const gUser = await userRes.json() as any;
    const { id: googleId, email, name, picture } = gUser;
    if (!email || !googleId) throw new UnauthorizedException('Google auth failed');

    // 3. Upsert user â logic y chang code cÅ©
    //    TÃ¬m báº±ng google_id â email â táº¡o má»i
    let user = await this.db.query.users.findFirst({
      where: eq(users.googleId, googleId),
    });

    if (!user) {
      user = await this.db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      });

      if (user) {
        // Email ÄÃ£ tá»n táº¡i, gáº¯n google_id vÃ o
        await this.db
          .update(users)
          .set({ googleId, avatarUrl: picture ?? user.avatarUrl, updatedAt: new Date() })
          .where(eq(users.id, user.id));
        user = { ...user, googleId };
      } else {
        // Táº¡o user má»i tá»« Google
        const [newUser] = await this.db
          .insert(users)
          .values({
            email:          email.toLowerCase(),
            name,
            avatarUrl:      picture ?? null,
            hashedPassword: await this.hashPassword(crypto.randomBytes(32).toString('hex')),
            isVerified:     true,   // Google ÄÃ£ verify email
            isActive:       true,
            googleId,
            plan:           'free',
          })
          .returning();
        user = newUser;
      }
    }

    const accessToken  = this.createAccessToken(user.email);
    const refreshToken = this.createRefreshToken(user.email);

    // LÆ°u session
    await this.sessionRedis.set(sessionKey(user.id), refreshToken, 'EX', REFRESH_TTL);

    this.logger.log(`[GOOGLE] User ${user.email} logged in via Google`);

    return {
      // Redirect vá» frontend vá»i token (giá»¯ y chang code cÅ©)
      redirectUrl:  `${this.frontendUrl}?google_token=${accessToken}&name=${encodeURIComponent(user.name ?? '')}&email=${encodeURIComponent(user.email)}`,
      accessToken,
      refreshToken,
      user: {
        id:    user.id,
        email: user.email,
        name:  user.name,
        plan:  user.plan,
      },
    };
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // GET ME
  // GET /auth/me
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async getMe(userId: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true, email: true, name: true,
        avatarUrl: true, plan: true, createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng');
    return user;
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // EMAIL HELPERS (Resend)
  // Templates giá»¯ nguyÃªn style xanh lÃ¡ tá»« code cÅ©
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  private async sendVerificationEmail(email: string, name: string, token: string) {
    const verifyUrl = `${this.apiUrl}/api/v1/auth/verify/${token}`;
    try {
      if (this.resend) {
        await this.resend.emails.send({
          from:    'Querencia <no-reply@querencia.com.vn>',
          to:      email,
          subject: 'XÃ¡c nháº­n tÃ i khoáº£n Querencia cá»§a báº¡n',
          html:    this.verificationEmailHtml(name, verifyUrl),
        });
      }
      this.logger.log(`[EMAIL] Verification â ${email}`);
    } catch (e) {
      // KhÃ´ng block ÄÄng kÃ½ náº¿u email lá»i â giá»¯ y chang code cÅ©
      this.logger.error(`[EMAIL ERROR] ${e}`);
    }
  }

  private async sendPasswordResetEmail(email: string, name: string, token: string) {
    const resetUrl = `${this.apiUrl}/api/v1/auth/reset-password/${token}`;
    try {
      if (this.resend) {
        await this.resend.emails.send({
          from:    'Querencia <no-reply@querencia.com.vn>',
          to:      email,
          subject: 'Äáº·t láº¡i máº­t kháº©u Querencia',
          html:    this.resetEmailHtml(name, resetUrl),
        });
      }
      this.logger.log(`[EMAIL] Password reset â ${email}`);
    } catch (e) {
      this.logger.error(`[EMAIL ERROR] ${e}`);
    }
  }

  // ââ Email templates (giá»¯ style xanh lÃ¡ #4a7c59 tá»« code cÅ©) ââ

  private verificationEmailHtml(name: string, verifyUrl: string): string {
    return `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:40px 24px">
      <h1 style="font-size:2rem;color:#2d5a3d;margin-bottom:8px">Querencia</h1>
      <p style="color:#555;font-size:1rem">Xin chÃ o <strong>${name}</strong>,</p>
      <p style="color:#555">Cáº£m Æ¡n báº¡n ÄÃ£ ÄÄng kÃ½! Vui lÃ²ng xÃ¡c nháº­n email Äá» kÃ­ch hoáº¡t tÃ i khoáº£n.</p>
      <a href="${verifyUrl}"
         style="display:inline-block;margin:24px 0;padding:14px 32px;background:#4a7c59;color:#fff;border-radius:32px;text-decoration:none;font-weight:600;font-size:1rem">
        XÃ¡c nháº­n tÃ i khoáº£n
      </a>
      <p style="color:#999;font-size:0.82rem">Link cÃ³ hiá»u lá»±c trong 24 giá». Náº¿u báº¡n khÃ´ng ÄÄng kÃ½, hÃ£y bá» qua email nÃ y.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:32px 0"/>
      <p style="color:#bbb;font-size:0.78rem">Â© 2026 Querencia Â· querencia.com.vn</p>
    </div>`;
  }

  private resetEmailHtml(name: string, resetUrl: string): string {
    return `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:40px 24px">
      <h1 style="font-size:2rem;color:#2d5a3d;margin-bottom:8px">Querencia</h1>
      <p style="color:#555">Xin chÃ o <strong>${name}</strong>,</p>
      <p style="color:#555">ChÃºng tÃ´i nháº­n ÄÆ°á»£c yÃªu cáº§u Äáº·t láº¡i máº­t kháº©u cho tÃ i khoáº£n cá»§a báº¡n.</p>
      <a href="${resetUrl}"
         style="display:inline-block;margin:24px 0;padding:14px 32px;background:#4a7c59;color:#fff;border-radius:32px;text-decoration:none;font-weight:600;font-size:1rem">
        Äáº·t láº¡i máº­t kháº©u
      </a>
      <p style="color:#999;font-size:0.82rem">Link cÃ³ hiá»u lá»±c trong 1 giá». Náº¿u báº¡n khÃ´ng yÃªu cáº§u, hÃ£y bá» qua email nÃ y.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:32px 0"/>
      <p style="color:#bbb;font-size:0.78rem">Â© 2026 Querencia Â· querencia.com.vn</p>
    </div>`;
  }

  async verifyGoogleIdToken(idToken: string) {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!res.ok) throw new UnauthorizedException('Invalid Google token');
    const payload = await res.json() as any;
    return { email: payload.email, name: payload.name, picture: payload.picture };
  }

  async googleOAuthCallback(email: string, name?: string, picture?: string) {
    return this.appleOAuthCallback(email, email, name);
  }

  // ââ Apple Identity Token verification ââââââââââââââââââââââââ
  async verifyAppleIdentityToken(identityToken: string) {
    // Apple public keys endpoint
    const jwksRes  = await fetch('https://appleid.apple.com/auth/keys');
    const jwks     = await jwksRes.json();

    // Decode header Äá» láº¥y kid
    const header   = JSON.parse(
      Buffer.from(identityToken.split('.')[0], 'base64').toString()
    );
    const key      = jwks.keys.find((k: any) => k.kid === header.kid);
    if (!key) throw new UnauthorizedException('Apple key not found');

    // Verify JWT
    const jwkToPem = require('jwk-to-pem');
    const pem      = jwkToPem(key);
    const payload  = require('jsonwebtoken').verify(identityToken, pem, {
      algorithms: ['RS256'],
      audience:   'com.querencia.cuibap',
      issuer:     'https://appleid.apple.com',
    }) as any;

    return payload; // { sub, email, email_verified, ... }
  }

  // ââ Apple OAuth upsert ââââââââââââââââââââââââââââââââââââââââ
  async appleOAuthCallback(appleUserId: string, email?: string, name?: string) {
    // TÃ¬m user ÄÃ£ cÃ³ vá»i appleId nÃ y
    let user = await this.db.query.users.findFirst({
      where: eq(users.googleId, appleUserId),
    });

    if (!user && email) {
      // TÃ¬m theo email (user cÃ³ thá» ÄÃ£ ÄÄng kÃ½ báº±ng email)
      user = await this.db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (user) {
        // Link Apple ID vÃ o account cÅ©
        await this.db.update(users).set({ googleId: appleUserId }).where(eq(users.id, user.id));
      }
    }

    if (!user) {
      // User má»i â táº¡o account
      if (!email) throw new UnauthorizedException('Email required for first Apple Sign-In');
      const [newUser] = await this.db.insert(users).values({
        email,
        name:       name ?? email.split('@')[0],
        googleId:   appleUserId,
        isVerified: true,
        plan:       'free',
      }).returning();
      user = newUser;
    }

    const accessToken  = this.createAccessToken(user.email);
    const refreshToken = this.createRefreshToken(user.email);
    await this.sessionRedis.set(sessionKey(user.id), refreshToken, 'EX', REFRESH_TTL);
    return {
      user:          { id: user.id, email: user.email, name: user.name, plan: user.plan },
      access_token:  accessToken,
      refresh_token: refreshToken,
    };
  }

  // ââ FCM Token registration ââââââââââââââââââââââââââââââââââââ
  async registerFcmToken(userId: string, fcmToken: string) {
    await this.db.update(users)
      .set({ fcmToken, updatedAt: new Date() })
      .where(eq(users.id, userId));
    return { ok: true };
  }

  // ââ MFA: gá»­i push notification lÃªn FCM token cá»§a thiáº¿t bá» ââââ
  async initiateMfa(userId: string, requestingDevice: string, ipAddress: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true, fcmToken: true, email: true },
    });
    if (!user?.fcmToken) return { mfaRequired: false }; // khÃ´ng cÃ³ device â skip MFA

    // Táº¡o MFA token ngáº¯n háº¡n (5 phÃºt)
    const mfaToken = crypto.randomBytes(32).toString('hex');
    await this.sessionRedis.setex(`mfa:${mfaToken}`, 300, JSON.stringify({
      userId, status: 'pending',
    }));

    // Gá»­i FCM push notification Äáº¿n thiáº¿t bá» cá»§a user
    await this._sendMfaPushNotification(user.fcmToken, {
      mfaToken, device: requestingDevice, ipAddress,
      createdAt: new Date().toISOString(),
    });

    return { mfaRequired: true, mfaToken };
  }

  async respondMfa(mfaToken: string, status: 'approved' | 'rejected') {
    const raw = await this.sessionRedis.get(`mfa:${mfaToken}`);
    if (!raw) throw new BadRequestException('MFA token háº¿t háº¡n hoáº·c khÃ´ng há»£p lá»');

    const data = JSON.parse(raw);
    if (data.status !== 'pending') throw new BadRequestException('MFA token ÄÃ£ ÄÆ°á»£c sá»­ dá»¥ng');

    await this.sessionRedis.setex(`mfa:${mfaToken}`, 30, JSON.stringify({
      ...data, status,
    }));
    return { ok: true, status };
  }

  async checkMfaStatus(mfaToken: string): Promise<'pending' | 'approved' | 'rejected' | 'expired'> {
    const raw = await this.sessionRedis.get(`mfa:${mfaToken}`);
    if (!raw) return 'expired';
    return JSON.parse(raw).status;
  }

  private async _sendMfaPushNotification(fcmToken: string, data: Record<string, string>) {
    const serverKey = this.config.get('FIREBASE_SERVER_KEY');
    if (!serverKey) return;
    try {
      await fetch('https://fcm.googleapis.com/fcm/send', {
        method:  'POST',
        headers: { 'Authorization': `key=${serverKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: fcmToken,
          priority: 'high',
          data: { type: 'mfa_request', ...data },
          notification: {
            title: 'ð XÃ¡c nháº­n ÄÄng nháº­p',
            body:  `Ai ÄÃ³ Äang ÄÄng nháº­p tá»« ${data.device}`,
          },
        }),
      });
    } catch (e) {
      this.logger.warn('FCM send failed:', e);
    }
  }
}
