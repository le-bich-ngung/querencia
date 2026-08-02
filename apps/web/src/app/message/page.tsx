'use client';
/**
 * Message - send feedback to Querencia
 * One-way: send it and that's it, no reply
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
      setError('Please fill in all fields.'); return;
    }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/v1/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content }),
      });
      if (res.ok) setSent(true);
      else setError('Failed to send. Please try again.');
    } catch {
      setError('Could not connect. Please try again.');
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
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>📬</div>
        <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)', marginBottom: 10 }}>
          Sent
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          We read every message, but don't reply. Thanks for taking the time to write. 🌿
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px 96px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6, color: 'var(--text)' }}>
        Message Querencia
      </h1>
      <p style={{
        fontSize: '0.85rem', color: 'var(--text-secondary)',
        lineHeight: 1.6, marginBottom: 32,
      }}>
        We read every message. But we won't reply - this is a one-way inbox.
        You don't need to sign in to send one.
      </p>

      <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{
            display: 'block', fontSize: '0.82rem', fontWeight: 600,
            color: 'var(--text-secondary)', marginBottom: 6,
          }}>
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Example: Feedback about LàNo"
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
            Message
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write anything - feedback, a bug report, or just something on your mind…"
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
          {loading ? 'Sending…' : 'Send'}
        </button>

        <p style={{
          fontSize: '0.72rem', color: 'var(--gray)',
          textAlign: 'center', lineHeight: 1.5,
        }}>
          What you send is never shared or sold to anyone.
        </p>
      </form>
    </div>
  );
}
