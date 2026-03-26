/*!
 * Smart Find — Querencia
 * Find-in-page cho mobile browser & WebView (Cùi Bắp / Nope / LàNo)
 *
 * Dùng:
 *   <script src="/js/smart-find.js"></script>
 *
 * Kích hoạt:
 *   - Mobile: nút 🔍 floating (góc dưới trái)
 *   - Desktop: Ctrl+F / Cmd+F (ghi đè browser native)
 *   - JS API: window.SmartFind.open()
 *
 * Trong app (WebView):
 *   Android: webView.evaluateJavascript("window.SmartFind.open()", null)
 *   iOS:     webView.evaluateJavaScript("window.SmartFind.open()")
 */

(function () {
  'use strict';

  if (document.getElementById('sf-root')) return;

  // ── CONFIG ─────────────────────────────────────────────────
  const HIGHLIGHT_COLOR  = 'rgba(74, 124, 89, 0.25)'; // sage green
  const ACTIVE_COLOR     = 'rgba(74, 124, 89, 0.7)';
  const SKIP_TAGS        = new Set(['SCRIPT','STYLE','NOSCRIPT','IFRAME','INPUT','TEXTAREA','SELECT','OPTION']);

  // ── STATE ──────────────────────────────────────────────────
  let matches     = [];   // list of { node, start, end, mark }
  let currentIdx  = -1;
  let lastQuery   = '';
  let isOpen      = false;

  // ── INJECT HTML ────────────────────────────────────────────
  const root = document.createElement('div');
  root.id = 'sf-root';
  root.innerHTML = `
    <style>
      #sf-root * { box-sizing: border-box; font-family: system-ui, sans-serif; }

      /* FAB — chỉ hiện trên mobile khi bar đóng */
      #sf-fab {
        position: fixed; bottom: 80px; left: 16px; z-index: 2147483640;
        width: 44px; height: 44px; border-radius: 50%;
        background: #4a7c59; border: none; cursor: pointer;
        box-shadow: 0 3px 14px rgba(74,124,89,0.38);
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.18s, opacity 0.18s;
        color: #fff; font-size: 1.05rem;
      }
      #sf-fab.hidden { opacity: 0; pointer-events: none; transform: scale(0.8); }
      @media (hover: hover) and (pointer: fine) {
        /* Desktop: ẩn FAB, dùng Ctrl+F */
        #sf-fab { display: none; }
      }

      /* BAR */
      #sf-bar {
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 2147483641;
        background: #f7f9f8;
        border-top: 1.5px solid #c8ddd1;
        padding: 10px 12px;
        transform: translateY(100%);
        transition: transform 0.22s cubic-bezier(0.4,0,0.2,1);
        /* safe area cho iPhone notch */
        padding-bottom: calc(10px + env(safe-area-inset-bottom));
      }
      #sf-bar.open { transform: translateY(0); }

      #sf-row {
        display: flex; align-items: center; gap: 6px;
      }

      #sf-input {
        flex: 1; padding: 9px 13px;
        border: 1.5px solid #c8ddd1; border-radius: 22px;
        background: #fff; font-size: 0.88rem; color: #111;
        outline: none; transition: border-color 0.18s;
        font-family: inherit;
        /* Tránh zoom iOS khi focus */
        font-size: max(16px, 0.88rem);
      }
      #sf-input:focus { border-color: #4a7c59; }
      #sf-input::placeholder { color: #aaa; }

      #sf-status {
        font-size: 0.7rem; color: #888; white-space: nowrap;
        min-width: 54px; text-align: center;
      }
      #sf-status.no-match { color: #e05a5a; }

      .sf-btn {
        width: 36px; height: 36px; border-radius: 50%;
        border: 1.5px solid #ddeee3; background: #fff;
        cursor: pointer; font-size: 0.9rem; color: #4a7c59;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.15s, border-color 0.15s;
        flex-shrink: 0;
      }
      .sf-btn:active { background: #ddeee3; }
      .sf-btn:disabled { opacity: 0.3; cursor: default; }
      #sf-close {
        width: 36px; height: 36px; border-radius: 50%;
        border: none; background: none;
        cursor: pointer; font-size: 1rem; color: #999;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }

      /* HIGHLIGHTS */
      .sf-mark {
        background: ${HIGHLIGHT_COLOR};
        border-radius: 2px;
        padding: 0 1px;
        color: inherit;
        transition: background 0.15s;
      }
      .sf-mark.sf-active {
        background: ${ACTIVE_COLOR};
        color: #fff;
        border-radius: 3px;
      }
    </style>

    <!-- FAB (mobile) -->
    <button id="sf-fab" aria-label="Tìm trong trang" title="Tìm trong trang (Ctrl+F)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
        <circle cx="11" cy="11" r="7"/><line x1="17" y1="17" x2="22" y2="22"/>
      </svg>
    </button>

    <!-- BAR -->
    <div id="sf-bar" role="search" aria-label="Tìm trong trang">
      <div id="sf-row">
        <input id="sf-input" type="search" placeholder="Tìm trong trang…" autocomplete="off" autocorrect="off" spellcheck="false"/>
        <span id="sf-status">–</span>
        <button class="sf-btn" id="sf-prev" title="Kết quả trước (Shift+Enter)" disabled>↑</button>
        <button class="sf-btn" id="sf-next" title="Kết quả tiếp (Enter)" disabled>↓</button>
        <button id="sf-close" title="Đóng (Esc)">✕</button>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  // ── REFS ───────────────────────────────────────────────────
  const fab    = document.getElementById('sf-fab');
  const bar    = document.getElementById('sf-bar');
  const input  = document.getElementById('sf-input');
  const status = document.getElementById('sf-status');
  const btnPrev = document.getElementById('sf-prev');
  const btnNext = document.getElementById('sf-next');

  // ── HIGHLIGHT ENGINE ───────────────────────────────────────
  function clearHighlights() {
    document.querySelectorAll('.sf-mark').forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
    matches = [];
    currentIdx = -1;
  }

  function getTextNodes(node) {
    const nodes = [];
    const walker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(n) {
          if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          let p = n.parentNode;
          while (p && p !== document.body) {
            if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
            if (p.id === 'sf-root') return NodeFilter.FILTER_REJECT;
            p = p.parentNode;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  function highlight(query) {
    clearHighlights();
    if (!query || query.length < 2) { updateStatus(); return; }

    const textNodes = getTextNodes(document.body);
    const regex = new RegExp(escapeRegex(query), 'gi');

    textNodes.forEach(node => {
      const text = node.nodeValue;
      let match;
      const parts = [];
      let lastIndex = 0;
      regex.lastIndex = 0;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(document.createTextNode(text.slice(lastIndex, match.index)));
        }
        const mark = document.createElement('mark');
        mark.className = 'sf-mark';
        mark.textContent = match[0];
        parts.push(mark);
        matches.push(mark);
        lastIndex = match.index + match[0].length;
      }

      if (parts.length > 0) {
        if (lastIndex < text.length) {
          parts.push(document.createTextNode(text.slice(lastIndex)));
        }
        const frag = document.createDocumentFragment();
        parts.forEach(p => frag.appendChild(p));
        node.parentNode.replaceChild(frag, node);
      }
    });

    if (matches.length > 0) {
      currentIdx = 0;
      activateCurrent();
    }
    updateStatus();
  }

  function activateCurrent() {
    matches.forEach((m, i) => m.classList.toggle('sf-active', i === currentIdx));
    if (matches[currentIdx]) {
      matches[currentIdx].scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    updateStatus();
  }

  function updateStatus() {
    if (matches.length === 0) {
      status.textContent = lastQuery.length >= 2 ? '0 kết quả' : '–';
      status.classList.toggle('no-match', lastQuery.length >= 2);
      btnPrev.disabled = btnNext.disabled = true;
    } else {
      status.textContent = `${currentIdx + 1} / ${matches.length}`;
      status.classList.remove('no-match');
      btnPrev.disabled = false;
      btnNext.disabled = false;
    }
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ── NAVIGATION ─────────────────────────────────────────────
  function next() {
    if (!matches.length) return;
    currentIdx = (currentIdx + 1) % matches.length;
    activateCurrent();
  }

  function prev() {
    if (!matches.length) return;
    currentIdx = (currentIdx - 1 + matches.length) % matches.length;
    activateCurrent();
  }

  // ── OPEN / CLOSE ───────────────────────────────────────────
  function open() {
    isOpen = true;
    fab.classList.add('hidden');
    bar.classList.add('open');
    // Đẩy content lên để bar không che
    document.body.style.paddingBottom = `calc(60px + env(safe-area-inset-bottom))`;
    setTimeout(() => input.focus(), 80);
    if (lastQuery) highlight(lastQuery);
  }

  function close() {
    isOpen = false;
    bar.classList.remove('open');
    fab.classList.remove('hidden');
    document.body.style.paddingBottom = '';
    clearHighlights();
    input.value = '';
    lastQuery = '';
    updateStatus();
    input.blur();
  }

  // ── EVENTS ─────────────────────────────────────────────────
  fab.addEventListener('click', open);
  document.getElementById('sf-close').addEventListener('click', close);
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);

  input.addEventListener('input', () => {
    lastQuery = input.value;
    highlight(lastQuery);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.shiftKey ? prev() : next();
    }
    if (e.key === 'Escape') close();
  });

  // Ctrl+F / Cmd+F — ghi đè trên desktop
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      isOpen ? (input.select(), input.focus()) : open();
    }
    if (e.key === 'Escape' && isOpen) close();
  });

  // ── PUBLIC API ─────────────────────────────────────────────
  // Dùng từ WebView hoặc JS khác:
  //   window.SmartFind.open()
  //   window.SmartFind.close()
  //   window.SmartFind.search('từ khóa')
  window.SmartFind = { open, close, search: (q) => { open(); input.value = q; lastQuery = q; highlight(q); } };

})();
