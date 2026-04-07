ï»¿// Smart History â lÆ°u lá»ch sá»­ Äá»c vÃ  chat trong localStorage

export const lanoHistory = {
  get: (): { role: string; content: string }[] => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('lano_history') ?? '[]'); } catch { return []; }
  },
  append: (role: string, content: string) => {
    if (typeof window === 'undefined') return;
    try {
      const h = lanoHistory.get();
      h.push({ role, content });
      // Giá»¯ tá»i Äa 50 messages
      if (h.length > 50) h.splice(0, h.length - 50);
      localStorage.setItem('lano_history', JSON.stringify(h));
    } catch {}
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('lano_history');
  },
};

export const readHistory = {
  getRecent: (limit = 5): { slug: string; title: string }[] => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('read_history') ?? '[]').slice(0, limit); } catch { return []; }
  },
  record: (slug: string, title: string) => {
    if (typeof window === 'undefined') return;
    try {
      const h = readHistory.getRecent(20);
      const filtered = h.filter(x => x.slug !== slug);
      filtered.unshift({ slug, title });
      localStorage.setItem('read_history', JSON.stringify(filtered.slice(0, 20)));
    } catch {}
  },
};
