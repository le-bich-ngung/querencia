// ============================================================
// FILE: js/read-laws.js
// NHIỆM VỤ: Danh sách văn bản pháp luật + nhúng iframe vbpl.vn
//
// Để thêm văn bản mới → thêm object vào mảng LAWS:
//   {
//     id:        'unique-id',         // dùng nội bộ
//     number:    'Luật XX/20XX/QH1X', // số hiệu
//     title:     'Tên đầy đủ',
//     category:  'Nhóm',              // dùng để lọc
//     date:      'dd/mm/yyyy',        // ngày ban hành
//     effective: 'dd/mm/yyyy',        // ngày có hiệu lực
//     itemId:    123456,              // số ItemID trong URL vbpl.vn
//   }
//
// URL iframe tự động ghép:
//   https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID={itemId}&Keyword=
// ============================================================

const LAWS = [
  {
    id: 'hienphap2013',
    number: 'Hiến pháp 2013',
    title: 'Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam',
    category: 'Hiến pháp',
    date: '28/11/2013',
    effective: '01/01/2014',
    itemId: 14380,
  },
  {
    id: 'blds2015',
    number: 'BLDS 2015 — Luật số 91/2015/QH13',
    title: 'Bộ luật Dân sự năm 2015',
    category: 'Dân sự',
    date: '24/11/2015',
    effective: '01/01/2017',
    itemId: 96182,
  },
  {
    id: 'blhs2015',
    number: 'BLHS 2015 — Luật số 100/2015/QH13',
    title: 'Bộ luật Hình sự năm 2015 (sửa đổi, bổ sung 2017)',
    category: 'Hình sự',
    date: '27/11/2015',
    effective: '01/01/2018',
    itemId: 96170,
  },
  {
    id: 'bltths2015',
    number: 'BLTTHS 2015 — Luật số 101/2015/QH13',
    title: 'Bộ luật Tố tụng Hình sự năm 2015',
    category: 'Hình sự',
    date: '27/11/2015',
    effective: '01/01/2018',
    itemId: 96172,
  },
  {
    id: 'bllao2019',
    number: 'BLLĐ 2019 — Luật số 45/2019/QH14',
    title: 'Bộ luật Lao động năm 2019',
    category: 'Lao động',
    date: '20/11/2019',
    effective: '01/01/2021',
    itemId: 112761,
  },
  {
    id: 'lhngd2014',
    number: 'Luật số 52/2014/QH13',
    title: 'Luật Hôn nhân và Gia đình năm 2014',
    category: 'Dân sự',
    date: '19/06/2014',
    effective: '01/01/2015',
    itemId: 77586,
  },
  {
    id: 'lct2013',
    number: 'Luật số 23/2013/QH13',
    title: 'Luật Đất đai năm 2013',
    category: 'Đất đai',
    date: '29/11/2013',
    effective: '01/07/2014',
    itemId: 67036,
  },
  {
    id: 'ldt2020',
    number: 'Luật số 61/2020/QH14',
    title: 'Luật Đầu tư năm 2020',
    category: 'Kinh doanh',
    date: '17/06/2020',
    effective: '01/01/2021',
    itemId: 114812,
  },
  {
    id: 'ldn2020',
    number: 'Luật số 59/2020/QH14',
    title: 'Luật Doanh nghiệp năm 2020',
    category: 'Kinh doanh',
    date: '17/06/2020',
    effective: '01/01/2021',
    itemId: 114810,
  },
  {
    id: 'lbvqlntd2023',
    number: 'Luật số 19/2023/QH15',
    title: 'Luật Bảo vệ quyền lợi người tiêu dùng năm 2023',
    category: 'Dân sự',
    date: '20/06/2023',
    effective: '01/07/2024',
    itemId: 154681,
  },
  {
    id: 'lgddt2019',
    number: 'Luật số 43/2019/QH14',
    title: 'Luật Giáo dục năm 2019',
    category: 'Giáo dục',
    date: '14/06/2019',
    effective: '01/07/2020',
    itemId: 110294,
  },
  {
    id: 'lkb2023',
    number: 'Luật số 15/2023/QH15',
    title: 'Luật Khám bệnh, Chữa bệnh năm 2023',
    category: 'Y tế',
    date: '09/01/2023',
    effective: '01/01/2024',
    itemId: 151844,
  },
  {
    id: 'lxpvphc2012',
    number: 'Luật số 15/2012/QH13',
    title: 'Luật Xử lý vi phạm hành chính năm 2012',
    category: 'Hành chính',
    date: '20/06/2012',
    effective: '01/07/2013',
    itemId: 55661,
  },
  {
    id: 'lttds2015',
    number: 'BLTTDS 2015 — Luật số 92/2015/QH13',
    title: 'Bộ luật Tố tụng Dân sự năm 2015',
    category: 'Dân sự',
    date: '25/11/2015',
    effective: '01/07/2016',
    itemId: 96183,
  },
  {
    id: 'lgtvt2019',
    number: 'Luật số 23/2008/QH12',
    title: 'Luật Giao thông đường bộ năm 2008',
    category: 'Giao thông',
    date: '13/11/2008',
    effective: '01/07/2009',
    itemId: 11365,
  },
];

// ─── HELPERS ──────────────────────────────────────────────
const VBPL_PROXY = 'https://querencia.fly.dev/proxy/law';

function lawIframeURL(itemId) {
  return `https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=${itemId}&Keyword=`;
}

function lawProxyURL(itemId) {
  return `${VBPL_PROXY}?url=${encodeURIComponent(lawIframeURL(itemId))}`;
}

// ─── STATE ────────────────────────────────────────────────
const LAW_CATEGORIES = ['Tất cả', ...new Set(LAWS.map(l => l.category))];
let activeLawCat = 'Tất cả';
let activeLawId  = null;

// ─── INIT ─────────────────────────────────────────────────
function initLaws() {
  renderLawCats();
  renderLawItems(LAWS);
}

// ─── CATEGORIES ───────────────────────────────────────────
function renderLawCats() {
  const wrap = document.getElementById('lawCats');
  if (!wrap) return;
  wrap.innerHTML = LAW_CATEGORIES.map(c => `
    <button class="cat-chip${c === activeLawCat ? ' active' : ''}"
      onclick="setLawCat('${c}',this)">${c}</button>
  `).join('');
}

function setLawCat(cat, btn) {
  activeLawCat = cat;
  document.querySelectorAll('#lawCats .cat-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterLaws(document.getElementById('lawSearch')?.value || '');
}

// ─── FILTER + RENDER LIST ─────────────────────────────────
function filterLaws(q = '') {
  const filtered = LAWS.filter(l => {
    const matchCat = activeLawCat === 'Tất cả' || l.category === activeLawCat;
    const matchQ   = !q
      || l.title.toLowerCase().includes(q.toLowerCase())
      || l.number.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });
  renderLawItems(filtered);
}

function renderLawItems(list) {
  const wrap = document.getElementById('lawItems');
  if (!wrap) return;

  if (!list.length) {
    wrap.innerHTML = '<div class="read-empty-state">Không tìm thấy văn bản nào.</div>';
    return;
  }

  wrap.innerHTML = list.map(l => `
    <div class="law-item${activeLawId === l.id ? ' active' : ''}"
      onclick="openLaw('${l.id}')" title="${l.title}">
      <div class="law-item-num">${l.number} · ${l.category}</div>
      <div class="law-item-title">${l.title}</div>
      <div class="law-item-meta">Hiệu lực: ${l.effective}</div>
    </div>
  `).join('');
}

// ─── OPEN LAW (iframe) ────────────────────────────────────
function openLaw(id) {
  const law = LAWS.find(l => l.id === id);
  if (!law) return;

  activeLawId = id;

  // Re-render list để highlight
  const q = document.getElementById('lawSearch')?.value || '';
  filterLaws(q);

  // Lấy các element
  const emptyEl   = document.getElementById('lawReaderEmpty');
  const barEl     = document.getElementById('lawIframeBar');
  const iframeEl  = document.getElementById('lawIframe');
  const spinnerEl = document.getElementById('lawIframeSpinner');
  const titleEl   = document.getElementById('lawIframeTitle');
  const metaEl    = document.getElementById('lawIframeMeta');
  const linkEl    = document.getElementById('lawIframeExtLink');

  if (!iframeEl) return;

  // Ẩn empty state, hiện topbar + spinner
  if (emptyEl)   emptyEl.style.display   = 'none';
  if (barEl)   { barEl.style.display     = 'flex'; }
  if (spinnerEl) { spinnerEl.style.display = 'flex'; }
  iframeEl.style.display = 'none'; // ẩn iframe trong khi load

  // Cập nhật topbar
  if (titleEl) titleEl.textContent = law.title;
  if (metaEl)  metaEl.textContent  = `${law.number} · Ban hành: ${law.date} · Hiệu lực: ${law.effective}`;
  const url = lawIframeURL(law.itemId);   // link gốc → nút "Mở trang gốc"
  const proxyUrl = lawProxyURL(law.itemId); // qua proxy → iframe
  if (linkEl) linkEl.href = url;

  // Load iframe
  iframeEl.onload = () => {
    if (spinnerEl) spinnerEl.style.display = 'none';
    iframeEl.style.display = 'block';
    iframeEl.style.flex    = '1';
  };
  iframeEl.onerror = () => {
    if (spinnerEl) spinnerEl.style.display = 'none';
    iframeEl.style.display = 'none';
    // Fallback: mở tab mới
    if (emptyEl) {
      emptyEl.style.display = 'flex';
      emptyEl.innerHTML = `
        <div style="font-size:2.5rem;margin-bottom:16px;opacity:0.3">⚠️</div>
        <p style="font-size:0.88rem;line-height:1.8;max-width:300px">
          Không thể nhúng văn bản này.<br/>
          <a href="${url}" target="_blank" rel="noopener"
            style="color:var(--sage);font-weight:600">
            Nhấn đây để mở trang gốc ↗
          </a>
        </p>
      `;
    }
  };

  // Đặt src qua proxy
  iframeEl.src = proxyUrl;
}
