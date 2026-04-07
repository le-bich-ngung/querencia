ï»¿'use client';
/**
 * Register page â /auth/register
 * Migrated tá»« auth.js doRegister()
 * Flow: Há» + TÃªn + Email + Password â POST /api/v1/auth/register
 *       â Hiá»n thÃ´ng bÃ¡o â chuyá»n sang login
 */
import { useState } from 'react';
import Link         from 'next/link';
import { signIn }   from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AuthCard }    from '../../../components/auth/AuthCard';
import { AuthInput }   from '../../../components/auth/AuthInput';
import { AuthMessage } from '../../../components/auth/AuthMessage';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();

  const [givenName,  setGivenName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [confirm,    setConfirm]    = useState('');
  const [loading,    setLoading]    = useState(false);
  const [msg,        setMsg]        = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!givenName.trim())  e.givenName = 'Vui lÃ²ng nháº­p tÃªn.';
    if (!lastName.trim())   e.lastName  = 'Vui lÃ²ng nháº­p há».';
    if (!email.trim())      e.email     = 'Vui lÃ²ng nháº­p email.';
    else if (!emailRegex.test(email)) e.email = 'Email khÃ´ng há»£p lá».';
    if (!password)          e.password  = 'Vui lÃ²ng nháº­p máº­t kháº©u.';
    else if (password.length < 8) e.password = 'Máº­t kháº©u cáº§n Ã­t nháº¥t 8 kÃ½ tá»±.';
    if (password !== confirm) e.confirm = 'Máº­t kháº©u khÃ´ng khá»p.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMsg(null);

    // Giá»¯ logic cÅ©: name = `${lastName} ${givenName}`
    const name = `${lastName.trim()} ${givenName.trim()}`;

    try {
      const res = await fetch('/api/v1/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email: email.toLowerCase(), password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMsg({ text: 'Táº¡o tÃ i khoáº£n thÃ nh cÃ´ng! Vui lÃ²ng kiá»m tra email Äá» xÃ¡c nháº­n.', type: 'success' });
        // Chuyá»n sang login sau 2s, pre-fill email â giá»¯ y chang code cÅ©
        setTimeout(() => router.push(`/auth/login?email=${encodeURIComponent(email)}`), 2000);
      } else {
        setMsg({
          text: data.message ?? 'ÄÄng kÃ½ tháº¥t báº¡i. Email cÃ³ thá» ÄÃ£ ÄÆ°á»£c sá»­ dá»¥ng.',
          type: 'error',
        });
      }
    } catch {
      setMsg({ text: 'KhÃ´ng thá» káº¿t ná»i Äáº¿n mÃ¡y chá»§. Vui lÃ²ng thá»­ láº¡i.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Táº¡o tÃ i khoáº£n" subtitle="Miá»n phÃ­ mÃ£i mÃ£i. KhÃ´ng quáº£ng cÃ¡o. KhÃ´ng bÃ¡n dá»¯ liá»u.">
      {/* Google */}
      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
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
        Tiáº¿p tá»¥c vá»i Google
      </button>

      {/* Divider */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
        color: 'var(--gray)', fontSize: '0.78rem',
      }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }}/>
        hoáº·c
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }}/>
      </div>

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Há» + TÃªn trÃªn 1 hÃ ng â giá»¯ y chang form cÅ© */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AuthInput
            label="Há»"
            type="text"
            value={lastName}
            onChange={e => { setLastName(e.target.value); setErrors(p => ({...p, lastName: ''})); }}
            placeholder="Nguyá»n"
            autoComplete="family-name"
            error={errors.lastName}
            autoFocus
          />
          <AuthInput
            label="TÃªn"
            type="text"
            value={givenName}
            onChange={e => { setGivenName(e.target.value); setErrors(p => ({...p, givenName: ''})); }}
            placeholder="VÄn A"
            autoComplete="given-name"
            error={errors.givenName}
          />
        </div>

        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})); }}
          placeholder="ban@email.com"
          autoComplete="email"
          error={errors.email}
        />
        <AuthInput
          label="Máº­t kháº©u"
          showToggle
          value={password}
          onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})); }}
          placeholder="Ãt nháº¥t 8 kÃ½ tá»±"
          autoComplete="new-password"
          error={errors.password}
        />
        <AuthInput
          label="XÃ¡c nháº­n máº­t kháº©u"
          showToggle
          value={confirm}
          onChange={e => { setConfirm(e.target.value); setErrors(p => ({...p, confirm: ''})); }}
          placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
          autoComplete="new-password"
          error={errors.confirm}
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
            opacity: loading ? 0.7 : 1, marginTop: 2,
          }}
        >
          {loading ? 'Äang táº¡o tÃ i khoáº£nâ¦' : 'Táº¡o tÃ i khoáº£n'}
        </button>
      </form>

      <p style={{
        textAlign: 'center', fontSize: '0.83rem',
        color: 'var(--text-secondary)', marginTop: 20,
      }}>
        ÄÃ£ cÃ³ tÃ i khoáº£n?{' '}
        <Link href="/auth/login" style={{ color: 'var(--sage)', fontWeight: 600, textDecoration: 'none' }}>
          ÄÄng nháº­p
        </Link>
      </p>

      {/* Privacy note */}
      <p style={{
        textAlign: 'center', fontSize: '0.72rem',
        color: 'var(--gray)', marginTop: 14, lineHeight: 1.5,
      }}>
        Báº±ng cÃ¡ch ÄÄng kÃ½, báº¡n Äá»ng Ã½ vá»i{' '}
        <Link href="/pages/terms" style={{ color: 'var(--sage)' }}>Äiá»u khoáº£n</Link>
        {' '}vÃ {' '}
        <Link href="/pages/privacy" style={{ color: 'var(--sage)' }}>ChÃ­nh sÃ¡ch báº£o máº­t</Link> cá»§a chÃºng tÃ´i.
      </p>
    </AuthCard>
  );
}
