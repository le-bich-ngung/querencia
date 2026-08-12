import React from 'react';
import Link from 'next/link';

const SAGE = '#4a7c59';

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 96px' }}>
      <Link
        href="/"
        style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}
      >
        ← Back to home
      </Link>
      <h1
        style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.1rem)',
          fontWeight: 800,
          letterSpacing: -0.5,
          color: 'var(--text)',
          marginBottom: 8,
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 40 }}>
        Last updated: {lastUpdated}
      </p>
      <div style={{ fontSize: '0.92rem', lineHeight: 1.75, color: 'var(--text)' }}>
        {children}
      </div>
    </div>
  );
}

export function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      style={{
        fontSize: '1.25rem',
        fontWeight: 800,
        color: 'var(--text)',
        marginTop: 40,
        marginBottom: 14,
        letterSpacing: -0.3,
        scrollMarginTop: 24,
      }}
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: '1.02rem',
        fontWeight: 700,
        color: SAGE,
        marginTop: 26,
        marginBottom: 10,
      }}
    >
      {children}
    </h3>
  );
}

export function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ marginBottom: 14, color: 'var(--text-secondary)', ...style }}>{children}</p>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul style={{ paddingLeft: 20, marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {children}
    </ul>
  );
}

export function LI({ children }: { children: React.ReactNode }) {
  return <li style={{ color: 'var(--text-secondary)' }}>{children}</li>;
}

export function HR() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '32px 0' }} />;
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 20 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>{children}</table>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: 'left',
        padding: '8px 12px',
        borderBottom: '2px solid var(--border)',
        color: 'var(--text)',
        fontWeight: 700,
      }}
    >
      {children}
    </th>
  );
}

export function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
      {children}
    </td>
  );
}

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 40,
        padding: '16px 18px',
        borderRadius: 12,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        fontStyle: 'italic',
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: 'var(--text)', fontWeight: 700 }}>{children}</strong>;
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ color: SAGE, fontWeight: 600, textDecoration: 'none' }}>
      {children}
    </Link>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        background: 'var(--bg-surface)',
        padding: '2px 6px',
        borderRadius: 4,
        fontSize: '0.85em',
        fontFamily: 'monospace',
      }}
    >
      {children}
    </code>
  );
}
