ï»¿'use client';
/**
 * Forgot password page â /auth/forgot-password
 * Migrated tá»« auth.js doForgotPassword()
 * LuÃ´n show success dÃ¹ email cÃ³ hay khÃ´ng (chá»ng enumerate â giá»¯ y chang code cÅ©)
 */
import { useState }  from 'react';
import Link          from 'next/link';
import { AuthCard }    from '../../../components/auth/AuthCard';
import { AuthInput }   from '../../../components/auth/AuthInput';
import { AuthMessage } from '../../../components/auth/AuthMessage';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [msg,     setMsg]     = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setMsg({ text: 'Vui lÃ²ng nháº­p email.', type: 'error' }); return;
    }
    setLoading(true);
    setMsg(null);
    try {
      await fetch('/api/v1/auth/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      // LuÃ´n show success â giá»¯ y chang code cÅ© (chá»ng enumerate)
      setSent(true);
    } catch {
      setMsg({ text: 'KhÃ´ng thá» káº¿t ná»i. Vui lÃ²ng thá»­ láº¡i.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthCard title="Kiá»m tra email" subtitle={`Náº¿u ${email} tá»n táº¡i trong há» thá»ng, báº¡n sáº½ nháº­n ÄÆ°á»£c link Äáº·t láº¡i máº­t kháº©u trong vÃ i phÃºt.`}>
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>ð¬</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
            Kiá»m tra hÃ²m thÆ° (ká» cáº£ folder Spam). Link cÃ³ hiá»u lá»±c trong 1 giá».
          </p>
          <Link href="/auth/login" style={{
            display: 'inline-block', padding: '11px 28px',
            background: 'var(--sage)', color: '#fff',
            borderRadius: 10, textDecoration: 'none',
            fontWeight: 600, fontSize: '0.9rem',
          }}>
            â Quay láº¡i ÄÄng nháº­p
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="QuÃªn máº­t kháº©u"
      subtitle="Nháº­p email cá»§a báº¡n vÃ  chÃºng tÃ´i sáº½ gá»­i link Äáº·t láº¡i máº­t kháº©u."
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
          {loading ? 'Äang gá»­iâ¦' : 'Gá»­i link Äáº·t láº¡i'}
        </button>
      </form>
      <p style={{
        textAlign: 'center', fontSize: '0.83rem',
        color: 'var(--text-secondary)', marginTop: 20,
      }}>
        <Link href="/auth/login" style={{ color: 'var(--sage)', fontWeight: 600, textDecoration: 'none' }}>
          â Quay láº¡i ÄÄng nháº­p
        </Link>
      </p>
    </AuthCard>
  );
}
