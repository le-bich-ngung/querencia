ï»¿'use client';
import { useState, useRef, useEffect } from 'react';
import { useI18n, LOCALES } from '../lib/i18n';
import Link            from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useProfile }  from '../hooks/use-profile';
import { usePathname } from 'next/navigation';

// Animated logo â wave cháº¡y liÃªn tá»¥c
const AnimatedLogo = ({ size = 22, color = '#4a7c59' }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" width={size} height={size} style={{ flexShrink: 0 }}>
    <style>{`
      @keyframes waveRun {
        0%   { stroke-dashoffset: 160; }
        100% { stroke-dashoffset: -160; }
      }
      .qw { stroke-dasharray: 160; animation: waveRun 2s linear infinite; }
    `}</style>
    <defs><clipPath id="qClipNav"><circle cx="55" cy="55" r="32"/></clipPath></defs>
    <circle cx="55" cy="55" r="38" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/>
    <line x1="81" y1="79" x2="98" y2="98" stroke={color} strokeWidth="7" strokeLinecap="round"/>
    <polyline className="qw" points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
      fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      clipPath="url(#qClipNav)"/>
  </svg>
);

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { user, quota }   = useProfile();
  const { locale, setLocale, t } = useI18n();
  const [dropOpen, setDrop]   = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (pathname.startsWith('/auth')) return null;

  const name  = user?.name ?? session?.user?.name ?? '';
  const plan  = user?.plan ?? 'free';
  const totalQ = (quota?.expiring ?? 0) + (quota?.permanent ?? 0);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      height: 54, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 20px',
      background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
    }}>

      {/* Logo + wordmark + slogan */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
        <AnimatedLogo size={22} color="#4a7c59" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, lineHeight: 1 }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: -0.3, lineHeight: 1.1 }}>
            <span style={{ color: 'var(--text, #111)' }}>ueren</span>
            <span style={{ color: '#4a7c59' }}>cia</span>
          </span>
          <span style={{ fontSize: '0.58rem', color: '#4a7c59', fontWeight: 500, letterSpacing: '0.04em', opacity: 0.75, lineHeight: 1 }}>
            Tech and more
          </span>
        </div>
      </Link>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* ð Language switcher */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button onClick={() => setLangOpen(o => !o)} title="Language" style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'none', border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 8, padding: '4px 9px', cursor: 'pointer',
            fontSize: '0.78rem', color: '#666', transition: 'all 0.15s',
          }}>
            ð <span style={{ fontSize: '0.9rem' }}>{LOCALES.find(l => l.code === locale)?.flag}</span>
          </button>
          {langOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              padding: 6, zIndex: 300, minWidth: 160,
            }}>
              {LOCALES.map(l => (
                <button key={l.code} onClick={() => { setLocale(l.code); setLangOpen(false); }} style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '8px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: locale === l.code ? 'rgba(74,124,89,0.08)' : 'transparent',
                  color: locale === l.code ? '#4a7c59' : '#333',
                  fontWeight: locale === l.code ? 600 : 400,
                  fontSize: '0.83rem', textAlign: 'left',
                }}>
                  <span>{l.flag}</span><span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing */}
        <Link href="/pricing" style={{
          fontSize: '0.82rem', color: '#666', textDecoration: 'none',
          padding: '5px 10px', borderRadius: 7, transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f3'; e.currentTarget.style.color = '#111'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#666'; }}
        >{t('nav.pricing')}</Link>

        {session ? (
          <div ref={dropRef} style={{ position: 'relative' }}>
            <button onClick={() => setDrop(o => !o)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'none', border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 9, padding: '5px 10px', cursor: 'pointer',
              fontSize: '0.82rem', color: '#333',
            }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#4a7c59', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>
                {(name?.[0] ?? '?').toUpperCase()}
              </div>
              {totalQ > 0 && (
                <span style={{ fontSize: '0.72rem', color: '#4a7c59', fontWeight: 600 }}>{totalQ}Q</span>
              )}
            </button>
            {dropOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                padding: 6, zIndex: 200, minWidth: 180,
              }}>
                {[
                  { label: 'Dashboard', href: '/dashboard/nope' },
                  { label: 'Settings', href: '/settings' },
                  { label: 'Q Wallet', href: '/wallet' },
                  { label: 'Pricing', href: '/pricing' },
                ].map(item => (
                  <Link key={item.label} href={item.href} style={{
                    display: 'block', padding: '8px 12px', borderRadius: 7,
                    textDecoration: 'none', fontSize: '0.83rem', color: '#333',
                    transition: 'background 0.1s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f3')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >{item.label}</Link>
                ))}
                <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '4px 0' }}/>
                <button onClick={() => signOut()} style={{
                  display: 'block', width: '100%', padding: '8px 12px', borderRadius: 7,
                  textAlign: 'left', border: 'none', background: 'none',
                  fontSize: '0.83rem', color: '#e53e3e', cursor: 'pointer',
                }}>Sign out</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link href="/auth/login" style={{ fontSize: '0.82rem', color: '#666', textDecoration: 'none', padding: '5px 10px' }}>
              {t('nav.signin')}
            </Link>
            <Link href="/auth/register" style={{
              fontSize: '0.82rem', fontWeight: 600, color: '#fff',
              background: '#4a7c59', borderRadius: 8, padding: '6px 14px',
              textDecoration: 'none', transition: 'all 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#3d6b4a')}
              onMouseLeave={e => (e.currentTarget.style.background = '#4a7c59')}
            >{t('nav.getstarted')}</Link>
          </>
        )}
      </div>
    </header>
  );
}
