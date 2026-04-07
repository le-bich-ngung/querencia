ï»¿'use client';
/**
 * Tools listing page â /tools
 * Migrated tá»« querencia-frontend/pages/tools.html
 * Hiá»n thá» táº¥t cáº£ 44 tools theo category, free/paid filter
 */
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { TOOLS, CATEGORIES, getFreeTools, getPaidTools } from '../../lib/tools-registry';
import type { Tool } from '../../lib/tools-registry';

export default function ToolsPage() {
  const { data: session } = useSession();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = TOOLS.filter(t => {
    const matchCat = activeCategory === 'all' || t.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q
      || t.name.toLowerCase().includes(q)
      || t.nameVi.toLowerCase().includes(q)
      || t.descVi.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: -0.5, marginBottom: 6 }}>
          Tools
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          KhÃ´ng quáº£ng cÃ¡o, khÃ´ng bÃ¡n dá»¯ liá»u. Nguá»n thu duy nháº¥t lÃ  tools cÃ³ phÃ­.
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="TÃ¬m tool..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', maxWidth: 400,
          padding: '10px 14px', borderRadius: 10,
          border: '1.5px solid var(--border)',
          background: 'var(--bg-surface)',
          fontFamily: 'inherit', fontSize: '0.9rem',
          color: 'var(--text)', marginBottom: 24, outline: 'none',
        }}
      />

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        <FilterBtn active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
          Táº¥t cáº£ ({TOOLS.length})
        </FilterBtn>
        {CATEGORIES.map(c => {
          const count = TOOLS.filter(t => t.category === c.id).length;
          return (
            <FilterBtn
              key={c.id}
              active={activeCategory === c.id}
              onClick={() => setActiveCategory(c.id)}
            >
              {c.emoji} {c.labelVi} ({count})
            </FilterBtn>
          );
        })}
      </div>

      {/* Tools grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 14,
      }}>
        {filtered.map(tool => (
          <ToolCard key={tool.slug} tool={tool} hasSession={!!session} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: 48, textAlign: 'center', color: 'var(--gray)' }}>
            KhÃ´ng tÃ¬m tháº¥y tool nÃ o
          </div>
        )}
      </div>

      {/* Footer note */}
      <p style={{
        marginTop: 48, textAlign: 'center',
        fontSize: '0.8rem', color: 'var(--gray)',
      }}>
        Querencia khÃ´ng gáº¯n quáº£ng cÃ¡o vÃ  khÃ´ng bÃ¡n dá»¯ liá»u ngÆ°á»i dÃ¹ng. ð¿
      </p>
    </div>
  );
}

function FilterBtn({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: 999,
        border: '1.5px solid',
        borderColor: active ? 'var(--sage)' : 'var(--border)',
        background: active ? 'var(--sage)' : 'transparent',
        color: active ? '#fff' : 'var(--text)',
        fontFamily: 'inherit', fontSize: '0.82rem',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function ToolCard({ tool, hasSession }: { tool: Tool; hasSession: boolean }) {
  const needsQ = tool.qCost > 0;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        padding: '18px 20px',
        borderRadius: 12,
        border: '1.5px solid var(--border)',
        background: 'var(--bg)',
        cursor: 'pointer',
        transition: 'all 0.15s',
        height: '100%',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--sage)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(74,124,89,0.1)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLDivElement).style.transform = '';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '';
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <span style={{ fontSize: '1.6rem' }}>{tool.emoji}</span>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {tool.isNew && (
              <span style={{
                fontSize: '0.65rem', fontWeight: 700,
                background: 'var(--sage)', color: '#fff',
                padding: '2px 7px', borderRadius: 999,
              }}>Má»I</span>
            )}
            {needsQ ? (
              <span style={{
                fontSize: '0.65rem', fontWeight: 600,
                background: 'var(--sage-light, #ddeee3)', color: 'var(--sage)',
                padding: '2px 7px', borderRadius: 999,
              }}>{tool.qCost} Q</span>
            ) : (
              <span style={{
                fontSize: '0.65rem', fontWeight: 600,
                background: 'var(--bg-surface)', color: 'var(--gray)',
                padding: '2px 7px', borderRadius: 999,
              }}>Miá»n phÃ­</span>
            )}
          </div>
        </div>

        {/* Name + description */}
        <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 4, color: 'var(--text)' }}>
          {tool.nameVi}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          {tool.descVi}
        </div>
      </div>
    </Link>
  );
}
