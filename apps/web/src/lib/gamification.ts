/**
 * Gamification — Badges, Streaks, Q Stats
 * Browser-side tracking + server sync khi có session
 */

// ── Badge definitions ─────────────────────────────────────────
export interface Badge {
  id:          string;
  emoji:       string;
  name:        string;
  desc:        string;
  rarity:      'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

export const BADGES: Record<string, Omit<Badge, 'unlockedAt'>> = {
  // Tools
  'first_tool':        { id: 'first_tool',        emoji: '🔧', name: 'Người thợ', desc: 'Dùng tool đầu tiên', rarity: 'common' },
  'tool_explorer':     { id: 'tool_explorer',      emoji: '🗺️', name: 'Thám hiểm', desc: 'Dùng 10 tools khác nhau', rarity: 'rare' },
  'tool_master':       { id: 'tool_master',        emoji: '⚡', name: 'Tool Master', desc: 'Dùng 30 tools khác nhau', rarity: 'epic' },
  'pdf_warrior':       { id: 'pdf_warrior',        emoji: '📄', name: 'PDF Warrior', desc: 'Convert 10 file PDF', rarity: 'rare' },
  // LàNo
  'first_chat':        { id: 'first_chat',         emoji: '🎧', name: 'Lần đầu nói chuyện', desc: 'Chat với LàNo lần đầu', rarity: 'common' },
  'open_heart':        { id: 'open_heart',         emoji: '💚', name: 'Trái tim mở', desc: 'Chat với LàNo 7 ngày liên tiếp', rarity: 'rare' },
  'night_owl':         { id: 'night_owl',          emoji: '🦉', name: 'Cú đêm', desc: 'Chat với LàNo sau 12h đêm', rarity: 'common' },
  // Nope
  'first_share':       { id: 'first_share',        emoji: '🌱', name: 'Người gieo hạt', desc: 'Đăng bài đầu tiên trên Nope', rarity: 'common' },
  'helpful':           { id: 'helpful',            emoji: '🌟', name: 'Người có ích', desc: 'Bài viết nhận 100 ❤️', rarity: 'rare' },
  'legend':            { id: 'legend',             emoji: '🏆', name: 'Huyền thoại', desc: 'Bài viết nhận 1000 ❤️', rarity: 'legendary' },
  // Cùi Bắp
  'connected':         { id: 'connected',          emoji: '🤝', name: 'Kết nối', desc: 'Gửi tin nhắn đầu tiên', rarity: 'common' },
  'group_leader':      { id: 'group_leader',       emoji: '👑', name: 'Trưởng nhóm', desc: 'Tạo nhóm đầu tiên', rarity: 'common' },
  // Q
  'generous':          { id: 'generous',           emoji: '🎁', name: 'Hào phóng', desc: 'Tặng Q cho người khác lần đầu', rarity: 'common' },
  'benefactor':        { id: 'benefactor',         emoji: '💫', name: 'Mạnh thường quân', desc: 'Tặng 50 Q tổng cộng', rarity: 'rare' },
  'pool_angel':        { id: 'pool_angel',         emoji: '🌊', name: 'Thiên thần Q Pool', desc: 'Tặng Q vào pool 10 lần', rarity: 'epic' },
  // Streaks
  'streak_3':          { id: 'streak_3',           emoji: '🔥', name: '3 ngày liên tiếp', desc: 'Dùng Querencia 3 ngày liên tiếp', rarity: 'common' },
  'streak_7':          { id: 'streak_7',           emoji: '🔥🔥', name: '1 tuần liên tiếp', desc: 'Dùng Querencia 7 ngày liên tiếp', rarity: 'rare' },
  'streak_30':         { id: 'streak_30',          emoji: '🔥🔥🔥', name: '1 tháng liên tiếp', desc: 'Dùng Querencia 30 ngày liên tiếp', rarity: 'epic' },
  'early_adopter':     { id: 'early_adopter',      emoji: '🌅', name: 'Early Adopter', desc: 'Tham gia từ những ngày đầu', rarity: 'legendary' },
};

// ── Local badge store ─────────────────────────────────────────
const KEY_BADGES  = 'q_badges';
const KEY_STREAK  = 'q_streak';
const KEY_STATS   = 'q_gamestats';

function read<T>(key: string, fb: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; }
  catch { return fb; }
}
function write(key: string, v: unknown) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

// ── Streak ────────────────────────────────────────────────────
export interface StreakData {
  current: number; longest: number; lastDate: string;
}

export const streak = {
  touch(): StreakData {
    const today = new Date().toDateString();
    const data  = read<StreakData>(KEY_STREAK, { current: 0, longest: 0, lastDate: '' });
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (data.lastDate === today) return data;

    if (data.lastDate === yesterday) {
      data.current++;
    } else if (data.lastDate !== today) {
      data.current = 1;
    }
    data.longest  = Math.max(data.longest, data.current);
    data.lastDate = today;
    write(KEY_STREAK, data);

    // Check streak badges
    if (data.current === 3)  badgeStore.unlock('streak_3');
    if (data.current === 7)  badgeStore.unlock('streak_7');
    if (data.current === 30) badgeStore.unlock('streak_30');

    return data;
  },
  get(): StreakData {
    return read<StreakData>(KEY_STREAK, { current: 0, longest: 0, lastDate: '' });
  },
};

// ── Badge store ───────────────────────────────────────────────
export const badgeStore = {
  unlock(id: string): Badge | null {
    const all = read<Badge[]>(KEY_BADGES, []);
    if (all.find(b => b.id === id)) return null; // already unlocked
    const def = BADGES[id];
    if (!def) return null;
    const badge: Badge = { ...def, unlockedAt: new Date().toISOString() };
    all.push(badge);
    write(KEY_BADGES, all);
    return badge; // caller shows toast
  },
  getAll():    Badge[]        { return read<Badge[]>(KEY_BADGES, []); },
  has(id: string): boolean    { return this.getAll().some(b => b.id === id); },
  getRecent(n = 3): Badge[]   { return this.getAll().slice(-n).reverse(); },
};

// ── Stats ─────────────────────────────────────────────────────
export interface GameStats {
  toolsUsed:    number;
  toolSlugs:    string[];
  laNoMessages: number;
  nopePostsSent: number;
  nopeThanksGiven: number;
  qGifted:      number;
  qPoolDonated: number;
  cbMessages:   number;
  cbGroupsCreated: number;
}

const defaultStats = (): GameStats => ({
  toolsUsed: 0, toolSlugs: [], laNoMessages: 0,
  nopePostsSent: 0, nopeThanksGiven: 0,
  qGifted: 0, qPoolDonated: 0,
  cbMessages: 0, cbGroupsCreated: 0,
});

export const gameStats = {
  get(): GameStats { return read<GameStats>(KEY_STATS, defaultStats()); },

  recordToolUse(slug: string) {
    const s = this.get();
    if (!s.toolSlugs.includes(slug)) {
      s.toolSlugs.push(slug);
      s.toolsUsed = s.toolSlugs.length;
    }
    write(KEY_STATS, s);
    // Badge checks
    if (!badgeStore.has('first_tool'))   badgeStore.unlock('first_tool');
    if (s.toolsUsed >= 10)               badgeStore.unlock('tool_explorer');
    if (s.toolsUsed >= 30)               badgeStore.unlock('tool_master');
  },

  recordLaNoMessage() {
    const s = this.get();
    s.laNoMessages++;
    write(KEY_STATS, s);
    if (!badgeStore.has('first_chat')) badgeStore.unlock('first_chat');
    if (new Date().getHours() >= 0 && new Date().getHours() < 5)
      badgeStore.unlock('night_owl');
  },

  recordNopePost() {
    const s = this.get();
    s.nopePostsSent++;
    write(KEY_STATS, s);
    if (!badgeStore.has('first_share')) badgeStore.unlock('first_share');
  },

  recordQGift(amount: number, toPool: boolean) {
    const s = this.get();
    s.qGifted += amount;
    if (toPool) s.qPoolDonated++;
    write(KEY_STATS, s);
    if (!badgeStore.has('generous')) badgeStore.unlock('generous');
    if (s.qGifted >= 50)             badgeStore.unlock('benefactor');
    if (s.qPoolDonated >= 10)        badgeStore.unlock('pool_angel');
  },

  recordCbMessage() {
    const s = this.get();
    s.cbMessages++;
    write(KEY_STATS, s);
    if (!badgeStore.has('connected')) badgeStore.unlock('connected');
  },

  recordGroupCreate() {
    const s = this.get();
    s.cbGroupsCreated++;
    write(KEY_STATS, s);
    if (!badgeStore.has('group_leader')) badgeStore.unlock('group_leader');
  },
};
