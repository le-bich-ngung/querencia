'use client';
/**
 * Wallet Buy - /wallet/buy
 * Paddle Checkout for buying Pro days
 * $0.50/day flat, no discount, 1/7/30-day plans
 */
'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useProfile } from '../../../hooks/use-profile';

declare global {
  interface Window { Paddle?: any; }
}

const PRICE_PER_DAY = 0.50;
const PLANS = [
  { days: 1,  label: '1 day',   badge: null,      desc: 'Try it first - just $0.50' },
  { days: 7,  label: '7 days',  badge: 'Popular', desc: '1 week without worrying about paying again' },
  { days: 30, label: '30 days', badge: null,      desc: 'Saves you the most time' },
];

const QIcon = ({ size = 16, color = '#4a7c59' }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size}>
    <defs><clipPath id="qbuy"><circle cx="55" cy="55" r="32"/></clipPath></defs>
    <circle cx="55" cy="55" r="38" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"/>
    <line x1="81" y1="79" x2="98" y2="98" stroke={color} strokeWidth="9" strokeLinecap="round"/>
    <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
      fill="none" stroke={color} strokeWidth="4"
      strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qbuy)"/>
  </svg>
);

function BuyContent() {
  const { data: session } = useSession();
  const { token } = useProfile();
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultDays = parseInt(searchParams.get('days') ?? '7');
  const [selected, setSelected] = useState(
    PLANS.find(p => p.days === defaultDays) ? defaultDays : 7
  );
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [processing,   setProcessing]   = useState(false);

  // Load Paddle.js
  useEffect(() => {
    if (window.Paddle) { setPaddleLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.onload = () => {
      window.Paddle?.Environment.set(
        process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      );
      window.Paddle?.Initialize({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? '',
      });
      setPaddleLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  async function handleCheckout() {
    if (!session) { router.push('/auth/login?next=/wallet/buy'); return; }
    if (!paddleLoaded || !window.Paddle) return;
    setProcessing(true);

    try {
      // Create checkout session from server (server creates a custom price based on days)
      const res = await fetch('/api/v1/payments/create-checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ days: selected }),
      });
      const { checkoutId, priceId } = await res.json();

      // Open Paddle checkout overlay
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: { userId: (session as any).user?.id, days: selected },
        successUrl:  `${window.location.origin}/wallet/buy/success?days=${selected}`,
        settings: {
          theme:        'dark',
          locale:       'en',
          allowLogout:  false,
        },
        eventCallback: (data: any) => {
          if (data.name === 'checkout.completed') {
            router.push(`/wallet/buy/success?days=${selected}`);
          }
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  }

  const total = selected * PRICE_PER_DAY;
  const qExpiring  = selected * 10;
  const qPermanent = selected * 1;

  if (!session) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
          Sign in to buy Q Pro
        </p>
        <Link href={`/auth/login?next=/wallet/buy?days=${selected}`} style={{
          padding: '10px 24px', background: '#4a7c59', color: '#fff',
          borderRadius: 10, textDecoration: 'none', fontWeight: 700,
        }}>Sign in</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 20px 96px' }}>
      <Link href="/pricing" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none', display: 'block', marginBottom: 20 }}>
        ← View pricing details
      </Link>

      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 6, color: 'var(--text)' }}>
        Buy Q Pro
      </h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 28 }}>
        $0.50/day · 10Q expiring + 1Q permanent per day
      </p>

      {/* Plan selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {PLANS.map(plan => (
          <button key={plan.days} onClick={() => setSelected(plan.days)} style={{
            padding: '16px 18px', borderRadius: 12, textAlign: 'left',
            border: `2px solid ${selected === plan.days ? '#4a7c59' : 'var(--border)'}`,
            background: selected === plan.days ? 'rgba(74,124,89,0.04)' : 'var(--bg)',
            cursor: 'pointer', fontFamily: 'inherit', position: 'relative',
            transition: 'all 0.15s',
          }}>
            {plan.badge && (
              <span style={{
                position: 'absolute', top: -10, left: 14,
                background: '#4a7c59', color: '#fff',
                fontSize: '0.6rem', fontWeight: 800,
                padding: '2px 8px', borderRadius: 999,
              }}>{plan.badge}</span>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{plan.label}</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: selected === plan.days ? '#4a7c59' : 'var(--text)' }}>
                ${(plan.days * PRICE_PER_DAY).toFixed(2)}
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{plan.desc}</span>
          </button>
        ))}
      </div>

      {/* Q summary */}
      <div style={{
        padding: '16px', borderRadius: 12,
        background: 'var(--bg-surface)', marginBottom: 24,
        border: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Q expiring (24h)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <QIcon size={12} color="#b45309"/>
            <span style={{ fontWeight: 700, color: '#b45309', fontSize: '0.85rem' }}>{qExpiring} Q</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Q permanent</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <QIcon size={12}/>
            <span style={{ fontWeight: 700, color: '#4a7c59', fontSize: '0.85rem' }}>{qPermanent} Q</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleCheckout}
        disabled={!paddleLoaded || processing}
        style={{
          width: '100%', padding: '14px',
          background: '#4a7c59', color: '#fff',
          border: 'none', borderRadius: 12,
          fontFamily: 'inherit', fontWeight: 700, fontSize: '1rem',
          cursor: paddleLoaded ? 'pointer' : 'not-allowed',
          opacity: paddleLoaded ? 1 : 0.7,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { if (paddleLoaded) e.currentTarget.style.background = '#2d5a3d'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#4a7c59'; }}
      >
        {!paddleLoaded ? 'Loading...' : processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>

      <p style={{ fontSize: '0.72rem', color: 'var(--gray)', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
        No auto-renewal · Full refund for unused days · Transaction fees are your responsibility
      </p>
    </div>
  );
}

export default function BuyPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>}>
      <BuyContent/>
    </Suspense>
  );
}
