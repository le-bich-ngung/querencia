/**
 * useCuiBap — state + logic cho toàn bộ Cùi Bắp
 * Migrated từ cuibap.js — giữ y chang logic, chuyển sang React hooks
 */
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

// ── Types ────────────────────────────────────────────────────
export interface CBUser {
  id: string; name: string; email?: string; avatarUrl?: string;
}
export interface CBMessage {
  id: string;
  sender: CBUser;
  type: 'text' | 'image' | 'file' | 'audio' | 'location' | 'sticker';
  content: string | null;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_expires_at?: string;
  reply_to_id?: string;
  is_edited: boolean;
  is_deleted: boolean;
  is_pinned: boolean;
  reactions: Record<string, number>;
  sent_at: string;
}
export interface CBConversation {
  id: string;
  other_user: CBUser;
  is_online: boolean;
  last_message: { content: string | null; type: string; sent_at: string } | null;
  last_message_at: string;
}
export interface CBGroup {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  member_count: number;
  role: 'owner' | 'admin' | 'member';
  last_message: { content: string | null; sent_at: string } | null;
  last_message_at: string;
}

export type Tab = 'chats' | 'groups';
export type ChatType = 'direct' | 'group';

// ── Hook ─────────────────────────────────────────────────────
export function useCuiBap() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  // State
  const [tab,           setTab]           = useState<Tab>('chats');
  const [conversations, setConversations] = useState<CBConversation[]>([]);
  const [groups,        setGroups]        = useState<CBGroup[]>([]);
  const [messages,      setMessages]      = useState<CBMessage[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [currentType,   setCurrentType]   = useState<ChatType>('direct');
  const [currentOther,  setCurrentOther]  = useState<CBUser | null>(null);
  const [search,        setSearch]        = useState('');
  const [loading,       setLoading]       = useState(false);
  const [msgLoading,    setMsgLoading]    = useState(false);
  const [typingUser,    setTypingUser]    = useState<string | null>(null);
  const [replyTo,       setReplyTo]       = useState<CBMessage | null>(null);
  const [editingMsg,    setEditingMsg]    = useState<CBMessage | null>(null);
  const [hasMore,       setHasMore]       = useState(false);
  const [connected,     setConnected]     = useState(false);

  // Refs
  const socketRef    = useRef<Socket | null>(null);
  const typingTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEnd  = useRef<HTMLDivElement | null>(null);
  const myId         = useRef<string | undefined>((session as any)?.user?.id);

  // ── API helper ──────────────────────────────────────────────
  const api = useCallback(async (path: string, opts: RequestInit = {}) => {
    const res = await fetch(`/api/v1${path}`, {
      ...opts,
      headers: {
        ...(opts.body && !(opts.body instanceof FormData)
          ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers ?? {}),
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }, [token]);

  // ── WebSocket ───────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;

    const socket = io('/cuibap', {
      auth: { token },
      transports: ['websocket'],
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // New DM message
    socket.on('new_message', (data: { conversation_id: string; message: CBMessage }) => {
      if (data.conversation_id === currentConvId) {
        setMessages(prev => [...prev, data.message]);
        scrollToBottom();
      }
      // Update conv preview
      setConversations(prev => prev.map(c =>
        c.id === data.conversation_id
          ? { ...c, last_message: { content: data.message.content, type: data.message.type, sent_at: data.message.sent_at }, last_message_at: data.message.sent_at }
          : c
      ).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()));
      // Browser notification
      if (document.hidden && data.message.sender?.name) {
        if (Notification.permission === 'granted') {
          new Notification(`🌽 Cùi Bắp — ${data.message.sender.name}`, {
            body: (data.message.content || '📎 File').slice(0, 50),
          });
        }
      }
    });

    // New group message
    socket.on('new_group_message', (data: { group_id: string; message: CBMessage }) => {
      if (data.group_id === currentConvId && currentType === 'group') {
        setMessages(prev => [...prev, data.message]);
        scrollToBottom();
      }
      setGroups(prev => prev.map(g =>
        g.id === data.group_id
          ? { ...g, last_message: { content: data.message.content, sent_at: data.message.sent_at }, last_message_at: data.message.sent_at }
          : g
      ).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()));
    });

    // Typing
    socket.on('typing',      (d: { from_user_id: string }) => {
      setTypingUser(d.from_user_id);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setTypingUser(null), 3000);
    });
    socket.on('stop_typing', () => setTypingUser(null));

    // Edit / delete
    socket.on('message_edited',  (d: { message_id: string; content: string }) => {
      setMessages(prev => prev.map(m => m.id === d.message_id ? { ...m, content: d.content, is_edited: true } : m));
    });
    socket.on('message_deleted', (d: { message_id: string }) => {
      setMessages(prev => prev.map(m => m.id === d.message_id ? { ...m, is_deleted: true, content: null } : m));
    });

    // Reaction
    socket.on('reaction', (d: { message_id: string; emoji: string }) => {
      setMessages(prev => prev.map(m => {
        if (m.id !== d.message_id) return m;
        const r = { ...m.reactions };
        r[d.emoji] = (r[d.emoji] ?? 0) + 1;
        return { ...m, reactions: r };
      }));
    });

    // Request notification permission
    if (Notification.permission === 'default') Notification.requestPermission();

    return () => { socket.disconnect(); };
  }, [token]); // eslint-disable-line

  // ── Load data ───────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api('/cuibap/conversations');
      setConversations(data);
    } catch {} finally { setLoading(false); }
  }, [api, token]);

  const loadGroups = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api('/cuibap/groups');
      setGroups(data);
    } catch {}
  }, [api, token]);

  useEffect(() => {
    if (token) { loadConversations(); loadGroups(); }
  }, [token, loadConversations, loadGroups]);

  // ── Open conversation ────────────────────────────────────────
  const openConversation = useCallback(async (id: string, type: ChatType) => {
    setCurrentConvId(id);
    setCurrentType(type);
    setMessages([]);
    setMsgLoading(true);
    setReplyTo(null);
    setEditingMsg(null);

    // Set current other user
    if (type === 'direct') {
      const conv = conversations.find(c => c.id === id);
      if (conv) setCurrentOther(conv.other_user);
    } else {
      const group = groups.find(g => g.id === id);
      if (group) setCurrentOther({ id: group.id, name: group.name });
    }

    try {
      const url = type === 'direct'
        ? `/cuibap/conversations/${id}/messages`
        : `/cuibap/groups/${id}/messages`;
      const data = await api(url);
      setMessages(data.messages ?? data);
      setHasMore(data.hasMore ?? false);
      scrollToBottom(true);
    } catch {} finally { setMsgLoading(false); }

    // Mark read
    try { await api(`/cuibap/conversations/${id}/read`, { method: 'POST' }); } catch {}
  }, [api, conversations, groups]);

  // ── Send message ─────────────────────────────────────────────
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !currentConvId) return;
    const url = currentType === 'direct'
      ? `/cuibap/conversations/${currentConvId}/messages`
      : `/cuibap/groups/${currentConvId}/messages`;
    try {
      const msg = await api(url, {
        method: 'POST',
        body: JSON.stringify({
          content,
          msgType: 'text',
          replyToId: replyTo?.id,
        }),
      });
      setMessages(prev => [...prev, msg]);
      setReplyTo(null);
      scrollToBottom();
    } catch {}
  }, [api, currentConvId, currentType, replyTo]);

  // ── Upload file ──────────────────────────────────────────────
  const uploadFile = useCallback(async (file: File) => {
    if (!currentConvId) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const upload = await api('/cuibap/upload', { method: 'POST', body: formData });
      const type = file.type.startsWith('image/') ? 'image'
        : file.type.startsWith('audio/') ? 'audio' : 'file';
      const url = currentType === 'direct'
        ? `/cuibap/conversations/${currentConvId}/messages`
        : `/cuibap/groups/${currentConvId}/messages`;
      const msg = await api(url, {
        method: 'POST',
        body: JSON.stringify({
          content: file.name,
          msgType: type,
          fileUrl: upload.url,
          fileName: file.name,
          fileSize: file.size,
        }),
      });
      setMessages(prev => [...prev, msg]);
      scrollToBottom();
    } catch {}
  }, [api, currentConvId, currentType]);

  // ── Edit / Delete ────────────────────────────────────────────
  const editMessage = useCallback(async (msgId: string, content: string) => {
    await api(`/cuibap/messages/${msgId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content, is_edited: true } : m));
    setEditingMsg(null);
  }, [api]);

  const deleteMessage = useCallback(async (msgId: string) => {
    await api(`/cuibap/messages/${msgId}`, { method: 'DELETE' });
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, is_deleted: true, content: null } : m));
  }, [api]);

  // ── React ────────────────────────────────────────────────────
  const reactToMessage = useCallback(async (msgId: string, emoji: string) => {
    await api(`/cuibap/messages/${msgId}/react`, {
      method: 'POST',
      body: JSON.stringify({ emoji }),
    });
  }, [api]);

  // ── Typing ───────────────────────────────────────────────────
  const sendTyping = useCallback(() => {
    if (!socketRef.current || !currentConvId || !currentOther) return;
    socketRef.current.emit('typing', {
      conversation_id: currentConvId,
      target_user_id: currentOther.id,
    });
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socketRef.current?.emit('stop_typing', { target_user_id: currentOther?.id });
    }, 2000);
  }, [currentConvId, currentOther]);

  // ── Create conv / group ──────────────────────────────────────
  const createConversation = useCallback(async (targetUserId: string) => {
    const data = await api('/cuibap/conversations', {
      method: 'POST',
      body: JSON.stringify({ target_user_id: targetUserId }),
    });
    await loadConversations();
    openConversation(data.id, 'direct');
  }, [api, loadConversations, openConversation]);

  const createGroup = useCallback(async (name: string, description?: string) => {
    const data = await api('/cuibap/groups', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
    await loadGroups();
    openConversation(data.id, 'group');
  }, [api, loadGroups, openConversation]);

  // ── Helpers ──────────────────────────────────────────────────
  const scrollToBottom = (instant = false) => {
    setTimeout(() => {
      messagesEnd.current?.scrollIntoView({ behavior: instant ? 'auto' : 'smooth' });
    }, 50);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  // Filtered lists
  const filteredConvs = conversations.filter(c =>
    c.other_user.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.other_user.email?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return {
    // State
    tab, setTab,
    conversations: filteredConvs,
    groups: filteredGroups,
    messages,
    currentConvId, currentType, currentOther,
    search, setSearch,
    loading, msgLoading,
    typingUser,
    replyTo, setReplyTo,
    editingMsg, setEditingMsg,
    hasMore, connected,
    messagesEnd,
    myId: myId.current,
    // Actions
    openConversation,
    sendMessage,
    uploadFile,
    editMessage,
    deleteMessage,
    reactToMessage,
    sendTyping,
    createConversation,
    createGroup,
    loadConversations,
    loadGroups,
    // Utils
    formatSize, formatTime,
  };
}
