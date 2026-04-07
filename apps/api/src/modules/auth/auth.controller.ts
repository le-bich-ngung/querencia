ï»¿/**
 * Auth Controller â NestJS
 * Migrated tá»« querencia-backend/api/auth_route.py
 *
 * Endpoints (prefix: /api/v1/auth):
 *   POST /register          â ÄÄng kÃ½ + gá»­i email xÃ¡c nháº­n
 *   GET  /verify/:token     â xÃ¡c minh email (redirect)
 *   POST /login             â ÄÄng nháº­p â JWT
 *   POST /refresh           â refresh token rotation
 *   GET  /me                â thÃ´ng tin user Äang ÄÄng nháº­p
 *   POST /forgot-password   â gá»­i email reset
 *   GET  /reset-password/:token  â trang Äáº·t láº¡i máº­t kháº©u
 *   POST /reset-password/:token  â xá»­ lÃ½ Äáº·t láº¡i
 *   GET  /google            â redirect Äáº¿n Google OAuth
 *   GET  /google/callback   â nháº­n code tá»« Google
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

  // ââ REGISTER ââââââââââââââââââââââââââââââââââââââââââââââ
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'ÄÄng kÃ½ tÃ i khoáº£n má»i' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  // ââ VERIFY EMAIL ââââââââââââââââââââââââââââââââââââââââââ
  @Public()
  @Get('verify/:token')
  @ApiOperation({ summary: 'XÃ¡c minh email qua link' })
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    try {
      const { username, redirectUrl } = await this.authService.verifyEmail(token);
      // Tráº£ HTML giá»ng code cÅ© â tá»± redirect sau 2 giÃ¢y
      return res.send(`
        <html><body style="font-family:sans-serif;text-align:center;padding:60px">
          <h2 style="color:#4a7c59">â TÃ i khoáº£n ÄÃ£ ÄÆ°á»£c xÃ¡c nháº­n!</h2>
          <p>Xin chÃ o <strong>${username}</strong>, tÃ i khoáº£n cá»§a báº¡n ÄÃ£ sáºµn sÃ ng.</p>
          <p>Äang chuyá»n vá» trang ÄÄng nháº­p...</p>
          <script>setTimeout(() => window.location.href = '${redirectUrl}', 2000)</script>
          <a href="${redirectUrl}">â Vá» trang chá»§</a>
        </body></html>
      `);
    } catch {
      return res.status(400).send(`
        <html><body style="font-family:sans-serif;text-align:center;padding:60px">
          <h2 style="color:#c0392b">Link khÃ´ng há»£p lá» hoáº·c ÄÃ£ háº¿t háº¡n</h2>
          <p>Vui lÃ²ng ÄÄng kÃ½ láº¡i hoáº·c liÃªn há» há» trá»£.</p>
          <a href="https://querencia.com.vn">â Vá» trang chá»§</a>
        </body></html>
      `);
    }
  }

  // ââ LOGIN âââââââââââââââââââââââââââââââââââââââââââââââââ
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ÄÄng nháº­p' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // ââ REFRESH TOKEN âââââââââââââââââââââââââââââââââââââââââ
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'LÃ m má»i access token' })
  refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body.refresh_token);
  }

  // ââ GET ME ââââââââââââââââââââââââââââââââââââââââââââââââ
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'ThÃ´ng tin user Äang ÄÄng nháº­p' })
  getMe(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  // ââ FORGOT PASSWORD âââââââââââââââââââââââââââââââââââââââ
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gá»­i email Äáº·t láº¡i máº­t kháº©u' })
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  // ââ RESET PASSWORD PAGE (GET) âââââââââââââââââââââââââââââ
  @Public()
  @Get('reset-password/:token')
  async resetPasswordPage(@Param('token') token: string, @Res() res: Response) {
    // Render form HTML giá»ng code cÅ©
    const frontendUrl = 'https://querencia.com.vn';
    return res.send(`
      <html>
      <head><meta charset="UTF-8"/><title>Äáº·t láº¡i máº­t kháº©u Â· Querencia</title>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      </head>
      <body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9f9f7">
        <div style="background:#fff;border-radius:16px;padding:40px;width:100%;max-width:400px;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
          <h1 style="font-size:1.5rem;font-weight:700;color:#2d5a3d;margin-bottom:6px">Querencia</h1>
          <h2 style="font-size:1.1rem;font-weight:600;margin-bottom:20px;color:#222">Äáº·t láº¡i máº­t kháº©u</h2>
          <div id="msg" style="display:none;padding:10px 14px;border-radius:8px;font-size:0.85rem;margin-bottom:16px"></div>
          <div style="margin-bottom:14px">
            <label style="font-size:0.82rem;font-weight:500;color:#555;display:block;margin-bottom:6px">Máº­t kháº©u má»i</label>
            <input type="password" id="newPass" placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
              style="width:100%;padding:12px 16px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:0.9rem;box-sizing:border-box"/>
          </div>
          <div style="margin-bottom:20px">
            <label style="font-size:0.82rem;font-weight:500;color:#555;display:block;margin-bottom:6px">XÃ¡c nháº­n máº­t kháº©u má»i</label>
            <input type="password" id="confirmPass" placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
              style="width:100%;padding:12px 16px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:0.9rem;box-sizing:border-box"/>
          </div>
          <button onclick="doReset()"
            style="width:100%;padding:13px;background:#4a7c59;color:#fff;border:none;border-radius:8px;font-size:0.95rem;font-weight:600;cursor:pointer">
            Äáº·t láº¡i máº­t kháº©u
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
            if (!p||!c) return show('Vui lÃ²ng Äiá»n Äáº§y Äá»§.', false);
            if (p!==c) return show('Máº­t kháº©u khÃ´ng khá»p.', false);
            if (p.length<8) return show('Máº­t kháº©u cáº§n Ã­t nháº¥t 8 kÃ½ tá»±.', false);
            const res = await fetch('/api/v1/auth/reset-password/${token}', {
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify({new_password:p})
            });
            const data = await res.json();
            if (res.ok) {
              show('Äáº·t láº¡i máº­t kháº©u thÃ nh cÃ´ng! Äang chuyá»n vá» trang ÄÄng nháº­p...', true);
              setTimeout(() => window.location.href = '${frontendUrl}?login=1', 2000);
            } else {
              show(data.message || 'CÃ³ lá»i xáº£y ra.', false);
            }
          }
        </script>
      </body></html>
    `);
  }

  // ââ RESET PASSWORD (POST) âââââââââââââââââââââââââââââââââ
  @Public()
  @Post('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Param('token') token: string, @Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(token, body.new_password);
  }

  // ââ GOOGLE OAUTH ââââââââââââââââââââââââââââââââââââââââââ
  @Public()
  @Get('google')
  @ApiOperation({ summary: 'Redirect Äáº¿n Google OAuth' })
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


  // ââ LOGOUT âââââââââââââââââââââââââââââââââââââââââââââââââââ
  // ThÃªm má»i (code cÅ© khÃ´ng cÃ³) â thu há»i refresh token khá»i Redis db0
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ÄÄng xuáº¥t â thu há»i refresh token' })
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }


  // ââ Google ID Token (mobile app) âââââââââââââââââââââââââââââ
  @Public()
  @Post('google/id-token')
  async googleIdToken(@Body() body: { idToken: string }) {
    // Verify Google idToken server-side
    const ticket = await this.authService.verifyGoogleIdToken(body.idToken);
    return this.authService.googleOAuthCallback(ticket.email, ticket.name, ticket.picture);
  }

  // ââ Apple Identity Token (mobile app) ââââââââââââââââââââââââ
  @Public()
  @Post('apple/identity-token')
  async appleIdentityToken(@Body() body: {
    identityToken: string;
    name?:  string; // chá» cÃ³ láº§n Äáº§u
    email?: string; // chá» cÃ³ láº§n Äáº§u
  }) {
    const payload = await this.authService.verifyAppleIdentityToken(body.identityToken);
    return this.authService.appleOAuthCallback(
      payload.sub,           // Apple user ID (stable)
      body.email ?? payload.email,
      body.name,
    );
  }

  // ââ FCM Token (mobile push notification) âââââââââââââââââââââ
  @Post('fcm-token')
  registerFcmToken(@CurrentUser() user: any, @Body() body: { fcmToken: string }) {
    return this.authService.registerFcmToken(user.id, body.fcmToken);
  }

  // ââ MFA â respond to push notification âââââââââââââââââââââââ
  @Post('mfa/respond')
  respondMfa(@Body() body: { mfaToken: string; status: 'approved' | 'rejected' }) {
    return this.authService.respondMfa(body.mfaToken, body.status);
  }

  // ââ MFA â poll status (fallback khi WebSocket khÃ´ng dÃ¹ng ÄÆ°á»£c)
  @Public()
  @Get('mfa/status/:token')
  checkMfaStatus(@Param('token') token: string) {
    return this.authService.checkMfaStatus(token);
  }
}
