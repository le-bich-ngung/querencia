'use client';
import Link from 'next/link';

export function GlobalFooter() {
  var SAGE = '#4a7c59';
  var animStyle = { strokeDasharray: 160, animation: 'waveRun 2s linear infinite' };
  return (
    <footer style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '14px 24px', background: '#fafaf8' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="13 13 86 86" width="17" height="17" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
            <defs><clipPath id="qcfoot"><circle cx="55" cy="55" r="32"/></clipPath></defs>
            <circle cx="55" cy="55" r="38" fill="none" stroke={SAGE} strokeWidth="7" strokeLinecap="round"/>
            <line x1="81" y1="79" x2="98" y2="98" stroke={SAGE} strokeWidth="7" strokeLinecap="round"/>
            <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
              fill="none" stroke={SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              clipPath="url(#qcfoot)" style={animStyle}/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1, verticalAlign: 'middle', letterSpacing: -0.2 }}>
            <span style={{ color: '#111', opacity: 0.45 }}>ueren</span><span style={{ color: SAGE }}>cia</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: '#bbb', marginLeft: 8 }}>© 2026 · All rights reserved</span>
        </div>

        <span style={{ fontSize: '0.7rem', color: '#aaa', textAlign: 'center', flex: 1, padding: '0 16px' }}>
          Querencia không quảng cáo và không bán dữ liệu. Nguồn thu duy nhất đến từ các công cụ trả phí.
        </span>

        <div style={{ display: 'flex', gap: 14 }}>
          {[
            { label: 'Privacy', href: '/pages/privacy' },
            { label: 'Security', href: '/pages/security' },
            { label: 'Terms', href: '/pages/terms' },
          ].map(function(l) {
            return (
              <Link key={l.label} href={l.href}
                style={{ fontSize: '0.75rem', color: '#999', textDecoration: 'none' }}
                onMouseEnter={function(e) { e.currentTarget.style.color = SAGE; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = '#999'; }}
              >{l.label}</Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
