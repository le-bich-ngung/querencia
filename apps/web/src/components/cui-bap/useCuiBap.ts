import { useState, useCallback } from 'react';

export interface CuiBapMessage {
  id:           string;
  content:      string;
  type:         string;
  msgType?:     string;
  sentAt:       string;
  sender:       { id: string; name: string; avatarUrl?: string };
  isOut:        boolean;
  is_deleted?:  boolean;
  replyTo?:     CuiBapMessage | null;
  reactions?:   { emoji: string; count: number; byMe: boolean }[];
  fileUrl?:     string;
  fileName?:    string;
  fileSize?:    number;
  location?:    { lat: number; lng: number; label?: string };
}

// Aliases used by dashboard page
export type CBMessage      = CuiBapMessage;
export interface CBConversation {
  id:           string;
  userAId:      string;
  userBId:      string;
  lastMessageAt: string;
  other?: { id: string; name: string; avatarUrl?: string };
  unread?: number;
  lastMessage?: string;
}
export interface CBGroup {
  id:        string;
  name:      string;
  avatarUrl?: string;
  memberCount?: number;
  unread?: number;
  lastMessage?: string;
}

export function useCuiBap(convId: string, token?: string) {
  const [messages, setMessages] = useState<CuiBapMessage[]>([]);
  const [loading,  setLoading]  = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!token || !convId) return;
    const res = await fetch(`/api/v1/cuibap/conversations/${convId}/messages`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ content, msgType: 'text' }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages(p => [...p, { ...msg, isOut: true }]);
    }
  }, [convId, token]);

  return { messages, setMessages, loading, setLoading, sendMessage };
}
