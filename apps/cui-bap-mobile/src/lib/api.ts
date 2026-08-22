import { useAuthStore } from '../store/auth.store';

const BASE = __DEV__
  ? 'http://10.0.2.2:3001/api/v1'  // Android emulator → localhost
  : 'https://querencia.fly.dev/api/v1';

export async function apiRequest<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const { accessToken, refreshToken, setAuth, logout, user } = useAuthStore.getState();

  const doFetch = (token: string | null) =>
    fetch(`${BASE}${path}`, {
      ...opts,
      headers: {
        ...(opts.body && !(opts.body instanceof FormData) ? {'Content-Type':'application/json'} : {}),
        ...(token ? {Authorization:`Bearer ${token}`} : {}),
        ...opts.headers,
      },
    });

  let res = await doFetch(accessToken);

  if (res.status === 401 && refreshToken) {
    try {
      const r = await fetch(`${BASE}/auth/refresh`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({refreshToken}),
      });
      if (r.ok) {
        const d = await r.json();
        setAuth(user!, d.accessToken, d.refreshToken);
        res = await doFetch(d.accessToken);
      } else { logout(); throw new Error('SESSION_EXPIRED'); }
    } catch { logout(); throw new Error('SESSION_EXPIRED'); }
  }

  if (!res.ok) {
    const e = await res.json().catch(()=>({message:'Unknown error'}));
    throw new Error(e.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login:    (email:string,pw:string) =>
    apiRequest('/auth/login', {method:'POST',body:JSON.stringify({email,password:pw})}),
  register: (name:string,email:string,pw:string) =>
    apiRequest('/auth/register', {method:'POST',body:JSON.stringify({name,email,password:pw})}),
  me:       () => apiRequest('/auth/me'),

  // Cùi Bắp
  getConvs:      () => apiRequest('/cuibap/conversations'),
  getGroups:     () => apiRequest('/cuibap/groups'),
  getMsgs:       (id:string,before?:string) =>
    apiRequest(`/cuibap/conversations/${id}/messages${before?`?before=${before}`:''}`),
  getGroupMsgs:  (id:string,before?:string) =>
    apiRequest(`/cuibap/groups/${id}/messages${before?`?before=${before}`:''}`),
  sendMsg:       (id:string,body:object) =>
    apiRequest(`/cuibap/conversations/${id}/messages`, {method:'POST',body:JSON.stringify(body)}),
  sendGroupMsg:  (id:string,body:object) =>
    apiRequest(`/cuibap/groups/${id}/messages`, {method:'POST',body:JSON.stringify(body)}),
  editMsg:       (id:string,content:string) =>
    apiRequest(`/cuibap/messages/${id}`, {method:'PATCH',body:JSON.stringify({content})}),
  deleteMsg:     (id:string) =>
    apiRequest(`/cuibap/messages/${id}`, {method:'DELETE'}),
  reactMsg:      (id:string,emoji:string) =>
    apiRequest(`/cuibap/messages/${id}/react`, {method:'POST',body:JSON.stringify({emoji})}),
  createConv:    (targetId:string) =>
    apiRequest('/cuibap/conversations', {method:'POST',body:JSON.stringify({target_user_id:targetId})}),
  createGroup:   (name:string,desc?:string) =>
    apiRequest('/cuibap/groups', {method:'POST',body:JSON.stringify({name,description:desc})}),
  upload:        (form:FormData) =>
    apiRequest('/cuibap/upload', {method:'POST',body:form}),
  markRead:      (id:string) =>
    apiRequest(`/cuibap/conversations/${id}/read`, {method:'POST'}),
  registerFCM:   (token:string) =>
    apiRequest('/auth/fcm-token', {method:'POST',body:JSON.stringify({fcmToken:token})}),
};

// E2EE key management
export const e2eeApiExt = {
  getE2eeKeys:          (userId: string) => apiRequest(`/e2ee/keys/${userId}`),
  uploadE2eeKeys:       (bundle: any)    => apiRequest('/e2ee/keys', { method:'POST', body:JSON.stringify(bundle) }),
  uploadMoreE2eePreKeys:(keys: any[])    => apiRequest('/e2ee/keys/prekeys', { method:'POST', body:JSON.stringify({preKeys:keys}) }),
};

// Merge vào api object
Object.assign(api, e2eeApiExt);

// Auth extensions
Object.assign(api, {
  googleAuth: (idToken: string) =>
    apiRequest('/auth/google/id-token', { method:'POST', body:JSON.stringify({idToken}) }),
});

// Extend api with apple auth
Object.assign(api, {
  appleAuth: (identityToken: string, name?: string, email?: string) =>
    apiRequest('/auth/apple/identity-token', {
      method: 'POST',
      body: JSON.stringify({ identityToken, name, email }),
    }),
});

// Thêm API methods cho tính năng mới
Object.assign(api, {
  blockUser:       (userId: string)            => apiRequest(`/users/${userId}/block`,  { method:'POST' }),
  reportUser:      (userId: string, reason: string) => apiRequest(`/users/${userId}/report`, { method:'POST', body:JSON.stringify({reason}) }),
  mfaRespond:      (token: string, status: 'approved'|'rejected') =>
    apiRequest(`/auth/mfa/respond`, { method:'POST', body:JSON.stringify({mfaToken:token, status}) }),
  pinMessage:      (msgId: string) => apiRequest(`/cuibap/messages/${msgId}/pin`, { method:'PATCH' }),
  getGroupMembers: (groupId: string) => apiRequest(`/cuibap/groups/${groupId}/members`),
  setMemberRole:   (groupId: string, userId: string, role: string) =>
    apiRequest(`/cuibap/groups/${groupId}/members/${userId}/role`, { method:'PATCH', body:JSON.stringify({role}) }),
});

// Conv management
Object.assign(api, {
  pinConversation:   (convId: string, pin: boolean) =>
    apiRequest(`/cuibap/conversations/${convId}/pin`, { method:'PATCH', body:JSON.stringify({pin}) }),
  muteConversation:  (convId: string, mute: boolean) =>
    apiRequest(`/cuibap/conversations/${convId}/mute`, { method:'PATCH', body:JSON.stringify({mute}) }),
  deleteConversation:(convId: string) =>
    apiRequest(`/cuibap/conversations/${convId}`, { method:'DELETE' }),
  addGroupMember:    (groupId: string, email: string) =>
    apiRequest(`/cuibap/groups/${groupId}/members`, { method:'POST', body:JSON.stringify({email}) }),
  removeGroupMember: (groupId: string, userId: string) =>
    apiRequest(`/cuibap/groups/${groupId}/members/${userId}`, { method:'DELETE' }),
  setMemberRole:     (groupId: string, userId: string, role: string) =>
    apiRequest(`/cuibap/groups/${groupId}/members/${userId}/role`, { method:'PATCH', body:JSON.stringify({role}) }),
  getGroupMembers:   (groupId: string) =>
    apiRequest(`/cuibap/groups/${groupId}/members`),
});

// Profile management
Object.assign(api, {
  updateProfile: (data: { name?: string; avatarUrl?: string }) =>
    apiRequest('/users/me/profile', { method: 'PATCH', body: JSON.stringify(data) }),
});

// Link preview
Object.assign(api, {
  getLinkPreview: (url: string) =>
    apiRequest(`/meta/preview?url=${encodeURIComponent(url)}`),
});
