'use client';
/**
 * Message — gửi feedback cho Querencia
 * 1 chiều: gửi rồi thôi, không nhận hồi âm
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
      setError('Vui lòng điền đầy đủ thông tin.'); return;
    }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/v1/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content }),
      });
      if (res.ok) setSent(true);
      else setError('Gửi thất bại. Vui lòng thử lại.');
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.');
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
          Đã gửi rồi
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Mình đọc mọi tin nhắn, nhưng không hồi âm. Cảm ơn bạn đã dành thời gian nhắn. 🌿
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px 96px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6, color: 'var(--text)' }}>
        Nhắn tin cho Querencia
      </h1>
      <p style={{
        fontSize: '0.85rem', color: 'var(--text-secondary)',
        lineHeight: 1.6, marginBottom: 32,
      }}>
        Mình đọc mọi tin nhắn. Nhưng sẽ không hồi âm — đây là hộp thư 1 chiều.
        Bạn không cần đăng nhập để gửi.
      </p>

      <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{
            display: 'block', fontSize: '0.82rem', fontWeight: 600,
            color: 'var(--text-secondary)', marginBottom: 6,
          }}>
            Chủ đề
          </label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Ví dụ: Góp ý về LàNo"
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
            Nội dung
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Viết gì cũng được — góp ý, báo lỗi, hay chỉ muốn nói gì đó…"
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
          {loading ? 'Đang gửi…' : 'Gửi'}
        </button>

        <p style={{
          fontSize: '0.72rem', color: 'var(--gray)',
          textAlign: 'center', lineHeight: 1.5,
        }}>
          Dữ liệu bạn gửi không được chia sẻ hay bán cho bất kỳ ai.
        </p>
      </form>
    </div>
  );
}
