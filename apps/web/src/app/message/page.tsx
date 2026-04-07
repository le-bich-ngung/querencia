ï»¿'use client';
/**
 * Message â gá»­i feedback cho Querencia
 * 1 chiá»u: gá»­i rá»i thÃ´i, khÃ´ng nháº­n há»i Ã¢m
 */
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function MessagePage() {
  const { data: session } = useSession();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      setError('Vui lÃ²ng Äiá»n Äáº§y Äá»§ thÃ´ng tin.'); return;
    }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/v1/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content }),
      });
      if (res.ok) setSent(true);
      else setError('Gá»­i tháº¥t báº¡i. Vui lÃ²ng thá»­ láº¡i.');
    } catch {
      setError('KhÃ´ng thá» káº¿t ná»i. Vui lÃ²ng thá»­ láº¡i.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={{
        maxWidth: 480, margin: '80px auto', padding: '0 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>ð¬</div>
        <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)', marginBottom: 10 }}>
          ÄÃ£ gá»­i rá»i
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          MÃ¬nh Äá»c má»i tin nháº¯n, nhÆ°ng khÃ´ng há»i Ã¢m. Cáº£m Æ¡n báº¡n ÄÃ£ dÃ nh thá»i gian nháº¯n. ð¿
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px 96px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6, color: 'var(--text)' }}>
        Nháº¯n tin cho Querencia
      </h1>
      <p style={{
        fontSize: '0.85rem', color: 'var(--text-secondary)',
        lineHeight: 1.6, marginBottom: 32,
      }}>
        MÃ¬nh Äá»c má»i tin nháº¯n. NhÆ°ng sáº½ khÃ´ng há»i Ã¢m â ÄÃ¢y lÃ  há»p thÆ° 1 chiá»u.
        Báº¡n khÃ´ng cáº§n ÄÄng nháº­p Äá» gá»­i.
      </p>

      <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{
            display: 'block', fontSize: '0.82rem', fontWeight: 600,
            color: 'var(--text-secondary)', marginBottom: 6,
          }}>
            Chá»§ Äá»
          </label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="VÃ­ dá»¥: GÃ³p Ã½ vá» LÃ No"
            style={{
              width: '100%', padding: '11px 14px',
              border: '1.5px solid var(--border)', borderRadius: 10,
              fontFamily: 'inherit', fontSize: '0.9rem',
              background: 'var(--bg)', color: 'var(--text)',
              outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#4a7c59')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        <div>
          <label style={{
            display: 'block', fontSize: '0.82rem', fontWeight: 600,
            color: 'var(--text-secondary)', marginBottom: 6,
          }}>
            Ná»i dung
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Viáº¿t gÃ¬ cÅ©ng ÄÆ°á»£c â gÃ³p Ã½, bÃ¡o lá»i, hay chá» muá»n nÃ³i gÃ¬ ÄÃ³â¦"
            rows={6}
            style={{
              width: '100%', padding: '11px 14px',
              border: '1.5px solid var(--border)', borderRadius: 10,
              fontFamily: 'inherit', fontSize: '0.9rem',
              background: 'var(--bg)', color: 'var(--text)',
              outline: 'none', resize: 'vertical',
              boxSizing: 'border-box',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#4a7c59')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 8,
            background: '#fdecea', color: '#c0392b', fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '13px', background: '#4a7c59',
            color: '#fff', border: 'none', borderRadius: 10,
            fontFamily: 'inherit', fontSize: '0.95rem',
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Äang gá»­iâ¦' : 'Gá»­i'}
        </button>

        <p style={{
          fontSize: '0.72rem', color: 'var(--gray)',
          textAlign: 'center', lineHeight: 1.5,
        }}>
          Dá»¯ liá»u báº¡n gá»­i khÃ´ng ÄÆ°á»£c chia sáº» hay bÃ¡n cho báº¥t ká»³ ai.
        </p>
      </form>
    </div>
  );
}
