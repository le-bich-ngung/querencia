'use client';
import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

export function GlobalFooter() {
  var SAGE = '#4a7c59';
  var i18n = useI18n();
  var t = i18n.t;

  return (
    <footer style={{ borderTop: '1px solid rgba(0,0,0,0.07)', background: '#fafaf8', padding: '14px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>

        {/* Left: logo + copyright + links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Logo wordmark */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="22 22 72 72" width="12" height="12"
              style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'baseline', position: 'relative', top: '1px', marginRight: 1 }}>
              <defs><clipPath id="qcfoot"><circle cx="55" cy="55" r="26"/></clipPath></defs>
              <circle cx="55" cy="55" r="30" fill="none" stroke={SAGE} strokeWidth="6" strokeLinecap="round"/>
              <line x1="75" y1="75" x2="88" y2="88" stroke={SAGE} strokeWidth="6" strokeLinecap="round"/>
              <polyline points="26,55 33,41 40,65 47,34 53,57 59,43 65,66 71,48 84,55"
                fill="none" stroke={SAGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                clipPath="url(#qcfoot)"/>
            </svg>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, fontSize: '0.82rem' }}>
              <span style={{ color: '#111', opacity: 0.4 }}>ueren</span>
              <span style={{ color: SAGE }}>cia</span>
            </span>
          </div>

          {/* Copyright */}
          <span style={{ fontSize: '0.7rem', color: '#ccc' }}>{t('footer.rights')}</span>

          {/* Links */}
          {/* NOTE: intentionally plain text (not <Link>) until the legal pages are
              ready for public launch (company registration pending). Once ready,
              change this back to map over an array of <Link> like before. */}
          <div style={{ display: 'flex', gap: 10 }}>
            {['Privacy', 'Security', 'Terms'].map(function(label) {
              return (
                <span key={label}
                  style={{ fontSize: '0.72rem', color: SAGE, opacity: 0.5 }}
                >{label}</span>
              );
            })}
          </div>
        </div>

        {/* Right: tagline */}
        <span style={{ fontSize: '0.7rem', color: '#bbb' }}>
          {t('footer.tagline')}
        </span>

      </div>
    </footer>
  );
}
