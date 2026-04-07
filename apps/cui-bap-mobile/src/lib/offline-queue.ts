ï»¿/**
 * Offline Message Queue
 * Khi gá»­i tin nháº¯n tháº¥t báº¡i do máº¥t máº¡ng â lÆ°u vÃ o MMKV queue
 * Khi máº¡ng trá» láº¡i (NetInfo) â tá»± Äá»ng retry theo thá»© tá»±
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

// ââ Queue operations ââââââââââââââââââââââââââââââââââââââââââ
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

// ââ Flush â gá»­i táº¥t cáº£ pending khi máº¡ng cÃ³ láº¡i âââââââââââââââ
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

      // Replace optimistic vá»i real message
      store.updateMessage(msg.convId, msg.tempId, {
        ...sent, id: sent.id, pending: false, receiptStatus: 'sent',
      });
      dequeue(msg.tempId);
    } catch {
      // Update retry count â bá» qua náº¿u ÄÃ£ retry > 5 láº§n
      const q = readQueue();
      const idx = q.findIndex(m => m.tempId === msg.tempId);
      if (idx >= 0) {
        q[idx].retries++;
        if (q[idx].retries > 5) {
          // ÄÃ¡nh dáº¥u failed
          store.updateMessage(msg.convId, msg.tempId, {
            isDeleted: true, content: '[Gá»­i tháº¥t báº¡i â khÃ´ng cÃ³ máº¡ng]', pending: false,
          });
          q.splice(idx, 1); // xÃ³a khá»i queue
        }
        writeQueue(q);
      }
    }
  }
  isFlushing = false;
}

// ââ Auto-retry khi máº¡ng trá» láº¡i ââââââââââââââââââââââââââââââ
export function startOfflineQueueListener(): () => void {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected && state.isInternetReachable) {
      flushQueue();
    }
  });
  return unsubscribe;
}
