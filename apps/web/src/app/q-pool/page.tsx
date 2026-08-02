'use client';
/**
 * Q Pool - gifted to the community
 * Anyone with Q about to expire can gift it - users worldwide can claim it
 */
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const QSymbol = ({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size}>
    <defs><clipPath id="qPoolClip"><circle cx="55" cy="55" r="32"/></clipPath></defs>
    <circle cx="55" cy="55" r="38" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"/>
    <line x1="81" y1="79" x2="98" y2="98" stroke={color} strokeWidth="9" strokeLinecap="round"/>
    <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
      fill="none" stroke={color} strokeWidth="4"
      strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qPoolClip)"/>
  </svg>
);

// Mock data - will be replaced with a real API
const MOCK_POOL = [
  { id: '1', amount: 2, type: 'expiring',  expiresIn: '1h 42m', donor: null,     claimed: 0 },
  { id: '2', amount: 1, type: 'expiring',  expiresIn: '2h 15m', donor: 'An N.',  claimed: 3 },
  { id: '3', amount: 1, type: 'permanent', expiresIn: null,      donor: null,     claimed: 0 },
  { id: '4', amount: 2, type: 'expiring',  expiresIn: '0h 28m', donor: 'Minh T.', claimed: 1 },
];

export default function QPoolPage() {
  const { data: session } = useSession();
  const [claimed, setClaimed] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleClaim(id: string) {
    if (!session) return;
    setLoading(id);

    // Use mock data until the real API is ready
    await new Promise(r => setTimeout(r, 800));
    setClaimed(c => [...c, id]);
    setLoading(null);

    // TODO: uncomment this once the real API is ready
    // const token = (session as any).accessToken;
    // const res = await fetch(`/api/v1/q-pool/${id}/claim`, {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // if (res.ok) {
    //   setClaimed(c => [...c, id]);
    // }
    // setLoading(null);
  }

  const available = MOCK_POOL.filter(p => !claimed.includes(p.id));

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 96px' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#4a7c59', marginBottom: 12,
        }}>
          <QSymbol size={20} color="#4a7c59"/>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: -0.5 }}>
            Q Pool
          </h1>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 6 }}>
          Q gifted by the community - anyone who needs it can claim it. 1-2 Q per claim.
          Expiring Q expires 24h after it's granted to the donor.
        </p>
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'flex', gap: 20, padding: '14px 18px',
        background: 'var(--bg-surface)', borderRadius: 12,
        marginBottom: 28, border: '1px solid var(--border)',
      }}>
        {[
          { label: 'Q available', value: `${available.length * 1.5}` },
          { label: 'In the pool', value: `${available.length}` },
          { label: 'Claimed today', value: '47' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4a7c59' }}>{s.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pool items */}
      {available.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 24px',
          color: 'var(--text-secondary)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🌿</div>
          <p style={{ fontSize: '0.9rem' }}>Pool is empty. Check back later!</p>
          <p style={{ fontSize: '0.78rem', marginTop: 8, color: 'var(--gray)' }}>
            Q is gifted regularly by users whose Q is about to expire.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {available.map(item => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 20px',
              border: '1.5px solid var(--border)', borderRadius: 14,
              background: 'var(--bg)',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#4a7c59')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {/* Q badge */}
              <div style={{
                width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                background: item.type === 'permanent'
                  ? 'rgba(74,124,89,0.1)'
                  : 'rgba(249,168,37,0.1)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 2,
              }}>
                <QSymbol
                  size={20}
                  color={item.type === 'permanent' ? '#4a7c59' : '#b45309'}
                />
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700,
                  color: item.type === 'permanent' ? '#4a7c59' : '#b45309',
                }}>
                  {item.amount}Q
                </span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                    {item.amount} Q
                  </span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 600,
                    background: item.type === 'permanent'
                      ? 'rgba(74,124,89,0.1)'
                      : '#fef3c7',
                    color: item.type === 'permanent' ? '#4a7c59' : '#92400e',
                    padding: '1px 6px', borderRadius: 999,
                  }}>
                    {item.type === 'permanent' ? 'no expiry' : `expires ${item.expiresIn}`}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {item.donor ? `Gifted by ${item.donor}` : 'Anonymous gift'}
                  {item.claimed > 0 && ` · ${item.claimed} people claimed`}
                </div>
              </div>

              {/* Claim button */}
              {session ? (
                <button
                  onClick={() => handleClaim(item.id)}
                  disabled={!!loading}
                  style={{
                    padding: '8px 18px', borderRadius: 9,
                    background: loading === item.id ? 'var(--bg-surface)' : '#4a7c59',
                    color: loading === item.id ? 'var(--text)' : '#fff',
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', fontSize: '0.82rem',
                    fontWeight: 600, transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                >
                  {loading === item.id ? '...' : 'Claim'}
                </button>
              ) : (
                <Link href="/auth/login" style={{
                  padding: '8px 18px', borderRadius: 9,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none', fontSize: '0.82rem',
                  fontWeight: 600, flexShrink: 0,
                }}>
                  Sign in
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CTA: gift Q */}
      {session && (
        <div style={{
          marginTop: 32, padding: '20px 24px',
          background: 'rgba(74,124,89,0.05)',
          border: '1px solid rgba(74,124,89,0.15)',
          borderRadius: 14, textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
            Have Q about to expire? Gift it to the community 🌿
          </p>
          <Link href="/wallet/gift?pool=true" style={{
            fontSize: '0.82rem', fontWeight: 600,
            color: '#4a7c59', textDecoration: 'none',
          }}>
            Gift Q to the Pool →
          </Link>
        </div>
      )}
    </div>
  );
}
