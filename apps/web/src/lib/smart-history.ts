/**
 * Smart History — lưu hoàn toàn trong browser (localStorage)
 * KHÔNG gửi server → không có vấn đề GDPR/PDPA
 * User xóa browser data = xóa history
 *
 * Track:
 *   - Tools đã dùng (gợi ý Recent Tools)
 *   - LàNo: resume conversation context
 *   - Read: bài đã đọc, vị trí scroll
 *   - Nope: bài đã xem
 */

const KEY_TOOLS   = 'q_history_tools';
const KEY_LANO    = 'q_history_lano';
const KEY_READ    = 'q_history_read';
const KEY_NOPE    = 'q_history_nope';
const MAX_ITEMS   = 20;

function readJSON<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function writeJSON(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Tools history ──────────────────────────────────────────────
export interface ToolHistoryEntry {
  slug: string; name: string; emoji: string;
  usedAt: string; count: number;
}

export const toolHistory = {
  record(slug: string, name: string, emoji: string) {
    const list = readJSON<ToolHistoryEntry[]>(KEY_TOOLS, []);
    const idx  = list.findIndex(t => t.slug === slug);
    if (idx >= 0) {
      list[idx].usedAt = new Date().toISOString();
      list[idx].count++;
      list.sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime());
    } else {
      list.unshift({ slug, name, emoji, usedAt: new Date().toISOString(), count: 1 });
    }
    writeJSON(KEY_TOOLS, list.slice(0, MAX_ITEMS));
  },
  get(): ToolHistoryEntry[] {
    return readJSON<ToolHistoryEntry[]>(KEY_TOOLS, []);
  },
  getRecent(n = 6): ToolHistoryEntry[] {
    return this.get().slice(0, n);
  },
  getMostUsed(n = 4): ToolHistoryEntry[] {
    return [...this.get()].sort((a, b) => b.count - a.count).slice(0, n);
  },
  clear() { localStorage.removeItem(KEY_TOOLS); },
};

// ── LàNo conversation context ──────────────────────────────────
export interface LanoMessage { role: 'user' | 'assistant'; content: string; ts: string; }

export const lanoHistory = {
  save(messages: LanoMessage[]) {
    // Chỉ giữ 50 tin nhắn cuối — tránh tốn storage
    writeJSON(KEY_LANO, messages.slice(-50));
  },
  get(): LanoMessage[] {
    return readJSON<LanoMessage[]>(KEY_LANO, []);
  },
  append(role: 'user' | 'assistant', content: string) {
    const msgs = this.get();
    msgs.push({ role, content, ts: new Date().toISOString() });
    this.save(msgs);
  },
  clear() { localStorage.removeItem(KEY_LANO); },
  hasHistory(): boolean { return this.get().length > 0; },
};

// ── Read history ───────────────────────────────────────────────
export interface ReadEntry { slug: string; title: string; scrollY: number; readAt: string; }

export const readHistory = {
  record(slug: string, title: string, scrollY = 0) {
    const list = readJSON<ReadEntry[]>(KEY_READ, []);
    const idx  = list.findIndex(r => r.slug === slug);
    const entry: ReadEntry = { slug, title, scrollY, readAt: new Date().toISOString() };
    if (idx >= 0) list.splice(idx, 1);
    list.unshift(entry);
    writeJSON(KEY_READ, list.slice(0, MAX_ITEMS));
  },
  getScrollPosition(slug: string): number {
    return readJSON<ReadEntry[]>(KEY_READ, []).find(r => r.slug === slug)?.scrollY ?? 0;
  },
  getRecent(n = 5): ReadEntry[] {
    return readJSON<ReadEntry[]>(KEY_READ, []).slice(0, n);
  },
  clear() { localStorage.removeItem(KEY_READ); },
};

// ── Nope seen posts ────────────────────────────────────────────
export const nopeHistory = {
  markSeen(postId: string) {
    const set = new Set(readJSON<string[]>(KEY_NOPE, []));
    set.add(postId);
    // Giữ tối đa 200 post IDs
    const arr = [...set].slice(-200);
    writeJSON(KEY_NOPE, arr);
  },
  hasSeen(postId: string): boolean {
    return readJSON<string[]>(KEY_NOPE, []).includes(postId);
  },
  clear() { localStorage.removeItem(KEY_NOPE); },
};

// ── Clear all (user request / logout) ─────────────────────────
export function clearAllHistory() {
  toolHistory.clear();
  lanoHistory.clear();
  readHistory.clear();
  nopeHistory.clear();
}
