'use client';
/**
 * Forgot password page - /auth/forgot-password
 * Migrated from auth.js doForgotPassword()
 * Always shows success whether the email exists or not (anti-enumeration - keeps old behavior)
 */
import { useState }  from 'react';
import Link          from 'next/link';
import { AuthCard }    from '../../../components/auth/AuthCard';
import { AuthInput }   from '../../../components/auth/AuthInput';
import { AuthMessage } from '../../../components/auth/AuthMessage';
import { Turnstile }   from '../../../components/common/Turnstile';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [msg,     setMsg]     = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [captchaToken, setCaptchaToken] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setMsg({ text: 'Please enter your email.', type: 'error' }); return;
    }
    if (!captchaToken) {
      setMsg({ text: 'Please complete the verification check.', type: 'error' }); return;
    }
    setLoading(true);
    setMsg(null);
    try {
      await fetch('/api/v1/auth/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, captchaToken }),
      });
      // Always show success - keeps old behavior (anti-enumeration)
      setSent(true);
    } catch {
      setMsg({ text: 'Could not connect. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthCard title="Check your email" subtitle={`If ${email} exists in our system, you'll receive a password reset link within a few minutes.`}>
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📬</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
            Check your inbox (including Spam). The link is valid for 1 hour.
          </p>
          <Link href="/auth/login" style={{
            display: 'inline-block', padding: '11px 28px',
            background: 'var(--sage)', color: '#fff',
            borderRadius: 10, textDecoration: 'none',
            fontWeight: 600, fontSize: '0.9rem',
          }}>
            ← Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password"
      subtitle="Enter your email and we'll send you a password reset link."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          autoFocus
        />
        <Turnstile onVerify={setCaptchaToken} />
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
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
      <p style={{
        textAlign: 'center', fontSize: '0.83rem',
        color: 'var(--text-secondary)', marginTop: 20,
      }}>
        <Link href="/auth/login" style={{ color: 'var(--sage)', fontWeight: 600, textDecoration: 'none' }}>
          ← Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
