'use client';
/**
 * Nope — Feed bài viết chia sẻ kinh nghiệm sống
 * Features: feed, create post, comments, thank ❤️, save, profile
 */
import { useState, useEffect, useCallback } from 'react';
import Link        from 'next/link';
import { useSession } from 'next-auth/react';

// ── Types ─────────────────────────────────────────────────────
interface NopePost {
  id:           string;
  authorId:     string;
  authorName:   string;
  title:        string;
  body:         string;
  imageUrl?:    string;
  tags:         string[];
  thanksCount:  number;
  commentCount: number;
  isThanked:    boolean;
  isSaved:      boolean;
  createdAt:    string;
}

interface Comment {
  id:         string;
  authorName: string;
  body:       string;
  createdAt:  string;
}

const SAGE = '#4a7c59';
const API  = '/api/v1/nope';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

// ── Post Card ─────────────────────────────────────────────────
function PostCard({
  post, token, onUpdate,
}: {
  post: NopePost; token?: string; onUpdate: (id: string, updates: Partial<NopePost>) => void;
}) {
  const [expanded,    setExpanded]    = useState(false);
  const [comments,    setComments]    = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loadingCmt,  setLoadingCmt]  = useState(false);
  const [showAll,     setShowAll]     = useState(false);

  const body = showAll ? post.body : post.body.slice(0, 280);
  const needsMore = post.body.length > 280;

  async function handleThank() {
    if (!token) return;
    const res = await fetch(`${API}/posts/${post.id}/thank`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const d = await res.json();
      onUpdate(post.id, { isThanked: d.thanked, thanksCount: d.count });
    }
  }

  async function handleSave() {
    if (!token) return;
    const res = await fetch(`${API}/posts/${post.id}/save`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const d = await res.json();
      onUpdate(post.id, { isSaved: d.saved });
    }
  }

  async function loadComments() {
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    const res = await fetch(`${API}/posts/${post.id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
    if (res.ok) { const d = await res.json(); setComments(d.comments ?? []); }
  }

  async function submitComment() {
    if (!commentText.trim() || !token) return;
    setLoadingCmt(true);
    const res = await fetch(`${API}/posts/${post.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: commentText.trim() }),
    });
    if (res.ok) {
      const cmt = await res.json();
      setComments(p => [cmt, ...p]);
      onUpdate(post.id, { commentCount: post.commentCount + 1 });
      setCommentText('');
    }
    setLoadingCmt(false);
  }

  return (
    <article style={{
      background: 'var(--bg)', border: '1.5px solid var(--border)',
      borderRadius: 14, overflow: 'hidden',
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = SAGE + '60')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{ padding: '20px 22px' }}>
        {/* Author + time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: SAGE, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
            }}>
              {post.authorName[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
              {post.authorName}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{timeAgo(post.createdAt)}</span>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {post.tags.map(t => (
              <span key={t} style={{
                fontSize: '0.68rem', fontWeight: 700,
                background: 'rgba(74,124,89,0.08)', color: SAGE,
                padding: '2px 8px', borderRadius: 999,
              }}>
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 style={{
          fontSize: '1rem', fontWeight: 700, color: 'var(--text)',
          marginBottom: 8, lineHeight: 1.4, letterSpacing: -0.2,
        }}>
          {post.title}
        </h2>

        {/* Body */}
        <p style={{
          fontSize: '0.88rem', color: 'var(--text-secondary)',
          lineHeight: 1.65, marginBottom: needsMore ? 4 : 0, whiteSpace: 'pre-wrap',
        }}>
          {body}{needsMore && !showAll ? '…' : ''}
        </p>
        {needsMore && (
          <button onClick={() => setShowAll(s => !s)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: SAGE, fontSize: '0.8rem', fontWeight: 600,
            padding: '2px 0', marginBottom: 4,
          }}>
            {showAll ? 'Thu gọn' : 'Đọc thêm'}
          </button>
        )}

        {/* Image */}
        {post.imageUrl && (
          <img src={post.imageUrl} alt="" style={{
            width: '100%', borderRadius: 10, marginTop: 10,
            maxHeight: 360, objectFit: 'cover',
          }}/>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', gap: 0,
        borderTop: '1px solid var(--border)',
      }}>
        {[
          {
            label: `❤️ ${post.thanksCount > 0 ? post.thanksCount : ''} Cảm ơn`,
            active: post.isThanked,
            onClick: handleThank,
            disabled: !token,
          },
          {
            label: `💬 ${post.commentCount > 0 ? post.commentCount : ''} Bình luận`,
            active: expanded,
            onClick: loadComments,
          },
          {
            label: post.isSaved ? '🔖 Đã lưu' : '🔖 Lưu',
            active: post.isSaved,
            onClick: handleSave,
            disabled: !token,
          },
        ].map(btn => (
          <button key={btn.label} onClick={btn.onClick} disabled={btn.disabled}
            style={{
              flex: 1, padding: '10px 4px',
              background: 'none', border: 'none', cursor: btn.disabled ? 'default' : 'pointer',
              fontSize: '0.8rem', fontWeight: btn.active ? 700 : 500,
              color: btn.active ? SAGE : 'var(--text-secondary)',
              transition: 'all 0.15s',
              opacity: btn.disabled ? 0.5 : 1,
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Comments section */}
      {expanded && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '16px 22px',
          background: 'var(--bg-surface)',
        }}>
          {/* Comment input */}
          {token && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Viết bình luận..."
                rows={2}
                style={{
                  flex: 1, padding: '8px 12px',
                  border: '1.5px solid var(--border)', borderRadius: 10,
                  fontFamily: 'inherit', fontSize: '0.85rem',
                  background: 'var(--bg)', color: 'var(--text)',
                  resize: 'vertical', outline: 'none',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
              <button onClick={submitComment} disabled={!commentText.trim() || loadingCmt}
                style={{
                  padding: '8px 16px', borderRadius: 10,
                  background: commentText.trim() ? SAGE : 'var(--border)',
                  color: commentText.trim() ? '#fff' : 'var(--gray)',
                  border: 'none', cursor: commentText.trim() ? 'pointer' : 'default',
                  fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600,
                  alignSelf: 'flex-end',
                }}>
                {loadingCmt ? '…' : 'Gửi'}
              </button>
            </div>
          )}

          {/* Comments list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {comments.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--gray)', textAlign: 'center', padding: '8px 0' }}>
                Chưa có bình luận nào. Hãy là người đầu tiên!
              </p>
            ) : comments.map(c => (
              <div key={c.id} style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'var(--bg)', border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>
                    {c.authorName}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray)' }}>{timeAgo(c.createdAt)}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

// ── Create Post Modal ─────────────────────────────────────────
function CreatePostModal({ token, onCreated, onClose }: {
  token: string; onCreated: (post: NopePost) => void; onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [body,  setBody]  = useState('');
  const [tags,  setTags]  = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) { setError('Vui lòng điền tiêu đề và nội dung.'); return; }
    setLoading(true); setError('');
    const res = await fetch(`${API}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: title.trim(),
        body:  body.trim(),
        tags:  tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      }),
    });
    if (res.ok) {
      const post = await res.json();
      onCreated({ ...post, tags: JSON.parse(post.tags ?? '[]'), thanksCount: 0, commentCount: 0, isThanked: false, isSaved: false });
      onClose();
    } else {
      setError('Đăng bài thất bại. Thử lại nhé.');
    }
    setLoading(false);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: 'var(--bg)', borderRadius: 16, padding: '28px 24px',
        width: '100%', maxWidth: 520,
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>
            🌿 Chia sẻ kinh nghiệm
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--gray)' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Tiêu đề bài viết *"
            autoFocus
            style={{
              padding: '11px 14px', borderRadius: 10,
              border: '1.5px solid var(--border)',
              fontFamily: 'inherit', fontSize: '0.95rem',
              background: 'var(--bg)', color: 'var(--text)', outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            placeholder="Chia sẻ câu chuyện, bài học, kinh nghiệm của bạn... *"
            rows={6}
            style={{
              padding: '11px 14px', borderRadius: 10,
              border: '1.5px solid var(--border)',
              fontFamily: 'inherit', fontSize: '0.88rem',
              background: 'var(--bg)', color: 'var(--text)',
              resize: 'vertical', outline: 'none', lineHeight: 1.6,
            }}
            onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
          <input
            value={tags} onChange={e => setTags(e.target.value)}
            placeholder="Tags: việc làm, sức khỏe, tài chính... (cách nhau bằng dấu phẩy)"
            style={{
              padding: '10px 14px', borderRadius: 10,
              border: '1.5px solid var(--border)',
              fontFamily: 'inherit', fontSize: '0.85rem',
              background: 'var(--bg)', color: 'var(--text)', outline: 'none',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
          {error && <p style={{ fontSize: '0.82rem', color: '#c0392b' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{
              padding: '10px 20px', borderRadius: 10,
              border: '1.5px solid var(--border)', background: 'none',
              color: 'var(--text)', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Hủy
            </button>
            <button type="submit" disabled={loading} style={{
              padding: '10px 24px', borderRadius: 10,
              background: SAGE, color: '#fff', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', fontWeight: 700, opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Đang đăng…' : 'Đăng bài'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function NopePage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const [posts,      setPosts]      = useState<NopePost[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [hasMore,    setHasMore]    = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search,     setSearch]     = useState('');
  const [searching,  setSearching]  = useState(false);

  const loadFeed = useCallback(async (p = 1) => {
    if (p === 1) setLoading(true);
    const res = await fetch(`${API}/posts?page=${p}&limit=20`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    if (res.ok) {
      const d = await res.json();
      setPosts(prev => p === 1 ? d.posts : [...prev, ...d.posts]);
      setHasMore(d.hasMore);
      setPage(p);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { loadFeed(1); }, [loadFeed]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) { loadFeed(1); return; }
    setSearching(true);
    const res = await fetch(`${API}/posts/search?q=${encodeURIComponent(search)}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    if (res.ok) {
      const d = await res.json();
      setPosts(d.posts);
      setHasMore(false);
    }
    setSearching(false);
  }

  const updatePost = (id: string, updates: Partial<NopePost>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 96px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20,
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>
            🌿 Nope
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Kinh nghiệm sống từ người thật
          </p>
        </div>
        {session && (
          <button onClick={() => setShowCreate(true)} style={{
            padding: '9px 18px', borderRadius: 10,
            background: SAGE, color: '#fff', border: 'none',
            cursor: 'pointer', fontFamily: 'inherit',
            fontWeight: 700, fontSize: '0.85rem',
          }}>
            ✏️ Chia sẻ
          </button>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kinh nghiệm, chủ đề..."
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 10,
            border: '1.5px solid var(--border)',
            fontFamily: 'inherit', fontSize: '0.88rem',
            background: 'var(--bg)', color: 'var(--text)', outline: 'none',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        />
        <button type="submit" disabled={searching} style={{
          padding: '10px 16px', borderRadius: 10,
          background: 'var(--bg-surface)', border: '1.5px solid var(--border)',
          cursor: 'pointer', color: 'var(--text)', fontFamily: 'inherit',
        }}>
          {searching ? '…' : '🔍'}
        </button>
      </form>

      {/* Feed */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              height: 160, borderRadius: 14,
              background: 'var(--bg-surface)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}/>
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🌱</div>
          <p style={{ fontSize: '0.95rem' }}>Chưa có bài nào. Hãy là người đầu tiên chia sẻ!</p>
          {session && (
            <button onClick={() => setShowCreate(true)} style={{
              marginTop: 16, padding: '10px 24px', borderRadius: 10,
              background: SAGE, color: '#fff', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700,
            }}>
              Chia sẻ ngay
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {posts.map(post => (
              <PostCard key={post.id} post={post} token={token} onUpdate={updatePost}/>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={() => loadFeed(page + 1)}
              style={{
                width: '100%', marginTop: 20, padding: '12px',
                background: 'var(--bg-surface)', border: '1.5px solid var(--border)',
                borderRadius: 10, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '0.88rem', color: 'var(--text-secondary)',
              }}
            >
              Xem thêm
            </button>
          )}
        </>
      )}

      {/* Login CTA */}
      {!session && (
        <div style={{
          marginTop: 24, padding: '20px', borderRadius: 12,
          background: 'rgba(74,124,89,0.05)', border: '1px solid rgba(74,124,89,0.2)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
            Đăng nhập để chia sẻ kinh nghiệm và cảm ơn bài viết 🌿
          </p>
          <Link href="/auth/login" style={{
            padding: '9px 22px', borderRadius: 10,
            background: SAGE, color: '#fff',
            textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem',
          }}>
            Đăng nhập
          </Link>
        </div>
      )}

      {/* Create post modal */}
      {showCreate && token && (
        <CreatePostModal
          token={token}
          onCreated={p => setPosts(prev => [p, ...prev])}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
