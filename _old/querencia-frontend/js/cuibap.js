// ============================================================
// FILE: js/cuibap.js
// NHIỆM VỤ: Logic frontend cho app nhắn tin Cùi Bắp
// ============================================================

const CB_API = 'https://querencia.fly.dev/cuibap';
let cbWs = null;                  // WebSocket connection
let cbCurrentConvId = null;       // ID cuộc trò chuyện đang mở
let cbCurrentType = 'direct';     // 'direct' hoặc 'group'
let cbCurrentTab = 'chats';       // Tab hiện tại
let cbConversations = [];         // Cache danh sách chat
let cbGroups = [];                // Cache danh sách nhóm
let cbReplyToId = null;           // ID tin nhắn đang reply
let cbReplyToText = '';           // Nội dung tin nhắn đang reply
let cbTypingTimer = null;         // Timer cho typing indicator
let cbCurrentOtherId = null;      // ID người đang chat cùng

// ── INIT ─────────────────────────────────────────────────────

function cbInit() {
  if (!localStorage.getItem('token')) {
    document.getElementById('cbApp').innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:var(--gray)">
        <div style="font-size:3rem">🌽</div>
        <p style="font-size:1rem;font-weight:600">Bạn cần đăng nhập để dùng Cùi Bắp</p>
        <button onclick="openAuthModal('login')" style="padding:10px 28px;background:var(--sage);color:#fff;border:none;border-radius:20px;font-family:inherit;font-size:0.9rem;font-weight:600;cursor:pointer">Đăng nhập</button>
      </div>`;
    // Thử lại sau 1 giây nếu user vừa đăng nhập xong
    setTimeout(() => { if (localStorage.getItem('token')) location.reload(); }, 1000);
    return;
  }
  cbConnectWs();
  cbLoadConversations();
  // Xin quyền notification
  if (Notification.permission === 'default') Notification.requestPermission();
}

// ── WEBSOCKET ─────────────────────────────────────────────────

function cbConnectWs() {
  const token = localStorage.getItem('token');
  if (!token) return;
  const wsUrl = `wss://querencia.fly.dev/cuibap/ws/${token}`;
  cbWs = new WebSocket(wsUrl);

  cbWs.onopen = () => console.log('[CB] WebSocket connected');

  cbWs.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === 'new_message') {
      if (data.conversation_id === cbCurrentConvId && cbCurrentType === 'direct') {
        cbRenderMessage(data.message, false);
        cbScrollToBottom();
      }
      cbUpdateConvPreview(data.conversation_id, data.message);
      // Thông báo khi có tin nhắn mới (kể cả khi đang ở tab khác)
      if (data.message && data.message.sender) {
        const senderName = data.message.sender.username || 'Ai đó';
        const preview = (data.message.content || '📎 File').slice(0, 40);
        if (document.hidden || data.conversation_id !== cbCurrentConvId) {
          // Browser notification
          if (Notification.permission === 'granted') {
            new Notification('🌽 Cùi Bắp - ' + senderName, { body: preview, icon: '/favicon.ico' });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
          }
          // Update title
          document.title = '🌽 Tin nhắn mới!';
          setTimeout(() => document.title = 'Cùi Bắp', 3000);
        }
      }
    } else if (data.type === 'typing') {
      if (data.conversation_id === cbCurrentConvId) cbShowTyping(data.from_user_id);
    } else if (data.type === 'stop_typing') {
      cbHideTyping();
    } else if (data.type === 'message_edited') {
      const el = document.querySelector(`[data-msg-id="${data.message_id}"] .cb-bubble`);
      if (el) el.textContent = data.content;
    } else if (data.type === 'message_deleted') {
      const el = document.querySelector(`[data-msg-id="${data.message_id}"] .cb-bubble`);
      if (el) { el.textContent = '🗑 Tin nhắn đã bị xóa'; el.style.opacity = '0.5'; }
    } else if (data.type === 'reaction') {
      cbUpdateReaction(data.message_id, data.emoji, data.user_id);
    }
  };

  cbWs.onclose = () => {
    // Tự kết nối lại sau 3 giây
    setTimeout(cbConnectWs, 3000);
  };
}

// ── LOAD DATA ─────────────────────────────────────────────────

async function cbLoadConversations() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${CB_API}/conversations`, {headers: {'Authorization': `Bearer ${token}`}});
    cbConversations = await res.json();
    cbRenderConvList();
  } catch(e) { console.error('[CB] Load convs error', e); }
}

async function cbLoadGroups() {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${CB_API}/groups`, {headers: {'Authorization': `Bearer ${token}`}});
    cbGroups = await res.json();
    cbRenderGroupList();
  } catch(e) { console.error('[CB] Load groups error', e); }
}

// ── RENDER LIST ───────────────────────────────────────────────

function cbRenderConvList(filter = '') {
  const list = document.getElementById('cbConvList');
  if (!list) return;
  const filtered = cbConversations.filter(c =>
    c.other_user.username.toLowerCase().includes(filter.toLowerCase()) ||
    c.other_user.email.toLowerCase().includes(filter.toLowerCase())
  );
  if (filtered.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:32px 16px;font-size:0.82rem;color:var(--gray-light)">Chưa có cuộc trò chuyện nào<br/><br/><button onclick="cbShowNewChat()" style="padding:8px 18px;background:var(--sage);color:#fff;border:none;border-radius:16px;font-family:inherit;font-size:0.8rem;cursor:pointer">Nhắn tin mới</button></div>`;
    return;
  }
  list.innerHTML = filtered.map(c => `
    <div class="cb-conv-item ${cbCurrentConvId === c.id && cbCurrentType === 'direct' ? 'active' : ''}"
         onclick="cbOpenConv(${c.id},'direct')" data-conv-id="${c.id}">
      <div class="cb-conv-avatar">
        ${c.other_user.username.charAt(0).toUpperCase()}
        ${c.is_online ? '<div class="cb-online-dot"></div>' : ''}
      </div>
      <div class="cb-conv-info">
        <div class="cb-conv-name">${cbEscape(c.other_user.username)}</div>
        <div class="cb-conv-preview">${c.last_message ? cbEscape(c.last_message.content || '📎 File') : 'Bắt đầu trò chuyện'}</div>
      </div>
    </div>
  `).join('');
}

function cbRenderGroupList(filter = '') {
  const list = document.getElementById('cbConvList');
  if (!list) return;
  const filtered = cbGroups.filter(g => g.name.toLowerCase().includes(filter.toLowerCase()));
  if (filtered.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:32px 16px;font-size:0.82rem;color:var(--gray-light)">Chưa có nhóm nào<br/><br/><button onclick="cbShowNewGroup()" style="padding:8px 18px;background:var(--sage);color:#fff;border:none;border-radius:16px;font-family:inherit;font-size:0.8rem;cursor:pointer">Tạo nhóm</button></div>`;
    return;
  }
  list.innerHTML = filtered.map(g => `
    <div class="cb-conv-item ${cbCurrentConvId === g.id && cbCurrentType === 'group' ? 'active' : ''}"
         onclick="cbOpenConv(${g.id},'group')" data-conv-id="${g.id}">
      <div class="cb-conv-avatar" style="background:#7c5cbf">👥</div>
      <div class="cb-conv-info">
        <div class="cb-conv-name">${cbEscape(g.name)}</div>
        <div class="cb-conv-preview">${g.member_count} thành viên · ${g.last_message ? cbEscape(g.last_message.content || '📎 File') : 'Chưa có tin nhắn'}</div>
      </div>
    </div>
  `).join('');
}

// ── OPEN CONVERSATION ─────────────────────────────────────────

async function cbOpenConv(id, type = 'direct') {
  cbCurrentConvId = id;
  cbCurrentType = type;

  // Cập nhật active state
  document.querySelectorAll('.cb-conv-item').forEach(el => el.classList.remove('active'));
  const activeItem = document.querySelector(`[data-conv-id="${id}"]`);
  if (activeItem) activeItem.classList.add('active');

  // Mobile: ẩn sidebar, hiện chat
  document.getElementById('cbApp').classList.add('cb-chatting');  document.getElementById('cbEmpty').style.display = 'none';
  const win = document.getElementById('cbChatWindow');
  win.style.display = 'flex';

  // Set header
  if (type === 'direct') {
    const conv = cbConversations.find(c => c.id === id);
    if (conv) {
      cbCurrentOtherId = conv.other_user.id;
      document.getElementById('cbHeaderAvatar').textContent = conv.other_user.username.charAt(0).toUpperCase();
      document.getElementById('cbHeaderName').textContent = conv.other_user.username;
      document.getElementById('cbHeaderStatus').textContent = conv.is_online ? '🟢 online' : 'offline';
    }
  } else {
    const group = cbGroups.find(g => g.id === id);
    if (group) {
      document.getElementById('cbHeaderAvatar').textContent = '👥';
      document.getElementById('cbHeaderAvatar').style.background = '#7c5cbf';
      document.getElementById('cbHeaderName').textContent = group.name;
      document.getElementById('cbHeaderStatus').textContent = `${group.member_count} thành viên`;
    }
  }

  // Load messages
  await cbLoadMessages(id, type);
  cbScrollToBottom();
  document.getElementById('cbInput').focus();
}

async function cbLoadMessages(convId, type) {
  const token = localStorage.getItem('token');
  const url = type === 'direct'
    ? `${CB_API}/conversations/${convId}/messages`
    : `${CB_API}/groups/${convId}/messages`;
  try {
    const res = await fetch(url, {headers: {'Authorization': `Bearer ${token}`}});
    const msgs = await res.json();
    const container = document.getElementById('cbMessages');
    container.innerHTML = '';
    const myId = await cbGetMyId();  // cached sau lần đầu
    if (!Array.isArray(msgs)) return;
    msgs.forEach(m => cbRenderMessage(m, m.sender?.id === myId));
  } catch(e) { console.error('[CB] Load messages error', e); }
}

// ── RENDER MESSAGE ────────────────────────────────────────────

function cbRenderMessage(msg, isOut) {
  const container = document.getElementById('cbMessages');
  if (!container) return;

  const div = document.createElement('div');
  div.className = `cb-msg ${isOut ? 'out' : 'in'}`;
  div.setAttribute('data-msg-id', msg.id);

  let content = '';
  if (msg.is_deleted) {
    content = `<div class="cb-bubble" style="opacity:0.5;font-style:italic">🗑 Tin nhắn đã bị xóa</div>`;
  } else if (msg.type === 'text') {
    content = `<div class="cb-bubble">${cbEscape(msg.content)}${msg.is_edited ? ' <span class="cb-msg-edited">(đã sửa)</span>' : ''}</div>`;
  } else if (msg.type === 'image') {
    content = `<div class="cb-bubble" style="padding:4px"><img src="${msg.file_url}" style="max-width:240px;max-height:240px;border-radius:12px;display:block;cursor:pointer" onclick="window.open('${msg.file_url}')"/></div>`;
  } else if (msg.type === 'file') {
    content = `<div class="cb-bubble">📎 <a href="${msg.file_url}" target="_blank" style="color:inherit;text-decoration:underline">${cbEscape(msg.file_name || 'File')}</a><br/><span style="font-size:0.72rem;opacity:0.7">${cbFormatSize(msg.file_size)}</span></div>`;
  } else if (msg.type === 'audio') {
    content = `<div class="cb-bubble"><audio controls src="${msg.file_url}" style="max-width:220px"/></div>`;
  }

  // Reactions
  let reactionsHtml = '';
  if (msg.reactions && Object.keys(msg.reactions).length > 0) {
    reactionsHtml = `<div class="cb-reactions">${Object.entries(msg.reactions).map(([emoji, count]) =>
      `<span class="cb-reaction-pill" onclick="cbReact(${msg.id},'${emoji}')">${emoji} ${count}</span>`
    ).join('')}</div>`;
  }

  // Context menu actions
  const actions = isOut
    ? `<div class="cb-msg-actions" style="display:none;gap:4px;margin-bottom:2px">
        <button onclick="cbEditMsg(${msg.id},'${cbEscape(msg.content)}')" style="background:none;border:none;cursor:pointer;font-size:0.75rem;color:var(--gray);padding:2px 6px;border-radius:4px;background:var(--cb-hover)">✏️</button>
        <button onclick="cbDeleteMsg(${msg.id})" style="background:none;border:none;cursor:pointer;font-size:0.75rem;color:#e74c3c;padding:2px 6px;border-radius:4px;background:var(--cb-hover)">🗑</button>
        <button onclick="cbSetReply(${msg.id},'${cbEscape(msg.content)}')" style="background:none;border:none;cursor:pointer;font-size:0.75rem;color:var(--gray);padding:2px 6px;border-radius:4px;background:var(--cb-hover)">↩️</button>
      </div>`
    : `<div class="cb-msg-actions" style="display:none;gap:4px;margin-bottom:2px">
        <button onclick="cbSetReply(${msg.id},'${cbEscape(msg.content)}')" style="background:none;border:none;cursor:pointer;font-size:0.75rem;color:var(--gray);padding:2px 6px;border-radius:4px;background:var(--cb-hover)">↩️</button>
        <button onclick="cbShowReactPicker(${msg.id})" style="background:none;border:none;cursor:pointer;font-size:0.75rem;padding:2px 6px;border-radius:4px;background:var(--cb-hover)">😊</button>
      </div>`;

  const time = new Date(msg.sent_at).toLocaleTimeString('vi-VN', {hour:'2-digit',minute:'2-digit'});

  div.innerHTML = `
    ${actions}
    ${content}
    ${reactionsHtml}
    <div class="cb-msg-time">${time}</div>
  `;

  // Hover to show actions
  div.addEventListener('mouseenter', () => {
    const a = div.querySelector('.cb-msg-actions');
    if (a) a.style.display = 'flex';
  });
  div.addEventListener('mouseleave', () => {
    const a = div.querySelector('.cb-msg-actions');
    if (a) a.style.display = 'none';
  });

  container.appendChild(div);
}

// ── SEND MESSAGE ──────────────────────────────────────────────

async function cbSendMessage() {
  const input = document.getElementById('cbInput');
  const content = input.value.trim();
  if (!content || !cbCurrentConvId) return;

  const token = localStorage.getItem('token');
  const url = cbCurrentType === 'direct'
    ? `${CB_API}/conversations/${cbCurrentConvId}/messages`
    : `${CB_API}/groups/${cbCurrentConvId}/messages`;

  const params = new URLSearchParams({content, msg_type: 'text'});
  if (cbReplyToId) params.append('reply_to_id', cbReplyToId);

  try {
    const res = await fetch(`${url}?${params}`, {
      method: 'POST',
      headers: {'Authorization': `Bearer ${token}`}
    });
    if (res.ok) {
      const msg = await res.json();
      cbRenderMessage(msg, true);
      cbScrollToBottom();
      input.value = '';
      input.style.height = 'auto';
      cbCancelReply();
      cbUpdateConvPreview(cbCurrentConvId, msg);
    }
  } catch(e) { console.error('[CB] Send error', e); }
}

// ── TYPING INDICATOR ──────────────────────────────────────────

function cbSendTyping() {
  if (!cbWs || cbWs.readyState !== WebSocket.OPEN || !cbCurrentOtherId) return;
  cbWs.send(JSON.stringify({type: 'typing', conversation_id: cbCurrentConvId, target_user_id: cbCurrentOtherId}));
  clearTimeout(cbTypingTimer);
  cbTypingTimer = setTimeout(() => {
    if (cbWs && cbWs.readyState === WebSocket.OPEN) {
      cbWs.send(JSON.stringify({type: 'stop_typing', target_user_id: cbCurrentOtherId}));
    }
  }, 2000);
}

function cbShowTyping(userId) {
  const el = document.getElementById('cbTyping');
  el.style.display = 'block';
  el.textContent = 'Đang nhập...';
  clearTimeout(cbTypingTimer);
  cbTypingTimer = setTimeout(() => cbHideTyping(), 3000);
}

function cbHideTyping() {
  const el = document.getElementById('cbTyping');
  if (el) el.style.display = 'none';
}

// ── EDIT / DELETE ─────────────────────────────────────────────

async function cbEditMsg(msgId, currentContent) {
  const newContent = prompt('Sửa tin nhắn:', currentContent);
  if (!newContent || newContent === currentContent) return;
  const token = localStorage.getItem('token');
  await fetch(`${CB_API}/messages/${msgId}?content=${encodeURIComponent(newContent)}`, {
    method: 'PATCH', headers: {'Authorization': `Bearer ${token}`}
  });
}

async function cbDeleteMsg(msgId) {
  if (!confirm('Xóa tin nhắn này?')) return;
  const token = localStorage.getItem('token');
  await fetch(`${CB_API}/messages/${msgId}`, {
    method: 'DELETE', headers: {'Authorization': `Bearer ${token}`}
  });
  const el = document.querySelector(`[data-msg-id="${msgId}"] .cb-bubble`);
  if (el) { el.textContent = '🗑 Tin nhắn đã bị xóa'; el.style.opacity = '0.5'; }
}

// ── REPLY ─────────────────────────────────────────────────────

function cbSetReply(msgId, content) {
  cbReplyToId = msgId;
  cbReplyToText = content;
  const preview = document.getElementById('cbReplyPreview');
  document.getElementById('cbReplyText').textContent = `↩️ ${content}`;
  preview.style.display = 'flex';
  document.getElementById('cbInput').focus();
}

function cbCancelReply() {
  cbReplyToId = null;
  cbReplyToText = '';
  const preview = document.getElementById('cbReplyPreview');
  if (preview) preview.style.display = 'none';
}

// ── REACTIONS ─────────────────────────────────────────────────

function cbShowReactPicker(msgId) {
  const emojis = ['❤️','😂','👍','😮','😢','🔥','🎉','👏','🙏','💯'];
  const picker = document.getElementById('cbEmojiPicker');
  picker.innerHTML = emojis.map(e => `<span onclick="cbReact(${msgId},'${e}');document.getElementById('cbEmojiPicker').style.display='none'" style="cursor:pointer;font-size:1.4rem;padding:4px;border-radius:6px;transition:background 0.15s" onmouseover="this.style.background='var(--cb-hover)'" onmouseout="this.style.background='none'">${e}</span>`).join('');
  picker.style.display = 'flex';
  picker.style.flexWrap = 'wrap';
  picker.style.gap = '4px';
  // Đóng khi click ra ngoài
  setTimeout(() => document.addEventListener('click', function h(e) {
    if (!picker.contains(e.target)) { picker.style.display = 'none'; document.removeEventListener('click', h); }
  }), 100);
}

async function cbReact(msgId, emoji) {
  const token = localStorage.getItem('token');
  await fetch(`${CB_API}/messages/${msgId}/react?emoji=${encodeURIComponent(emoji)}`, {
    method: 'POST', headers: {'Authorization': `Bearer ${token}`}
  });
}

function cbUpdateReaction(msgId, emoji, userId) {
  // Reload reactions cho message này (đơn giản nhất)
  // TODO: optimize later
}

// ── FILE UPLOAD ───────────────────────────────────────────────

function cbAttachFile() {
  document.getElementById('cbFileInput').click();
}

async function cbHandleFile(input) {
  const file = input.files[0];
  if (!file) return;
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${CB_API}/upload`, {
      method: 'POST',
      headers: {'Authorization': `Bearer ${token}`},
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('audio/') ? 'audio' : 'file';
      // Gửi tin nhắn file
      const url = cbCurrentType === 'direct'
        ? `${CB_API}/conversations/${cbCurrentConvId}/messages`
        : `${CB_API}/groups/${cbCurrentConvId}/messages`;
      await fetch(`${url}?content=${encodeURIComponent(file.name)}&msg_type=${type}&file_url=${encodeURIComponent(data.url)}&file_name=${encodeURIComponent(file.name)}&file_size=${file.size}`, {
        method: 'POST', headers: {'Authorization': `Bearer ${token}`}
      });
    }
  } catch(e) { console.error('[CB] Upload error', e); }
  input.value = '';
}

// ── NEW CHAT / GROUP ──────────────────────────────────────────

function cbShowNewChat() {
  const modal = document.getElementById('cbNewChatModal');
  modal.style.display = 'flex';
  setTimeout(() => document.getElementById('cbNewChatEmail').focus(), 100);
}

function cbShowNewGroup() {
  const modal = document.getElementById('cbNewGroupModal');
  modal.style.display = 'flex';
  setTimeout(() => document.getElementById('cbGroupName').focus(), 100);
}

function cbCloseModal(id) {
  document.getElementById(id).style.display = 'none';
}

async function cbCreateConversation() {
  const email = document.getElementById('cbNewChatEmail').value.trim();
  if (!email) return;
  const token = localStorage.getItem('token');
  const errEl = document.getElementById('cbNewChatErr');
  try {
    const res = await fetch(`${CB_API}/conversations?target_email=${encodeURIComponent(email)}`, {
      method: 'POST', headers: {'Authorization': `Bearer ${token}`}
    });
    const data = await res.json();
    if (res.ok) {
      cbCloseModal('cbNewChatModal');
      document.getElementById('cbNewChatEmail').value = '';
      await cbLoadConversations();
      cbOpenConv(data.id, 'direct');
    } else {
      errEl.textContent = data.detail || 'Không tìm thấy người dùng';
      errEl.style.display = 'block';
    }
  } catch(e) {
    errEl.textContent = 'Không thể kết nối server';
    errEl.style.display = 'block';
  }
}

async function cbCreateGroup() {
  const name = document.getElementById('cbGroupName').value.trim();
  const desc = document.getElementById('cbGroupDesc').value.trim();
  if (!name) return;
  const token = localStorage.getItem('token');
  const errEl = document.getElementById('cbNewGroupErr');
  try {
    const res = await fetch(`${CB_API}/groups?name=${encodeURIComponent(name)}&description=${encodeURIComponent(desc)}`, {
      method: 'POST', headers: {'Authorization': `Bearer ${token}`}
    });
    const data = await res.json();
    if (res.ok) {
      cbCloseModal('cbNewGroupModal');
      document.getElementById('cbGroupName').value = '';
      document.getElementById('cbGroupDesc').value = '';
      await cbLoadGroups();
      cbSetTab('groups');
      cbOpenConv(data.id, 'group');
    } else {
      errEl.textContent = data.detail || 'Lỗi tạo nhóm';
      errEl.style.display = 'block';
    }
  } catch(e) {
    errEl.textContent = 'Không thể kết nối server';
    errEl.style.display = 'block';
  }
}

// ── TABS ──────────────────────────────────────────────────────

function cbSetTab(tab) {
  cbCurrentTab = tab;
  const btnChats = document.getElementById('cbTabChats');
  const btnGroups = document.getElementById('cbTabGroups');
  if (tab === 'chats') {
    btnChats.style.background = 'var(--sage)';
    btnChats.style.color = '#fff';
    btnGroups.style.background = 'none';
    btnGroups.style.color = 'var(--gray)';
    cbRenderConvList(document.getElementById('cbSearch').value);
  } else {
    btnGroups.style.background = 'var(--sage)';
    btnGroups.style.color = '#fff';
    btnChats.style.background = 'none';
    btnChats.style.color = 'var(--gray)';
    cbLoadGroups();
  }
}

function cbFilterConvs(val) {
  if (cbCurrentTab === 'chats') cbRenderConvList(val);
  else cbRenderGroupList(val);
}

// ── CALL ──────────────────────────────────────────────────────

function cbStartCall(type) {
  const msg = type === 'voice'
    ? '📞 Gọi thoại chỉ khả dụng trên app Cùi Bắp. Tải app để gọi điện nhé! 🌿'
    : '📹 Gọi video chỉ khả dụng trên app Cùi Bắp. Tải app để gọi video nhé! 🌿';
  alert(msg);
}

// ── HELPERS ───────────────────────────────────────────────────

function cbScrollToBottom() {
  const el = document.getElementById('cbMessages');
  if (el) el.scrollTop = el.scrollHeight;
}

function cbAutoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function cbEscape(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function cbFormatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/1024/1024).toFixed(1) + ' MB';
}

function cbUpdateConvPreview(convId, msg) {
  const conv = cbConversations.find(c => c.id === convId);
  if (conv) {
    conv.last_message = msg;
    cbRenderConvList(document.getElementById('cbSearch')?.value || '');
  }
}

let _myId = null;
async function cbGetMyId() {
  if (_myId) return _myId;
  const token = localStorage.getItem('token');
  const res = await fetch('https://querencia.fly.dev/auth/me', {headers: {'Authorization': `Bearer ${token}`}});
  const data = await res.json();
  _myId = data.id;
  return _myId;
}

function cbToggleInfo() {
  alert('Thông tin cuộc trò chuyện - Sắp có!');
}

function cbPickEmoji() {
  const emojis = ['😊','😂','❤️','👍','🙏','🔥','🎉','😮','😢','💯','✨','🌿'];
  const input = document.getElementById('cbInput');
  const picker = document.getElementById('cbEmojiPicker');
  picker.innerHTML = emojis.map(e => `<span onclick="document.getElementById('cbInput').value+='${e}';document.getElementById('cbEmojiPicker').style.display='none'" style="cursor:pointer;font-size:1.5rem;padding:4px;border-radius:6px" onmouseover="this.style.background='var(--cb-hover)'" onmouseout="this.style.background='none'">${e}</span>`).join('');
  picker.style.display = 'flex';
  picker.style.flexWrap = 'wrap';

  // Position near button
  const btn = document.querySelector('[onclick="cbPickEmoji()"]');
  if (btn) {
    const rect = btn.getBoundingClientRect();
    picker.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
    picker.style.left = rect.left + 'px';
  }
  setTimeout(() => document.addEventListener('click', function h(e) {
    if (!picker.contains(e.target)) { picker.style.display = 'none'; document.removeEventListener('click', h); }
  }), 100);
}

// ── MOBILE BACK BUTTON ────────────────────────────────────
function cbGoBack() {
  document.getElementById('cbApp').classList.remove('cb-chatting');
  document.getElementById('cbChatWindow').style.cssText = 'display:none';
  document.getElementById('cbEmpty').style.display = 'flex';
  cbCurrentConvId = null;
  document.querySelectorAll('.cb-conv-item').forEach(el => el.classList.remove('active'));
}
