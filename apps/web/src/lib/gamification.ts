// Gamification — track user actions for streak/badges

export const gameStats = {
  recordLaNoMessage: () => {
    if (typeof window === 'undefined') return;
    try {
      const count = parseInt(localStorage.getItem('lano_msg_count') ?? '0') + 1;
      localStorage.setItem('lano_msg_count', String(count));
    } catch {}
  },
  getLaNoCount: (): number => {
    if (typeof window === 'undefined') return 0;
    try { return parseInt(localStorage.getItem('lano_msg_count') ?? '0'); } catch { return 0; }
  },
};
