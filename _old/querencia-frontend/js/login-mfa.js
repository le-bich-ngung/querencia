// ============================================================
// FILE: js/login-mfa.js - Web Querencia
// Xử lý luồng đăng nhập có Push MFA
// Thêm vào trang login sau khi user submit email+password đúng
// ============================================================

const API = 'https://querencia.fly.dev';

/**
 * Gọi sau khi xác nhận email+password đúng.
 * Nếu user có app → khởi động MFA push flow.
 * Nếu không có app → đăng nhập bình thường với JWT nhận được.
 *
 * @param {string} email
 * @param {string} accessToken - JWT trả về từ /auth/login (nếu không bật MFA)
 */
async function startLoginFlow(email, accessToken) {
  // Lấy thông tin thiết bị để hiển thị trong push notification
  const deviceInfo = getDeviceInfo();

  let mfaToken = null;
  let hasApp = false;

  try {
    const res = await fetch(`${API}/auth/mfa/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        ip: await getPublicIP(),
        device: deviceInfo,
      }),
    });
    const data = await res.json();
    mfaToken = data.mfa_token;
    hasApp   = data.has_app;
  } catch (e) {
    console.warn('[MFA] Không thể khởi động MFA, đăng nhập thường:', e);
  }

  if (!hasApp || !mfaToken) {
    // Không có app → dùng JWT bình thường
    onLoginSuccess(accessToken);
    return;
  }

  // Có app → hiện MFA waiting UI
  showMFAWaiting(deviceInfo);
  await pollMFAStatus(mfaToken);
}


// ── POLLING ──────────────────────────────────────────────────

async function pollMFAStatus(mfaToken) {
  const MAX_POLLS = 150; // 5 phút × (2s interval)
  let count = 0;

  const interval = setInterval(async () => {
    count++;
    if (count > MAX_POLLS) {
      clearInterval(interval);
      showMFAExpired();
      return;
    }

    try {
      const res = await fetch(`${API}/auth/mfa/status/${mfaToken}`);
      const data = await res.json();

      if (data.status === 'approved') {
        clearInterval(interval);
        hideMFAWaiting();
        onLoginSuccess(data.access_token);
      } else if (data.status === 'rejected') {
        clearInterval(interval);
        showMFARejected();
      } else if (data.status === 'expired') {
        clearInterval(interval);
        showMFAExpired();
      }
      // 'pending' → tiếp tục chờ
    } catch (e) {
      console.warn('[MFA] Poll error:', e);
    }
  }, 2000);
}


// ── UI ────────────────────────────────────────────────────────

function showMFAWaiting(deviceInfo) {
  const existing = document.getElementById('mfaOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'mfaOverlay';
  overlay.innerHTML = `
    <div style="
      position:fixed; inset:0; background:rgba(0,0,0,0.5);
      display:flex; align-items:center; justify-content:center;
      z-index:9999; font-family:system-ui,sans-serif;
      animation: fadeIn 0.2s ease;
    ">
      <div style="
        background:#fff; border-radius:20px; padding:32px 28px;
        max-width:340px; width:calc(100% - 40px);
        box-shadow:0 20px 60px rgba(0,0,0,0.2); text-align:center;
      ">
        <div style="font-size:2.5rem; margin-bottom:12px">📱</div>
        <h2 style="font-size:1.1rem; font-weight:800; color:#111; margin:0 0 8px">
          Kiểm tra điện thoại của bạn
        </h2>
        <p style="font-size:0.85rem; color:#666; line-height:1.6; margin:0 0 20px">
          Mình đã gửi thông báo đến app Cùi Bắp.<br/>
          Nhấn <strong>Đồng ý</strong> trên điện thoại để đăng nhập.
        </p>

        <div style="
          background:#f7f9f8; border-radius:12px; padding:12px 16px;
          font-size:0.78rem; color:#666; margin-bottom:20px; text-align:left;
        ">
          <div style="margin-bottom:4px">🖥️ <strong>Thiết bị:</strong> ${deviceInfo}</div>
          <div>⏱️ <strong>Hết hạn sau:</strong> <span id="mfaCountdown">5:00</span></div>
        </div>

        <!-- Spinner -->
        <div style="display:flex; align-items:center; justify-content:center; gap:8px; color:#4a7c59; font-size:0.82rem; margin-bottom:20px">
          <div class="mfa-spinner"></div>
          Đang chờ xác nhận…
        </div>

        <button onclick="cancelMFA()" style="
          background:none; border:1.5px solid #e4ede7; border-radius:10px;
          padding:8px 20px; font-size:0.8rem; color:#888; cursor:pointer;
          font-family:inherit; transition:border-color 0.15s;
        ">Đăng nhập theo cách khác</button>
      </div>
    </div>
    <style>
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      .mfa-spinner {
        width:16px; height:16px; border:2px solid #ddeee3;
        border-top-color:#4a7c59; border-radius:50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin { to{transform:rotate(360deg)} }
    </style>
  `;
  document.body.appendChild(overlay);

  // Countdown timer
  let remaining = 300;
  const countdownEl = document.getElementById('mfaCountdown');
  const timer = setInterval(() => {
    remaining--;
    if (remaining <= 0) { clearInterval(timer); return; }
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    if (countdownEl) countdownEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }, 1000);
  overlay._timer = timer;
}

function hideMFAWaiting() {
  const o = document.getElementById('mfaOverlay');
  if (o) { clearInterval(o._timer); o.remove(); }
}

function showMFARejected() {
  hideMFAWaiting();
  showMFAMessage('🔒', 'Đăng nhập bị từ chối', 'Bạn đã từ chối xác nhận trên điện thoại. Nếu không phải bạn, hãy đổi mật khẩu ngay.', '#e05a5a');
}

function showMFAExpired() {
  hideMFAWaiting();
  showMFAMessage('⏰', 'Phiên xác thực hết hạn', 'Bạn không phản hồi trong 5 phút. Vui lòng thử đăng nhập lại.', '#888');
}

function showMFAMessage(icon, title, body, color) {
  const overlay = document.createElement('div');
  overlay.id = 'mfaOverlay';
  overlay.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:system-ui,sans-serif">
      <div style="background:#fff;border-radius:20px;padding:32px 28px;max-width:320px;width:calc(100%-40px);box-shadow:0 20px 60px rgba(0,0,0,0.2);text-align:center">
        <div style="font-size:2.5rem;margin-bottom:12px">${icon}</div>
        <h2 style="font-size:1.1rem;font-weight:800;color:${color};margin:0 0 10px">${title}</h2>
        <p style="font-size:0.85rem;color:#666;line-height:1.6;margin:0 0 20px">${body}</p>
        <button onclick="document.getElementById('mfaOverlay').remove()" style="padding:10px 24px;background:#4a7c59;color:#fff;border:none;border-radius:22px;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:inherit">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function cancelMFA() {
  hideMFAWaiting();
  // Hiện lại form đăng nhập thường hoặc email OTP
  document.getElementById('loginForm')?.classList.remove('hidden');
}


// ── HELPERS ───────────────────────────────────────────────────

function getDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = 'Trình duyệt';
  let os = 'Web';

  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('Linux')) os = 'Linux';

  return `${browser} trên ${os}`;
}

async function getPublicIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch {
    return null;
  }
}

function onLoginSuccess(accessToken) {
  // Lưu token và redirect
  localStorage.setItem('access_token', accessToken);
  window.location.href = '/';
}
