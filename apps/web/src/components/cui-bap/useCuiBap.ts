ï»¿import { useState, useCallback } from 'react';

export interface CuiBapMessage {
  id:           string;
  content:      string;
  type:         string;
  msgType?:     string;
  sent_at?:     string;
  sentAt?:      string;
  sender?:      { id: string; name: string; avatarUrl?: string };
  isOut?:       boolean;
  is_deleted?:  boolean;
  is_edited?:   boolean;
  reply_to_id?: string | null;
  reactions?:   Record<string, number>;
  file_url?:    string;
  file_name?:   string;
  file_size?:   number;
}

export type CBMessage = CuiBapMessage;

export interface CBConversation {
  id:            string;
  userAId?:      string;
  userBId?:      string;
  lastMessageAt?: string;
  other_user?:   { id: string; name: string; avatarUrl?: string };
  is_online?:    boolean;
  last_message?: string;
  unread?:       number;
}

export interface CBGroup {
  id:            string;
  name:          string;
  avatarUrl?:    string;
  member_count?: number;
  memberCount?:  number;
  last_message?: string;
  unread?:       number;
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
