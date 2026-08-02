/**
 * Offline Message Queue
 * Khi gửi tin nhắn thất bại do mất mạng → lưu vào MMKV queue
 * Khi mạng trở lại (NetInfo) → tự động retry theo thứ tự
 */
import { MMKV }    from 'react-native-mmkv';
import NetInfo     from '@react-native-community/netinfo';
import { api }     from './api';
import { useChatStore } from '../store/chat.store';

const storage = new MMKV({ id: 'offline-queue' });
const KEY      = 'pending_messages';

export interface QueuedMessage {
  tempId:    string;
  convId:    string;
  convType:  'direct' | 'group';
  body:      object;
  queuedAt:  string;
  retries:   number;
}

// ── Queue operations ──────────────────────────────────────────
function readQueue(): QueuedMessage[] {
  try {
    const raw = storage.getString(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeQueue(q: QueuedMessage[]) {
  try { storage.set(KEY, JSON.stringify(q)); } catch {}
}

export function enqueue(msg: QueuedMessage) {
  const q = readQueue();
  q.push(msg);
  writeQueue(q);
}

export function dequeue(tempId: string) {
  const q = readQueue().filter(m => m.tempId !== tempId);
  writeQueue(q);
}

export function getPending(): QueuedMessage[] {
  return readQueue();
}

export function getQueueSize(): number {
  return readQueue().length;
}

// ── Flush - gửi tất cả pending khi mạng có lại ───────────────
let isFlushing = false;

export async function flushQueue(): Promise<void> {
  if (isFlushing) return;
  const queue = readQueue();
  if (!queue.length) return;

  isFlushing = true;
  const store = useChatStore.getState();

  for (const msg of queue) {
    try {
      const sent = msg.convType === 'direct'
        ? await api.sendMsg(msg.convId, msg.body)
        : await api.sendGroupMsg(msg.convId, msg.body);

      // Replace optimistic với real message
      store.updateMessage(msg.convId, msg.tempId, {
        ...sent, id: sent.id, pending: false, receiptStatus: 'sent',
      });
      dequeue(msg.tempId);
    } catch {
      // Update retry count - bỏ qua nếu đã retry > 5 lần
      const q = readQueue();
      const idx = q.findIndex(m => m.tempId === msg.tempId);
      if (idx >= 0) {
        q[idx].retries++;
        if (q[idx].retries > 5) {
          // Đánh dấu failed
          store.updateMessage(msg.convId, msg.tempId, {
            isDeleted: true, content: '[Gửi thất bại - không có mạng]', pending: false,
          });
          q.splice(idx, 1); // xóa khỏi queue
        }
        writeQueue(q);
      }
    }
  }
  isFlushing = false;
}

// ── Auto-retry khi mạng trở lại ──────────────────────────────
export function startOfflineQueueListener(): () => void {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected && state.isInternetReachable) {
      flushQueue();
    }
  });
  return unsubscribe;
}
