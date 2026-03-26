// toggleSearch: Mở/đóng overlay tìm kiếm
function toggleSearch() {
  const o = document.getElementById('searchOverlay');
  o.classList.toggle('open');
  if (o.classList.contains('open')) document.getElementById('overlaySearchInput').focus();
}

// Đóng overlay khi nhấn Escape
document.addEventListener('keydown', e => {
  if (e.key==='Escape') {
    document.getElementById('searchOverlay').classList.remove('open');
    document.getElementById('langSwitcher').classList.remove('open');
  }
});

// Đóng dropdown ngôn ngữ khi click ra ngoài
document.addEventListener('click', e => {
  const ls = document.getElementById('langSwitcher');
  if (!ls.contains(e.target)) ls.classList.remove('open');
});

// Thêm shadow cho nav khi scroll xuống
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 10);
});

// Dữ liệu tìm kiếm — các mục có thể tìm được
const SEARCH_INDEX = [
  { title: 'Tools', titleVI: 'Công cụ', titleJA: 'ツール', titleES: 'Herramientas', section: 'tools', desc: 'QR Generator, PDF, Image tools...' },
  { title: 'Learn', titleVI: 'Học', titleJA: '学ぶ', titleES: 'Aprender', section: 'learn', desc: 'Courses, guides, resources' },
  { title: 'Read', titleVI: 'Đọc', titleJA: '読む', titleES: 'Leer', desc: 'Essays and ideas', section: 'read' },
  { title: 'Cùi Bắp', titleVI: 'Cùi Bắp', titleJA: 'Cùi Bắp', titleES: 'Cùi Bắp', desc: 'Messaging app', section: 'cuibap' },
  { title: 'Message', titleVI: 'Nhắn tin', titleJA: 'メッセージ', titleES: 'Mensaje', desc: 'Contact us', section: 'message' },
];

function doSearch(query) {
  const q = query.toLowerCase().trim();
  const resultsEl = document.getElementById('searchResults');
  if (!resultsEl) return;
  if (!q) { resultsEl.innerHTML = ''; return; }

  const matches = SEARCH_INDEX.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.titleVI.toLowerCase().includes(q) ||
    item.titleJA.toLowerCase().includes(q) ||
    item.titleES.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    resultsEl.innerHTML = '<p style="color:#999;font-size:0.9rem;padding:8px 0">Không tìm thấy kết quả.</p>';
    return;
  }

  resultsEl.innerHTML = matches.map(m => `
    <button onclick="goToSection('${m.section}')" style="display:block;width:100%;text-align:left;padding:10px 14px;border:none;border-radius:8px;background:none;cursor:pointer;transition:background 0.15s" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='none'">
      <div style="font-weight:600;font-size:0.95rem;color:#222">${m.title}</div>
    </button>
  `).join('');
}

// Search input listener
function goToSection(section) {
  // Đóng overlay tìm kiếm
  document.getElementById('searchOverlay').classList.remove('open');
  // Ẩn tất cả section rồi hiện section được chọn
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(section);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('overlaySearchInput');
  if (input) input.addEventListener('input', e => doSearch(e.target.value));
});
