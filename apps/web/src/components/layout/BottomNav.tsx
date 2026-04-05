'use client';
/**
 * Bottom Navigation — cố định, luôn hiển thị
 * 5 tab: Home · Apps · Tools · Read · Account
 *
 * Apps    → sub-menu: Nope, Cùi Bắp, LàNo
 * Account → profile, Q wallet, Message (feedback 1 chiều), settings, pricing, logout
 */
import { useState }    from 'react';
import Link            from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useProfile }  from '../../hooks/use-profile';

// ── Icons ─────────────────────────────────────────────────────
type IconProps = { active: boolean };

const HomeIcon = ({ active }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'} stroke="currentColor"
    strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    {!active && <path d="M9 22V12h6v10"/>}
  </svg>
);

const AppsIcon = ({ active }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'} stroke="currentColor"
    strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);

const ToolsIcon = ({ active }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
      fill={active ? 'currentColor' : 'none'}/>
  </svg>
);

const ReadIcon = ({ active }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'} stroke="currentColor"
    strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);

const AccountIcon = ({ active }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'} stroke="currentColor"
    strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

// ── Q Logo ────────────────────────────────────────────────────
const QSymbol = ({ size = 13, color = '#4a7c59' }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size}>
    <defs><clipPath id="qBNav"><circle cx="55" cy="55" r="32"/></clipPath></defs>
    <circle cx="55" cy="55" r="38" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"/>
    <line x1="81" y1="79" x2="98" y2="98" stroke={color} strokeWidth="9" strokeLinecap="round"/>
    <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
      fill="none" stroke={color} strokeWidth="4"
      strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qBNav)"/>
  </svg>
);

// ── Main component ────────────────────────────────────────────
export function BottomNav() {
  const pathname            = usePathname();
  const { data: session }   = useSession();
  const { user, quota }     = useProfile();
  const [appsOpen, setApps] = useState(false);
  const [acctOpen, setAcct] = useState(false);

  // Ẩn ở auth pages
  if (pathname.startsWith('/auth')) return null;

  const name       = user?.name ?? session?.user?.name ?? '';
  const plan       = user?.plan ?? 'free';
  const qExpiring  = quota?.expiring  ?? 0;
  const qPermanent = quota?.permanent ?? 0;
  const totalQ     = qExpiring + qPermanent;

  const isActive = (prefix: string) =>
    prefix === '/' ? pathname === '/' : pathname.startsWith(prefix);

  const appsActive = ['/dashboard/nope', '/dashboard/cui-bap', '/dashboard/lano']
    .some(p => pathname.startsWith(p));
  const acctActive = ['/settings', '/wallet', '/pricing', '/q-pool', '/message']
    .some(p => pathname.startsWith(p));

  // Close drawers on backdrop click
  const closeAll = () => { setApps(false); setAcct(false); };

  return (
    <>
      {/* Spacer */}
      <div style={{ height: 52 }}/>

      {/* Q strip — chỉ hiện khi logged in và có Q */}
      {session && totalQ > 0 && (
        <div style={{
          position: 'fixed', bottom: 52, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', zIndex: 99,
          pointerEvents: 'none',
        }}>
          <Link href="/wallet" style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(15,15,13,0.82)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(74,124,89,0.3)',
            borderRadius: 999, padding: '4px 12px 4px 8px',
            textDecoration: 'none', pointerEvents: 'all',
            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
          }}>
            <QSymbol size={12}/>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f0efeb' }}>
              {totalQ} Q
            </span>
            {qExpiring > 0 && (
              <span style={{
                fontSize: '0.6rem', color: 'rgba(240,239,235,0.45)',
                borderLeft: '1px solid rgba(255,255,255,0.12)',
                paddingLeft: 6, marginLeft: 1,
              }}>
                {qExpiring} hết hạn
              </span>
            )}
          </Link>
        </div>
      )}

      {/* Backdrop for drawers */}
      {(appsOpen || acctOpen) && (
        <div
          onClick={closeAll}
          style={{
            position: 'fixed', inset: 0, zIndex: 101,
            background: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Apps drawer */}
      {appsOpen && (
        <div style={{
          position: 'fixed', bottom: 58, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 102, width: 'min(340px, calc(100vw - 32px))',
          background: 'var(--bg)',
          border: '1.5px solid var(--border)',
          borderRadius: 18,
          boxShadow: '0 -4px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          animation: 'slideUpDrawer 0.22s cubic-bezier(0.34,1.3,0.64,1) both',
        }}>
          <style>{`@keyframes slideUpDrawer{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
          <div style={{
            padding: '14px 16px 10px',
            fontSize: '0.68rem', fontWeight: 700,
            color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.06em',
            borderBottom: '1px solid var(--border)',
          }}>
            Apps
          </div>
          {[
            { href: '/dashboard/nope',    emoji: '🌿', name: 'Nope',     desc: 'Chia sẻ kinh nghiệm sống' },
            { href: '/dashboard/cui-bap', emoji: '🌽', name: 'Cùi Bắp', desc: 'Nhắn tin riêng tư' },
            { href: '/dashboard/lano',    emoji: '🎧', name: 'LàNo',     desc: 'AI lắng nghe bạn' },
          ].map(app => (
            <Link
              key={app.href}
              href={app.href}
              onClick={closeAll}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border)',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <span style={{
                width: 42, height: 42, borderRadius: 12,
                background: 'var(--bg-surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', flexShrink: 0,
              }}>
                {app.emoji}
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                  {app.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 1 }}>
                  {app.desc}
                </div>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--gray)', fontSize: '0.85rem' }}>›</span>
            </Link>
          ))}
        </div>
      )}

      {/* Account drawer */}
      {acctOpen && (
        <div style={{
          position: 'fixed', bottom: 58, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 102, width: 'min(340px, calc(100vw - 32px))',
          background: 'var(--bg)',
          border: '1.5px solid var(--border)',
          borderRadius: 18,
          boxShadow: '0 -4px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          animation: 'slideUpDrawer 0.22s cubic-bezier(0.34,1.3,0.64,1) both',
        }}>

          {session ? (
            <>
              {/* User info */}
              <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: '#4a7c59', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', fontWeight: 700, flexShrink: 0,
                  }}>
                    {name[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                      {name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray)', marginTop: 1 }}>
                      {session.user?.email}
                    </div>
                  </div>
                  {/* Q + plan */}
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    {totalQ > 0 && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        justifyContent: 'flex-end', marginBottom: 4,
                      }}>
                        <QSymbol size={11}/>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a7c59' }}>
                          {totalQ} Q
                        </span>
                      </div>
                    )}
                    <span style={{
                      fontSize: '0.62rem', fontWeight: 700,
                      background: plan === 'free'
                        ? 'rgba(74,124,89,0.1)' : '#fff3cd',
                      color: plan === 'free' ? '#4a7c59' : '#856404',
                      padding: '2px 7px', borderRadius: 999,
                    }}>
                      {plan === 'free' ? 'Free' : '⭐ Pro'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              {[
                { href: '/wallet',           icon: '🔮', label: 'Q Wallet', sub: `${totalQ} Q còn lại` },
                { href: '/pricing',          icon: '⭐', label: 'Nâng cấp Pro', sub: '$0.50/ngày · 1/7/30 ngày' },
                { href: '/q-pool',           icon: '🎁', label: 'Q Pool', sub: 'Tặng Q cho cộng đồng' },
                { href: '/settings/profile', icon: '👤', label: 'Tài khoản', sub: 'Thông tin cá nhân' },
                { href: '/settings',         icon: '⚙️', label: 'Cài đặt', sub: 'Giao diện, thông báo' },
                { href: '/message',          icon: '✉️', label: 'Nhắn tin cho Querencia', sub: 'Gửi feedback · Không hồi âm' },
              ].map((item, i, arr) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeAll}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 18px',
                    textDecoration: 'none',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <span style={{ fontSize: '1.1rem', width: 24, textAlign: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 1 }}>
                      {item.sub}
                    </div>
                  </div>
                  <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>›</span>
                </Link>
              ))}

              {/* Logout */}
              <button
                onClick={() => { closeAll(); signOut({ callbackUrl: '/' }); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '12px 18px',
                  background: 'none', border: 'none',
                  borderTop: '1px solid var(--border)',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fdecea')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <span style={{ fontSize: '1.1rem', width: 24, textAlign: 'center' }}>🚪</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#c0392b' }}>
                  Đăng xuất
                </span>
              </button>
            </>
          ) : (
            /* Not logged in */
            <div style={{ padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{
                fontSize: '0.85rem', color: 'var(--text-secondary)',
                textAlign: 'center', marginBottom: 8,
              }}>
                Đăng nhập để dùng đầy đủ tính năng
              </p>
              <Link href="/auth/register" onClick={closeAll} style={{
                display: 'block', textAlign: 'center',
                padding: '12px', borderRadius: 10,
                background: '#4a7c59', color: '#fff',
                textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
              }}>
                Đăng ký miễn phí
              </Link>
              <Link href="/auth/login" onClick={closeAll} style={{
                display: 'block', textAlign: 'center',
                padding: '11px', borderRadius: 10,
                border: '1.5px solid var(--border)',
                color: 'var(--text)',
                textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
              }}>
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Bottom nav bar ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 52,
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        display: 'flex', alignItems: 'stretch',
        zIndex: 100,
      }}>
        {/* Home */}
        <TabLink
          href="/"
          label="Home"
          active={isActive('/')}
          onClick={closeAll}
          icon={<HomeIcon active={isActive('/')}/>}
        />

        {/* Apps */}
        <TabButton
          label="Apps"
          active={appsActive || appsOpen}
          onClick={() => { setAcct(false); setApps(o => !o); }}
          icon={<AppsIcon active={appsActive || appsOpen}/>}
        />

        {/* Tools */}
        <TabLink
          href="/tools"
          label="Tools"
          active={isActive('/tools')}
          onClick={closeAll}
          icon={<ToolsIcon active={isActive('/tools')}/>}
        />

        {/* Read */}
        <TabLink
          href="/read"
          label="Read"
          active={isActive('/read')}
          onClick={closeAll}
          icon={<ReadIcon active={isActive('/read')}/>}
        />

        {/* Account */}
        <TabButton
          label="Account"
          active={acctActive || acctOpen}
          onClick={() => { setApps(false); setAcct(o => !o); }}
          icon={<AccountIcon active={acctActive || acctOpen}/>}
          badge={!session ? undefined : totalQ > 0 ? undefined : undefined}
          showDot={!session} // dot nhắc chưa đăng nhập
        />
      </nav>
    </>
  );
}

// ── Tab sub-components ────────────────────────────────────────

function TabLink({ href, label, active, onClick, icon }: {
  href: string; label: string; active: boolean;
  onClick: () => void; icon: React.ReactNode;
}) {
  return (
    <Link href={href} onClick={onClick} style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 4, textDecoration: 'none',
      color: active ? '#4a7c59' : '#888882',
      transition: 'color 0.15s',
      position: 'relative',
      WebkitTapHighlightColor: 'transparent',
    }}>
      {active && <ActiveBar/>}
      {icon}
    </Link>
  );
}

function TabButton({ label, active, onClick, icon, showDot }: {
  label: string; active: boolean; onClick: () => void;
  icon: React.ReactNode; badge?: number; showDot?: boolean;
}) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 4, border: 'none', background: 'none',
      color: active ? '#4a7c59' : '#888882',
      cursor: 'pointer', position: 'relative',
      transition: 'color 0.15s',
      WebkitTapHighlightColor: 'transparent',
      fontFamily: 'inherit',
    }}>
      {active && <ActiveBar/>}
      <div style={{ position: 'relative' }}>
        {icon}
        {showDot && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            width: 7, height: 7, borderRadius: '50%',
            background: '#4a7c59',
            border: '1.5px solid #fff',
          }}/>
        )}
      </div>
    </button>
  );
}

const ActiveBar = () => (
  <div style={{
    position: 'absolute', top: 0, left: '50%',
    transform: 'translateX(-50%)',
    width: 28, height: 3,
    background: '#4a7c59',
    borderRadius: '0 0 3px 3px',
  }}/>
);
