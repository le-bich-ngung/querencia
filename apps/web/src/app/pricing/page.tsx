'use client';
/**
 * Pricing - $0.50/day flat
 * Plans: 1 day · 7 days · 30 days - same price, just differs in payment frequency
 * Q: 10Q expiring + 1Q permanent per day
 */
import { useState } from 'react';
import Link         from 'next/link';
import { useSession } from 'next-auth/react';

const PRICE_PER_DAY = 0.50; // USD, flat, no discount

const PLANS = [
  {
    days:  1,
    label: '1 day',
    badge: null,
    desc:  "Try it first. If you don't like it, you only lose $0.50.",
  },
  {
    days:  7,
    label: '7 days',
    badge: 'Popular',
    desc:  'A week without worrying about paying again.',
  },
  {
    days:  30,
    label: '30 days',
    badge: null,
    desc:  'A month of peace of mind. Still refundable if needed.',
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
          Transparent · No tricks · No auto-renewal
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          fontWeight: 800, letterSpacing: -1.5,
          color: 'var(--text)', marginBottom: 14,
        }}>
          $0.50 / day. That's it.
        </h1>
        <p style={{
          fontSize: '1rem', color: 'var(--text-secondary)',
          maxWidth: 480, margin: '0 auto', lineHeight: 1.7,
        }}>
          No plan is better than another. Same price - just differs in how many times you tap to pay.
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
            Q you get with the {selected}-day plan
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
              Q expiring in 24h
            </div>
            <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: 3 }}>
              {10} Q × {selected} days · granted at the start of each day
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
              Q with no expiry
            </div>
            <div style={{ fontSize: '0.7rem', color: '#4a7c59', marginTop: 3 }}>
              1 Q × {selected} days · use anytime
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 14, fontSize: '0.75rem', color: 'var(--text-secondary)',
          lineHeight: 1.6, paddingTop: 12, borderTop: '1px solid var(--border)',
        }}>
          💡 Have unused expiring Q after 24h? Gift it to someone or donate it to the Q Pool for the community.
          A popup will remind you 3 hours before it expires.
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
        Buy {selected} days Pro - ${total.toFixed(2)}
      </Link>
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--gray)' }}>
        No auto-renewal · Full refund for unused days · Transaction fees are your responsibility
      </p>

      {/* Refund policy - clear, simple */}
      <div style={{
        marginTop: 40, border: '1.5px solid var(--border)',
        borderRadius: 14, padding: '24px', background: 'var(--bg)',
      }}>
        <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 14, color: 'var(--text)' }}>
          💸 Refund - how it's calculated
        </h3>
        <div style={{
          background: 'var(--bg-surface)', borderRadius: 10,
          padding: '16px', marginBottom: 14,
          fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7,
        }}>
          <strong style={{ color: 'var(--text)' }}>Example: bought 7 days ($3.50):</strong>
          <br/>On day 3, requesting a mid-cycle refund:
          <ul style={{ paddingLeft: 18, margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li>Refund <strong>4 full unused days</strong> (days 4, 5, 6, 7)</li>
            <li>Refund amount: 4 × $0.50 = <strong>$2.00</strong></li>
            <li>Day 3 (in use) continues until the end of its 24h, then expires automatically</li>
            <li>Refund transaction fee: your responsibility (charged by Paddle)</li>
          </ul>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--gray)', lineHeight: 1.5 }}>
          Refundable while at least 1 full unused day remains.
          Q already granted for the day in use is non-refundable - you use it until that day ends.
        </p>
      </div>

      {/* Tool cost table */}
      <div style={{
        marginTop: 20, border: '1.5px solid var(--border)',
        borderRadius: 14, padding: '24px', background: 'var(--bg)',
      }}>
        <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 14, color: 'var(--text)' }}>
          Q cost per Pro tool
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { tool: 'PDF → Word',              q: 1, icon: '📄' },
            { tool: 'Screenshot Translator',   q: 2, icon: '🌐' },
            { tool: 'Gift Q to someone',       q: '1–2', icon: '🎁' },
            { tool: 'All other 40+ tools',     q: 0, icon: '🔧' },
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
                {row.q === 0 ? 'Free' : `${row.q} Q`}
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
          LàNo, Nope, Cùi Bắp, and 40+ tools - free, no payment needed.
        </p>
        <Link href="/auth/register" style={{
          fontSize: '0.82rem', color: '#4a7c59',
          fontWeight: 700, textDecoration: 'none',
        }}>
          Sign up free →
        </Link>
      </div>
    </div>
  );
}
