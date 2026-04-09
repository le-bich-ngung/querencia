'use client';
import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

export function GlobalFooter() {
  var SAGE = '#4a7c59';
  var i18n = useI18n();
  var t = i18n.t;

  return (
    <footer style={{ borderTop: '1px solid rgba(0,0,0,0.07)', background: '#fafaf8', padding: '28px 24px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>

          {/* Logo + wordmark */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="22 22 72 72" width="13" height="13"
              style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'baseline', position: 'relative', top: '1px', marginRight: '0.15em' }}>
              <defs><clipPath id="qcfoot"><circle cx="55" cy="55" r="26"/></clipPath></defs>
              <circle cx="55" cy="55" r="30" fill="none" stroke={SAGE} strokeWidth="6" strokeLinecap="round"/>
              <line x1="75" y1="75" x2="88" y2="88" stroke={SAGE} strokeWidth="6" strokeLinecap="round"/>
              <polyline points="26,55 33,41 40,65 47,34 53,57 59,43 65,66 71,48 84,55"
                fill="none" stroke={SAGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                clipPath="url(#qcfoot)"/>
            </svg>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'baseline' }}>
              <span style={{ color: '#111', opacity: 0.45 }}>ueren</span>
              <span style={{ color: SAGE }}>c</span>
              <span style={{ color: SAGE }}>i</span>
              <span style={{ color: SAGE }}>a</span>
            </span>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {[
              { label: 'Privacy', href: '/pages/privacy' },
              { label: 'Security', href: '/pages/security' },
              { label: 'Terms', href: '/pages/terms' },
            ].map(function(l) {
              return (
                <Link key={l.label} href={l.href} style={{ fontSize: '0.75rem', color: '#999', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = SAGE; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = '#999'; }}
                >{l.label}</Link>
              );
            })}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 12 }}>
          <span style={{ fontSize: '0.72rem', color: '#aaa' }}>
            Querencia không hiển thị quảng cáo và luôn tôn trọng quyền riêng tư của bạn.
          </span>
          <span style={{ fontSize: '0.7rem', color: '#ccc' }}>© 2026 Querencia · All rights reserved</span>
        </div>

      </div>
    </footer>
  );
}
