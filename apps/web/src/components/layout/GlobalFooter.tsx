'use client';
import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

export function GlobalFooter() {
  var SAGE = '#4a7c59';
  var i18n = useI18n();
  var t = i18n.t;

  return (
    <footer style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '14px 24px', background: '#fafaf8' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="22 22 72 72" width="13" height="13" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'text-bottom', marginRight: 0 }}>
            <defs><clipPath id="qcfoot"><circle cx="55" cy="55" r="26"/></clipPath></defs>
            <circle cx="55" cy="55" r="30" fill="none" stroke={SAGE} strokeWidth="6" strokeLinecap="round"/>
            <line x1="75" y1="75" x2="88" y2="88" stroke={SAGE} strokeWidth="6" strokeLinecap="round"/>
            <polyline points="26,55 33,41 40,65 47,34 53,57 59,43 65,66 71,48 84,55"
              fill="none" stroke={SAGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              clipPath="url(#qcfoot)"/>
          </svg>
          <span style={{ fontWeight: 300, fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', lineHeight: 1, letterSpacing: -0.2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, display: 'inline-flex', alignItems: 'baseline' }}><span style={{ color: '#111', opacity: 0.45 }}>ueren</span><span style={{ color: SAGE }}>c</span><span style={{ position: 'relative', display: 'inline-block', color: SAGE }}>i<svg style={{ position: 'absolute', left: '56%', top: '0.12em', transform: 'translateX(-50%)', width: '0.20em', height: '0.20em' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ef4444"/></svg></span><span style={{ color: SAGE }}>a</span></span>
          </span>
          <span style={{ fontSize: '0.7rem', color: '#bbb', marginLeft: 10 }}>© 2026 · All rights reserved</span>
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