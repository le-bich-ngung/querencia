ï»¿import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';
import { useChatStore } from '../store/chat.store';

const WS = __DEV__
  ? 'http://10.0.2.2:3001'
  : 'https://querencia-api.fly.dev';

function normalize(raw: any) {
  return {
    id: raw.id, sender: raw.sender,
    type: raw.type ?? 'text',
    content: raw.content ?? null,
    fileUrl: raw.file_url, fileName: raw.file_name, fileSize: raw.file_size,
    replyToId: raw.reply_to_id,
    isEdited: raw.is_edited ?? false, isDeleted: raw.is_deleted ?? false,
    reactions: raw.reactions ?? {}, sentAt: raw.sent_at ?? new Date().toISOString(),
  };
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken } = useAuthStore();
  const store = useChatStore();

  useEffect(() => {
    if (!accessToken) return;
    const socket = io(`${WS}/cuibap`, {
      auth: { token: accessToken },
      transports: ['websocket'],
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
    });
    socketRef.current = socket;

    socket.on('connect',    () => store.setConnected(true));
    socket.on('disconnect', () => store.setConnected(false));

    socket.on('new_message', (d: any) => {
      const msg = normalize(d.message);
      store.appendMessage(d.conversation_id, msg);
      store.updateConvPreview(d.conversation_id, msg);
    });

    socket.on('new_group_message', (d: any) => {
      const msg = normalize(d.message);
      store.appendMessage(d.group_id, msg);
    });

    socket.on('typing',      (d: any) => {
      store.setTyping(d.from_user_id, true);
      setTimeout(() => store.setTyping(d.from_user_id, false), 3000);
    });
    socket.on('stop_typing', (d: any) => store.setTyping(d.from_user_id, false));

    socket.on('message_edited',  (d: any) =>
      store.updateMessage('', d.message_id, { content: d.content, isEdited: true })
    );
    // Online presence
    socket.on('presence', (d: { user_id: string; online: boolean }) => {
      store.setUserOnline(d.user_id, d.online);
    });

    // Read receipts
    socket.on('message_delivered', (d: { conversation_id: string; message_ids: string[] }) => {
      store.updateReceipts(d.conversation_id, d.message_ids, 'delivered');
    });

    socket.on('message_read', (d: { conversation_id: string; message_ids: string[] }) => {
      store.updateReceipts(d.conversation_id, d.message_ids, 'read');
    });

    socket.on('message_deleted', (d: any) =>
      store.updateMessage('', d.message_id, { isDeleted: true, content: null })
    );

    // WebRTC signaling events â forwarded to useWebRTC hook
    // call_offer, call_answer, call_ice, call_end, call_reject

    return () => { socket.disconnect(); };
  }, [accessToken]); // eslint-disable-line

  const sendTyping = useCallback((targetId: string, convId: string) => {
    socketRef.current?.emit('typing', { conversation_id: convId, target_user_id: targetId });
  }, []);
  const stopTyping = useCallback((targetId: string) => {
    socketRef.current?.emit('stop_typing', { target_user_id: targetId });
  }, []);
  const sendCallOffer = useCallback((targetId: string, convId: string, callType: 'voice'|'video', sdp: string) => {
    socketRef.current?.emit('call_offer', { target_user_id: targetId, conversation_id: convId, call_type: callType, sdp });
  }, []);
  const sendCallAnswer = useCallback((targetId: string, sdp: string) => {
    socketRef.current?.emit('call_answer', { target_user_id: targetId, sdp });
  }, []);
  const sendIceCandidate = useCallback((targetId: string, candidate: any) => {
    socketRef.current?.emit('call_ice', { target_user_id: targetId, candidate });
  }, []);
  const sendCallEnd = useCallback((targetId: string) => {
    socketRef.current?.emit('call_end', { target_user_id: targetId });
  }, []);
  const sendCallReject = useCallback((targetId: string) => {
    socketRef.current?.emit('call_reject', { target_user_id: targetId });
  }, []);

  const onCallEvent = useCallback((event: string, cb: (data: any) => void) => {
    socketRef.current?.on(event, cb);
    return () => socketRef.current?.off(event, cb);
  }, []);

  return { sendTyping, stopTyping, sendCallOffer, sendCallAnswer, sendIceCandidate, sendCallEnd, sendCallReject, onCallEvent };
}
