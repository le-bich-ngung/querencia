// useCuiBap — hook cho web chat widget (simplified version)
import { useState, useCallback } from 'react';

export interface CuiBapMessage {
  id:        string;
  content:   string;
  type:      string;
  sentAt:    string;
  sender:    { id: string; name: string };
  isOut:     boolean;
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
