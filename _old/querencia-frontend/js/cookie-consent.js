// ============================================================
// FILE: js/cookie-consent.js
// Dùng: <script src="/js/cookie-consent.js"></script> trước </body>
// ============================================================

(function () {
  const COOKIE_KEY = 'querencia_cookie_consent';

  // Nếu đã chọn rồi thì thôi
  if (localStorage.getItem(COOKIE_KEY)) return;

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    #qr-cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 99999;
      background: #fff;
      border-top: 1.5px solid #ddeee3;
      box-shadow: 0 -4px 32px rgba(74,124,89,0.10);
      padding: 18px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }
    #qr-cookie-banner.visible {
      transform: translateY(0);
    }
    #qr-cookie-banner .qr-cookie-text {
      flex: 1;
      font-size: 14px;
      color: #444;
      line-height: 1.6;
    }
    #qr-cookie-banner .qr-cookie-text strong {
      color: #2f5c3e;
      font-weight: 600;
    }
    #qr-cookie-banner .qr-cookie-text a {
      color: #4a7c59;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    #qr-cookie-banner .qr-cookie-actions {
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }
    #qr-cookie-decline {
      padding: 9px 20px;
      border: 1.5px solid #c8ddd1;
      border-radius: 8px;
      background: transparent;
      color: #4a7c59;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    #qr-cookie-decline:hover {
      background: #f0f7f2;
      border-color: #4a7c59;
    }
    #qr-cookie-accept {
      padding: 9px 22px;
      border: none;
      border-radius: 8px;
      background: #4a7c59;
      color: #fff;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    #qr-cookie-accept:hover {
      background: #2f5c3e;
    }
    @media (max-width: 600px) {
      #qr-cookie-banner {
        flex-direction: column;
        align-items: flex-start;
        padding: 16px 20px;
        gap: 14px;
      }
      #qr-cookie-banner .qr-cookie-actions {
        width: 100%;
      }
      #qr-cookie-decline, #qr-cookie-accept {
        flex: 1;
        text-align: center;
      }
    }
  `;
  document.head.appendChild(style);

  // Tạo banner
  const banner = document.createElement('div');
  banner.id = 'qr-cookie-banner';
  banner.innerHTML = `
    <div class="qr-cookie-text">
      <strong>🍪 Querencia dùng cookie</strong> để cải thiện trải nghiệm của bạn — phân tích ẩn danh, không quảng cáo, không bán dữ liệu.
      Xem thêm tại <a href="/pages/privacy.html" target="_blank">Chính sách bảo mật</a>.
    </div>
    <div class="qr-cookie-actions">
      <button id="qr-cookie-decline">Từ chối</button>
      <button id="qr-cookie-accept">Chấp nhận</button>
    </div>
  `;
  document.body.appendChild(banner);

  // Hiện banner sau 300ms
  setTimeout(() => banner.classList.add('visible'), 300);

  function dismiss(choice) {
    localStorage.setItem(COOKIE_KEY, choice); // 'accepted' hoặc 'declined'
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => banner.remove(), 400);
  }

  document.getElementById('qr-cookie-accept').addEventListener('click', () => dismiss('accepted'));
  document.getElementById('qr-cookie-decline').addEventListener('click', () => dismiss('declined'));
})();
