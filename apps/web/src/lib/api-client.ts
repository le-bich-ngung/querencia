/**
 * API Client — gọi NestJS API từ Next.js
 * Giữ cùng pattern với js/api.js cũ nhưng dùng fetch thay XHR
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...fetchOpts } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOpts.headers as Record<string, string> ?? {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...fetchOpts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? 'Có lỗi xảy ra');
  }
  return res.json();
}

// ── Auth ─────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; name: string; password: string }) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    apiRequest<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),

  me: (token: string) =>
    apiRequest<any>('/auth/me', { token }),
};

// ── Nope ─────────────────────────────────────────────────────
export const nopeApi = {
  getFeed: (page = 1, token?: string) =>
    apiRequest<any>(`/nope/posts?page=${page}`, { token }),

  getPost: (id: string, token?: string) =>
    apiRequest<any>(`/nope/posts/${id}`, { token }),

  createPost: (data: any, token: string) =>
    apiRequest('/nope/posts', { method: 'POST', body: JSON.stringify(data), token }),

  toggleThank: (postId: string, token: string) =>
    apiRequest(`/nope/posts/${postId}/thank`, { method: 'POST', token }),

  toggleSave: (postId: string, token: string) =>
    apiRequest(`/nope/posts/${postId}/save`, { method: 'POST', token }),

  addComment: (postId: string, content: string, token: string) =>
    apiRequest(`/nope/posts/${postId}/comments`, {
      method: 'POST', body: JSON.stringify({ content }), token,
    }),
};

// ── Cùi Bắp ─────────────────────────────────────────────────
export const cuiBapApi = {
  getConversations: (token: string) =>
    apiRequest<any[]>('/cuibap/conversations', { token }),

  getMessages: (convId: string, token: string) =>
    apiRequest<any>(`/cuibap/conversations/${convId}/messages`, { token }),

  sendMessage: (convId: string, data: any, token: string) =>
    apiRequest(`/cuibap/conversations/${convId}/messages`, {
      method: 'POST', body: JSON.stringify(data), token,
    }),

  getGroups: (token: string) =>
    apiRequest<any[]>('/cuibap/groups', { token }),

  getSettings: (token: string) =>
    apiRequest<any>('/cuibap/settings', { token }),
};

// ── Tools ────────────────────────────────────────────────────
export const toolsApi = {
  getTools: () => apiRequest<any>('/tools'),
  getQuota: (token: string) => apiRequest<any>('/tools/quota', { token }),
  useTool: (slug: string, token: string) =>
    apiRequest(`/tools/${slug}/use`, { method: 'POST', token }),
};

// ── Vocab Sets ───────────────────────────────────────────────
export type VocabWord = { w: string; p?: string; m: string };
export type VocabSetMeta = {
  id: string; name: string; isPublic: boolean; wordCount: number;
  userId: string; createdAt: string; updatedAt: string;
};
export type VocabSetDetail = VocabSetMeta & { words: VocabWord[] };

export const vocabApi = {
  listMine: (token: string) =>
    apiRequest<VocabSetMeta[]>('/vocab-sets/mine', { token }),

  listPublic: () =>
    apiRequest<VocabSetMeta[]>('/vocab-sets/public'),

  getMine: (id: string, token: string) =>
    apiRequest<VocabSetDetail>(`/vocab-sets/mine/${id}`, { token }),

  getPublic: (id: string) =>
    apiRequest<VocabSetDetail>(`/vocab-sets/public/${id}`),

  create: (data: { name: string; isPublic?: boolean; words: VocabWord[] }, token: string) =>
    apiRequest<VocabSetMeta>('/vocab-sets', { method: 'POST', body: JSON.stringify(data), token }),

  update: (id: string, data: { name?: string; isPublic?: boolean; words?: VocabWord[] }, token: string) =>
    apiRequest<VocabSetMeta>(`/vocab-sets/${id}`, { method: 'PATCH', body: JSON.stringify(data), token }),

  remove: (id: string, token: string) =>
    apiRequest<{ success: boolean }>(`/vocab-sets/${id}`, { method: 'DELETE', token }),
};
