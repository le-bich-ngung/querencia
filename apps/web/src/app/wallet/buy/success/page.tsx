'use client';
export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const days = searchParams.get('days') ?? '?';
  return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
        Mua thanh cong!
      </h1>
      <p style={{ marginBottom: 24, lineHeight: 1.6 }}>
        {days} ngay Pro da duoc kich hoat.
      </p>
      <Link href="/wallet">Xem Q Wallet</Link>
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
