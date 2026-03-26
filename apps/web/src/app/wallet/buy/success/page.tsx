'use client';
import Link from 'next/link';
import { useSearchParams, Suspense } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const days = searchParams.get('days') ?? '?';
  return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--text)' }}>
        Mua thành công!
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
        {days} ngày Pro đã được kích hoạt.<br/>
        Q sẽ được cấp mỗi đầu ngày lúc 00:00 UTC.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/wallet" style={{
          padding: '10px 22px', background: '#4a7c59', color: '#fff',
          borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
        }}>Xem Q Wallet</Link>
        <Link href="/tools" style={{
          padding: '10px 22px', border: '1.5px solid var(--border)',
          color: 'var(--text)', borderRadius: 10, textDecoration: 'none',
          fontWeight: 600, fontSize: '0.9rem',
        }}>Dùng Tools</Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div/>}>
      <SuccessContent/>
    </Suspense>
  );
}
