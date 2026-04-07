ï»¿'use client';
/**
 * CÃ¹i Báº¯p â Trang chat chÃ­nh
 * Layout: Sidebar (conv list) | Chat window
 * Mobile: slide giá»¯a sidebar vÃ  chat
 */
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCuiBap } from '../../../components/cui-bap/useCuiBap';
import type { CBMessage, CBConversation, CBGroup } from '../../../components/cui-bap/useCuiBap';

// ââ Constants ââââââââââââââââââââââââââââââââââââââââââââââââââ
const SAGE       = '#4a7c59';
const REACTIONS  = ['â¤ï¸','ð','ð','ð®','ð¢','ð¥','ð','ð','ð','ð¯'];
const EMOJI_PICK = ['ð','ð','â¤ï¸','ð','ð','ð¥','ð','ð®','ð¢','ð¯','â¨','ð¿','ð½','ð','ð¤','ðª'];

// ââ Avatar ââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function Avatar({ name, size = 38, color = SAGE }: { name: string; size?: number; color?: string }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: '#fff', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.38,
    }}>
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}

// ââ Online dot âââââââââââââââââââââââââââââââââââââââââââââââââ
const OnlineDot = () => (
  <div style={{
    position: 'absolute', bottom: 0, right: 0,
    width: 10, height: 10, borderRadius: '50%',
    background: '#22c55e', border: '2px solid var(--bg)',
  }}/>
);

// ââ Format size ââââââââââââââââââââââââââââââââââââââââââââââââ
function fmtSize(b?: number) {
  if (!b) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`;
  return `${(b/1048576).toFixed(1)} MB`;
}

// ââ Message bubble âââââââââââââââââââââââââââââââââââââââââââââ
function MessageBubble({
  msg, isOut, onReply, onEdit, onDelete, onReact, formatTime,
}: {
  msg: CBMessage; isOut: boolean;
  onReply: (m: CBMessage) => void;
  onEdit:  (m: CBMessage) => void;
  onDelete:(id: string) => void;
  onReact: (id: string, emoji: string) => void;
  formatTime: (s: string) => string;
}) {
  const [showActions, setShowActions] = useState(false);
  const [showReacts,  setShowReacts]  = useState(false);

  const bubbleStyle: React.CSSProperties = {
    maxWidth: '72%',
    padding: msg.type === 'image' ? '4px' : '9px 13px',
    borderRadius: isOut ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
    background: isOut ? SAGE : 'var(--bg-surface)',
    color: isOut ? '#fff' : 'var(--text)',
    fontSize: '0.88rem',
    lineHeight: 1.5,
    wordBreak: 'break-word',
    position: 'relative',
  };

  if (msg.is_deleted) {
    return (
      <div style={{ display: 'flex', justifyContent: isOut ? 'flex-end' : 'flex-start', padding: '2px 16px' }}>
        <div style={{ ...bubbleStyle, opacity: 0.45, fontStyle: 'italic', fontSize: '0.8rem' }}>
          ð Tin nháº¯n ÄÃ£ bá» xÃ³a
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ display: 'flex', justifyContent: isOut ? 'flex-end' : 'flex-start', padding: '2px 12px', gap: 8, alignItems: 'flex-end' }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowReacts(false); }}
    >
      {/* Incoming: avatar bÃªn trÃ¡i */}
      {!isOut && (
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Avatar name={msg.sender?.name ?? '?'} size={28}/>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isOut ? 'flex-end' : 'flex-start', gap: 2, maxWidth: '75%' }}>
        {/* Sender name (group) */}
        {!isOut && msg.sender?.name && (
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, paddingLeft: 4 }}>
            {msg.sender.name}
          </span>
        )}

        {/* Reply preview */}
        {msg.reply_to_id && (
          <div style={{
            fontSize: '0.72rem', padding: '4px 10px',
            background: isOut ? 'rgba(255,255,255,0.15)' : 'var(--border)',
            borderRadius: 8, borderLeft: `2px solid ${isOut ? 'rgba(255,255,255,0.5)' : SAGE}`,
            color: isOut ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
            maxWidth: '100%', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            â©ï¸ Tráº£ lá»i tin nháº¯n
          </div>
        )}

        <div style={bubbleStyle}>
          {/* Content by type */}
          {msg.type === 'image' && msg.file_url ? (
            <img
              src={msg.file_url} alt={msg.file_name}
              style={{ maxWidth: 240, maxHeight: 240, borderRadius: 12, display: 'block', cursor: 'pointer' }}
              onClick={() => window.open(msg.file_url)}
            />
          ) : msg.type === 'audio' && msg.file_url ? (
            <audio controls src={msg.file_url} style={{ maxWidth: 220, display: 'block' }}/>
          ) : msg.type === 'file' && msg.file_url ? (
            <a href={msg.file_url} target="_blank" rel="noreferrer"
              style={{ color: isOut ? '#fff' : SAGE, textDecoration: 'none', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem' }}>ð</span>
              <span>
                <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{msg.file_name || 'File'}</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>{fmtSize(msg.file_size)}</div>
              </span>
            </a>
          ) : (
            <>
              {msg.content}
              {msg.is_edited && (
                <span style={{ fontSize: '0.62rem', opacity: 0.6, marginLeft: 4 }}>(ÄÃ£ sá»­a)</span>
              )}
            </>
          )}
        </div>

        {/* Reactions */}
        {Object.keys(msg.reactions ?? {}).length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', paddingLeft: isOut ? 0 : 4 }}>
            {Object.entries(msg.reactions).map(([emoji, count]) => (
              <button key={emoji} onClick={() => onReact(msg.id, emoji)} style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 999, padding: '1px 7px',
                fontSize: '0.72rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                {emoji} <span style={{ fontWeight: 600 }}>{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Time + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: isOut ? 0 : 4 }}>
          <span style={{ fontSize: '0.62rem', color: 'var(--gray)' }}>
            {formatTime(msg.sent_at)}
          </span>
          {showActions && (
            <div style={{ display: 'flex', gap: 2 }}>
              <ActionBtn onClick={() => setShowReacts(s => !s)} title="React">ð</ActionBtn>
              <ActionBtn onClick={() => onReply(msg)} title="Reply">â©ï¸</ActionBtn>
              {isOut && <>
                <ActionBtn onClick={() => onEdit(msg)} title="Sá»­a">âï¸</ActionBtn>
                <ActionBtn onClick={() => onDelete(msg.id)} title="XÃ³a">ðï¸</ActionBtn>
              </>}
            </div>
          )}
        </div>

        {/* Reaction picker */}
        {showReacts && (
          <div style={{
            display: 'flex', gap: 2, flexWrap: 'wrap',
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '6px 8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            zIndex: 10,
          }}>
            {REACTIONS.map(e => (
              <button key={e} onClick={() => { onReact(msg.id, e); setShowReacts(false); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '1.3rem', padding: '3px', borderRadius: 6,
                  transition: 'transform 0.1s',
                }}
                onMouseEnter={ev => (ev.currentTarget.style.transform = 'scale(1.3)')}
                onMouseLeave={ev => (ev.currentTarget.style.transform = '')}
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const ActionBtn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
  <button onClick={onClick} title={title} style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 6, padding: '2px 5px', cursor: 'pointer',
    fontSize: '0.8rem', lineHeight: 1,
  }}>
    {children}
  </button>
);

// ââ Conversation item âââââââââââââââââââââââââââââââââââââââââââ
function ConvItem({ conv, active, onClick }: { conv: CBConversation; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', width: '100%', textAlign: 'left',
      background: active ? 'rgba(74,124,89,0.08)' : 'none',
      border: 'none', cursor: 'pointer', borderRadius: 10,
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-surface)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'none'; }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar name={conv.other_user.name} size={38}/>
        {conv.is_online && <OnlineDot/>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', marginBottom: 2 }}>
          {conv.other_user.name}
        </div>
        <div style={{
          fontSize: '0.75rem', color: 'var(--text-secondary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {conv.last_message?.content || conv.last_message?.type === 'image' ? 'ð· HÃ¬nh áº£nh'
            : conv.last_message?.type === 'file' ? 'ð File'
            : conv.last_message?.type === 'audio' ? 'ðµ Audio'
            : 'Báº¯t Äáº§u trÃ² chuyá»n'}
        </div>
      </div>
    </button>
  );
}

// ââ Group item âââââââââââââââââââââââââââââââââââââââââââââââââ
function GroupItem({ group, active, onClick }: { group: CBGroup; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', width: '100%', textAlign: 'left',
      background: active ? 'rgba(74,124,89,0.08)' : 'none',
      border: 'none', cursor: 'pointer', borderRadius: 10,
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-surface)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'none'; }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: '#7c5cbf', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem', flexShrink: 0,
      }}>
        ð¥
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)', marginBottom: 2 }}>
          {group.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {group.member_count} thÃ nh viÃªn
          {group.last_message ? ` Â· ${group.last_message.content || 'ð File'}` : ''}
        </div>
      </div>
    </button>
  );
}

// ââ Main page ââââââââââââââââââââââââââââââââââââââââââââââââââ
export default function CuiBapPage() {
  const { data: session, status } = useSession();
  const cb = useCuiBap();

  // Input state
  const [inputText,    setInputText]    = useState('');
  const [editText,     setEditText]     = useState('');
  const [showNewChat,  setShowNewChat]  = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [showEmoji,    setShowEmoji]    = useState(false);
  const [mobileView,   setMobileView]   = useState<'sidebar' | 'chat'>('sidebar');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Not logged in
  if (status === 'loading') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ color: 'var(--text-secondary)' }}>Äang táº£i...</div>
    </div>
  );

  if (!session) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
      <div style={{ fontSize: '3rem' }}>ð½</div>
      <p style={{ fontWeight: 600, fontSize: '1rem' }}>Báº¡n cáº§n ÄÄng nháº­p Äá» dÃ¹ng CÃ¹i Báº¯p</p>
      <Link href="/auth/login" style={{
        padding: '10px 28px', background: SAGE, color: '#fff',
        borderRadius: 20, textDecoration: 'none', fontWeight: 600,
      }}>
        ÄÄng nháº­p
      </Link>
    </div>
  );

  // Handlers
  const handleSend = async () => {
    if (!inputText.trim()) return;
    await cb.sendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await cb.uploadFile(file);
    e.target.value = '';
  };

  const openConv = (id: string, type: 'direct' | 'group') => {
    cb.openConversation(id, type);
    setMobileView('chat');
  };

  const goBack = () => {
    setMobileView('sidebar');
  };

  const sidebarVisible  = mobileView === 'sidebar';
  const chatVisible     = mobileView === 'chat';

  return (
    <>
      <style>{`
        @media (min-width: 640px) {
          .cb-sidebar  { display: flex !important; }
          .cb-chat     { display: flex !important; }
          .cb-back-btn { display: none !important; }
        }
        .cb-input:focus { outline: none; }
        .cb-input { resize: none; }
      `}</style>

      <div style={{
        display: 'flex', height: 'calc(100vh - 54px - 72px)',
        background: 'var(--bg)', overflow: 'hidden',
      }}>

        {/* ââ SIDEBAR âââââââââââââââââââââââââââââââââââââââââ */}
        <div className="cb-sidebar" style={{
          width: 300, flexShrink: 0,
          borderRight: '1px solid var(--border)',
          display: sidebarVisible ? 'flex' : 'none',
          flexDirection: 'column',
          background: 'var(--bg)',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h2 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
                ð½ CÃ¹i Báº¯p
              </h2>
              <div style={{ display: 'flex', gap: 6 }}>
                <IconBtn title="Nháº¯n tin má»i" onClick={() => setShowNewChat(true)}>âï¸</IconBtn>
                <IconBtn title="Táº¡o nhÃ³m" onClick={() => setShowNewGroup(true)}>ð¥</IconBtn>
              </div>
            </div>
            {/* Search */}
            <input
              type="text" placeholder="TÃ¬m kiáº¿m..."
              value={cb.search} onChange={e => cb.setSearch(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px',
                border: '1.5px solid var(--border)', borderRadius: 10,
                fontFamily: 'inherit', fontSize: '0.82rem',
                background: 'var(--bg-surface)', color: 'var(--text)',
                outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {(['chats', 'groups'] as const).map(t => (
                <button key={t} onClick={() => cb.setTab(t)} style={{
                  flex: 1, padding: '6px', borderRadius: 8,
                  border: 'none', cursor: 'pointer',
                  background: cb.tab === t ? SAGE : 'var(--bg-surface)',
                  color: cb.tab === t ? '#fff' : 'var(--text-secondary)',
                  fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 600,
                  transition: 'all 0.15s',
                }}>
                  {t === 'chats' ? 'ð¬ Chat' : 'ð¥ NhÃ³m'}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {cb.loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                Äang táº£i...
              </div>
            ) : cb.tab === 'chats' ? (
              cb.conversations.length === 0 ? (
                <Empty
                  emoji="ð¬" text="ChÆ°a cÃ³ cuá»c trÃ² chuyá»n nÃ o"
                  action="Nháº¯n tin má»i" onAction={() => setShowNewChat(true)}
                />
              ) : (
                cb.conversations.map(c => (
                  <ConvItem
                    key={c.id} conv={c}
                    active={cb.currentConvId === c.id && cb.currentType === 'direct'}
                    onClick={() => openConv(c.id, 'direct')}
                  />
                ))
              )
            ) : (
              cb.groups.length === 0 ? (
                <Empty
                  emoji="ð¥" text="ChÆ°a cÃ³ nhÃ³m nÃ o"
                  action="Táº¡o nhÃ³m" onAction={() => setShowNewGroup(true)}
                />
              ) : (
                cb.groups.map(g => (
                  <GroupItem
                    key={g.id} group={g}
                    active={cb.currentConvId === g.id && cb.currentType === 'group'}
                    onClick={() => openConv(g.id, 'group')}
                  />
                ))
              )
            )}
          </div>
        </div>

        {/* ââ CHAT WINDOW âââââââââââââââââââââââââââââââââââââ */}
        <div className="cb-chat" style={{
          flex: 1, display: chatVisible ? 'flex' : cb.currentConvId ? 'flex' : 'none',
          flexDirection: 'column', minWidth: 0,
        }}>
          {cb.currentConvId ? (
            <>
              {/* Chat header */}
              <div style={{
                height: 56, padding: '0 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg)',
                flexShrink: 0,
              }}>
                {/* Mobile back */}
                <button className="cb-back-btn" onClick={goBack} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '1.1rem', padding: '4px 8px 4px 0',
                  display: sidebarVisible ? 'none' : 'block',
                }}>
                  â¹
                </button>

                {cb.currentType === 'direct' ? (
                  <div style={{ position: 'relative' }}>
                    <Avatar name={cb.currentOther?.name ?? '?'} size={36}/>
                    {cb.conversations.find(c => c.id === cb.currentConvId)?.is_online && <OnlineDot/>}
                  </div>
                ) : (
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#7c5cbf', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0,
                  }}>ð¥</div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                    {cb.currentOther?.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {cb.typingUser ? (
                      <span style={{ color: SAGE }}>Äang nháº­p...</span>
                    ) : cb.currentType === 'direct' ? (
                      cb.conversations.find(c => c.id === cb.currentConvId)?.is_online
                        ? 'ð¢ online' : 'offline'
                    ) : (
                      `${cb.groups.find(g => g.id === cb.currentConvId)?.member_count ?? 0} thÃ nh viÃªn`
                    )}
                  </div>
                </div>
                {/* Call buttons */}
                <IconBtn title="Gá»i thoáº¡i" onClick={() => alert('Gá»i thoáº¡i â sáº¯p cÃ³ trÃªn app!')}>ð</IconBtn>
                <IconBtn title="Gá»i video" onClick={() => alert('Gá»i video â sáº¯p cÃ³ trÃªn app!')}>ð¹</IconBtn>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
                {cb.msgLoading ? (
                  <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    Äang táº£i tin nháº¯n...
                  </div>
                ) : cb.messages.length === 0 ? (
                  <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    Báº¯t Äáº§u cuá»c trÃ² chuyá»n ð
                  </div>
                ) : (
                  cb.messages.map(msg => (
                    <MessageBubble
                      key={msg.id}
                      msg={msg}
                      isOut={msg.sender?.id === (session as any)?.user?.id}
                      onReply={m => { cb.setReplyTo(m); }}
                      onEdit={m => { cb.setEditingMsg(m); setEditText(m.content ?? ''); }}
                      onDelete={cb.deleteMessage}
                      onReact={cb.reactToMessage}
                      formatTime={cb.formatTime}
                    />
                  ))
                )}
                <div ref={cb.messagesEnd}/>
              </div>

              {/* Reply preview */}
              {cb.replyTo && (
                <div style={{
                  padding: '8px 16px',
                  background: 'var(--bg-surface)',
                  borderTop: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{ flex: 1, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: SAGE, fontWeight: 600 }}>â©ï¸ Tráº£ lá»i:</span>{' '}
                    {cb.replyTo.content?.slice(0, 60)}
                  </div>
                  <button onClick={() => cb.setReplyTo(null)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--gray)', fontSize: '1rem',
                  }}>â</button>
                </div>
              )}

              {/* Edit bar */}
              {cb.editingMsg && (
                <div style={{
                  padding: '8px 16px',
                  background: '#fef9ee',
                  borderTop: '1px solid #fde68a',
                  display: 'flex', gap: 10, alignItems: 'center',
                }}>
                  <input
                    autoFocus value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { cb.editMessage(cb.editingMsg!.id, editText); }
                      if (e.key === 'Escape') cb.setEditingMsg(null);
                    }}
                    style={{
                      flex: 1, padding: '8px 12px', border: '1.5px solid #fde68a',
                      borderRadius: 8, fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none',
                      background: '#fff',
                    }}
                    placeholder="Sá»­a tin nháº¯n... (Enter Äá» lÆ°u, Esc Äá» há»§y)"
                  />
                  <button onClick={() => cb.editMessage(cb.editingMsg!.id, editText)} style={{
                    padding: '8px 14px', background: SAGE, color: '#fff',
                    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                  }}>LÆ°u</button>
                  <button onClick={() => cb.setEditingMsg(null)} style={{
                    padding: '8px 10px', background: 'none',
                    border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem',
                  }}>Há»§y</button>
                </div>
              )}

              {/* Input area */}
              <div style={{
                padding: '10px 12px',
                borderTop: '1px solid var(--border)',
                background: 'var(--bg)',
                display: 'flex', gap: 8, alignItems: 'flex-end',
                flexShrink: 0,
              }}>
                {/* Attach file */}
                <input type="file" ref={fileInputRef} onChange={handleFile} style={{ display: 'none' }}/>
                <IconBtn title="ÄÃ­nh kÃ¨m file" onClick={() => fileInputRef.current?.click()}>ð</IconBtn>

                {/* Emoji picker toggle */}
                <div style={{ position: 'relative' }}>
                  <IconBtn title="Emoji" onClick={() => setShowEmoji(s => !s)}>ð</IconBtn>
                  {showEmoji && (
                    <div style={{
                      position: 'absolute', bottom: '100%', left: 0, marginBottom: 6,
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: 12, padding: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      display: 'flex', flexWrap: 'wrap', gap: 4, width: 200, zIndex: 20,
                    }}>
                      {EMOJI_PICK.map(e => (
                        <button key={e} onClick={() => { setInputText(t => t + e); setShowEmoji(false); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', padding: 3, borderRadius: 6 }}>
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Text input */}
                <textarea
                  className="cb-input"
                  value={inputText}
                  onChange={e => {
                    setInputText(e.target.value);
                    // Auto resize
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    cb.sendTyping();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Nháº¯n tin..."
                  rows={1}
                  style={{
                    flex: 1, padding: '9px 13px',
                    border: '1.5px solid var(--border)',
                    borderRadius: 20, fontFamily: 'inherit',
                    fontSize: '0.88rem', background: 'var(--bg-surface)',
                    color: 'var(--text)', lineHeight: 1.4,
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                />

                {/* Send */}
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: inputText.trim() ? SAGE : 'var(--bg-surface)',
                    color: inputText.trim() ? '#fff' : 'var(--gray)',
                    border: 'none', cursor: inputText.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', transition: 'all 0.15s', flexShrink: 0,
                  }}
                >
                  â¤
                </button>
              </div>
            </>
          ) : (
            /* Empty state â no conv selected */
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)', gap: 16,
            }}>
              <div style={{ fontSize: '3rem' }}>ð½</div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', textAlign: 'center' }}>
                Chá»n má»t cuá»c trÃ² chuyá»n<br/>hoáº·c báº¯t Äáº§u nháº¯n tin má»i
              </p>
              <button onClick={() => setShowNewChat(true)} style={{
                padding: '9px 22px', background: SAGE, color: '#fff',
                border: 'none', borderRadius: 20, cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
              }}>
                âï¸ Nháº¯n tin má»i
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ââ MODAL: New Chat âââââââââââââââââââââââââââââââââââ */}
      {showNewChat && (
        <Modal title="âï¸ Nháº¯n tin má»i" onClose={() => { setShowNewChat(false); setNewChatEmail(''); }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
            Nháº­p email ngÆ°á»i báº¡n muá»n nháº¯n tin
          </p>
          <ModalInput
            autoFocus
            type="email" placeholder="ban@email.com"
            value={newChatEmail} onChange={e => setNewChatEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && cb.createConversation(newChatEmail).then(() => setShowNewChat(false))}
          />
          <ModalBtn onClick={() => cb.createConversation(newChatEmail).then(() => { setShowNewChat(false); setNewChatEmail(''); })}>
            Báº¯t Äáº§u chat
          </ModalBtn>
        </Modal>
      )}

      {/* ââ MODAL: New Group ââââââââââââââââââââââââââââââââââ */}
      {showNewGroup && (
        <Modal title="ð¥ Táº¡o nhÃ³m má»i" onClose={() => { setShowNewGroup(false); setNewGroupName(''); setNewGroupDesc(''); }}>
          <ModalInput
            autoFocus
            type="text" placeholder="TÃªn nhÃ³m *"
            value={newGroupName} onChange={e => setNewGroupName(e.target.value)}
          />
          <ModalInput
            type="text" placeholder="MÃ´ táº£ nhÃ³m (tÃ¹y chá»n)"
            value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)}
          />
          <ModalBtn
            disabled={!newGroupName.trim()}
            onClick={() => cb.createGroup(newGroupName, newGroupDesc).then(() => { setShowNewGroup(false); setNewGroupName(''); setNewGroupDesc(''); })}
          >
            Táº¡o nhÃ³m
          </ModalBtn>
        </Modal>
      )}
    </>
  );
}

// ââ Reusable small components ââââââââââââââââââââââââââââââââââ

const IconBtn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
  <button onClick={onClick} title={title} style={{
    background: 'none', border: 'none', cursor: 'pointer',
    width: 32, height: 32, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1rem', color: 'var(--text-secondary)', flexShrink: 0,
    transition: 'background 0.15s',
  }}
    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
  >
    {children}
  </button>
);

const Empty = ({ emoji, text, action, onAction }: { emoji: string; text: string; action: string; onAction: () => void }) => (
  <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)' }}>
    <div style={{ fontSize: '2rem', marginBottom: 8 }}>{emoji}</div>
    <p style={{ fontSize: '0.82rem', marginBottom: 12 }}>{text}</p>
    <button onClick={onAction} style={{
      padding: '7px 16px', background: SAGE, color: '#fff',
      border: 'none', borderRadius: 16, cursor: 'pointer',
      fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 600,
    }}>{action}</button>
  </div>
);

const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div style={{
      background: 'var(--bg)', borderRadius: 16, padding: '28px 24px',
      width: '100%', maxWidth: 400,
      boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', fontSize: '1.1rem' }}>â</button>
      </div>
      {children}
    </div>
  </div>
);

const ModalInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} style={{
    width: '100%', padding: '10px 14px',
    border: '1.5px solid var(--border)', borderRadius: 10,
    fontFamily: 'inherit', fontSize: '0.88rem',
    background: 'var(--bg-surface)', color: 'var(--text)',
    outline: 'none', boxSizing: 'border-box',
  }}
    onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
  />
);

const ModalBtn = ({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: '11px', background: disabled ? 'var(--bg-surface)' : SAGE,
    color: disabled ? 'var(--gray)' : '#fff',
    border: 'none', borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600,
    marginTop: 4, transition: 'all 0.15s',
  }}>
    {children}
  </button>
);
