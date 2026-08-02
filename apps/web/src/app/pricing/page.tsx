'use client';
/**
 * Pricing - $0.50/ngày flat
 * Gói: 1 ngày · 7 ngày · 30 ngày - cùng giá, chỉ khác số lần thanh toán
 * Q: 10Q expiring + 1Q permanent mỗi ngày
 */
import { useState } from 'react';
import Link         from 'next/link';
import { useSession } from 'next-auth/react';

const PRICE_PER_DAY = 0.50; // USD, flat, không discount

const PLANS = [
  {
    days:  1,
    label: '1 ngày',
    badge: null,
    desc:  'Thử trước. Mất thì chỉ mất $0.50.',
  },
  {
    days:  7,
    label: '7 ngày',
    badge: 'Phổ biến',
    desc:  'Một tuần không cần lo thanh toán lại.',
  },
  {
    days:  30,
    label: '30 ngày',
    badge: null,
    desc:  'Một tháng yên tâm. Vẫn hoàn tiền nếu cần.',
  },
];

const QSymbol = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size}>
    <defs><clipPath id="qpc"><circle cx="55" cy="55" r="32"/></clipPath></defs>
    <circle cx="55" cy="55" r="38" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round"/>
    <line x1="81" y1="79" x2="98" y2="98" stroke="currentColor" strokeWidth="9" strokeLinecap="round"/>
    <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
      fill="none" stroke="currentColor" strokeWidth="4"
      strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qpc)"/>
  </svg>
);

export default function PricingPage() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState(7);

  const total      = selected * PRICE_PER_DAY;
  const qExpiring  = selected * 10;
  const qPermanent = selected * 1;

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '52px 24px 96px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(74,124,89,0.08)',
          border: '1px solid rgba(74,124,89,0.18)',
          borderRadius: 999, padding: '5px 14px',
          fontSize: '0.72rem', fontWeight: 700, color: '#4a7c59',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          Minh bạch · Không trick · Không tự gia hạn
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          fontWeight: 800, letterSpacing: -1.5,
          color: 'var(--text)', marginBottom: 14,
        }}>
          $0.50 / ngày. Vậy thôi.
        </h1>
        <p style={{
          fontSize: '1rem', color: 'var(--text-secondary)',
          maxWidth: 480, margin: '0 auto', lineHeight: 1.7,
        }}>
          Không có gói nào tốt hơn gói nào. Cùng một giá - chỉ khác số lần bạn phải bấm thanh toán.
        </p>
      </div>

      {/* Plan selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14, marginBottom: 36,
      }}>
        {PLANS.map(plan => {
          const active = selected === plan.days;
          return (
            <button
              key={plan.days}
              onClick={() => setSelected(plan.days)}
              style={{
                padding: '22px 18px',
                borderRadius: 14,
                border: `2px solid ${active ? '#4a7c59' : 'var(--border)'}`,
                background: active ? 'rgba(74,124,89,0.04)' : 'var(--bg)',
                cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left', position: 'relative',
                transition: 'all 0.15s',
              }}
            >
              {plan.badge && (
                <span style={{
                  position: 'absolute', top: -10, left: 14,
                  background: '#4a7c59', color: '#fff',
                  fontSize: '0.62rem', fontWeight: 800,
                  padding: '2px 8px', borderRadius: 999,
                  letterSpacing: '0.04em',
                }}>
                  {plan.badge}
                </span>
              )}
              <div style={{
                fontSize: '1.1rem', fontWeight: 800,
                color: active ? '#4a7c59' : 'var(--text)',
                marginBottom: 4,
              }}>
                {plan.label}
              </div>
              <div style={{
                fontSize: '1.5rem', fontWeight: 800,
                color: 'var(--text)', letterSpacing: -0.5,
                marginBottom: 6,
              }}>
                ${(plan.days * PRICE_PER_DAY).toFixed(plan.days === 1 ? 2 : 2)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {plan.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Q summary */}
      <div style={{
        border: '1.5px solid var(--border)', borderRadius: 14,
        padding: '22px 24px', marginBottom: 28, background: 'var(--bg)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 16, color: '#4a7c59',
        }}>
          <QSymbol size={18}/>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
            Q bạn nhận được với gói {selected} ngày
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{
            padding: '14px 16px', borderRadius: 10,
            background: '#fef9ee', border: '1px solid #fde68a',
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309', lineHeight: 1 }}>
              {qExpiring}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#92400e', marginTop: 4 }}>
              Q hết hạn sau 24h
            </div>
            <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: 3 }}>
              {10} Q × {selected} ngày · cấp mỗi đầu ngày
            </div>
          </div>
          <div style={{
            padding: '14px 16px', borderRadius: 10,
            background: 'rgba(74,124,89,0.06)', border: '1px solid rgba(74,124,89,0.2)',
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4a7c59', lineHeight: 1 }}>
              {qPermanent}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2d5a3d', marginTop: 4 }}>
              Q không hết hạn
            </div>
            <div style={{ fontSize: '0.7rem', color: '#4a7c59', marginTop: 3 }}>
              1 Q × {selected} ngày · dùng bất cứ lúc nào
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 14, fontSize: '0.75rem', color: 'var(--text-secondary)',
          lineHeight: 1.6, paddingTop: 12, borderTop: '1px solid var(--border)',
        }}>
          💡 Hết 24h còn Q expiring chưa dùng → tặng cho người quen hoặc treo Q Pool cho cộng đồng.
          3 giờ trước khi hết hạn sẽ có popup nhắc.
        </div>
      </div>

      {/* CTA */}
      <Link
        href={session ? `/wallet/buy?days=${selected}` : `/auth/register?next=/wallet/buy?days=${selected}`}
        style={{
          display: 'block', textAlign: 'center',
          padding: '15px', borderRadius: 12,
          background: '#4a7c59', color: '#fff',
          textDecoration: 'none', fontWeight: 700,
          fontSize: '1rem', marginBottom: 14,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#2d5a3d';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#4a7c59';
          e.currentTarget.style.transform = '';
        }}
      >
        Mua {selected} ngày Pro - ${total.toFixed(2)}
      </Link>
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--gray)' }}>
        Không tự gia hạn · Hoàn tiền ngày trọn vẹn chưa dùng · Phí giao dịch do bạn chịu
      </p>

      {/* Refund policy - rõ ràng, đơn giản */}
      <div style={{
        marginTop: 40, border: '1.5px solid var(--border)',
        borderRadius: 14, padding: '24px', background: 'var(--bg)',
      }}>
        <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 14, color: 'var(--text)' }}>
          💸 Hoàn tiền - cách tính
        </h3>
        <div style={{
          background: 'var(--bg-surface)', borderRadius: 10,
          padding: '16px', marginBottom: 14,
          fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7,
        }}>
          <strong style={{ color: 'var(--text)' }}>Ví dụ mua 7 ngày ($3.50):</strong>
          <br/>Đang dùng ngày thứ 3, muốn hoàn tiền giữa chừng:
          <ul style={{ paddingLeft: 18, margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li>Hoàn <strong>4 ngày</strong> trọn vẹn chưa dùng (ngày 4, 5, 6, 7)</li>
            <li>Số tiền hoàn: 4 × $0.50 = <strong>$2.00</strong></li>
            <li>Ngày 3 đang dùng → tiếp tục đến hết 24h, sau đó tự hết</li>
            <li>Phí giao dịch hoàn: bạn tự chịu (Paddle thu)</li>
          </ul>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--gray)', lineHeight: 1.5 }}>
          Hoàn được khi còn ít nhất 1 ngày trọn vẹn chưa được cấp Q.
          Q đã cấp cho ngày đang dùng không hoàn - bạn dùng đến hết ngày đó.
        </p>
      </div>

      {/* Tool cost table */}
      <div style={{
        marginTop: 20, border: '1.5px solid var(--border)',
        borderRadius: 14, padding: '24px', background: 'var(--bg)',
      }}>
        <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 14, color: 'var(--text)' }}>
          Chi phí Q mỗi tool Pro
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { tool: 'PDF → Word',              q: 1, icon: '📄' },
            { tool: 'Screenshot Translator',   q: 2, icon: '🌐' },
            { tool: 'Tặng Q cho người khác',   q: '1–2', icon: '🎁' },
            { tool: 'Tất cả 40+ tools khác',   q: 0, icon: '🔧' },
            { tool: 'LàNo, Nope, Cùi Bắp',     q: 0, icon: '🌿' },
          ].map((row, i, arr) => (
            <div key={row.tool} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 0',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ fontSize: '1rem', width: 24, textAlign: 'center' }}>{row.icon}</span>
              <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text)' }}>{row.tool}</span>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700,
                background: row.q === 0
                  ? 'rgba(74,124,89,0.08)'
                  : 'rgba(249,168,37,0.1)',
                color: row.q === 0 ? '#4a7c59' : '#b45309',
                padding: '2px 8px', borderRadius: 999,
              }}>
                {row.q === 0 ? 'Miễn phí' : `${row.q} Q`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Free tier note */}
      <div style={{
        marginTop: 28, textAlign: 'center',
        padding: '20px', borderRadius: 12,
        background: 'var(--bg-surface)',
      }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
          LàNo, Nope, Cùi Bắp và 40+ tools - miễn phí, không cần trả gì.
        </p>
        <Link href="/auth/register" style={{
          fontSize: '0.82rem', color: '#4a7c59',
          fontWeight: 700, textDecoration: 'none',
        }}>
          Đăng ký miễn phí →
        </Link>
      </div>
    </div>
  );
}
