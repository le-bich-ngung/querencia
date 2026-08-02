// ============================================================
// FILE: js/read-quotes.js
// NHIỆM VỤ: Data câu nói hay + logic hiển thị card / iframe
//
// Để thêm câu mới:
//   1. Thêm object vào mảng QUOTES
//   2. source: URL trang có câu nói (nếu có)
//   3. iframeable: true nếu trang cho phép nhúng, false nếu không
//   4. category: nhóm chủ đề
// ============================================================

const QUOTES = [
  {
    id: 'q1',
    text: 'Bạn không thể đi lại trong cuộc đời và không để lại dấu vết.',
    author: 'Lão Tử',
    context: 'Đạo Đức Kinh',
    category: 'Triết học',
    source: null,
    iframeable: false,
  },
  {
    id: 'q2',
    text: 'Điều duy nhất ngăn bạn thực hiện ước mơ ngày mai là nghi ngờ của bạn ngày hôm nay.',
    author: 'Franklin D. Roosevelt',
    context: 'Diễn văn nhậm chức, 1933',
    category: 'Động lực',
    source: 'https://www.goodreads.com/quotes/42271',
    iframeable: false,
  },
  {
    id: 'q3',
    text: 'Không có con đường nào dẫn đến hạnh phúc - hạnh phúc chính là con đường.',
    author: 'Thích Nhất Hạnh',
    context: 'Peace Is Every Step',
    category: 'Thiền định',
    source: null,
    iframeable: false,
  },
  {
    id: 'q4',
    text: 'Sự can đảm không phải là không sợ hãi. Đó là phán xét rằng có thứ gì đó quan trọng hơn nỗi sợ.',
    author: 'Ambrose Redmoon',
    context: 'No Peaceful Warriors',
    category: 'Động lực',
    source: null,
    iframeable: false,
  },
  {
    id: 'q5',
    text: 'Trong giữa khó khăn luôn nằm cơ hội.',
    author: 'Albert Einstein',
    context: '',
    category: 'Động lực',
    source: null,
    iframeable: false,
  },
  {
    id: 'q6',
    text: 'Đừng đi theo con đường đã có sẵn. Thay vào đó, hãy đi vào chỗ không có đường và để lại dấu vết.',
    author: 'Ralph Waldo Emerson',
    context: '',
    category: 'Sáng tạo',
    source: null,
    iframeable: false,
  },
  {
    id: 'q7',
    text: 'Cuộc sống là những gì xảy ra với bạn trong khi bạn đang bận lên kế hoạch cho những thứ khác.',
    author: 'John Lennon',
    context: 'Beautiful Boy, 1980',
    category: 'Cuộc sống',
    source: null,
    iframeable: false,
  },
  {
    id: 'q8',
    text: 'Hai điều vô hạn: vũ trụ và sự ngu ngốc của con người - và tôi không chắc về vũ trụ.',
    author: 'Albert Einstein',
    context: '',
    category: 'Hài hước',
    source: null,
    iframeable: false,
  },
  {
    id: 'q9',
    text: 'Hãy là sự thay đổi mà bạn muốn thấy trong thế giới này.',
    author: 'Mahatma Gandhi',
    context: '',
    category: 'Triết học',
    source: null,
    iframeable: false,
  },
  {
    id: 'q10',
    text: 'Không phải thế giới quá tối, mà vì có lúc ta đã quen sống mà không thắp sáng chính mình.',
    author: 'Querencia',
    context: 'querencia.com.vn',
    category: 'Querencia',
    source: 'https://querencia.com.vn',
    iframeable: false,
  },
  {
    id: 'q11',
    text: 'Bắt đầu ở đâu đó. Sự hoàn hảo là kẻ thù của sự hoàn thành.',
    author: 'Voltaire',
    context: 'La Bégueule, 1772',
    category: 'Sáng tạo',
    source: null,
    iframeable: false,
  },
  {
    id: 'q12',
    text: 'Chúng ta chấp nhận tình yêu mà ta nghĩ mình xứng đáng.',
    author: 'Stephen Chbosky',
    context: 'The Perks of Being a Wallflower',
    category: 'Cuộc sống',
    source: null,
    iframeable: false,
  },
  {
    id: 'q13',
    text: 'Kiến thức là sức mạnh.',
    author: 'Francis Bacon',
    context: 'Meditationes Sacrae, 1597',
    category: 'Học hỏi',
    source: null,
    iframeable: false,
  },
  {
    id: 'q14',
    text: 'Đọc sách là trò chuyện với những bộ óc vĩ đại nhất của các thế kỷ đã qua.',
    author: 'René Descartes',
    context: '',
    category: 'Học hỏi',
    source: null,
    iframeable: false,
  },
  {
    id: 'q15',
    text: 'Nếu bạn muốn đi nhanh, hãy đi một mình. Nếu bạn muốn đi xa, hãy đi cùng nhau.',
    author: 'Tục ngữ châu Phi',
    context: '',
    category: 'Cuộc sống',
    source: null,
    iframeable: false,
  },
  {
    id: 'q16',
    text: 'Sự đơn giản là sự tinh tế tối thượng.',
    author: 'Leonardo da Vinci',
    context: '',
    category: 'Sáng tạo',
    source: null,
    iframeable: false,
  },
  {
    id: 'q17',
    text: 'Những người điên đủ để nghĩ họ có thể thay đổi thế giới - là những người làm được điều đó.',
    author: 'Steve Jobs',
    context: 'Apple "Think Different" campaign, 1997',
    category: 'Động lực',
    source: null,
    iframeable: false,
  },
  {
    id: 'q18',
    text: 'Thất bại là gia vị mang lại hương vị cho thành công.',
    author: 'Truman Capote',
    context: '',
    category: 'Động lực',
    source: null,
    iframeable: false,
  },
];

// ─── CATEGORIES ─────────────────────────────────────────────
const QUOTE_CATEGORIES = ['Tất cả', ...new Set(QUOTES.map(q => q.category))];

// ─── STATE ──────────────────────────────────────────────────
let activeQuoteCat = 'Tất cả';

// ─── INIT ───────────────────────────────────────────────────
function initQuotes() {
  renderQuoteCats();
  renderQuoteGrid(QUOTES);
}

function renderQuoteCats() {
  const wrap = document.getElementById('quoteCats');
  if (!wrap) return;
  wrap.innerHTML = QUOTE_CATEGORIES.map(c => `
    <button class="cat-chip${c === activeQuoteCat ? ' active' : ''}"
      onclick="setQuoteCat('${c}',this)">${c}</button>
  `).join('');
}

function setQuoteCat(cat, btn) {
  activeQuoteCat = cat;
  document.querySelectorAll('#quoteCats .cat-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterQuotes();
}

function filterQuotes() {
  const q = (document.getElementById('quoteSearch')?.value || '').toLowerCase();
  const filtered = QUOTES.filter(qt => {
    const matchCat = activeQuoteCat === 'Tất cả' || qt.category === activeQuoteCat;
    const matchQ   = !q
      || qt.text.toLowerCase().includes(q)
      || qt.author.toLowerCase().includes(q)
      || qt.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });
  renderQuoteGrid(filtered);
}

function renderQuoteGrid(list) {
  const grid = document.getElementById('quoteGrid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:64px;color:var(--gray-light);font-size:0.85rem">
      Không tìm thấy câu nào phù hợp.
    </div>`;
    return;
  }

  grid.innerHTML = list.map(q => `
    <div class="quote-card" onclick="openQuote('${q.id}')" title="Nhấn để xem chi tiết">
      <div class="quote-cat-badge">${q.category}</div>
      <p class="quote-text">${q.text}</p>
      <div style="display:flex;flex-direction:column;gap:4px;margin-top:auto">
        <div class="quote-author">${q.author}</div>
        ${q.context ? `<div class="quote-source">${q.context}</div>` : ''}
        ${q.source ? `<div class="quote-source" style="color:var(--sage-light)">🔗 Có nguồn</div>` : ''}
      </div>
    </div>
  `).join('');
}

function openQuote(id) {
  const q = QUOTES.find(x => x.id === id);
  if (!q) return;

  const modal  = document.getElementById('quoteModal');
  const author = document.getElementById('qModalAuthor');
  const body   = document.getElementById('qModalBody');
  const link   = document.getElementById('qModalLink');

  author.textContent = `${q.author}${q.context ? ' · ' + q.context : ''}`;

  if (q.source) {
    link.href = q.source;
    link.style.display = 'flex';
  } else {
    link.style.display = 'none';
  }

  // Thử iframe nếu iframeable, ngược lại dùng card đẹp
  if (q.iframeable && q.source) {
    body.innerHTML = `
      <iframe src="${q.source}" style="width:100%;height:400px;border:none;border-radius:8px"
        sandbox="allow-scripts allow-same-origin allow-popups"
        onerror="this.style.display='none';document.getElementById('qModalFallback').style.display='block'">
      </iframe>
      <div id="qModalFallback" style="display:none">
        ${quoteCardHTML(q)}
      </div>
    `;
  } else {
    body.innerHTML = quoteCardHTML(q);
  }

  modal.style.display = 'flex';
}

function quoteCardHTML(q) {
  return `
    <div style="text-align:center;padding:20px 0">
      <div style="font-size:4rem;color:var(--sage-pale);font-family:Georgia,serif;line-height:1;margin-bottom:8px">"</div>
      <p style="font-family:'Georgia',serif;font-size:1.2rem;font-style:italic;line-height:1.85;
        color:var(--black);margin-bottom:24px;max-width:520px;margin-left:auto;margin-right:auto">
        ${q.text}
      </p>
      <div style="font-size:0.88rem;font-weight:600;color:var(--sage-dark);margin-bottom:4px">- ${q.author}</div>
      ${q.context ? `<div style="font-size:0.78rem;color:var(--gray-light)">${q.context}</div>` : ''}
      ${q.source
        ? `<a href="${q.source}" target="_blank" rel="noopener"
            style="display:inline-block;margin-top:20px;font-size:0.78rem;color:var(--sage);
              border:1.5px solid var(--sage);padding:6px 18px;border-radius:20px;text-decoration:none">
            ↗ Xem nguồn gốc
          </a>`
        : `<div style="margin-top:20px;font-size:0.72rem;color:var(--gray-light);font-style:italic">
            Câu nói này được lưu hành rộng rãi - nguồn gốc chính xác có thể khác nhau.
          </div>`
      }
    </div>
  `;
}

function closeQuoteModal() {
  document.getElementById('quoteModal').style.display = 'none';
}
