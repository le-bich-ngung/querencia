ï»¿'use client';
/**
 * Pricing â $0.50/ngÃ y flat
 * GÃ³i: 1 ngÃ y Â· 7 ngÃ y Â· 30 ngÃ y â cÃ¹ng giÃ¡, chá» khÃ¡c sá» láº§n thanh toÃ¡n
 * Q: 10Q expiring + 1Q permanent má»i ngÃ y
 */
import { useState } from 'react';
import Link         from 'next/link';
import { useSession } from 'next-auth/react';

const PRICE_PER_DAY = 0.50; // USD, flat, khÃ´ng discount

const PLANS = [
  {
    days:  1,
    label: '1 ngÃ y',
    badge: null,
    desc:  'Thá»­ trÆ°á»c. Máº¥t thÃ¬ chá» máº¥t $0.50.',
  },
  {
    days:  7,
    label: '7 ngÃ y',
    badge: 'Phá» biáº¿n',
    desc:  'Má»t tuáº§n khÃ´ng cáº§n lo thanh toÃ¡n láº¡i.',
  },
  {
    days:  30,
    label: '30 ngÃ y',
    badge: null,
    desc:  'Má»t thÃ¡ng yÃªn tÃ¢m. Váº«n hoÃ n tiá»n náº¿u cáº§n.',
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
          Minh báº¡ch Â· KhÃ´ng trick Â· KhÃ´ng tá»± gia háº¡n
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          fontWeight: 800, letterSpacing: -1.5,
          color: 'var(--text)', marginBottom: 14,
        }}>
          $0.50 / ngÃ y. Váº­y thÃ´i.
        </h1>
        <p style={{
          fontSize: '1rem', color: 'var(--text-secondary)',
          maxWidth: 480, margin: '0 auto', lineHeight: 1.7,
        }}>
          KhÃ´ng cÃ³ gÃ³i nÃ o tá»t hÆ¡n gÃ³i nÃ o. CÃ¹ng má»t giÃ¡ â chá» khÃ¡c sá» láº§n báº¡n pháº£i báº¥m thanh toÃ¡n.
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
            Q báº¡n nháº­n ÄÆ°á»£c vá»i gÃ³i {selected} ngÃ y
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
              Q háº¿t háº¡n sau 24h
            </div>
            <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: 3 }}>
              {10} Q Ã {selected} ngÃ y Â· cáº¥p má»i Äáº§u ngÃ y
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
              Q khÃ´ng háº¿t háº¡n
            </div>
            <div style={{ fontSize: '0.7rem', color: '#4a7c59', marginTop: 3 }}>
              1 Q Ã {selected} ngÃ y Â· dÃ¹ng báº¥t cá»© lÃºc nÃ o
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 14, fontSize: '0.75rem', color: 'var(--text-secondary)',
          lineHeight: 1.6, paddingTop: 12, borderTop: '1px solid var(--border)',
        }}>
          ð¡ Háº¿t 24h cÃ²n Q expiring chÆ°a dÃ¹ng â táº·ng cho ngÆ°á»i quen hoáº·c treo Q Pool cho cá»ng Äá»ng.
          3 giá» trÆ°á»c khi háº¿t háº¡n sáº½ cÃ³ popup nháº¯c.
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
        Mua {selected} ngÃ y Pro â ${total.toFixed(2)}
      </Link>
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--gray)' }}>
        KhÃ´ng tá»± gia háº¡n Â· HoÃ n tiá»n ngÃ y trá»n váº¹n chÆ°a dÃ¹ng Â· PhÃ­ giao dá»ch do báº¡n chá»u
      </p>

      {/* Refund policy â rÃµ rÃ ng, ÄÆ¡n giáº£n */}
      <div style={{
        marginTop: 40, border: '1.5px solid var(--border)',
        borderRadius: 14, padding: '24px', background: 'var(--bg)',
      }}>
        <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 14, color: 'var(--text)' }}>
          ð¸ HoÃ n tiá»n â cÃ¡ch tÃ­nh
        </h3>
        <div style={{
          background: 'var(--bg-surface)', borderRadius: 10,
          padding: '16px', marginBottom: 14,
          fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7,
        }}>
          <strong style={{ color: 'var(--text)' }}>VÃ­ dá»¥ mua 7 ngÃ y ($3.50):</strong>
          <br/>Äang dÃ¹ng ngÃ y thá»© 3, muá»n hoÃ n tiá»n giá»¯a chá»«ng:
          <ul style={{ paddingLeft: 18, margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li>HoÃ n <strong>4 ngÃ y</strong> trá»n váº¹n chÆ°a dÃ¹ng (ngÃ y 4, 5, 6, 7)</li>
            <li>Sá» tiá»n hoÃ n: 4 Ã $0.50 = <strong>$2.00</strong></li>
            <li>NgÃ y 3 Äang dÃ¹ng â tiáº¿p tá»¥c Äáº¿n háº¿t 24h, sau ÄÃ³ tá»± háº¿t</li>
            <li>PhÃ­ giao dá»ch hoÃ n: báº¡n tá»± chá»u (Paddle thu)</li>
          </ul>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--gray)', lineHeight: 1.5 }}>
          HoÃ n ÄÆ°á»£c khi cÃ²n Ã­t nháº¥t 1 ngÃ y trá»n váº¹n chÆ°a ÄÆ°á»£c cáº¥p Q.
          Q ÄÃ£ cáº¥p cho ngÃ y Äang dÃ¹ng khÃ´ng hoÃ n â báº¡n dÃ¹ng Äáº¿n háº¿t ngÃ y ÄÃ³.
        </p>
      </div>

      {/* Tool cost table */}
      <div style={{
        marginTop: 20, border: '1.5px solid var(--border)',
        borderRadius: 14, padding: '24px', background: 'var(--bg)',
      }}>
        <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 14, color: 'var(--text)' }}>
          Chi phÃ­ Q má»i tool Pro
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { tool: 'PDF â Word',              q: 1, icon: 'ð' },
            { tool: 'Screenshot Translator',   q: 2, icon: 'ð' },
            { tool: 'Táº·ng Q cho ngÆ°á»i khÃ¡c',   q: '1â2', icon: 'ð' },
            { tool: 'Táº¥t cáº£ 40+ tools khÃ¡c',   q: 0, icon: 'ð§' },
            { tool: 'LÃ No, Nope, CÃ¹i Báº¯p',     q: 0, icon: 'ð¿' },
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
                {row.q === 0 ? 'Miá»n phÃ­' : `${row.q} Q`}
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
          LÃ No, Nope, CÃ¹i Báº¯p vÃ  40+ tools â miá»n phÃ­, khÃ´ng cáº§n tráº£ gÃ¬.
        </p>
        <Link href="/auth/register" style={{
          fontSize: '0.82rem', color: '#4a7c59',
          fontWeight: 700, textDecoration: 'none',
        }}>
          ÄÄng kÃ½ miá»n phÃ­ â
        </Link>
      </div>
    </div>
  );
}
