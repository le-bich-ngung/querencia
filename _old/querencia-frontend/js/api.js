const API = 'https://querencia.fly.dev';

// Token đăng nhập — null nếu chưa đăng nhập
let authToken = localStorage.getItem('token') || null;
let currentUser = null;  // Thông tin user hiện tại (chưa dùng)

// ── FORM GỬI TIN NHẮN ──────────────────────────────────────

// sendMessage: Gọi POST /message
// Các trường bắt buộc: name, subject, content
// Email là không bắt buộc
// Nếu đã đăng nhập → tự động gắn Bearer token vào header
async function sendMessage() {
  const subject = document.getElementById('msgSubject').value.trim();
  const content = document.getElementById('msgBody').value.trim();
  const fb = document.getElementById('msgFeedback');
  const btn = document.getElementById('msgSendBtn');

  if (!subject || !content) {
    fb.style.display = 'block'; fb.style.background = '#fdecea'; fb.style.color = '#c0392b';
    fb.textContent = 'Vui lòng điền tiêu đề và nội dung.'; return;
  }

  btn.textContent = 'Đang gửi...'; btn.disabled = true;
  try {
    const headers = {'Content-Type': 'application/json'};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
    const res = await fetch(`${API}/message`, {
      method: 'POST', headers,
      body: JSON.stringify({subject, content})
    });
    if (res.ok) {
      fb.style.display = 'block'; fb.style.background = '#ddeee3'; fb.style.color = '#2f5c3e';
      fb.textContent = 'Tin nhắn đã gửi! Cảm ơn bạn 🌿';
      document.getElementById('msgSubject').value = '';
      document.getElementById('msgBody').value = '';
    } else {
      const data = await res.json();
      fb.style.display = 'block'; fb.style.background = '#fdecea'; fb.style.color = '#c0392b';
      fb.textContent = data.detail || 'Gửi thất bại. Thử lại sau.';
    }
  } catch {
    fb.style.display = 'block'; fb.style.background = '#fdecea'; fb.style.color = '#c0392b';
    fb.textContent = 'Không thể kết nối server.';
  }
  btn.textContent = 'Send Message'; btn.disabled = false;
}

// ── HELPER: Lấy thông tin thiết bị cho MFA ─────────────────
function _getDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = 'Browser';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  const os = ua.includes('Windows') ? 'Windows'
    : ua.includes('Mac') ? 'macOS'
    : ua.includes('Linux') ? 'Linux'
    : ua.includes('Android') ? 'Android'
    : ua.includes('iPhone') || ua.includes('iPad') ? 'iOS' : 'Unknown';
  return `${browser} trên ${os}`;
}

// ── KHÔI PHỤC TRẠNG THÁI ĐĂNG NHẬP ────────────────────────
// Xử lý Google OAuth callback — URL có ?google_token=...
const urlParams = new URLSearchParams(window.location.search);
const googleToken = urlParams.get('google_token');
const googleName  = urlParams.get('name');
const googleEmail = urlParams.get('email');
if (googleToken) {
  // Lưu thông tin user trước
  if (googleName) {
    const parts = decodeURIComponent(googleName).trim().split(' ');
    localStorage.setItem('userName', parts[parts.length - 1]);
    localStorage.setItem('userFullName', decodeURIComponent(googleName));
  }
  const decodedEmail = googleEmail ? decodeURIComponent(googleEmail) : null;
  if (decodedEmail) localStorage.setItem('userEmail', decodedEmail);

  // Xóa params khỏi URL ngay
  window.history.replaceState({}, '', window.location.pathname);

  // Thử khởi động MFA nếu user có app
  (async () => {
    const deviceInfo = _getDeviceInfo();
    let mfaToken = null;
    try {
      const mfaRes = await fetch(`${API}/auth/mfa/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: decodedEmail, device: deviceInfo })
      });
      const mfaData = await mfaRes.json();
      if (mfaData.has_app && mfaData.mfa_token) {
        mfaToken = mfaData.mfa_token;
      }
    } catch(e) { /* MFA không khả dụng → đăng nhập bình thường */ }

    if (mfaToken) {
      // Có app → hiện màn hình chờ xác nhận
      _showMFAWaiting(deviceInfo, mfaToken, googleToken, decodedEmail);
    } else {
      // Không có app → đăng nhập bình thường
      authToken = googleToken;
      localStorage.setItem('token', authToken);
      localStorage.setItem('userLastLogin', new Date().toLocaleString('vi-VN'));
    }
  })();
}

// Khi tải lại trang, nếu có token → kiểm tra với server
// GET /auth/me → trả về info user → cập nhật UI
// Nếu token hết hạn → doLogout() xóa token cũ
if (authToken) {
  fetch(`${API}/auth/me`, {headers: {'Authorization': `Bearer ${authToken}`}})
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (data) {
        let displayName = localStorage.getItem('userName');
        const fullName = data.username || data.name;
        if (!displayName && fullName) {
          const parts = fullName.trim().split(' ');
          displayName = parts[parts.length - 1];
          localStorage.setItem('userName', displayName);
        }
        if (!displayName) displayName = data.email.split('@')[0];
        if (fullName) localStorage.setItem('userFullName', fullName);
        if (data.email) localStorage.setItem('userEmail', data.email);
        updateNavAuth(displayName, localStorage.getItem('userFullName'), localStorage.getItem('userEmail'));
      } else doLogout();
    })
    .catch(() => doLogout());
}
