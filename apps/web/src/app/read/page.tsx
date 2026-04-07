ï»¿'use client';
/**
 * Read â BÃ i viáº¿t / Blog ná»i bá» Querencia
 * Content láº¥y tá»« /api/v1/read/posts (markdown rendered)
 * Smart History: track bÃ i ÄÃ£ Äá»c + resume scroll
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { readHistory } from '../../lib/smart-history';

const SAGE = '#4a7c59';

interface Article {
  slug:      string;
  title:     string;
  excerpt:   string;
  category:  string;
  readTime:  number;
  publishedAt: string;
  featured?: boolean;
}

const CATEGORIES = ['Táº¥t cáº£', 'TÃ¢m lÃ½', 'Sá»©c khá»e', 'CÃ´ng viá»c', 'TÃ i chÃ­nh', 'Cuá»c sá»ng'];

// Static articles â sáº½ ÄÆ°á»£c replace báº±ng API call khi CMS ready
const ARTICLES: Article[] = [
  {
    slug: 'lam-the-nao-de-noi-chuyen-voi-chinh-minh',
    title: 'LÃ m tháº¿ nÃ o Äá» nÃ³i chuyá»n vá»i chÃ­nh mÃ¬nh',
    excerpt: 'Journaling khÃ´ng pháº£i lÃ  viáº¿t nháº­t kÃ½. ÄÃ³ lÃ  cÃ¡ch báº¡n tá» chá»©c láº¡i nhá»¯ng gÃ¬ Äang xáº£y ra trong Äáº§u.',
    category: 'TÃ¢m lÃ½', readTime: 4, publishedAt: '2025-03-01', featured: true,
  },
  {
    slug: 'khi-cong-viec-khong-con-y-nghia',
    title: 'Khi cÃ´ng viá»c khÃ´ng cÃ²n Ã½ nghÄ©a',
    excerpt: 'Báº¡n khÃ´ng bá» há»ng. Báº¡n chá» Äang á» má»t giai Äoáº¡n mÃ  nhiá»u ngÆ°á»i khÃ´ng dÃ¡m thá»«a nháº­n.',
    category: 'CÃ´ng viá»c', readTime: 6, publishedAt: '2025-02-20',
  },
  {
    slug: 'giac-ngu-va-ban-nghÄ©-gi-truoc-khi-ngu',
    title: 'Giáº¥c ngá»§ vÃ  báº¡n nghÄ© gÃ¬ trÆ°á»c khi ngá»§',
    excerpt: '20 phÃºt cuá»i trÆ°á»c khi ngá»§ áº£nh hÆ°á»ng Äáº¿n nÃ£o bá» nhiá»u hÆ¡n báº¡n nghÄ©.',
    category: 'Sá»©c khá»e', readTime: 3, publishedAt: '2025-02-10',
  },
  {
    slug: 'quan-ly-tien-khi-luong-khong-du',
    title: 'Quáº£n lÃ½ tiá»n khi lÆ°Æ¡ng khÃ´ng Äá»§',
    excerpt: 'KhÃ´ng pháº£i ai cÅ©ng báº¯t Äáº§u vá»i Äá»§ Äiá»u kiá»n. NhÆ°ng ai cÅ©ng cÃ³ thá» báº¯t Äáº§u.',
    category: 'TÃ i chÃ­nh', readTime: 5, publishedAt: '2025-01-28',
  },
  {
    slug: 'tinh-ban-tuoi-truong-thanh-kho-duy-tri-hon-ban-nghi',
    title: 'TÃ¬nh báº¡n tuá»i trÆ°á»ng thÃ nh khÃ³ duy trÃ¬ hÆ¡n báº¡n nghÄ©',
    excerpt: 'VÃ  ÄÃ³ khÃ´ng pháº£i lá»i cá»§a báº¡n hay há». ÄÃ³ lÃ  cáº¥u trÃºc cá»§a cuá»c Äá»i.',
    category: 'Cuá»c sá»ng', readTime: 5, publishedAt: '2025-01-15',
  },
  {
    slug: 'hoi-phuc-sau-burnout',
    title: 'Há»i phá»¥c sau burnout',
    excerpt: 'Burnout khÃ´ng pháº£i chá» lÃ  má»t. ÄÃ¢y lÃ  cÃ¡ch nháº­n biáº¿t vÃ  phá»¥c há»i ÄÃºng cÃ¡ch.',
    category: 'TÃ¢m lÃ½', readTime: 7, publishedAt: '2025-01-05',
  },
];

function timeAgo(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', { day:'numeric', month:'long', year:'numeric' });
}

export default function ReadPage() {
  const [category, setCategory] = useState('Táº¥t cáº£');
  const [search,   setSearch]   = useState('');
  const [recentRead, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const hist = readHistory.getRecent(3);
    setRecent(hist.map(h => h.slug));
  }, []);

  function handleArticleClick(article: Article) {
    readHistory.record(article.slug, article.title);
  }

  const filtered = ARTICLES.filter(a =>
    (category === 'Táº¥t cáº£' || a.category === category) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) ||
     a.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  const featured = filtered.find(a => a.featured);
  const rest     = filtered.filter(a => !a.featured);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px 96px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5, marginBottom: 4 }}>
          ð Read
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Nhá»¯ng bÃ i viáº¿t vá» cuá»c sá»ng, tÃ¢m lÃ½ vÃ  trÆ°á»ng thÃ nh
        </p>
      </div>

      {/* Search */}
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="TÃ¬m bÃ i viáº¿t..."
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 16,
          border: '1.5px solid var(--border)', fontFamily: 'inherit', fontSize: '0.88rem',
          background: 'var(--bg)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = SAGE)}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      />

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '5px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: category === cat ? SAGE : 'var(--bg-surface)',
            color: category === cat ? '#fff' : 'var(--text-secondary)',
            fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 600,
            transition: 'all 0.15s',
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Recently read */}
      {recentRead.length > 0 && search === '' && category === 'Táº¥t cáº£' && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Äá»c gáº§n ÄÃ¢y
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {recentRead.map(slug => {
              const art = ARTICLES.find(a => a.slug === slug);
              if (!art) return null;
              return (
                <Link key={slug} href={`/read/${slug}`} onClick={() => handleArticleClick(art)} style={{
                  padding: '5px 12px', borderRadius: 8,
                  background: 'rgba(74,124,89,0.06)', border: '1px solid rgba(74,124,89,0.2)',
                  color: SAGE, fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
                }}>
                  {art.title.slice(0, 32)}{art.title.length > 32 ? 'â¦' : ''}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured article */}
      {featured && (
        <Link href={`/read/${featured.slug}`} onClick={() => handleArticleClick(featured)} style={{ textDecoration: 'none' }}>
          <article style={{
            padding: '24px', borderRadius: 16, marginBottom: 20,
            background: `linear-gradient(135deg, rgba(74,124,89,0.06) 0%, rgba(74,124,89,0.02) 100%)`,
            border: '1.5px solid rgba(74,124,89,0.2)', cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = SAGE)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(74,124,89,0.2)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, background: SAGE, color: '#fff', padding: '2px 8px', borderRadius: 999 }}>
                â¨ Ná»I Báº¬T
              </span>
              <span style={{ fontSize: '0.72rem', color: SAGE, fontWeight: 600 }}>{featured.category}</span>
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8, lineHeight: 1.3 }}>
              {featured.title}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
              {featured.excerpt}
            </p>
            <div style={{ display: 'flex', gap: 12, fontSize: '0.72rem', color: 'var(--gray)' }}>
              <span>ð {timeAgo(featured.publishedAt)}</span>
              <span>â± {featured.readTime} phÃºt Äá»c</span>
            </div>
          </article>
        </Link>
      )}

      {/* Article grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {rest.map(art => (
          <Link key={art.slug} href={`/read/${art.slug}`} onClick={() => handleArticleClick(art)} style={{ textDecoration: 'none' }}>
            <article style={{
              padding: '18px 20px', borderRadius: 12, height: '100%',
              background: 'var(--bg)', border: '1.5px solid var(--border)',
              cursor: 'pointer', transition: 'border-color 0.15s',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = SAGE + '60')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: SAGE }}>
                {art.category}
                {recentRead.includes(art.slug) && (
                  <span style={{ marginLeft: 6, color: 'var(--gray)', fontWeight: 400 }}>Â· ÄÃ£ Äá»c</span>
                )}
              </span>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.35, margin: 0 }}>
                {art.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, flex: 1 }}>
                {art.excerpt}
              </p>
              <div style={{ display: 'flex', gap: 10, fontSize: '0.7rem', color: 'var(--gray)', marginTop: 4 }}>
                <span>ð {timeAgo(art.publishedAt)}</span>
                <span>â± {art.readTime} phÃºt</span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>ð­</div>
          <p>KhÃ´ng tÃ¬m tháº¥y bÃ i viáº¿t nÃ o</p>
        </div>
      )}
    </div>
  );
}
