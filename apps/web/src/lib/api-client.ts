ï»¿/**
 * API Client â gá»i NestJS API tá»« Next.js
 * Giá»¯ cÃ¹ng pattern vá»i js/api.js cÅ© nhÆ°ng dÃ¹ng fetch thay XHR
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
    throw new Error(err.message ?? 'CÃ³ lá»i xáº£y ra');
  }
  return res.json();
}

// ââ Auth âââââââââââââââââââââââââââââââââââââââââââââââââââââ
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

// ââ Nope âââââââââââââââââââââââââââââââââââââââââââââââââââââ
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

// ââ CÃ¹i Báº¯p âââââââââââââââââââââââââââââââââââââââââââââââââ
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

// ââ Tools ââââââââââââââââââââââââââââââââââââââââââââââââââââ
export const toolsApi = {
  getTools: () => apiRequest<any>('/tools'),
  getQuota: (token: string) => apiRequest<any>('/tools/quota', { token }),
  useTool: (slug: string, token: string) =>
    apiRequest(`/tools/${slug}/use`, { method: 'POST', token }),
};
