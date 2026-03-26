// ── AUTH MODAL ───────────────────────────────────────────

const AUTH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg><span class="auth-chevron">▼</span>`;

// ── MODAL HELPER ─────────────────────────────────────────
function createModal(id, content) {
  let m = document.getElementById(id);
  if (!m) {
    m = document.createElement('div');
    m.id = id;
    m.style.cssText = 'display:none;position:fixed;inset:0;z-index:600;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);align-items:center;justify-content:center;overflow-y:auto;padding:16px 0';
    document.body.appendChild(m);
  }
  m.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:36px 40px;width:100%;max-width:460px;position:relative;margin:auto">
      <button onclick="closeModal('${id}')" style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:1.2rem;cursor:pointer;color:#999">✕</button>
      ${content}
    </div>`;
  m.style.display = 'flex';
  m.onclick = e => { if (e.target === m) closeModal(id); };
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.style.display = 'none';
}

// ── THÔNG TIN TÀI KHOẢN ──────────────────────────────────
function openProfile() {
  document.getElementById('authSwitcher').classList.remove('open');
  const fullName  = localStorage.getItem('userFullName') || '—';
  const email     = localStorage.getItem('userEmail') || '—';
  const plan      = localStorage.getItem('userPlan') || 'free';
  const joined    = localStorage.getItem('userJoined') || '—';
  // Nếu chưa có lastLogin (đăng nhập trước khi có tính năng này), hiện thời gian hiện tại
  const lastLogin = localStorage.getItem('userLastLogin') || new Date().toLocaleString('vi-VN');
  const canEdit   = canEditName();
  const nextEdit  = localStorage.getItem('nameEditYear')
    ? `${parseInt(localStorage.getItem('nameEditYear')) + 1}` : null;

  createModal('modalProfile', `
    <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:20px">👤 Account</h2>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div>
        <div style="font-size:0.75rem;color:#999;margin-bottom:4px">Full name</div>
        <div style="display:flex;align-items:center;gap:10px">
          <div id="profileNameDisplay" style="font-weight:600;font-size:0.95rem">${fullName}</div>
          ${canEdit
            ? `<button onclick="toggleEditName()" style="font-size:0.75rem;color:#4a7c59;background:none;border:none;cursor:pointer;text-decoration:underline">Edit</button>`
            : `<span style="font-size:0.72rem;color:#bbb">(Can edit in ${nextEdit})</span>`}
        </div>
        <div id="profileNameEdit" style="display:none;margin-top:8px">
          <input id="profileNameInput" type="text" value="${fullName}"
            style="width:100%;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:0.9rem;font-family:inherit;outline:none"
            onfocus="this.style.borderColor='#4a7c59'" onblur="this.style.borderColor='#e0e0e0'"/>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button onclick="saveProfileName()" style="padding:8px 18px;background:#4a7c59;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem">Save</button>
            <button onclick="toggleEditName()" style="padding:8px 18px;background:#f5f5f5;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem">Cancel</button>
          </div>
        </div>
      </div>
      <div>
        <div style="font-size:0.75rem;color:#999;margin-bottom:4px">Email</div>
        <div style="font-weight:500;font-size:0.95rem">${email}</div>
      </div>
      <div>
        <div style="font-size:0.75rem;color:#999;margin-bottom:4px">Subscription</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-weight:600;font-size:0.95rem;text-transform:capitalize">${plan}</span>
          ${plan === 'free' ? `<span style="font-size:0.72rem;background:#f0f7f3;color:#4a7c59;padding:2px 8px;border-radius:20px;font-weight:600">Free</span>` : `<span style="font-size:0.72rem;background:#fff3cd;color:#856404;padding:2px 8px;border-radius:20px;font-weight:600">Pro ⭐</span>`}
        </div>
      </div>
      <div>
        <div style="font-size:0.75rem;color:#999;margin-bottom:4px">Account created</div>
        <div style="font-size:0.9rem">${joined}</div>
      </div>
      <div>
        <div style="font-size:0.75rem;color:#999;margin-bottom:4px">Last login</div>
        <div style="font-size:0.9rem">${lastLogin}</div>
      </div>

      <div style="border-top:1px solid #eee;padding-top:14px">
        <div style="font-size:0.75rem;color:#999;margin-bottom:8px">Nickname cho Nope</div>
        <div style="display:flex;gap:8px;align-items:center">
          <input id="profileNicknameInput" type="text"
            value="${localStorage.getItem('nopeNickname') || ''}"
            placeholder="Anonymous nickname (optional)"
            style="flex:1;padding:10px 14px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:0.9rem;font-family:inherit;outline:none"
            onfocus="this.style.borderColor='#4a7c59'" onblur="this.style.borderColor='#e0e0e0'"/>
          <button onclick="saveNickname()" style="padding:10px 16px;background:#4a7c59;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem">Save</button>
        </div>
        <div style="font-size:0.72rem;color:#bbb;margin-top:6px">Used in Nope for anonymous posts. Để trống = dùng tên thật.</div>
      </div>
    </div>
    <div id="profileMsg" style="display:none;margin-top:14px;padding:10px 14px;border-radius:8px;font-size:0.83rem"></div>
  `);
}

function canEditName() {
  const editYear = localStorage.getItem('nameEditYear');
  if (!editYear) return true;
  return new Date().getFullYear() > parseInt(editYear);
}

function toggleEditName() {
  const edit = document.getElementById('profileNameEdit');
  edit.style.display = edit.style.display === 'none' ? 'block' : 'none';
}

async function saveProfileName() {
  const newName = document.getElementById('profileNameInput').value.trim();
  if (!newName) return;
  try {
    const res = await fetch(`${API}/auth/update-name`, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json','Authorization':`Bearer ${authToken}`},
      body: JSON.stringify({name: newName})
    });
    if (res.ok) {
      localStorage.setItem('userFullName', newName);
      localStorage.setItem('nameEditYear', new Date().getFullYear());
      document.getElementById('profileNameDisplay').textContent = newName;
      document.getElementById('profileNameEdit').style.display = 'none';
      showProfileMsg('Name updated!', true);
    } else {
      showProfileMsg('Update failed.', false);
    }
  } catch { showProfileMsg('Cannot connect to server.', false); }
}

function saveNickname() {
  const nick = document.getElementById('profileNicknameInput').value.trim();
  localStorage.setItem('nopeNickname', nick);
  showProfileMsg('Nickname saved!', true);
}

function showProfileMsg(msg, ok) {
  const el = document.getElementById('profileMsg');
  if (!el) return;
  el.style.display = 'block';
  el.style.background = ok ? '#ddeee3' : '#fdecea';
  el.style.color = ok ? '#2f5c3e' : '#c0392b';
  el.textContent = msg;
  setTimeout(() => { el.style.display = 'none'; }, 2500);
}

// ── ĐỔI MẬT KHẨU ─────────────────────────────────────────
function openChangePassword() {
  document.getElementById('authSwitcher').classList.remove('open');
  createModal('modalPassword', `
    <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:20px">🔑 Change password</h2>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div>
        <label style="font-size:0.82rem;font-weight:500;color:#555;display:block;margin-bottom:6px">Current password</label>
        <div style="position:relative">
          <input type="password" id="passOld" placeholder="••••••••"
            style="width:100%;padding:12px 44px 12px 16px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:0.9rem;font-family:inherit;outline:none"
            onfocus="this.style.borderColor='#4a7c59'" onblur="this.style.borderColor='#e0e0e0'"/>
          <button type="button" onclick="togglePass('passOld',this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#999">👁</button>
        </div>
      </div>
      <div>
        <label style="font-size:0.82rem;font-weight:500;color:#555;display:block;margin-bottom:6px">New password</label>
        <div style="position:relative">
          <input type="password" id="passNew" placeholder="••••••••"
            style="width:100%;padding:12px 44px 12px 16px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:0.9rem;font-family:inherit;outline:none"
            onfocus="this.style.borderColor='#4a7c59'" onblur="this.style.borderColor='#e0e0e0'"/>
          <button type="button" onclick="togglePass('passNew',this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#999">👁</button>
        </div>
      </div>
      <div>
        <label style="font-size:0.82rem;font-weight:500;color:#555;display:block;margin-bottom:6px">Confirm new password</label>
        <div style="position:relative">
          <input type="password" id="passConfirm" placeholder="••••••••"
            style="width:100%;padding:12px 44px 12px 16px;border:1.5px solid #e0e0e0;border-radius:8px;font-size:0.9rem;font-family:inherit;outline:none"
            onfocus="this.style.borderColor='#4a7c59'" onblur="this.style.borderColor='#e0e0e0'"/>
          <button type="button" onclick="togglePass('passConfirm',this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#999">👁</button>
        </div>
      </div>
      <div id="passMsg" style="display:none;padding:10px 14px;border-radius:8px;font-size:0.83rem"></div>
      <button onclick="doChangePassword()"
        style="padding:12px;background:#4a7c59;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.9rem">
        Change password
      </button>
    </div>
  `);
}

async function doChangePassword() {
  const old  = document.getElementById('passOld').value;
  const n    = document.getElementById('passNew').value;
  const conf = document.getElementById('passConfirm').value;
  const msg  = document.getElementById('passMsg');
  const show = (t, ok) => {
    msg.style.display = 'block';
    msg.style.background = ok ? '#ddeee3' : '#fdecea';
    msg.style.color = ok ? '#2f5c3e' : '#c0392b';
    msg.textContent = t;
  };
  if (!old || !n || !conf) return show('Please fill in all fields.', false);
  if (n !== conf) return show('Passwords do not match.', false);
  if (n.length < 8) return show('Password must be at least 8 characters.', false);
  try {
    const res = await fetch(`${API}/auth/change-password`, {
      method: 'POST',
      headers: {'Content-Type':'application/json','Authorization':`Bearer ${authToken}`},
      body: JSON.stringify({old_password: old, new_password: n})
    });
    const data = await res.json();
    if (res.ok) {
      show('Password changed!', true);
      setTimeout(() => closeModal('modalPassword'), 1500);
    } else {
      show(data.detail || 'Incorrect current password.', false);
    }
  } catch { show('Cannot connect to server.', false); }
}

// ── CÀI ĐẶT ─────────────────────────────────────────────
function openSettings() {
  document.getElementById('authSwitcher').classList.remove('open');
  const notifOn = localStorage.getItem('notifEnabled') !== 'false';
  const fontSize = localStorage.getItem('fontSize') || 'medium';

  createModal('modalSettings', `
    <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:20px">⚙️ Settings</h2>
    <div style="display:flex;flex-direction:column;gap:20px">

      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-weight:600;font-size:0.9rem">Notifications</div>
          <div style="font-size:0.75rem;color:#999;margin-top:2px">Receive notifications from Querencia</div>
        </div>
        <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer">
          <input type="checkbox" id="toggleNotif" ${notifOn ? 'checked' : ''}
            onchange="saveNotifSetting(this.checked)"
            style="opacity:0;width:0;height:0;position:absolute"/>
          <span id="toggleNotifTrack" style="position:absolute;inset:0;border-radius:24px;background:${notifOn ? '#4a7c59' : '#ddd'};transition:background 0.2s">
            <span style="position:absolute;left:${notifOn ? '22px' : '2px'};top:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2)" id="toggleNotifThumb"></span>
          </span>
        </label>
      </div>

      <div>
        <div style="font-weight:600;font-size:0.9rem;margin-bottom:10px">Font size</div>
        <div style="display:flex;gap:8px">
          ${['small','medium','large'].map(s => `
            <button onclick="saveFontSize('${s}')" id="fontBtn_${s}"
              style="flex:1;padding:8px;border-radius:8px;border:1.5px solid ${fontSize===s ? '#4a7c59' : '#e0e0e0'};background:${fontSize===s ? '#f0f7f3' : '#fff'};cursor:pointer;font-size:${s==='small'?'0.78rem':s==='large'?'1rem':'0.88rem'};color:${fontSize===s ? '#4a7c59' : '#555'};font-weight:${fontSize===s ? '600' : '400'}">
              ${s==='small' ? 'Small' : s==='large' ? 'Large' : 'Medium'}
            </button>`).join('')}
        </div>
      </div>

    </div>
  `);
}

function saveNotifSetting(on) {
  localStorage.setItem('notifEnabled', on);
  const track = document.getElementById('toggleNotifTrack');
  const thumb = document.getElementById('toggleNotifThumb');
  if (track) track.style.background = on ? '#4a7c59' : '#ddd';
  if (thumb) thumb.style.left = on ? '22px' : '2px';
  updateNotifBadge();
}

function saveFontSize(size) {
  localStorage.setItem('fontSize', size);
  const scale = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
  document.documentElement.style.fontSize = scale;
  ['small','medium','large'].forEach(s => {
    const btn = document.getElementById(`fontBtn_${s}`);
    if (!btn) return;
    btn.style.border = `1.5px solid ${s===size ? '#4a7c59' : '#e0e0e0'}`;
    btn.style.background = s===size ? '#f0f7f3' : '#fff';
    btn.style.color = s===size ? '#4a7c59' : '#555';
    btn.style.fontWeight = s===size ? '600' : '400';
  });
}

// ── GÓI ĐĂNG KÝ ─────────────────────────────────────────
function openPlan() {
  document.getElementById('authSwitcher').classList.remove('open');
  const currentPlan = localStorage.getItem('userPlan') || 'free';

  createModal('modalPlan', `
    <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:6px">⭐ Subscription</h2>
    <p style="font-size:0.82rem;color:#999;margin-bottom:24px">Current plan: <strong style="color:#4a7c59;text-transform:capitalize">${currentPlan}</strong></p>

    <div style="display:flex;flex-direction:column;gap:14px">

      <div style="border:1.5px solid ${currentPlan==='free' ? '#4a7c59' : '#e0e0e0'};border-radius:12px;padding:20px;background:${currentPlan==='free' ? '#f0f7f3' : '#fff'}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-weight:700;font-size:1rem">Free</div>
          <div style="font-size:1.1rem;font-weight:700">$0 <span style="font-size:0.75rem;font-weight:400;color:#999">/ forever</span></div>
        </div>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px">
          <li style="font-size:0.82rem;color:#555">✓ Access to all free tools</li>
          <li style="font-size:0.82rem;color:#555">✓ No ads, no tracking</li>
          <li style="font-size:0.82rem;color:#555">✓ Community support</li>
        </ul>
        ${currentPlan==='free' ? `<div style="margin-top:12px;font-size:0.78rem;color:#4a7c59;font-weight:600">✓ Current plan</div>` : ''}
      </div>

      <div style="border:1.5px solid ${currentPlan==='pro' ? '#4a7c59' : '#e0e0e0'};border-radius:12px;padding:20px;background:${currentPlan==='pro' ? '#f0f7f3' : '#fff'}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="font-weight:700;font-size:1rem">Pro</div>
            <span style="font-size:0.7rem;background:#fff3cd;color:#856404;padding:2px 7px;border-radius:20px;font-weight:600">⭐ PRO</span>
          </div>
          <div style="font-size:1.1rem;font-weight:700">$1 <span style="font-size:0.75rem;font-weight:400;color:#999">/ month</span></div>
        </div>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px">
          <li style="font-size:0.82rem;color:#555">✓ Everything in Free</li>
          <li style="font-size:0.82rem;color:#555">✓ Unlimited tool usage</li>
          <li style="font-size:0.82rem;color:#555">✓ Early access to new tools</li>
          <li style="font-size:0.82rem;color:#555">✓ Priority support</li>
          <li style="font-size:0.82rem;color:#555">✓ Cross-device sync</li>
        </ul>
        ${currentPlan==='pro'
          ? `<div style="margin-top:12px;font-size:0.78rem;color:#4a7c59;font-weight:600">✓ Current plan</div>`
          : `<button onclick="alert('Payment coming soon!')" style="margin-top:14px;width:100%;padding:10px;background:#4a7c59;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.88rem">Upgrade to Pro</button>`}
      </div>

    </div>
  `);
}

// ── THÔNG BÁO ────────────────────────────────────────────
let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');

function updateNotifBadge() {
  const notifOn = localStorage.getItem('notifEnabled') !== 'false';
  const unread = notifOn ? notifications.filter(n => !n.read).length : 0;
  let badge = document.getElementById('notifBadge');
  const btn = document.getElementById('navAuthBtn');
  if (!btn) return;
  if (unread > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.id = 'notifBadge';
      badge.style.cssText = 'position:absolute;top:-4px;right:-4px;background:#e74c3c;color:#fff;font-size:0.6rem;font-weight:700;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;pointer-events:none';
      btn.style.position = 'relative';
      btn.appendChild(badge);
    }
    badge.textContent = unread > 9 ? '9+' : unread;
  } else {
    if (badge) badge.remove();
  }
}

function addNotification(text) {
  notifications.unshift({ text, time: new Date().toISOString(), read: false });
  localStorage.setItem('notifications', JSON.stringify(notifications));
  updateNotifBadge();
}

// ── AUTH FUNCTIONS ────────────────────────────────────────

function openAuth() {
  if (authToken) { doLogout(); return; }
  openAuthModal('login');
}

function closeAuth() {
  const modal = document.getElementById('authModal');
  modal.style.display = 'none';
  modal.classList.remove('open');
  clearAuthMsg();
}

function switchTab(tab) {
  document.getElementById('formLogin').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('formRegister').style.display = tab === 'register' ? 'block' : 'none';
  const forgot = document.getElementById('formForgot');
  if (forgot) forgot.style.display = tab === 'forgot' ? 'block' : 'none';
  clearAuthMsg();
}

async function doForgotPassword() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email) { showAuthMsg('Please enter your email.', false); return; }
  try {
    const res = await fetch(`${API}/auth/forgot-password`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email})
    });
    if (res.ok) {
      showAuthMsg('If the email exists, you will receive a reset link shortly. Check your inbox!', true);
    } else {
      showAuthMsg('An error occurred. Please try again.', false);
    }
  } catch { showAuthMsg('Cannot connect to server. Please try again.', false); }
}

function showAuthMsg(msg, ok) {
  const el = document.getElementById('authMsg');
  el.style.display    = 'block';
  el.style.background = ok ? '#ddeee3' : '#fdecea';
  el.style.color      = ok ? '#2f5c3e' : '#c0392b';
  el.textContent      = msg;
}
function clearAuthMsg() {
  const el = document.getElementById('authMsg');
  if (el) el.style.display = 'none';
}

function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.style.opacity = '1';
  } else {
    input.type = 'password';
    btn.style.opacity = '0.5';
  }
}

async function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  if (!email || !pass) { showAuthMsg('Please fill in all fields.', false); return; }
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({username: email, password: pass})
    });
    const data = await res.json();
    if (res.ok) {
      // ── PUSH MFA: thử khởi động nếu user có app ──────────
      const deviceInfo = _getDeviceInfo();
      let mfaToken = null;
      try {
        const mfaRes = await fetch(`${API}/auth/mfa/challenge`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ email, device: deviceInfo })
        });
        const mfaData = await mfaRes.json();
        if (mfaData.has_app && mfaData.mfa_token) {
          mfaToken = mfaData.mfa_token;
        }
      } catch(e) { /* MFA không khả dụng → đăng nhập bình thường */ }

      if (mfaToken) {
        // Có app → đóng modal, hiện màn hình chờ xác nhận
        closeAuth();
        _showMFAWaiting(deviceInfo, mfaToken, data.access_token, email);
        return;
      }

      // Không có app → đăng nhập bình thường
      await _finalizeLogin(data.access_token, email);
    } else {
      showAuthMsg(data.detail || 'Incorrect email or password.', false);
    }
  } catch { showAuthMsg('Cannot connect to server. Please try again.', false); }
}

// ── MFA HELPERS ───────────────────────────────────────────

async function _finalizeLogin(token, email) {
  authToken = token;
  localStorage.setItem('token', token);
  localStorage.setItem('userLastLogin', new Date().toLocaleString('vi-VN'));
  try {
    const meRes = await fetch(`${API}/auth/me`, {headers: {'Authorization': `Bearer ${token}`}});
    const user = await meRes.json();
    const fullName = user.username || user.name;
    if (fullName) {
      localStorage.setItem('userFullName', fullName);
      localStorage.setItem('userEmail', user.email || email);
      localStorage.setItem('userPlan', user.plan || 'free');
      const parts = fullName.trim().split(' ');
      localStorage.setItem('userName', parts[parts.length - 1]);
    }
    if (user.created_at) {
      const d = new Date(user.created_at);
      localStorage.setItem('userJoined', d.toLocaleDateString('vi-VN', {day:'2-digit', month:'2-digit', year:'numeric'}));
    }
  } catch(e) {}
  closeAuth();
  updateNavAuth(
    localStorage.getItem('userName') || email.split('@')[0],
    localStorage.getItem('userFullName'),
    localStorage.getItem('userEmail') || email
  );
  const gate = document.getElementById('msgLoginGate');
  const form = document.getElementById('msgForm');
  if (gate) gate.style.display = 'none';
  if (form) form.style.display = 'block';
}

function _getDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = 'Browser', os = 'Web';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Android')) os = 'Android';
  return `${browser} on ${os}`;
}

function _showMFAWaiting(deviceInfo, mfaToken, fallbackToken, email) {
  const overlay = document.createElement('div');
  overlay.id = 'mfaOverlay';
  overlay.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:inherit;animation:qFadeIn 0.2s ease">
      <div style="background:#fff;border-radius:20px;padding:32px 28px;max-width:340px;width:calc(100% - 40px);box-shadow:0 20px 60px rgba(0,0,0,0.2);text-align:center">
        <div style="font-size:2.5rem;margin-bottom:12px">📱</div>
        <h2 style="font-size:1.1rem;font-weight:800;color:#111;margin:0 0 8px">Check your phone</h2>
        <p style="font-size:0.85rem;color:#666;line-height:1.6;margin:0 0 16px">
          Open the <strong>Cùi Bắp</strong> app and tap <strong>Approve</strong> to confirm sign-in.
        </p>
        <div style="background:#f7f9f8;border-radius:12px;padding:10px 14px;font-size:0.78rem;color:#666;margin-bottom:18px;text-align:left">
          🖥️ <strong>Device:</strong> ${deviceInfo}<br/>
          ⏱️ Expires in: <span id="mfaCountdown">5:00</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;color:#4a7c59;font-size:0.82rem;margin-bottom:18px">
          <div style="width:14px;height:14px;border:2px solid #ddeee3;border-top-color:#4a7c59;border-radius:50%;animation:qSpin 0.8s linear infinite"></div>
          Waiting for confirmation…
        </div>
        <button onclick="_cancelMFA('${fallbackToken}','${email}')" style="background:none;border:1.5px solid #e4ede7;border-radius:10px;padding:8px 20px;font-size:0.8rem;color:#888;cursor:pointer;font-family:inherit">
          Skip, sign in without verification
        </button>
      </div>
    </div>
    <style>
      @keyframes qFadeIn{from{opacity:0}to{opacity:1}}
      @keyframes qSpin{to{transform:rotate(360deg)}}
    </style>
  `;
  document.body.appendChild(overlay);

  // Countdown
  let remaining = 300;
  const countdownEl = document.getElementById('mfaCountdown');
  const timer = setInterval(() => {
    remaining--;
    if (remaining <= 0) { clearInterval(timer); return; }
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    if (countdownEl) countdownEl.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  }, 1000);

  // Polling
  let pollCount = 0;
  const poll = setInterval(async () => {
    pollCount++;
    if (pollCount > 150) {
      clearInterval(poll); clearInterval(timer);
      overlay.remove();
      showAuthMsg('Confirmation timeout. Please sign in again.', false);
      openAuthModal('login');
      return;
    }
    try {
      const r = await fetch(`${API}/auth/mfa/status/${mfaToken}`);
      const d = await r.json();
      if (d.status === 'approved') {
        clearInterval(poll); clearInterval(timer);
        overlay.remove();
        await _finalizeLogin(d.access_token, email);
      } else if (d.status === 'rejected') {
        clearInterval(poll); clearInterval(timer);
        overlay.remove();
        showAuthMsg('🔒 Sign-in rejected from your phone.', false);
        openAuthModal('login');
      } else if (d.status === 'expired') {
        clearInterval(poll); clearInterval(timer);
        overlay.remove();
        showAuthMsg('Session expired. Please sign in again.', false);
        openAuthModal('login');
      }
    } catch(e) {}
  }, 2000);
}

async function _cancelMFA(fallbackToken, email) {
  document.getElementById('mfaOverlay')?.remove();
  await _finalizeLogin(fallbackToken, email);
}

async function doRegister() {
  const givenName = document.getElementById('regGivenName').value.trim();
  const lastName  = document.getElementById('regLastName').value.trim();
  const email     = document.getElementById('regEmail').value.trim();
  const pass      = document.getElementById('regPass').value;
  const passConfirm = document.getElementById('regPassConfirm').value;

  if (!givenName || !lastName || !email || !pass) {
    showAuthMsg('Please fill in all fields.', false); return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAuthMsg('Invalid email. Please check and try again.', false); return;
  }
  if (pass !== passConfirm) {
    showAuthMsg('Passwords do not match.', false); return;
  }
  if (pass.length < 8) {
    showAuthMsg('Password must be at least 8 characters.', false); return;
  }

  const name = `${lastName} ${givenName}`;
  localStorage.setItem('userName', givenName);
  localStorage.setItem('userFullName', name);
  localStorage.setItem('userEmail', email);
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, email, password: pass})
    });
    const data = await res.json();
    if (res.ok) {
      showAuthMsg('Account created! Redirecting to sign in...', true);
      setTimeout(() => {
        switchTab('login');
        document.getElementById('loginEmail').value = email;
      }, 1200);
    } else {
      showAuthMsg(data.detail || 'Sign up failed. Email may already be in use.', false);
    }
  } catch { showAuthMsg('Cannot connect to server. Please try again.', false); }
}

function doLogout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userFullName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userPlan');
  localStorage.removeItem('userJoined');
  localStorage.removeItem('userLastLogin');
  const btn = document.getElementById('navAuthBtn');
  btn.innerHTML = AUTH_ICON;
  btn.style.background = '';
  btn.style.color = '';
  btn.onclick = toggleAuthDropdown;
  const dropdown = document.getElementById('authDropdown');
  const t = typeof T !== 'undefined' ? T[currentLang] : null;
  dropdown.innerHTML = `<button class="auth-option" onclick="openAuthModal('register')">${t ? t.nav_register : 'Đăng ký'}</button><button class="auth-option" onclick="openAuthModal('login')">${t ? t.nav_login : 'Đăng nhập'}</button>`;
  dropdown.style.display = '';
  document.getElementById('authSwitcher').classList.remove('open');
  const gate = document.getElementById('msgLoginGate');
  const form = document.getElementById('msgForm');
  if (gate) gate.style.display = 'block';
  if (form) form.style.display = 'none';
  updateNotifBadge();
}

function updateNavAuth(displayName, fullName, email) {
  const btn      = document.getElementById('navAuthBtn');
  const dropdown = document.getElementById('authDropdown');
  const t        = typeof T !== 'undefined' ? T[currentLang] : null;
  btn.innerHTML  = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke-width="0"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg><span class="auth-chevron">▼</span>`;
  btn.style.background = 'var(--sage)';
  btn.style.color = 'var(--white)';
  btn.style.position = 'relative';
  btn.onclick = toggleAuthDropdown;
  dropdown.innerHTML = `
    <div style="padding:14px 16px 10px;border-bottom:1px solid var(--border)">
      <div style="font-weight:600;font-size:0.88rem;color:var(--black)">${fullName || displayName}</div>
      <div style="font-size:0.75rem;color:var(--gray-light);margin-top:2px">${email || ''}</div>
    </div>
    <button class="auth-option" onclick="openProfile()">👤 Account</button>
    <button class="auth-option" onclick="openSettings()">⚙️ Settings</button>
    <button class="auth-option" onclick="openChangePassword()">🔑 Change password</button>
    <button class="auth-option" onclick="openPlan()">⭐ Subscription</button>
    <button class="auth-option" onclick="alert('Coming soon!')">❓ ${t ? t.menu_faq : 'Frequently Asked Questions'}</button>
    <div style="border-top:1px solid var(--border);margin-top:4px;padding-top:4px">
      <button class="auth-option" onclick="doLogout()" style="color:#c0392b">🚪 ${t ? t.nav_logout : 'Log out'}</button>
    </div>
  `;
  dropdown.style.display = '';
  updateNotifBadge();
}

// ── AUTH DROPDOWN ─────────────────────────────────────────

function toggleAuthDropdown() {
  document.getElementById('authSwitcher').classList.toggle('open');
}

function openAuthModal(tab) {
  const as = document.getElementById('authSwitcher');
  if (as) as.classList.remove('open');
  const modal = document.getElementById('authModal');
  modal.style.display = 'flex';
  modal.classList.add('open');
  switchTab(tab);
  clearAuthMsg();
  requestAnimationFrame(() => {
    if (typeof setLang === 'function') setLang(currentLang);
  });
}

document.addEventListener('click', e => {
  const as = document.getElementById('authSwitcher');
  if (as && !as.contains(e.target)) as.classList.remove('open');
});

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('navAuthBtn');
  if (btn && !authToken) btn.innerHTML = AUTH_ICON;
  // Khôi phục font size
  const fontSize = localStorage.getItem('fontSize');
  if (fontSize) {
    const scale = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
    document.documentElement.style.fontSize = scale;
  }
  updateNotifBadge();
});

// ── XÓA TÀI KHOẢN (GDPR COMPLIANCE) ───────────────────────
async function confirmDeleteAccount() {
  const t = {
    en: {
      warn: "⚠️ WARNING: This action cannot be undone. All your data, messages, and settings will be permanently deleted from Querencia.",
      confirm: "Type your email to confirm deletion:",
      btn: "Permanently Delete My Account",
      match: "Emails do not match. Please try again."
    },
    vi: {
      warn: "⚠️ WARNING: This action cannot be undone. All your data, messages and settings will be bạn sẽ bị xóa vĩnh viễn khỏi Querencia.",
      confirm: "Enter your email to confirm deletion:",
      btn: "Permanently delete my account",
      match: "Emails do not match. Please try again."
    },
    ja: {
      warn: "⚠️ 警告：この操作は取り消せません。Querenciaからすべてのデータ、メッセージ、設定が永久に削除されます。",
      confirm: "削除を確認するには、メールアドレスを入力してください：",
      btn: "アカウントを永久に削除する",
      match: "メールアドレスが一致しません。もう一度お試しください。"
    },
    es: {
      warn: "⚠️ ADVERTENCIA: Esta acción no se puede deshacer. Todos tus datos, mensajes y configuraciones se eliminarán permanentemente de Querencia.",
      confirm: "Escribe tu correo para confirmar la eliminación:",
      btn: "Eliminar mi cuenta permanentemente",
      match: "Los correos no coinciden. Inténtalo de nuevo."
    }
  };

  const lang = localStorage.getItem('lang') || 'en';
  const currentT = t[lang] || t.en;
  const userEmail = localStorage.getItem('userEmail');

  const content = `
    <h2 style="color:#c0392b;font-size:1.3rem;font-weight:700;margin-bottom:16px">🗑️ ${currentT.btn}</h2>
    <div style="background:#fdecea;color:#c0392b;padding:16px;border-radius:8px;font-size:0.88rem;margin-bottom:20px;line-height:1.5">
      ${currentT.warn}
    </div>
    <p style="font-size:0.85rem;margin-bottom:10px">${currentT.confirm} <br><strong>${userEmail}</strong></p>
    <input id="deleteConfirmInput" type="text" placeholder="${userEmail}" 
      style="width:100%;padding:12px;border:1.5px solid #e0e0e0;border-radius:8px;margin-bottom:16px;outline:none"
      onfocus="this.style.borderColor='#c0392b'"/>
    <div id="deleteMsg" style="display:none;color:#c0392b;font-size:0.8rem;margin-bottom:12px"></div>
    <button onclick="doDeleteAccount()" 
      style="width:100%;padding:12px;background:#c0392b;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:700">
      ${currentT.btn}
    </button>
  `;

  createModal('modalDeleteAccount', content);
}

async function doDeleteAccount() {
  const input = document.getElementById('deleteConfirmInput').value.trim();
  const userEmail = localStorage.getItem('userEmail');
  const lang = localStorage.getItem('lang') || 'en';
  
  const errorMsg = {
    en: "Emails do not match.", vi: "Email không khớp.", ja: "一致しません。", es: "No coinciden."
  };

  if (input !== userEmail) {
    const el = document.getElementById('deleteMsg');
    el.style.display = 'block';
    el.textContent = errorMsg[lang] || errorMsg.en;
    return;
  }

  try {
    const res = await fetch(`${API}/auth/delete-account`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (res.ok) {
      alert("Account deleted successfully.");
      doLogout();
      closeModal('modalDeleteAccount');
    }
  } catch (e) {
    alert("Error connecting to server.");
  }
}
