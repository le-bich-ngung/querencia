'use client';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

// Logo SVG — kính lúp ECG từ code cũ
const QuerenciaLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="36" height="36">
    <defs><clipPath id="qClipAuth"><circle cx="55" cy="55" r="32"/></clipPath></defs>
    <circle cx="55" cy="55" r="38" fill="none" stroke="#4a7c59" strokeWidth="7" strokeLinecap="round"/>
    <line x1="81" y1="79" x2="98" y2="98" stroke="#4a7c59" strokeWidth="7" strokeLinecap="round"/>
    <polyline
      points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
      fill="none" stroke="#4a7c59" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round"
      clipPath="url(#qClipAuth)"
    />
  </svg>
);

export function AuthCard({ children, title, subtitle }: Props) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-warm)',
      padding: '24px 16px',
    }}>
      <div style={{
        background: 'var(--bg)',
        borderRadius: 18,
        padding: '40px 40px 36px',
        width: '100%',
        maxWidth: 440,
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          textDecoration: 'none', marginBottom: 28,
        }}>
          <QuerenciaLogo />
          <div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
              <span style={{ color: 'var(--text)' }}>ueren</span>
              <span style={{ color: 'var(--sage)' }}>cia</span>
            </span>
          </div>
        </Link>

        {/* Title */}
        <h1 style={{
          fontSize: '1.35rem', fontWeight: 700,
          letterSpacing: -0.5, marginBottom: subtitle ? 6 : 24,
          color: 'var(--text)',
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontSize: '0.85rem', color: 'var(--text-secondary)',
            marginBottom: 24, lineHeight: 1.5,
          }}>
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
