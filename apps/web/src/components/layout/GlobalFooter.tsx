'use client';
import Link from 'next/link';

export function GlobalFooter() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border, rgba(0,0,0,0.07))',
      padding: '16px 24px',
      background: 'var(--bg, #fafaf8)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8,
      }}>
        {/* Left: logo + copyright */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" width="18" height="18">
            <defs><clipPath id="qClipFoot"><circle cx="55" cy="55" r="32"/></clipPath></defs>
            <circle cx="55" cy="55" r="38" fill="none" stroke="#4a7c59" strokeWidth="7" strokeLinecap="round"/>
            <line x1="81" y1="79" x2="98" y2="98" stroke="#4a7c59" strokeWidth="7" strokeLinecap="round"/>
            <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
              fill="none" stroke="#4a7c59" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qClipFoot)"/>
          </svg>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text, #111)', letterSpacing: -0.2 }}>
            <span style={{ opacity: 0.45 }}>ueren</span>
            <span style={{ color: '#4a7c59' }}>cia</span>
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--gray, #999)', marginLeft: 4 }}>
            © 2026 Querencia · All rights reserved
          </span>
        </div>

        {/* Center: tagline */}
        <span style={{
          fontSize: '0.73rem', color: 'var(--gray, #aaa)',
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}>
          Querencia is ad-free and never sells your data. We're funded solely by our paid tools.
        </span>

        {/* Right: links */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {[
            { label: 'Privacy', href: '/pages/privacy' },
            { label: 'Security', href: '/pages/security' },
            { label: 'Terms', href: '/pages/terms' },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{
              fontSize: '0.78rem', color: 'var(--text-secondary, #888)',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#4a7c59')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary, #888)')}
            >{l.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
