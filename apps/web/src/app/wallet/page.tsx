'use client';
/**
 * Q Wallet - xem số dư, lịch sử, tặng Q
 * /wallet
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useProfile } from '../../hooks/use-profile';

const SAGE = '#4a7c59';

const QIcon = ({ size = 18, color = SAGE }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size}>
    <defs><clipPath id="qw"><circle cx="55" cy="55" r="32"/></clipPath></defs>
    <circle cx="55" cy="55" r="38" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"/>
    <line x1="81" y1="79" x2="98" y2="98" stroke={color} strokeWidth="9" strokeLinecap="round"/>
    <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
      fill="none" stroke={color} strokeWidth="4"
      strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qw)"/>
  </svg>
);

export default function WalletPage() {
  const { data: session } = useSession();
  const { user, quota, token } = useProfile();
  const [history, setHistory]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [giftTarget, setGift]   = useState('');
  const [giftAmount, setGiftAmt] = useState(1);
  const [giftType,   setGiftType] = useState<'expiring'|'permanent'>('expiring');
  const [gifting,    setGifting]  = useState(false);
  const [giftMsg,    setGiftMsg]  = useState('');

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch('/api/v1/q/history', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : { logs: [] })
      .then(d => { setHistory(d.logs ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  async function handleGift(toPool = false) {
    if (!token) return;
    if (!toPool && !giftTarget.trim()) return;
    setGifting(true); setGiftMsg('');
    try {
      const res = await fetch('/api/v1/q/gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          toEmail:  toPool ? null : giftTarget.trim(),
          toPool,
          amount:   giftAmount,
          qType:    giftType,
        }),
      });
      if (res.ok) {
        setGiftMsg(toPool ? '✅ Đã tặng Q vào Pool!' : '✅ Đã tặng Q thành công!');
        setGift('');
      } else {
        const d = await res.json();
        setGiftMsg(d.message ?? 'Tặng Q thất bại.');
      }
    } catch { setGiftMsg('Lỗi kết nối.'); }
    setGifting(false);
  }

  if (!session) {
    return (
      <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <QIcon size={48}/><br/><br/>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Đăng nhập để xem Q Wallet</p>
        <Link href="/auth/login" style={{
          padding: '10px 24px', background: SAGE, color: '#fff',
          borderRadius: 10, textDecoration: 'none', fontWeight: 700,
        }}>Đăng nhập</Link>
      </div>
    );
  }

  const qExpiring  = quota?.expiring  ?? 0;
  const qPermanent = quota?.permanent ?? 0;
  const isPro      = quota?.isPro     ?? false;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px 96px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6, color: 'var(--text)', letterSpacing: -0.5 }}>
        Q Wallet
      </h1>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 28 }}>
        Đơn vị Q - dùng cho tools Pro và tặng cho cộng đồng
      </p>

      {/* Balance cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div style={{
          padding: '20px', borderRadius: 14,
          background: 'rgba(249,168,37,0.06)', border: '1.5px solid rgba(249,168,37,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <QIcon size={14} color="#b45309"/>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Hết hạn 24h
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#b45309', lineHeight: 1 }}>
            {qExpiring}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#b45309', marginTop: 4, opacity: 0.7 }}>
            Q expiring
          </div>
        </div>

        <div style={{
          padding: '20px', borderRadius: 14,
          background: 'rgba(74,124,89,0.06)', border: '1.5px solid rgba(74,124,89,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <QIcon size={14} color={SAGE}/>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: SAGE, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Không hết hạn
            </span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: SAGE, lineHeight: 1 }}>
            {qPermanent}
          </div>
          <div style={{ fontSize: '0.72rem', color: SAGE, marginTop: 4, opacity: 0.7 }}>
            Q permanent
          </div>
        </div>
      </div>

      {/* Buy Pro */}
      {!isPro && (
        <Link href="/pricing" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderRadius: 12,
          background: SAGE, color: '#fff',
          textDecoration: 'none', marginBottom: 24,
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Nạp thêm Q</div>
            <div style={{ fontSize: '0.78rem', opacity: 0.8, marginTop: 2 }}>
              $0.50/ngày · 10Q + 1Q permanent mỗi ngày
            </div>
          </div>
          <span style={{ fontSize: '1.2rem' }}>→</span>
        </Link>
      )}

      {/* Gift Q */}
      <div style={{
        border: '1.5px solid var(--border)', borderRadius: 14,
        padding: '20px 22px', marginBottom: 20, background: 'var(--bg)',
      }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 14, color: 'var(--text)' }}>
          🎁 Tặng Q
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            value={giftTarget} onChange={e => setGift(e.target.value)}
            placeholder="Email người nhận (để trống = tặng Q Pool)"
            style={{
              padding: '10px 14px', borderRadius: 10,
              border: '1.5px solid var(--border)',
              fontFamily: 'inherit', fontSize: '0.85rem',
              background: 'var(--bg)', color: 'var(--text)', outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={giftAmount} onChange={e => setGiftAmt(Number(e.target.value))}
              style={{
                flex: 1, padding: '9px 12px', borderRadius: 10,
                border: '1.5px solid var(--border)',
                fontFamily: 'inherit', fontSize: '0.85rem',
                background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer',
              }}>
              <option value={1}>1 Q</option>
              <option value={2}>2 Q</option>
              <option value={5}>5 Q</option>
              <option value={10}>10 Q</option>
            </select>
            <select value={giftType} onChange={e => setGiftType(e.target.value as any)}
              style={{
                flex: 1, padding: '9px 12px', borderRadius: 10,
                border: '1.5px solid var(--border)',
                fontFamily: 'inherit', fontSize: '0.85rem',
                background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer',
              }}>
              <option value="expiring">Q hết hạn ({qExpiring} có sẵn)</option>
              <option value="permanent">Q permanent ({qPermanent} có sẵn)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => handleGift(false)} disabled={gifting || (!giftTarget.trim())}
              style={{
                flex: 1, padding: '10px', borderRadius: 10,
                background: SAGE, color: '#fff', border: 'none',
                cursor: giftTarget.trim() ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem',
                opacity: !giftTarget.trim() || gifting ? 0.5 : 1,
              }}>
              {gifting ? '…' : 'Tặng người quen'}
            </button>
            <button onClick={() => handleGift(true)} disabled={gifting}
              style={{
                flex: 1, padding: '10px', borderRadius: 10,
                background: 'var(--bg-surface)', color: SAGE,
                border: `1.5px solid ${SAGE}`,
                cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: 700, fontSize: '0.85rem',
              }}>
              🌊 Tặng Q Pool
            </button>
          </div>
          {giftMsg && (
            <p style={{
              fontSize: '0.82rem', padding: '8px 12px', borderRadius: 8,
              background: giftMsg.startsWith('✅') ? 'rgba(74,124,89,0.08)' : '#fdecea',
              color: giftMsg.startsWith('✅') ? SAGE : '#c0392b',
            }}>
              {giftMsg}
            </p>
          )}
        </div>
      </div>

      {/* History */}
      <div style={{ border: '1.5px solid var(--border)', borderRadius: 14, overflow: 'hidden', background: 'var(--bg)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
          Lịch sử sử dụng Q
        </div>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Đang tải...
          </div>
        ) : history.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Chưa có lịch sử sử dụng Q
          </div>
        ) : (
          history.map((log, i) => (
            <div key={log.id ?? i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 20px',
              borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                  {log.toolSlug ?? log.action ?? 'Sử dụng Q'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray)', marginTop: 2 }}>
                  {new Date(log.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
              <span style={{
                fontSize: '0.82rem', fontWeight: 700,
                color: log.qCost > 0 ? '#c0392b' : SAGE,
              }}>
                {log.qCost > 0 ? `-${log.qCost}Q` : `+${Math.abs(log.qCost ?? 0)}Q`}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
