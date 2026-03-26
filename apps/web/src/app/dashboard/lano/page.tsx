'use client';
/**
 * LàNo — AI companion, trang chat đầy đủ
 * Stream từ FastAPI /ai/lano/stream (Anthropic + prompt caching)
 * Smart History: lưu context trong localStorage
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { lanoHistory } from '@/lib/smart-history';
import { gameStats }   from '@/lib/gamification';

const SAGE = '#4a7c59';

interface Msg { role: 'user'|'assistant'; content: string; }

const SUGGESTIONS = [
  'Tôi đang cảm thấy căng thẳng về công việc',
  'Giúp tôi suy nghĩ về một quyết định khó',
  'Tôi muốn nói chuyện về cảm xúc của mình',
  'Chia sẻ về một ngày không như ý',
];

export default function LanoPage() {
  const { data: session }  = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const [messages,  setMessages]  = useState<Msg[]>([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [streaming, setStreaming] = useState(false);
  const [quota,     setQuota]     = useState<{ expiring:number; permanent:number }|null>(null);
  const [resumed,   setResumed]   = useState(false);
  const endRef    = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);
  const abortRef  = useRef<AbortController|null>(null);

  // Load quota
  useEffect(() => {
    if (!token) return;
    fetch('/api/v1/q/balance', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setQuota({ expiring: d.expiring, permanent: d.permanent }))
      .catch(() => {});
  }, [token]);

  // Resume từ smart history
  useEffect(() => {
    const history = lanoHistory.get();
    if (history.length > 0 && !resumed) {
      const msgs = history.map(h => ({ role: h.role, content: h.content }));
      setMessages([
        { role: 'assistant', content: '🌿 Xin chào! Chúng ta có thể tiếp tục từ lần trước...' },
        ...msgs.slice(-10),
      ]);
      setResumed(true);
    } else if (!resumed) {
      setMessages([{
        role: 'assistant',
        content: 'Xin chào 🌿 Tôi là LàNo — tôi ở đây để lắng nghe bạn. Hôm nay bạn cảm thấy thế nào?',
      }]);
    }
  }, [resumed]);

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setError('');

    const userMsg: Msg = { role: 'user', content: text.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    setStreaming(true);

    // Save to history
    lanoHistory.append('user', text.trim());
    gameStats.recordLaNoMessage();

    // Placeholder cho streaming response
    setMessages(m => [...m, { role: 'assistant', content: '' }]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/ai/lano/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 403 && err.code === 'INSUFFICIENT_Q') {
          setError('Hết Q 😔 Mua thêm để tiếp tục trò chuyện với LàNo.');
        } else {
          setError('Có lỗi xảy ra. Thử lại nhé.');
        }
        setMessages(m => m.slice(0, -1));
        return;
      }

      // SSE streaming
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              const delta  = parsed.delta?.text ?? parsed.content ?? '';
              accumulated += delta;
              setMessages(m => {
                const updated = [...m];
                updated[updated.length - 1] = { role: 'assistant', content: accumulated };
                return updated;
              });
            } catch {}
          }
        }
      }

      // Save assistant response
      if (accumulated) {
        lanoHistory.append('assistant', accumulated);
      }

    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setError('Kết nối bị gián đoạn. Thử lại nhé.');
        setMessages(m => m.slice(0, -1));
      }
    } finally {
      setLoading(false);
      setStreaming(false);
      abortRef.current = null;
    }
  }, [messages, loading, token]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleNewChat() {
    lanoHistory.clear();
    setMessages([{ role: 'assistant', content: 'Xin chào 🌿 Bắt đầu cuộc trò chuyện mới. Hôm nay bạn muốn chia sẻ điều gì?' }]);
    setResumed(true);
    setError('');
  }

  const isEmpty = messages.length <= 1;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 54px - 72px)', maxWidth:720, margin:'0 auto' }}>

      {/* Header */}
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        padding:'16px 20px', borderBottom:'1px solid var(--border)', flexShrink:0,
      }}>
        <div>
          <h1 style={{ fontSize:'1.1rem', fontWeight:800, color:'var(--text)', marginBottom:2 }}>LàNo</h1>
          <p style={{ fontSize:'0.75rem', color:'var(--text-secondary)' }}>
            AI companion · Miễn phí mãi mãi
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {quota && (
            <span style={{
              fontSize:'0.72rem', fontWeight:700, padding:'3px 10px',
              background:'rgba(74,124,89,0.08)', color:SAGE, borderRadius:999,
            }}>
              {quota.expiring + quota.permanent}Q
            </span>
          )}
          <button onClick={handleNewChat} style={{
            padding:'6px 14px', borderRadius:8, border:'1.5px solid var(--border)',
            background:'none', cursor:'pointer', color:'var(--text-secondary)',
            fontFamily:'inherit', fontSize:'0.78rem',
          }}>
            ✨ Chat mới
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display:'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 12,
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width:32, height:32, borderRadius:'50%', background:SAGE,
                color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'0.85rem', flexShrink:0, marginRight:8, marginTop:2,
              }}>🌿</div>
            )}
            <div style={{
              maxWidth: '75%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? SAGE : 'var(--bg-surface)',
              color: msg.role === 'user' ? '#fff' : 'var(--text)',
              fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {msg.content}
              {streaming && i === messages.length-1 && msg.role === 'assistant' && msg.content === '' && (
                <span style={{ opacity:0.5 }}>●●●</span>
              )}
            </div>
          </div>
        ))}

        {/* Suggestions khi mới bắt đầu */}
        {isEmpty && !session && (
          <div style={{ marginTop:20, padding:'16px 0' }}>
            <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:12, textAlign:'center' }}>
              Bắt đầu với một trong những chủ đề này:
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)} style={{
                  padding:'8px 14px', borderRadius:20,
                  border:'1.5px solid var(--border)', background:'none',
                  cursor:'pointer', color:'var(--text-secondary)',
                  fontFamily:'inherit', fontSize:'0.8rem',
                  transition:'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=SAGE; e.currentTarget.style.color=SAGE; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-secondary)'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding:'12px 16px', borderRadius:10, marginTop:8,
            background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.2)',
            color:'#c0392b', fontSize:'0.85rem',
          }}>
            {error}
            {error.includes('Q') && (
              <Link href="/wallet/buy" style={{ color:SAGE, fontWeight:700, marginLeft:8 }}>
                Mua thêm →
              </Link>
            )}
          </div>
        )}

        <div ref={endRef}/>
      </div>

      {/* Input area */}
      <div style={{
        padding:'12px 20px', borderTop:'1px solid var(--border)',
        background:'var(--bg)', flexShrink:0,
      }}>
        <div style={{
          display:'flex', gap:10, alignItems:'flex-end',
          background:'var(--bg-surface)', borderRadius:16,
          border:'1.5px solid var(--border)', padding:'10px 14px',
          transition:'border-color 0.15s',
        }}
          onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder="Chia sẻ với LàNo..."
            rows={1}
            style={{
              flex:1, border:'none', outline:'none', background:'transparent',
              fontFamily:'inherit', fontSize:'0.9rem', color:'var(--text)',
              lineHeight:1.5, resize:'none', maxHeight:120,
            }}
          />
          {streaming ? (
            <button onClick={handleStop} style={{
              width:34, height:34, borderRadius:'50%',
              background:'var(--border)', border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0,
            }}>⏹</button>
          ) : (
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              style={{
                width:34, height:34, borderRadius:'50%',
                background: input.trim() ? SAGE : 'var(--border)',
                border:'none', cursor: input.trim() ? 'pointer' : 'default',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'0.9rem', flexShrink:0, transition:'background 0.15s',
              }}
            >
              <span style={{ color:'#fff', fontSize:'0.85rem' }}>➤</span>
            </button>
          )}
        </div>
        <p style={{ fontSize:'0.68rem', color:'var(--gray)', marginTop:6, textAlign:'center' }}>
          LàNo là AI — không thay thế chuyên gia tâm lý. Nếu bạn cần hỗ trợ khẩn cấp, hãy gọi đường dây hỗ trợ sức khỏe tâm thần.
        </p>
      </div>
    </div>
  );
}
