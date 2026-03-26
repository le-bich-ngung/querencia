// ============================================================
// FILE: js/read-controller.js
// NHIỆM VỤ: Điều phối 3 tab trong section Read
//
// CÁCH TÍCH HỢP VÀO index.html:
// ─────────────────────────────
// 1. Thay thế toàn bộ <section class="section" id="read">...</section>
//    bằng nội dung trong file read-section.html
//
// 2. Load 3 file JS này TRƯỚC thẻ </body>:
//    <script src="js/read-laws.js"></script>
//    <script src="js/read-quotes.js"></script>
//    <script src="js/read-controller.js"></script>
//
// 3. Trong app.js → hàm showSection(), thêm case 'read':
//    case 'read':
//      initReadSection();
//      break;
//    (hoặc gọi initReadSection() từ bất cứ đâu khi tab Read được mở)
// ============================================================

let readInited = false;

function initReadSection() {
  if (readInited) return;
  readInited = true;

  // Khởi tạo luật và quotes khi lần đầu mở tab Read
  if (typeof initLaws   === 'function') initLaws();
  if (typeof initQuotes === 'function') initQuotes();
}

// ─── SWITCH TAB ─────────────────────────────────────────────
function switchReadTab(tab, btn) {
  // Ẩn tất cả panels
  document.querySelectorAll('.read-panel').forEach(p => p.style.display = 'none');

  // Bỏ active tất cả tabs
  document.querySelectorAll('.read-tab').forEach(b => b.classList.remove('active'));

  // Hiện panel được chọn
  const panel = document.getElementById('readPanel-' + tab);
  if (panel) panel.style.display = tab === 'laws' ? 'flex' : 'block';

  // Active tab button
  if (btn) btn.classList.add('active');

  // Lazy init
  if (tab === 'laws'   && typeof initLaws   === 'function') initLaws();
  if (tab === 'quotes' && typeof initQuotes === 'function') initQuotes();
}

// ─── BOOK NOTIFY ────────────────────────────────────────────
function bookNotifySignup() {
  const input = document.getElementById('bookNotifyEmail');
  const msg   = document.getElementById('bookNotifyMsg');
  const email = input?.value?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (msg) {
      msg.style.color = '#e07070';
      msg.textContent = 'Vui lòng nhập email hợp lệ.';
      msg.style.display = 'block';
    }
    return;
  }

  // TODO: Gửi email lên backend → POST /notify/book
  // fetch('https://querencia.fly.dev/notify/book', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email })
  // });

  // Tạm thời lưu local
  const existing = JSON.parse(localStorage.getItem('qBookNotify') || '[]');
  if (!existing.includes(email)) {
    existing.push(email);
    localStorage.setItem('qBookNotify', JSON.stringify(existing));
  }

  input.value = '';
  if (msg) {
    msg.style.color = 'var(--sage)';
    msg.textContent = '✓ Đã ghi nhận! Là sẽ thông báo khi sách ra mắt.';
    msg.style.display = 'block';
  }
}

// ─── AUTO INIT khi showSection('read') được gọi ─────────────
// Patch vào hàm showSection nếu nó tồn tại
(function patchShowSection() {
  const originalShow = window.showSection;
  if (typeof originalShow !== 'function') {
    // Thử lại sau khi app.js load
    window.addEventListener('DOMContentLoaded', () => {
      const s = window.showSection;
      if (typeof s === 'function') {
        window.showSection = function(section) {
          s(section);
          if (section === 'read') initReadSection();
        };
      }
    });
    return;
  }
  window.showSection = function(section) {
    originalShow(section);
    if (section === 'read') initReadSection();
  };
})();
