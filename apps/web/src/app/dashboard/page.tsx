'use client';
/**
 * Dashboard - the landing page after sign-in
 * Gives a genuine overview: Q balance, the three apps, and a curated look
 * at Tools (our only revenue source) - without being pushy about it.
 */
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useProfile } from '../../hooks/use-profile';
import { TOOLS } from '../../lib/tools-registry';

const SAGE = '#4a7c59';

const QIcon = ({ size = 16, color = SAGE }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size}>
    <defs><clipPath id="qDashClip"><circle cx="55" cy="55" r="32"/></clipPath></defs>
    <circle cx="55" cy="55" r="38" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"/>
    <line x1="81" y1="79" x2="98" y2="98" stroke={color} strokeWidth="9" strokeLinecap="round"/>
    <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
      fill="none" stroke={color} strokeWidth="4"
      strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qDashClip)"/>
  </svg>
);

const APPS = [
  { href: '/dashboard/nope',    name: 'Nope',     accent: SAGE,      desc: 'Real stories from real people' },
  { href: '/dashboard/cui-bap', name: 'Cùi Bắp', accent: '#f59e0b', desc: 'Private, end-to-end encrypted messaging' },
  { href: '/dashboard/lano',    name: 'LàNo',     accent: '#8b5cf6', desc: 'AI that listens' },
];

// A small, hand-picked set of Pro tools to surface here - not the whole catalog.
// Picking a mix of categories so the strip feels useful, not like a sales shelf.
const FEATURED_TOOL_SLUGS = ['image-editor', 'pdf-to-word', 'screenshot-translator', 'file-vault'];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { user, quota } = useProfile();

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to view your dashboard</p>
        <Link href="/auth/login?next=/dashboard" style={{
          padding: '10px 28px', background: SAGE, color: '#fff',
          borderRadius: 20, textDecoration: 'none', fontWeight: 600,
        }}>
          Sign in
        </Link>
      </div>
    );
  }

  const firstName = (user?.name ?? '').split(' ')[0] || 'there';
  const qExpiring  = quota?.expiring  ?? 0;
  const qPermanent = quota?.permanent ?? 0;
  const isPro      = quota?.isPro     ?? false;

  const featuredTools = FEATURED_TOOL_SLUGS
    .map(slug => TOOLS.find(t => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 20px 96px' }}>

      {/* Welcome header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 3.5vw, 1.9rem)', fontWeight: 800,
          color: 'var(--text)', letterSpacing: -0.5, marginBottom: 6,
        }}>
          Welcome back, {firstName}
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Here's what's going on in your Querencia account.
        </p>
      </div>

      {/* Q balance summary */}
      <Link href="/wallet" style={{ textDecoration: 'none' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderRadius: 16, marginBottom: 32,
          background: 'var(--bg)', border: '1.5px solid var(--border)',
          transition: 'border-color 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = SAGE)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <QIcon size={14} color="#b45309"/>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Expiring
                </span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>{qExpiring} Q</div>
            </div>
            <div style={{ width: 1, height: 36, background: 'var(--border)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <QIcon size={14}/>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: SAGE, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Permanent
                </span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>{qPermanent} Q</div>
            </div>
            {isPro && (
              <span style={{
                fontSize: '0.68rem', fontWeight: 700, color: SAGE,
                background: 'rgba(74,124,89,0.08)', padding: '4px 10px', borderRadius: 999,
              }}>
                ⭐ Pro active
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: SAGE, whiteSpace: 'nowrap' }}>
            {isPro ? 'View wallet' : 'Top up →'}
          </span>
        </div>
      </Link>

      {/* Your apps */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          Your apps
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {APPS.map(app => (
            <Link key={app.href} href={app.href} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '18px 20px', borderRadius: 14,
                background: 'var(--bg)', border: '1.5px solid var(--border)',
                borderLeft: `3px solid ${app.accent}`,
                height: '100%', transition: 'border-color 0.15s, transform 0.15s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = app.accent;
                  (e.currentTarget as HTMLDivElement).style.borderLeftColor = app.accent;
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLDivElement).style.borderLeftColor = app.accent;
                  (e.currentTarget as HTMLDivElement).style.transform = '';
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '1rem', color: app.accent, marginBottom: 4 }}>
                  {app.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {app.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Tools
          </h2>
          <Link href="/tools" style={{ fontSize: '0.8rem', fontWeight: 600, color: SAGE, textDecoration: 'none' }}>
            See all tools →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {featuredTools.map(tool => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '16px 18px', borderRadius: 12,
                background: 'var(--bg)', border: '1.5px solid var(--border)',
                height: '100%', transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = SAGE)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontSize: '1.3rem' }}>{tool.emoji}</span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    background: 'rgba(74,124,89,0.08)', color: SAGE,
                    padding: '2px 7px', borderRadius: 999,
                  }}>
                    {tool.qCost} Q
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', marginBottom: 3 }}>
                  {tool.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {tool.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
