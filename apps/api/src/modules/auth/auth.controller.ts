/**
 * Auth Controller — NestJS
 * Migrated từ querencia-backend/api/auth_route.py
 *
 * Endpoints (prefix: /api/v1/auth):
 *   POST /register          — đăng ký + gửi email xác nhận
 *   GET  /verify/:token     — xác minh email (redirect)
 *   POST /login             — đăng nhập → JWT
 *   POST /refresh           — refresh token rotation
 *   GET  /me                — thông tin user đang đăng nhập
 *   POST /forgot-password   — gửi email reset
 *   GET  /reset-password/:token  — trang đặt lại mật khẩu
 *   POST /reset-password/:token  — xử lý đặt lại
 *   GET  /google            — redirect đến Google OAuth
 *   GET  /google/callback   — nhận code từ Google
 */
import {
  Controller, Post, Get, Body, Param, Redirect,
  HttpCode, HttpStatus, Res, Req, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CaptchaGuard, RequireCaptcha } from '../../common/guards/captcha.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

class RegisterDto {
  email: string;
  name: string;
  password: string;
}

class LoginDto {
  email: string;
  password: string;
}

class ForgotPasswordDto {
  email: string;
}

class ResetPasswordDto {
  new_password: string;
}

class RefreshDto {
  refresh_token: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── REGISTER ──────────────────────────────────────────────
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  // ── VERIFY EMAIL ──────────────────────────────────────────
  @Public()
  @Get('verify/:token')
  @ApiOperation({ summary: 'Xác minh email qua link' })
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    try {
      const { username, redirectUrl } = await this.authService.verifyEmail(token);
      // Trả HTML giống code cũ — tự redirect sau 2 giây
      return res.send(`
        <html><body style="font-family:sans-serif;text-align:center;padding:60px">
          <h2 style="color:#4a7c59">✓ Tài khoản đã được xác nhận!</h2>
          <p>Xin chào <strong>${username}</strong>, tài khoản của bạn đã sẵn sàng.</p>
          <p>Đang chuyển về trang đăng nhập...</p>
          <script>setTimeout(() => window.location.href = '${redirectUrl}', 2000)</script>
          <a href="${redirectUrl}">← Về trang chủ</a>
        </body></html>
      `);
    } catch {
      return res.status(400).send(`
        <html><body style="font-family:sans-serif;text-align:center;padding:60px">
          <h2 style="color:#c0392b">Link không hợp lệ hoặc đã hết hạn</h2>
          <p>Vui lòng đăng ký lại hoặc liên hệ hỗ trợ.</p>
          <a href="https://querencia.com.vn">← Về trang chủ</a>
        </body></html>
      `);
    }
  }

  // ── LOGIN ─────────────────────────────────────────────────
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // ── REFRESH TOKEN ─────────────────────────────────────────
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Làm mới access token' })
  refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body.refresh_token);
  }

  // ── GET ME ────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Thông tin user đang đăng nhập' })
  getMe(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  // ── FORGOT PASSWORD ───────────────────────────────────────
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gửi email đặt lại mật khẩu' })
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  // ── RESET PASSWORD PAGE (GET) ─────────────────────────────
  @Public()
  @Get('reset-password/:token')
  async resetPasswordPage(@Param('token') token: string, @Res() res: Response) {
    // Render form HTML giống code cũ
    const frontendUrl = 'https://querencia.com.vn';
    return res.send(`
      <html>
      <head><meta charset="UTF-8"/><title>Đặt lại mật khẩu · Querencia</title>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      </head>
      <body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9f9f7">
        <div style="background:#fff;border-radius:16px;padding:40px;width:100%;max-width:400px;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
          <h1 style="font-size:1.5rem;font-weight:700;color:#2d5a3d;margin-bottom:6px">Querencia</h1>
          <h2 style="font-size:1.1rem;font-weight:600;margin-bottom:20px;color:#222">Đặt lại mật khẩu</h2>
          <div id="msg" style="display:none;padding:10px 14px;border-radius:8px;font-size:0.85rem;margin-bottom:16px"></div>
          <div style="margin-bottom:14px">
            <label style="font-size:0.82rem;font-weight:500;color:#555;display:block;margin-bottom:6px">Mật khẩu mới</label>
            <input type="password" id="newPass" placeholder="••••••••"
              style="width:100%;padding:12px 16px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:0.9rem;box-sizing:border-box"/>
          </div>
          <div style="margin-bottom:20px">
            <label style="font-size:0.82rem;font-weight:500;color:#555;display:block;margin-bottom:6px">Xác nhận mật khẩu mới</label>
            <input type="password" id="confirmPass" placeholder="••••••••"
              style="width:100%;padding:12px 16px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:0.9rem;box-sizing:border-box"/>
          </div>
          <button onclick="doReset()"
            style="width:100%;padding:13px;background:#4a7c59;color:#fff;border:none;border-radius:8px;font-size:0.95rem;font-weight:600;cursor:pointer">
            Đặt lại mật khẩu
          </button>
        </div>
        <script>
          async function doReset() {
            const p = document.getElementById('newPass').value;
            const c = document.getElementById('confirmPass').value;
            const msg = document.getElementById('msg');
            const show = (t, ok) => {
              msg.style.display='block';
              msg.style.background=ok?'#ddeee3':'#fdecea';
              msg.style.color=ok?'#2f5c3e':'#c0392b';
              msg.textContent=t;
            };
            if (!p||!c) return show('Vui lòng điền đầy đủ.', false);
            if (p!==c) return show('Mật khẩu không khớp.', false);
            if (p.length<8) return show('Mật khẩu cần ít nhất 8 ký tự.', false);
            const res = await fetch('/api/v1/auth/reset-password/${token}', {
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify({new_password:p})
            });
            const data = await res.json();
            if (res.ok) {
              show('Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...', true);
              setTimeout(() => window.location.href = '${frontendUrl}?login=1', 2000);
            } else {
              show(data.message || 'Có lỗi xảy ra.', false);
            }
          }
        </script>
      </body></html>
    `);
  }

  // ── RESET PASSWORD (POST) ─────────────────────────────────
  @Public()
  @Post('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Param('token') token: string, @Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(token, body.new_password);
  }

  // ── GOOGLE OAUTH ──────────────────────────────────────────
  @Public()
  @Get('google')
  @ApiOperation({ summary: 'Redirect đến Google OAuth' })
  googleLogin(@Res() res: Response) {
    return res.redirect(this.authService.getGoogleAuthUrl());
  }

  @Public()
  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const code = req.query.code as string;
    try {
      const { redirectUrl } = await this.authService.handleGoogleCallback(code);
      return res.redirect(redirectUrl);
    } catch {
      return res.redirect('https://querencia.com.vn?error=google_auth_failed');
    }
  }


  // ── LOGOUT ───────────────────────────────────────────────────
  // Thêm mới (code cũ không có) — thu hồi refresh token khỏi Redis db0
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng xuất — thu hồi refresh token' })
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }


  // ── Google ID Token (mobile app) ─────────────────────────────
  @Public()
  @Post('google/id-token')
  async googleIdToken(@Body() body: { idToken: string }) {
    // Verify Google idToken server-side
    const ticket = await this.authService.verifyGoogleIdToken(body.idToken);
    return this.authService.googleOAuthCallback(ticket.email, ticket.name, ticket.picture);
  }

  // ── Apple Identity Token (mobile app) ────────────────────────
  @Public()
  @Post('apple/identity-token')
  async appleIdentityToken(@Body() body: {
    identityToken: string;
    name?:  string; // chỉ có lần đầu
    email?: string; // chỉ có lần đầu
  }) {
    const payload = await this.authService.verifyAppleIdentityToken(body.identityToken);
    return this.authService.appleOAuthCallback(
      payload.sub,           // Apple user ID (stable)
      body.email ?? payload.email,
      body.name,
    );
  }

  // ── FCM Token (mobile push notification) ─────────────────────
  @Post('fcm-token')
  registerFcmToken(@CurrentUser() user: any, @Body() body: { fcmToken: string }) {
    return this.authService.registerFcmToken(user.id, body.fcmToken);
  }

  // ── MFA — respond to push notification ───────────────────────
  @Post('mfa/respond')
  respondMfa(@Body() body: { mfaToken: string; status: 'approved' | 'rejected' }) {
    return this.authService.respondMfa(body.mfaToken, body.status);
  }

  // ── MFA — poll status (fallback khi WebSocket không dùng được)
  @Public()
  @Get('mfa/status/:token')
  checkMfaStatus(@Param('token') token: string) {
    return this.authService.checkMfaStatus(token);
  }
}
