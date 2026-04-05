'use client';
import Link from 'next/link';

export function GlobalFooter() {
  var SAGE = '#4a7c59';
  return (
    <footer style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '14px 24px', background: '#fafaf8' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 3 }}>
              <circle cx="10" cy="10" r="7" fill="none" stroke={SAGE} strokeWidth="1.8"/>
              <line x1="15" y1="15" x2="21" y2="21" stroke={SAGE} strokeWidth="1.8" strokeLinecap="round"/>
              <polyline points="4,10 6,7 8,13 10,5 12,10 14,7 16,12 17,9 20,10"
                fill="none" stroke={SAGE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                clipPath="url(#fcl)"
                style={{ strokeDasharray: 40, animation: 'waveRun 2s linear infinite' }}/>
              <clipPath id="fcl"><circle cx="10" cy="10" r="7"/></clipPath>
            </svg>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1, verticalAlign: 'middle' }}>
              <span style={{ color: '#111', opacity: 0.45 }}>ueren</span>
              <span style={{ color: SAGE }}>cia</span>
            </span>
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
              <Link key={l.label} href={l.href} style={{ fontSize: '0.75rem', color: '#999', textDecoration: 'none' }}
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
