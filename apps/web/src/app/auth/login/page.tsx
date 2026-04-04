'use client';
/**
 * Login page — /auth/login
 * Migrated từ auth.js doLogin() + MFA waiting overlay
 * Flow giữ nguyên:
 *   1. Email + password → POST /api/v1/auth/login
 *   2. Nếu user có Cùi Bắp app → MFA challenge → polling
 *   3. Nếu không có app → đăng nhập thẳng
 */
import { useState, useRef } from 'react';
import { signIn }            from 'next-auth/react';
import Link                  from 'next/link';
import { useRouter, useSearchParams, Suspense } from 'next/navigation';
import { AuthCard }    from '../../../components/auth/AuthCard';
import { AuthInput }   from '../../../components/auth/AuthInput';
import { AuthMessage } from '../../../components/auth/AuthMessage';

// Google logo SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

type MFAState = {
  token:    string;
  device:   string;
  fallback: string; // JWT token nếu user bấm "skip"
  email:    string;
  expires:  number; // timestamp
};

function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [mfa,      setMfa]      = useState<MFAState | null>(null);
  const [mfaTimer, setMfaTimer] = useState(300); // 5 min countdown

  const pollRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Detect thiết bị — giữ y chang _getDeviceInfo() cũ ──
  function getDeviceInfo(): string {
    const ua = navigator.userAgent;
    let browser = 'Browser', os = 'Web';
    if (ua.includes('Chrome') && !ua.includes('Edg'))  browser = 'Chrome';
    else if (ua.includes('Firefox'))                    browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg'))                        browser = 'Edge';
    if (ua.includes('Windows'))       os = 'Windows';
    else if (ua.includes('Mac'))      os = 'macOS';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    else if (ua.includes('Android'))  os = 'Android';
    return `${browser} on ${os}`;
  }

  // ── Hoàn tất đăng nhập qua NextAuth session ──
  async function finalizeLogin(accessToken: string, refreshToken: string, email: string) {
    // Dùng NextAuth credentials provider với custom token
    // Truyền token đã có sẵn từ API — không cần gọi login lại
    const result = await signIn('credentials', {
      email,
      password: '__token__', // sentinel — NextAuth biết dùng token
      accessToken,
      refreshToken,
      redirect: false,
    });
    if (result?.ok) {
      router.push(callbackUrl);
    } else {
      router.push('/');
    }
  }

  // ── Start MFA polling — giữ y chang logic cũ ──
  function startMFAPolling(mfaState: MFAState) {
    let count = 0;
    let remaining = 300;

    timerRef.current = setInterval(() => {
      remaining--;
      setMfaTimer(remaining);
      if (remaining <= 0) clearInterval(timerRef.current!);
    }, 1000);

    pollRef.current = setInterval(async () => {
      count++;
      if (count > 150) {
        clearAll();
        setMfa(null);
        setMsg({ text: 'Xác nhận đã hết hạn. Vui lòng đăng nhập lại.', type: 'error' });
        return;
      }
      try {
        const r = await fetch(`/api/v1/auth/mfa/status/${mfaState.token}`);
        const d = await r.json();
        if (d.status === 'approved') {
          clearAll();
          setMfa(null);
          await finalizeLogin(d.access_token, d.refresh_token ?? mfaState.fallback, mfaState.email);
        } else if (d.status === 'rejected') {
          clearAll();
          setMfa(null);
          setMsg({ text: '🔒 Đăng nhập bị từ chối từ điện thoại của bạn.', type: 'error' });
        } else if (d.status === 'expired') {
          clearAll();
          setMfa(null);
          setMsg({ text: 'Phiên đã hết hạn. Vui lòng đăng nhập lại.', type: 'error' });
        }
      } catch {}
    }, 2000);
  }

  function clearAll() {
    if (pollRef.current)  clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function skipMFA() {
    clearAll();
    if (mfa) finalizeLogin(mfa.fallback, '', mfa.email);
    setMfa(null);
  }

  // ── Submit login ──
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setMsg({ text: 'Vui lòng điền đầy đủ thông tin.', type: 'error' }); return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg({ text: data.message ?? 'Email hoặc mật khẩu không đúng.', type: 'error' });
        return;
      }

      // Thử MFA challenge — giữ y chang doLogin() cũ
      const device = getDeviceInfo();
      let mfaToken: string | null = null;
      try {
        const mfaRes = await fetch('/api/v1/auth/mfa/challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, device }),
        });
        const mfaData = await mfaRes.json();
        if (mfaData.has_app && mfaData.mfa_token) mfaToken = mfaData.mfa_token;
      } catch {}

      if (mfaToken) {
        // Có Cùi Bắp app → hiện màn hình chờ
        const state: MFAState = {
          token:    mfaToken,
          device,
          fallback: data.access_token,
          email,
          expires:  Date.now() + 5 * 60 * 1000,
        };
        setMfa(state);
        startMFAPolling(state);
      } else {
        await finalizeLogin(data.access_token, data.refresh_token, email);
      }
    } catch {
      setMsg({ text: 'Không thể kết nối đến máy chủ. Vui lòng thử lại.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  // ── Google OAuth ──
  async function handleGoogle() {
    setLoading(true);
    await signIn('google', { callbackUrl });
  }

  // ── MFA waiting screen ──
  if (mfa) {
    const m = Math.floor(mfaTimer / 60);
    const s = mfaTimer % 60;
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-warm)', padding: 24,
      }}>
        <div style={{
          background: 'var(--bg)', borderRadius: 20, padding: '36px 32px',
          maxWidth: 360, width: '100%', textAlign: 'center',
          boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '2.8rem', marginBottom: 14 }}>📱</div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 8, color: 'var(--text)' }}>
            Kiểm tra điện thoại
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>
            Mở app <strong>Cùi Bắp</strong> và nhấn{' '}
            <strong style={{ color: 'var(--sage)' }}>Phê duyệt</strong> để xác nhận đăng nhập.
          </p>
          {/* Device + countdown */}
          <div style={{
            background: 'var(--bg-surface)', borderRadius: 10,
            padding: '10px 14px', fontSize: '0.78rem',
            color: 'var(--text-secondary)', marginBottom: 18, textAlign: 'left',
          }}>
            🖥️ <strong>Thiết bị:</strong> {mfa.device}<br/>
            ⏱️ Hết hạn sau: <strong>{m}:{s.toString().padStart(2, '0')}</strong>
          </div>
          {/* Spinner */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, color: 'var(--sage)', fontSize: '0.82rem', marginBottom: 20,
          }}>
            <SpinnerIcon />
            Đang chờ xác nhận…
          </div>
          <button
            onClick={skipMFA}
            style={{
              background: 'none', border: '1.5px solid var(--border)',
              borderRadius: 10, padding: '8px 20px',
              fontSize: '0.8rem', color: 'var(--gray)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Bỏ qua, đăng nhập không cần xác nhận
          </button>
        </div>
      </div>
    );
  }

  // ── Login form ──
  return (
    <AuthCard title="Đăng nhập" subtitle="Chào mừng bạn trở lại 🌿">
      {/* Google OAuth */}
      <button
        onClick={handleGoogle}
        disabled={loading}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 10,
          padding: '11px 16px', borderRadius: 10,
          border: '1.5px solid var(--border)', background: 'var(--bg)',
          cursor: 'pointer', fontFamily: 'inherit',
          fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)',
          marginBottom: 20, transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
      >
        <GoogleIcon />
        Tiếp tục với Google
      </button>

      {/* Divider */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
        color: 'var(--gray)', fontSize: '0.78rem',
      }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }}/>
        hoặc
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }}/>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="ban@email.com"
          autoComplete="email"
          autoFocus
        />
        <AuthInput
          label="Mật khẩu"
          showToggle
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        {/* Forgot password */}
        <div style={{ textAlign: 'right', marginTop: -8 }}>
          <Link href="/auth/forgot-password" style={{
            fontSize: '0.8rem', color: 'var(--sage)',
            textDecoration: 'none',
          }}>
            Quên mật khẩu?
          </Link>
        </div>

        <AuthMessage message={msg?.text ?? null} type={msg?.type ?? 'error'} />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '13px', background: 'var(--sage)',
            color: '#fff', border: 'none', borderRadius: 10,
            fontFamily: 'inherit', fontSize: '0.95rem',
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s',
          }}
        >
          {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
      </form>

      {/* Switch to register */}
      <p style={{
        textAlign: 'center', fontSize: '0.83rem',
        color: 'var(--text-secondary)', marginTop: 20,
      }}>
        Chưa có tài khoản?{' '}
        <Link href="/auth/register" style={{ color: 'var(--sage)', fontWeight: 600, textDecoration: 'none' }}>
          Đăng ký miễn phí
        </Link>
      </p>

      {/* No ads note */}
      <p style={{
        textAlign: 'center', fontSize: '0.72rem',
        color: 'var(--gray)', marginTop: 16,
      }}>
        🌿 Querencia không quảng cáo và không bán dữ liệu của bạn.
      </p>
    </AuthCard>
  );
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3"
        strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
    </svg>
  );
}

export default function LoginPage() {
  return <Suspense><LoginContent /></Suspense>;
}
