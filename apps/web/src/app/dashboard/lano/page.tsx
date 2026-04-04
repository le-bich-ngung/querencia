'use client';
import { useState } from 'react';
import { useI18n } from '../../../lib/i18n';

const SAGE = '#4a7c59';
const PURPLE = '#8b5cf6';

export default function LanoPage() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || sent) return;
    setLoading(true);
    try {
      await fetch('/api/v1/lano/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });
    } catch {}
    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #09090f 0%, #0d0d1a 60%, #0a0f0a 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', width: 600, height: 600,
        borderRadius: '50%', top: '10%', left: '50%', transform: 'translateX(-50%)',
        background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{ position: 'relative', maxWidth: 520, width: '100%', textAlign: 'center' }}>
        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(139,92,246,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', margin: '0 auto 28px',
          animation: 'float 3s ease-in-out infinite',
        }}>🎧</div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 14px', borderRadius: 100,
          border: '1px solid rgba(139,92,246,0.25)',
          color: 'rgba(139,92,246,0.7)', fontSize: '0.75rem',
          fontWeight: 600, letterSpacing: '0.08em', marginBottom: 20,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: PURPLE, display: 'inline-block', opacity: 0.6 }}/>
          {t('lano.coming')}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'Instrument Serif, Georgia, serif',
          fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
          fontWeight: 400, letterSpacing: -1.2, lineHeight: 1.1,
          color: '#f0efeb', marginBottom: 16,
        }}>
          LàNo
        </h1>
        <p style={{
          fontSize: '1rem', color: 'rgba(240,239,235,0.45)',
          lineHeight: 1.75, marginBottom: 48, maxWidth: 380, margin: '0 auto 48px',
        }}>
          Someone to listen. Without judgment.<br/>Always here. Free, forever.
        </p>

        {/* Feedback form */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: 24, textAlign: 'left',
        }}>
          <p style={{
            fontSize: '0.85rem', fontWeight: 600,
            color: 'rgba(240,239,235,0.7)', marginBottom: 12,
          }}>
            {t('lano.feedback')}
          </p>

          {sent ? (
            <div style={{
              padding: '16px', borderRadius: 10,
              background: 'rgba(74,124,89,0.1)',
              border: '1px solid rgba(74,124,89,0.2)',
              color: SAGE, fontSize: '0.88rem', textAlign: 'center',
            }}>
              {t('lano.sent')}
            </div>
          ) : (
            <>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={t('lano.placeholder')}
                rows={4}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, color: '#f0efeb',
                  fontSize: '0.85rem', lineHeight: 1.6,
                  resize: 'none', outline: 'none',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'border 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(139,92,246,0.4)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button
                onClick={handleSend}
                disabled={!text.trim() || loading}
                style={{
                  marginTop: 12, padding: '10px 24px',
                  background: text.trim() ? PURPLE : 'rgba(139,92,246,0.2)',
                  color: text.trim() ? '#fff' : 'rgba(139,92,246,0.5)',
                  border: 'none', borderRadius: 100, cursor: text.trim() ? 'pointer' : 'default',
                  fontSize: '0.85rem', fontWeight: 600,
                  transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {loading ? '...' : t('lano.send')}
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}
