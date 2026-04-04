'use client';
/**
 * Top navbar — sau khi di chuyển nav links xuống bottom
 * Chỉ còn: Logo | [Q balance nếu logged in] | Auth button
 * Gọn, không chiếm không gian
 */
import { useState }    from 'react';
import Link            from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useProfile }  from '../hooks/use-profile';
import { usePathname } from 'next/navigation';

const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" width="22" height="22"
    style={{ flexShrink: 0, position: 'relative', top: 0 }}>
    <defs><clipPath id="qClipTopNav"><circle cx="55" cy="55" r="32"/></clipPath></defs>
    <circle cx="55" cy="55" r="38" fill="none" stroke="#4a7c59" strokeWidth="7" strokeLinecap="round"/>
    <line x1="81" y1="79" x2="98" y2="98" stroke="#4a7c59" strokeWidth="7" strokeLinecap="round"/>
    <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
      fill="none" stroke="#4a7c59" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qClipTopNav)"/>
  </svg>
);

export function Navbar() {
  const pathname           = usePathname();
  const { data: session, status } = useSession();
  const { user, quota }    = useProfile();
  const [dropOpen, setDrop] = useState(false);

  // Ẩn hoàn toàn ở auth pages (auth card có logo riêng)
  if (pathname.startsWith('/auth')) return null;

  const name       = user?.name ?? session?.user?.name ?? '';
  const plan       = user?.plan ?? 'free';
  const qExpiring  = quota?.expiring  ?? 0;
  const qPermanent = quota?.permanent ?? 0;
  const totalQ     = qExpiring + qPermanent;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      height: 54,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
    }}>
      {/* Logo */}
      <Link href="/" style={{
        display: 'flex', alignItems: 'center', gap: -2,
        textDecoration: 'none', color: 'inherit',
      }}>
        <Logo />
        <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>
          <span style={{ color: 'var(--text)' }}>ueren</span>
          <span style={{ color: '#4a7c59' }}>cia</span>
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Pricing link */}
        <Link href="/pricing" style={{
          fontSize: '0.8rem', color: 'var(--text-secondary)',
          textDecoration: 'none', fontWeight: 500,
          padding: '5px 10px', borderRadius: 7,
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--bg-surface)';
            e.currentTarget.style.color = 'var(--text)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          Pricing
        </Link>

        {status === 'loading' ? (
          <div style={{ width: 80, height: 32, borderRadius: 8, background: 'var(--bg-surface)' }}/>
        ) : session ? (
          /* Logged in: avatar + name dropdown */
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDrop(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '5px 10px 5px 5px',
                background: 'var(--bg-surface)', borderRadius: 999,
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#4a7c59', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
              }}>
                {name[0]?.toUpperCase() ?? '?'}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>
                {name.split(' ').pop()}
              </span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="var(--gray)" strokeWidth="2.5" strokeLinecap="round"
                style={{ transform: dropOpen ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {dropOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setDrop(false)}/>
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'var(--bg)', border: '1.5px solid var(--border)',
                  borderRadius: 12, minWidth: 200, zIndex: 200,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>{name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray)', marginTop: 2 }}>
                      {session.user?.email}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      {plan === 'free' ? (
                        <Link href="/pricing" onClick={() => setDrop(false)} style={{
                          fontSize: '0.68rem', background: 'rgba(74,124,89,0.1)',
                          color: '#4a7c59', padding: '2px 8px', borderRadius: 999,
                          fontWeight: 700, textDecoration: 'none',
                        }}>
                          Free — Nâng cấp
                        </Link>
                      ) : (
                        <span style={{
                          fontSize: '0.68rem', background: '#fff3cd',
                          color: '#856404', padding: '2px 8px',
                          borderRadius: 999, fontWeight: 700,
                        }}>
                          ⭐ Pro
                        </span>
                      )}
                    </div>
                  </div>
                  {[
                    { href: '/wallet',           label: '🔮 Q Wallet' },
                    { href: '/q-pool',            label: '🎁 Q Pool' },
                    { href: '/settings/profile',  label: '👤 Tài khoản' },
                    { href: '/settings',          label: '⚙️ Cài đặt' },
                    { href: '/pricing',           label: '⭐ Pricing' },
                  ].map(item => (
                    <Link key={item.href} href={item.href}
                      onClick={() => setDrop(false)}
                      style={{
                        display: 'block', padding: '9px 16px',
                        fontSize: '0.82rem', color: 'var(--text)',
                        textDecoration: 'none', transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={() => { setDrop(false); signOut({ callbackUrl: '/' }); }}
                      style={{
                        display: 'block', width: '100%',
                        padding: '9px 16px', textAlign: 'left',
                        fontSize: '0.82rem', color: '#c0392b',
                        background: 'none', border: 'none',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fdecea')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Not logged in */
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/auth/login" style={{
              padding: '6px 14px', borderRadius: 8,
              textDecoration: 'none', fontSize: '0.82rem',
              color: 'var(--text)', fontWeight: 500,
              border: '1.5px solid var(--border)',
            }}>
              Đăng nhập
            </Link>
            <Link href="/auth/register" style={{
              padding: '6px 14px', borderRadius: 8,
              textDecoration: 'none', fontSize: '0.82rem',
              color: '#fff', fontWeight: 600,
              background: '#4a7c59',
            }}>
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
