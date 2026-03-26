'use client';
/**
 * Querencia Homepage — inspired by Bruin's wow-factor
 * Dark hero, animated text, product screenshots embedded, rhythm rõ ràng
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// ── Logo SVG ─────────────────────────────────────────────────
const Logo = ({ size = 40, color = '#4a7c59' }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size}>
    <defs><clipPath id="qClipHome"><circle cx="55" cy="55" r="32"/></clipPath></defs>
    <circle cx="55" cy="55" r="38" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/>
    <line x1="81" y1="79" x2="98" y2="98" stroke={color} strokeWidth="7" strokeLinecap="round"/>
    <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
      fill="none" stroke={color} strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qClipHome)"/>
  </svg>
);

// ── Animated text rotator (kiểu Bruin) ───────────────────────
const ROTATING_WORDS = ['Nope', 'Cùi Bắp', 'LàNo', 'Tools'];
function RotatingWord() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 350);
    }, 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{
      display: 'inline-block',
      color: '#4a7c59',
      fontStyle: 'italic',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
      minWidth: '2ch',
    }}>
      {ROTATING_WORDS[idx]}
    </span>
  );
}

// ── App card trong hero ───────────────────────────────────────
function AppCard({
  emoji, name, desc, href, accent, delay,
}: {
  emoji: string; name: string; desc: string; href: string;
  accent: string; delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: '22px 24px',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          background: hovered
            ? 'rgba(255,255,255,0.07)'
            : 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
          boxShadow: hovered
            ? `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px ${accent}40`
            : 'none',
          animationDelay: `${delay}ms`,
          animation: 'slideUp 0.6s ease forwards',
          opacity: 0,
        }}
      >
        <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{emoji}</div>
        <div style={{
          fontWeight: 700, fontSize: '1rem', color: '#f0efeb',
          marginBottom: 6, letterSpacing: -0.3,
        }}>{name}</div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(240,239,235,0.55)', lineHeight: 1.5 }}>
          {desc}
        </div>
        <div style={{
          marginTop: 14, fontSize: '0.75rem', fontWeight: 600,
          color: accent, display: 'flex', alignItems: 'center', gap: 4,
        }}>
          Khám phá →
        </div>
      </div>
    </Link>
  );
}

// ── Feature row ───────────────────────────────────────────────
function FeatureRow({
  eyebrow, title, desc, visual, reverse = false,
}: {
  eyebrow: string; title: string; desc: string;
  visual: React.ReactNode; reverse?: boolean;
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 64,
      alignItems: 'center',
      flexDirection: reverse ? 'row-reverse' : 'row',
      padding: '80px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ order: reverse ? 1 : 0 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: '0.72rem', fontWeight: 700,
          color: 'var(--sage)', letterSpacing: '0.08em',
          textTransform: 'uppercase',
          background: 'rgba(74,124,89,0.1)',
          padding: '4px 10px', borderRadius: 999,
          marginBottom: 16,
        }}>
          {eyebrow}
        </div>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
          fontWeight: 800, letterSpacing: -0.8,
          lineHeight: 1.2, marginBottom: 16,
          color: 'var(--text)',
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '1rem', color: 'var(--text-secondary)',
          lineHeight: 1.7, maxWidth: 420,
        }}>
          {desc}
        </p>
      </div>
      <div style={{
        order: reverse ? 0 : 1,
        borderRadius: 16, overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.08)',
      }}>
        {visual}
      </div>
    </div>
  );
}

// ── Fake chat UI cho LàNo preview ────────────────────────────
function LanoPreview() {
  return (
    <div style={{
      background: 'var(--bg-warm)', padding: 24,
      display: 'flex', flexDirection: 'column', gap: 14, minHeight: 240,
    }}>
      {[
        { role: 'user',      text: 'Hôm nay mình cảm thấy rất mệt mỏi và không biết tại sao...' },
        { role: 'assistant', text: 'Mình nghe bạn. Mệt mỏi mà không rõ nguyên nhân đôi khi còn nặng hơn khi biết lý do. Gần đây bạn có ngủ được không?' },
        { role: 'user',      text: 'Ngủ không sâu, hay thức giữa đêm.' },
        { role: 'assistant', text: 'Cơ thể đang cố nói gì đó với bạn đó. Bạn có muốn kể thêm về những gì đang xảy ra không? 🌿' },
      ].map((m, i) => (
        <div key={i} style={{
          display: 'flex',
          justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
        }}>
          <div style={{
            maxWidth: '78%',
            padding: '10px 14px',
            borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            background: m.role === 'user' ? '#4a7c59' : '#fff',
            color: m.role === 'user' ? '#fff' : '#1a1a18',
            fontSize: '0.82rem', lineHeight: 1.55,
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          }}>
            {m.text}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Fake Nope feed preview ───────────────────────────────────
function NopePreview() {
  const posts = [
    { name: 'Minh T.', tag: 'Việc làm', title: 'Từ fresher 3 triệu đến senior 40tr — mình học cách tự negotiate lương', thanks: 847, comments: 63 },
    { name: 'An N.',   tag: 'Sức khỏe',  title: 'Mình đã vượt qua burnout như thế nào sau 2 năm làm việc không nghỉ', thanks: 1.2e3, comments: 94 },
    { name: 'Hương L.', tag: 'Tài chính', title: '5 bài học tài chính mình ước gì biết từ năm 22 tuổi', thanks: 2.1e3, comments: 178 },
  ];
  return (
    <div style={{ background: 'var(--bg-warm)', padding: '8px 0' }}>
      {posts.map((p, i) => (
        <div key={i} style={{
          padding: '16px 20px',
          borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{
            display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'var(--sage)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
            }}>
              {p.name[0]}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{p.name}</span>
            <span style={{
              fontSize: '0.68rem', background: 'rgba(74,124,89,0.1)',
              color: 'var(--sage)', padding: '1px 7px',
              borderRadius: 999, fontWeight: 600,
            }}>{p.tag}</span>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 8 }}>
            {p.title}
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: '0.72rem', color: 'var(--gray)' }}>
            <span>❤️ {typeof p.thanks === 'number' && p.thanks > 999 ? (p.thanks/1000).toFixed(1)+'k' : p.thanks}</span>
            <span>💬 {p.comments}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Fake Cùi Bắp chat preview ───────────────────────────────
function CuiBapPreview() {
  return (
    <div style={{
      background: '#111110', display: 'flex',
      height: 260, overflow: 'hidden',
    }}>
      {/* Sidebar */}
      <div style={{
        width: 180, borderRight: '1px solid rgba(255,255,255,0.07)',
        padding: '12px 0', flexShrink: 0,
      }}>
        {[
          { name: 'Nhóm Coding 🖥️', preview: 'Mày làm xong chưa?', time: '2m', unread: 3 },
          { name: 'An Nguyễn', preview: 'ok nha!', time: '14m', unread: 0 },
          { name: 'Team Design', preview: 'figma link đây...', time: '1h', unread: 0 },
        ].map((c, i) => (
          <div key={i} style={{
            padding: '10px 14px',
            background: i === 0 ? 'rgba(74,124,89,0.15)' : 'transparent',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f0efeb' }}>
                {c.name}
              </span>
              {c.unread > 0 && (
                <span style={{
                  background: '#4a7c59', color: '#fff',
                  borderRadius: 999, fontSize: '0.6rem',
                  padding: '1px 5px', fontWeight: 700,
                }}>{c.unread}</span>
              )}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'rgba(240,239,235,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {c.preview}
            </span>
          </div>
        ))}
      </div>
      {/* Chat area */}
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { mine: false, text: 'mày làm xong phần auth chưa ?' },
          { mine: true,  text: 'xong rồi, đang test 🎉' },
          { mine: false, text: 'ngon! merge pr đi rồi deploy' },
          { mine: true,  text: 'oke, 5p nữa nha' },
        ].map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.mine ? 'flex-end' : 'flex-start' }}>
            <div style={{
              padding: '7px 12px', borderRadius: 12,
              background: m.mine ? '#4a7c59' : 'rgba(255,255,255,0.08)',
              color: '#f0efeb', fontSize: '0.75rem', lineHeight: 1.4,
              maxWidth: '70%',
            }}>{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tools grid preview ───────────────────────────────────────
function ToolsPreview() {
  const tools = [
    { emoji: '🖼️', name: 'Image Editor',    free: true },
    { emoji: '📄', name: 'PDF → Word',      free: false, q: '1Q' },
    { emoji: '🃏', name: 'Flashcards',      free: true },
    { emoji: '💣', name: 'Link tự hủy',     free: true },
    { emoji: '🌐', name: 'Screenshot Dịch', free: false, q: '2Q' },
    { emoji: '🔑', name: 'Password Gen',    free: true },
  ];
  return (
    <div style={{
      background: 'var(--bg-warm)',
      padding: 20,
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
    }}>
      {tools.map((t, i) => (
        <div key={i} style={{
          background: 'var(--bg)', borderRadius: 10,
          padding: '12px 14px', border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '1.3rem', marginBottom: 6 }}>{t.emoji}</div>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{t.name}</div>
          <span style={{
            fontSize: '0.62rem', fontWeight: 600,
            background: t.free ? 'rgba(74,124,89,0.1)' : '#fff3cd',
            color: t.free ? 'var(--sage)' : '#856404',
            padding: '1px 6px', borderRadius: 999,
          }}>
            {t.free ? 'Free' : t.q}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function HomePage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&display=swap');

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scrollLogos {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .hero-cta:hover { opacity: 0.88 !important; transform: translateY(-1px) !important; }
        .hero-cta-ghost:hover { background: rgba(255,255,255,0.08) !important; }
        .stats-card:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important; }
      `}</style>

      {/* ── HERO — dark, full-width ─────────────────────────── */}
      <section style={{
        background: 'linear-gradient(160deg, #0d0f0d 0%, #111410 40%, #0a0e0a 100%)',
        minHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(74,124,89,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(74,124,89,0.04) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}/>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(74,124,89,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>

        {/* Eyebrow badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(74,124,89,0.15)',
          border: '1px solid rgba(74,124,89,0.3)',
          borderRadius: 999, padding: '5px 14px',
          fontSize: '0.75rem', fontWeight: 600,
          color: '#6fa882', marginBottom: 28,
          animation: 'fadeIn 0.6s ease forwards',
          letterSpacing: '0.04em',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#4a7c59',
            boxShadow: '0 0 6px #4a7c59',
            display: 'inline-block',
          }}/>
          Không quảng cáo · Không bán dữ liệu · Nguồn thu duy nhất: tools có phí
        </div>

        {/* Main headline */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: 800, lineHeight: 1.05,
          letterSpacing: -2, textAlign: 'center',
          color: '#f0efeb', marginBottom: 12,
          maxWidth: 820,
          animation: 'slideUp 0.7s 0.1s ease forwards', opacity: 0,
        }}>
          Một hệ sinh thái cho <RotatingWord />
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: 'rgba(240,239,235,0.55)',
          textAlign: 'center', maxWidth: 540,
          lineHeight: 1.65, marginBottom: 40,
          animation: 'slideUp 0.7s 0.2s ease forwards', opacity: 0,
        }}>
          Querencia xây dựng những công cụ chu đáo cho những tâm trí tò mò.
          Nơi để hỏi, để lắng nghe, để trao đổi — và để cuộc sống tốt hơn.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: 64,
          animation: 'slideUp 0.7s 0.3s ease forwards', opacity: 0,
        }}>
          <Link href={session ? '/tools' : '/auth/register'} className="hero-cta" style={{
            padding: '13px 28px',
            background: '#4a7c59', color: '#fff',
            borderRadius: 10, textDecoration: 'none',
            fontWeight: 700, fontSize: '0.95rem',
            transition: 'all 0.2s', display: 'inline-block',
          }}>
            {session ? 'Khám phá Tools' : 'Bắt đầu miễn phí'}
          </Link>
          <Link href="/dashboard/lano" className="hero-cta-ghost" style={{
            padding: '13px 28px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(240,239,235,0.8)',
            borderRadius: 10, textDecoration: 'none',
            fontWeight: 600, fontSize: '0.95rem',
            transition: 'all 0.2s', display: 'inline-block',
          }}>
            Thử LàNo AI →
          </Link>
        </div>

        {/* App cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14, width: '100%', maxWidth: 900,
        }}>
          {[
            { emoji: '🌽', name: 'Cùi Bắp', desc: 'Nhắn tin riêng tư. Group chat. File sharing. Gọi video. Không quảng cáo.', href: '/dashboard/cui-bap', accent: '#f5a623', delay: 100 },
            { emoji: '🌿', name: 'Nope', desc: 'Hỏi kinh nghiệm sống. Chia sẻ câu chuyện thật. Không giả tạo.', href: '/dashboard/nope', accent: '#4a7c59', delay: 200 },
            { emoji: '🎧', name: 'LàNo', desc: 'AI lắng nghe bạn. Không phán xét. Luôn ở đây lúc 2 giờ sáng.', href: '/dashboard/lano', accent: '#7b9ed9', delay: 300 },
            { emoji: '🔧', name: 'Tools', desc: '44 công cụ miễn phí và có phí. Chạy trên trình duyệt. Riêng tư hoàn toàn.', href: '/tools', accent: '#e07b4f', delay: 400 },
          ].map(app => <AppCard key={app.name} {...app} />)}
        </div>
      </section>

      {/* ── QUOTE STRIP ───────────────────────────────────────── */}
      <section style={{
        padding: '32px 24px',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
        background: 'var(--bg-surface)',
      }}>
        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          color: 'var(--text-secondary)',
          fontStyle: 'italic', maxWidth: 680, margin: '0 auto',
          lineHeight: 1.65,
        }}>
          "Không phải thế giới quá tối, mà vì có lúc ta đã quen sống mà không thắp sáng chính mình."
        </p>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section style={{
        padding: '72px 24px',
        maxWidth: 1100, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 24,
      }}>
        {[
          { num: '44+', label: 'Công cụ miễn phí', sub: 'Chạy trên trình duyệt' },
          { num: '0',   label: 'Quảng cáo',        sub: 'Mãi mãi không quảng cáo' },
          { num: '0',   label: 'Dữ liệu bán ra',   sub: 'Bảo mật tuyệt đối' },
          { num: '4',   label: 'Apps trong 1 nơi', sub: 'Một tài khoản duy nhất' },
        ].map((s, i) => (
          <div
            key={i}
            className="stats-card"
            style={{
              padding: '28px 24px',
              borderRadius: 14, border: '1.5px solid var(--border)',
              background: 'var(--bg)', transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 800, color: 'var(--sage)',
              letterSpacing: -1, lineHeight: 1,
              marginBottom: 6,
            }}>{s.num}</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.sub}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURE SECTIONS ─────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        <FeatureRow
          eyebrow="LàNo AI"
          title="Lắng nghe không phán xét, mọi lúc 24/7"
          desc="LàNo không phải chatbot thông thường. Nó ở đây để bạn được nghe — không cần giải thích, không bị lecture. Vì đôi khi điều bạn cần chỉ là một nơi để nói ra."
          visual={<LanoPreview />}
        />

        <FeatureRow
          eyebrow="Nope"
          title="Kinh nghiệm sống thật, từ người thật"
          desc="Nơi mọi người chia sẻ những bài học cuộc sống mà họ ước gì ai đó nói với mình sớm hơn. Không toxic, không giả tạo, không clickbait."
          visual={<NopePreview />}
          reverse
        />

        <FeatureRow
          eyebrow="Cùi Bắp"
          title="Nhắn tin như mày tao — không bị theo dõi"
          desc="Chat 1-1, nhóm đến 100 người, file sharing, gọi video — tất cả dùng tài khoản Querencia. Không quảng cáo, không đọc tin nhắn của bạn."
          visual={<CuiBapPreview />}
        />

        <FeatureRow
          eyebrow="Tools"
          title="44 công cụ. Chạy trong trình duyệt. Miễn phí."
          desc="Từ Image Editor đến PDF→Word, từ Flashcards đến Link tự hủy. Hầu hết chạy hoàn toàn client-side — không upload dữ liệu, không cần tài khoản."
          visual={<ToolsPreview />}
          reverse
        />
      </section>

      {/* ── PRICING / CTA ────────────────────────────────────── */}
      <section style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{
            fontSize: '0.72rem', fontWeight: 700,
            color: 'var(--sage)', letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            Giá cả minh bạch
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: 800, letterSpacing: -1,
            marginBottom: 14, color: 'var(--text)',
          }}>
            Miễn phí mãi mãi.<br/>
            <span style={{ color: 'var(--sage)' }}>Trả khi bạn cần thêm.</span>
          </h2>
          <p style={{
            fontSize: '1rem', color: 'var(--text-secondary)',
            lineHeight: 1.7, marginBottom: 40,
          }}>
            Tất cả tính năng cốt lõi — LàNo, Nope, Cùi Bắp, 40+ tools — đều miễn phí.
            Pro plan mở khóa tool nâng cao và tăng Q quota.
          </p>

          {/* Plan cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20, textAlign: 'left', marginBottom: 40,
          }}>
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'mãi mãi',
                highlight: false,
                features: [
                  'LàNo AI không giới hạn',
                  'Nope — đọc & chia sẻ',
                  'Cùi Bắp messaging',
                  '40+ tools miễn phí',
                  'Không quảng cáo, bao giờ',
                ],
              },
              {
                name: 'Pro',
                price: '$0.50',
                period: '/ ngày',
                highlight: true,
                features: [
                  'Tất cả trong Free',
                  '10 Q hết hạn 24h / ngày',
                  '1 Q không hết hạn / ngày',
                  'PDF→Word (1Q), Screenshot Dịch (2Q)',
                  'Hoàn tiền ngày trọn vẹn chưa dùng',
                  'Mua 1, 7 hoặc 30 ngày tùy ý',
                ],
              },
            ].map(plan => (
              <div key={plan.name} style={{
                padding: '28px 24px',
                borderRadius: 14,
                border: plan.highlight ? '2px solid var(--sage)' : '1.5px solid var(--border)',
                background: plan.highlight ? 'rgba(74,124,89,0.04)' : 'var(--bg)',
                position: 'relative',
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: -12, left: 20,
                    background: 'var(--sage)', color: '#fff',
                    fontSize: '0.68rem', fontWeight: 700,
                    padding: '3px 10px', borderRadius: 999,
                    letterSpacing: '0.04em',
                  }}>
                    RECOMMENDED
                  </div>
                )}
                <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 4, color: 'var(--text)' }}>
                  {plan.name}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: plan.highlight ? 'var(--sage)' : 'var(--text)' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: 4 }}>
                    {plan.period}
                  </span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{
                      fontSize: '0.83rem', color: 'var(--text-secondary)',
                      display: 'flex', gap: 8, alignItems: 'flex-start',
                    }}>
                      <span style={{ color: 'var(--sage)', flexShrink: 0, fontWeight: 700 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.highlight ? '/auth/register' : '/auth/register'} style={{
                  display: 'block', textAlign: 'center',
                  marginTop: 24, padding: '11px',
                  background: plan.highlight ? 'var(--sage)' : 'transparent',
                  border: plan.highlight ? 'none' : '1.5px solid var(--border)',
                  color: plan.highlight ? '#fff' : 'var(--text)',
                  borderRadius: 9, textDecoration: 'none',
                  fontWeight: 600, fontSize: '0.88rem',
                  transition: 'all 0.15s',
                }}>
                  {plan.highlight ? 'Nâng cấp lên Pro' : 'Bắt đầu miễn phí'}
                </Link>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>
            🌿 Querencia không gắn quảng cáo và không bán dữ liệu người dùng trong bất kỳ sản phẩm nào.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0d0f0d 0%, #111a12 100%)',
        padding: '96px 24px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(74,124,89,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <Logo size={52} color="#4a7c59" />
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, color: '#f0efeb',
            letterSpacing: -1.5, lineHeight: 1.1,
            margin: '24px 0 16px',
          }}>
            Một tài khoản.<br/>
            <span style={{ color: '#4a7c59' }}>Cả hệ sinh thái.</span>
          </h2>
          <p style={{
            fontSize: '1rem', color: 'rgba(240,239,235,0.5)',
            marginBottom: 36, lineHeight: 1.6,
          }}>
            Đăng ký và truy cập LàNo, Nope, Cùi Bắp, 44 tools — miễn phí mãi mãi.
          </p>
          <Link href="/auth/register" style={{
            display: 'inline-block',
            padding: '14px 36px',
            background: '#4a7c59', color: '#fff',
            borderRadius: 12, textDecoration: 'none',
            fontWeight: 700, fontSize: '1rem',
            transition: 'all 0.2s',
            boxShadow: '0 0 0 0 rgba(74,124,89,0.4)',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(74,124,89,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 0 0 0 rgba(74,124,89,0.4)';
            }}
          >
            Bắt đầu miễn phí
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{
        background: 'var(--bg)', borderTop: '1px solid var(--border)',
        padding: '40px 24px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'auto repeat(3, 1fr)',
          gap: 40, alignItems: 'start',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Logo size={28} color="#4a7c59" />
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                <span>ueren</span><span style={{ color: '#4a7c59' }}>cia</span>
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray)', maxWidth: 180, lineHeight: 1.6 }}>
              Công cụ chu đáo cho những tâm trí tò mò.
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--gray)', marginTop: 12 }}>
              © 2026 Querencia
            </p>
          </div>

          {[
            {
              title: 'Apps',
              links: [
                { label: 'LàNo AI', href: '/dashboard/lano' },
                { label: 'Nope',    href: '/dashboard/nope' },
                { label: 'Cùi Bắp', href: '/dashboard/cui-bap' },
                { label: 'Tools',   href: '/tools' },
              ],
            },
            {
              title: 'Công cụ',
              links: [
                { label: 'Image Editor',  href: '/tools/image-editor' },
                { label: 'PDF → Word',    href: '/tools/pdf-to-word' },
                { label: 'Flashcards',    href: '/tools/flashcards' },
                { label: 'Xem tất cả →', href: '/tools' },
              ],
            },
            {
              title: 'Pháp lý',
              links: [
                { label: 'Bảo mật',    href: '/pages/privacy' },
                { label: 'Điều khoản', href: '/pages/terms' },
                { label: 'Bảo mật thông tin', href: '/pages/security' },
              ],
            },
          ].map(col => (
            <div key={col.title}>
              <div style={{
                fontSize: '0.72rem', fontWeight: 700,
                color: 'var(--text-secondary)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                {col.title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} style={{
                      fontSize: '0.82rem', color: 'var(--text-secondary)',
                      textDecoration: 'none', transition: 'color 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--sage)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </>
  );
}
