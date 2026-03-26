'use client';
/**
 * Forgot password page — /auth/forgot-password
 * Migrated từ auth.js doForgotPassword()
 * Luôn show success dù email có hay không (chống enumerate — giữ y chang code cũ)
 */
import { useState }  from 'react';
import Link          from 'next/link';
import { AuthCard }    from '@/components/auth/AuthCard';
import { AuthInput }   from '@/components/auth/AuthInput';
import { AuthMessage } from '@/components/auth/AuthMessage';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [msg,     setMsg]     = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setMsg({ text: 'Vui lòng nhập email.', type: 'error' }); return;
    }
    setLoading(true);
    setMsg(null);
    try {
      await fetch('/api/v1/auth/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      // Luôn show success — giữ y chang code cũ (chống enumerate)
      setSent(true);
    } catch {
      setMsg({ text: 'Không thể kết nối. Vui lòng thử lại.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthCard title="Kiểm tra email" subtitle={`Nếu ${email} tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu trong vài phút.`}>
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📬</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
            Kiểm tra hòm thư (kể cả folder Spam). Link có hiệu lực trong 1 giờ.
          </p>
          <Link href="/auth/login" style={{
            display: 'inline-block', padding: '11px 28px',
            background: 'var(--sage)', color: '#fff',
            borderRadius: 10, textDecoration: 'none',
            fontWeight: 600, fontSize: '0.9rem',
          }}>
            ← Quay lại đăng nhập
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Quên mật khẩu"
      subtitle="Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="ban@email.com"
          autoComplete="email"
          autoFocus
        />
        <AuthMessage message={msg?.text ?? null} type={msg?.type ?? 'error'} />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '13px', background: 'var(--sage)',
            color: '#fff', border: 'none', borderRadius: 10,
            fontFamily: 'inherit', fontSize: '0.95rem',
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Đang gửi…' : 'Gửi link đặt lại'}
        </button>
      </form>
      <p style={{
        textAlign: 'center', fontSize: '0.83rem',
        color: 'var(--text-secondary)', marginTop: 20,
      }}>
        <Link href="/auth/login" style={{ color: 'var(--sage)', fontWeight: 600, textDecoration: 'none' }}>
          ← Quay lại đăng nhập
        </Link>
      </p>
    </AuthCard>
  );
}
