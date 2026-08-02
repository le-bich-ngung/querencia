'use client';
/**
 * Login page - /auth/login
 * Google-only auth: 1 nút duy nhất, không còn email/password/MFA polling.
 * Nếu tài khoản Google chưa tồn tại, backend (/api/v1/auth/google/token-exchange)
 * tự tạo mới - nghĩa là nút này vừa là "đăng nhập" vừa là "đăng ký".
 */
import { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { AuthCard } from '../../../components/auth/AuthCard';

// Google logo SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/';

  async function handleGoogle() {
    await signIn('google', { callbackUrl });
  }

  return (
    <AuthCard title="Đăng nhập" subtitle="Chào mừng bạn trở lại 🌿">
      <button
        onClick={handleGoogle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 10,
          padding: '13px 16px', borderRadius: 10,
          border: '1.5px solid var(--border)', background: 'var(--bg)',
          cursor: 'pointer', fontFamily: 'inherit',
          fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg)')}
      >
        <GoogleIcon />
        Tiếp tục với Google
      </button>

      <p style={{
        textAlign: 'center', fontSize: '0.78rem',
        color: 'var(--text-secondary)', marginTop: 18, lineHeight: 1.6,
      }}>
        Chưa có tài khoản? Không sao - bấm nút trên, Querencia sẽ tự tạo tài khoản cho bạn.
      </p>

      <p style={{
        textAlign: 'center', fontSize: '0.72rem',
        color: 'var(--gray)', marginTop: 16,
      }}>
        🌿 Querencia không quảng cáo và không bán dữ liệu của bạn.
      </p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return <Suspense><LoginContent /></Suspense>;
}
