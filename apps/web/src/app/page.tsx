'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useI18n, LOCALES } from '../lib/i18n';
import { QUOTES } from '../lib/quotes';

const SAGE = '#4a7c59';

const LAW_QUOTES = [
  { text: "Laws are spider webs through which the big flies pass and the little ones get caught.", author: "Honoré de Balzac" },
  { text: "The law is reason, free from passion.", author: "Aristotle" },
  { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
  { text: "It is the spirit and not the form of law that keeps justice alive.", author: "Earl Warren" },
  { text: "The purpose of law is to prevent the strong always having their way.", author: "Ovid" },
  { text: "Justice is the constant and perpetual will to allot to every man his due.", author: "Domitius Ulpianus" },
  { text: "No man is above the law and no man is below it.", author: "Theodore Roosevelt" },
  { text: "The law must be stable, but it must not stand still.", author: "Roscoe Pound" },
  { text: "Wherever law ends, tyranny begins.", author: "John Locke" },
  { text: "The good of the people is the greatest law.", author: "Marcus Tullius Cicero" },
  { text: "Law is order, and good law is good order.", author: "Aristotle" },
  { text: "Justice delayed is justice denied.", author: "William E. Gladstone" },
];

const APPS = [
  { name: 'Cui Bap', emoji: '🌽', color: '#f59e0b', desc: 'Private messaging. No ads, no surveillance.', href: '/dashboard/cui-bap' },
  { name: 'Nope', emoji: '🌿', color: '#4a7c59', desc: 'Real stories from real people.', href: '/dashboard/nope' },
  { name: 'LaNo', emoji: '🎧', color: '#8b5cf6', desc: 'Someone to listen. Without judgment.', href: '/dashboard/lano' },
  { name: 'Tools', emoji: '🔧', color: '#ef4444', desc: '44+ free browser-based tools.', href: '/tools' },
];

const TOOLS = ['Image Editor','PDF to Word','Flashcards','Self-destruct Link','Screenshot Translate','Password Generator','Grammar Check','QR Generator','CV Builder','Text Summarize','Pomodoro Timer','Image Compress'];

function Typewriter({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
      else { setDone(true); clearInterval(t); }
    }, 28);
    return () => clearInterval(t);
  }, [text]);
  return (
    <span>
      {displayed}
      {!done && <span style={{ borderRight: '2px solid #4a7c59', marginLeft: 1, animation: 'blink 0.7s step-end infinite' }} />}
    </span>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function HomePage() {
  const { data: session } = useSession();
  const { locale, setLocale, t } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [lawIdx, setLawIdx] = useState(0);
  const [appIdx, setAppIdx] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [lawVisible, setLawVisible] = useState(true);
  const [appVisible, setAppVisible] = useState(true);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => { setQuoteIdx(i => (i + 1) % QUOTES.length); setQuoteVisible(true); }, 600);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLawVisible(false);
      setTimeout(() => { setLawIdx(i => (i + 1) % LAW_QUOTES.length); setLawVisible(true); }, 600);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setAppVisible(false);
      setTimeout(() => { setAppIdx(i => (i + 1) % APPS.length); setAppVisible(true); }, 500);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const h = (e) => { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const currentQuote = QUOTES[quoteIdx];
  const currentLaw = LAW_QUOTES[lawIdx];
  const currentApp = APPS[appIdx];
  const waveStyle = { strokeDasharray: 160, animation: 'waveRun 2s linear infinite' };

  return (
    <div>
      {/* FLOATING NAV */}
      <nav style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 200, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(8,10,8,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '8px 16px 8px 12px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" width={20} height={20}>
            <defs><clipPath id="qcn"><circle cx="55" cy="55" r="32" /></clipPath></defs>
            <circle cx="55" cy="55" r="38" fill="none" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
            <line x1="81" y1="79" x2="98" y2="98" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
            <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55" fill="none" stroke={SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qcn)" style={waveStyle} />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 0 }}>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', letterSpacing: -0.3, color: '#f0efeb' }}>
              <span style={{ opacity: 0.5 }}>ueren</span><span style={{ color: SAGE }}>cia</span>
            </span>
            <span style={{ fontSize: '0.52rem', color: SAGE, opacity: 0.7, fontWeight: 500, letterSpacing: '0.04em' }}>Tech and more</span>
          </div>
        </Link>

        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)' }} />

        <div ref={langRef} style={{ position: 'relative' }}>
          <button onClick={() => setLangOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(240,239,235,0.6)' }}>
            🌐 {LOCALES.find(l => l.code === locale)?.flag}
          </button>
          {langOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: '#1a1d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 4, zIndex: 300, minWidth: 150, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              {LOCALES.map(l => (
                <button key={l.code} onClick={() => { setLocale(l.code); setLangOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', background: locale === l.code ? 'rgba(74,124,89,0.15)' : 'transparent', color: locale === l.code ? SAGE : 'rgba(240,239,235,0.7)', fontWeight: locale === l.code ? 600 : 400, fontSize: '0.82rem', textAlign: 'left' }}>
                  <span>{l.flag}</span><span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)' }} />

        {session ? (
          <Link href="/dashboard/nope" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', background: SAGE, borderRadius: 100, padding: '5px 14px', textDecoration: 'none' }}>Dashboard</Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link href="/auth/login" style={{ fontSize: '0.8rem', color: 'rgba(240,239,235,0.6)', textDecoration: 'none', padding: '4px 8px' }}>{t('nav.signin')}</Link>
            <Link href="/auth/register" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', background: SAGE, borderRadius: 100, padding: '5px 14px', textDecoration: 'none' }}>{t('nav.getstarted')}</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', background: '#070908', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: '0%', left: '15%', background: 'radial-gradient(circle, rgba(74,124,89,0.1) 0%, transparent 70%)', animation: 'orb 14s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', bottom: '5%', right: '10%', background: 'radial-gradient(circle, rgba(74,124,89,0.06) 0%, transparent 70%)', animation: 'orb 18s ease-in-out infinite reverse', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', animation: 'fadeIn 1s ease both' }}>
          <div style={{ marginBottom: 24, animation: 'float 4s ease-in-out infinite' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" width={100} height={100}>
              <defs><clipPath id="qClipHome"><circle cx="55" cy="55" r="32" /></clipPath></defs>
              <circle cx="55" cy="55" r="38" fill="none" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
              <line x1="81" y1="79" x2="98" y2="98" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
              <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55" fill="none" stroke={SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qClipHome)" style={waveStyle} />
            </svg>
          </div>

          <h1 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: 400, letterSpacing: -4, lineHeight: 0.95, color: '#f0efeb', marginBottom: 8 }}>
            <span style={{ opacity: 0.35 }}>ueren</span><span style={{ color: SAGE }}>cia</span>
          </h1>

          <p style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: SAGE, opacity: 0.7, marginBottom: 48 }}>Tech and more</p>

          <div style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: 'rgba(240,239,235,0.45)', lineHeight: 1.7, maxWidth: 620, fontStyle: 'italic', minHeight: 80 }}>
            <Typewriter text='"It\'s not that the world is too dark but that we\'ve grown used to not lighting ourselves up."' />
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', opacity: 0.25 }}>
          <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${SAGE}, transparent)`, margin: '0 auto 6px' }} />
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color: '#f0efeb' }}>SCROLL</span>
        </div>
      </section>

      {/* TOOLS TICKER */}
      <section style={{ background: '#111814', padding: '40px 0', overflow: 'hidden' }}>
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, #111814, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, #111814, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div className="ticker-inner">
            {[...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS].map((tool, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', border: '1px solid rgba(74,124,89,0.2)', borderRadius: 100, fontSize: '0.85rem', color: 'rgba(240,239,235,0.6)', background: 'rgba(74,124,89,0.04)', flexShrink: 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: SAGE, display: 'inline-block', opacity: 0.5 }} />
                {tool}
              </span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/tools" style={{ fontSize: '0.78rem', color: SAGE, textDecoration: 'none', opacity: 0.7, fontWeight: 500 }}>44+ free tools — explore all →</Link>
        </div>
      </section>

      {/* QUOTES */}
      <section style={{ background: '#fafaf8', padding: '80px 24px', minHeight: 360, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', width: '100%' }}>
          <Reveal>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: 32 }}>From Read</p>
          </Reveal>
          <div style={{ opacity: quoteVisible ? 1 : 0, transform: quoteVisible ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.6s ease, transform 0.6s ease', minHeight: 140 }}>
            <blockquote style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 400, fontStyle: 'italic', color: '#111', lineHeight: 1.55, letterSpacing: -0.3, marginBottom: 20 }}>
              "{currentQuote.text}"
            </blockquote>
            {currentQuote.author && (
              <p style={{ fontSize: '0.82rem', color: SAGE, fontWeight: 600, letterSpacing: '0.04em' }}>— {currentQuote.author}</p>
            )}
          </div>
        </div>
      </section>

      {/* LAW */}
      <section style={{ background: '#0c0e0c', padding: '80px 24px', minHeight: 360, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(74,124,89,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', width: '100%', position: 'relative' }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <span style={{ fontSize: '1.2rem' }}>⚖️</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,239,235,0.3)' }}>Law and Justice · From Read</span>
            </div>
          </Reveal>
          <div style={{ opacity: lawVisible ? 1 : 0, transform: lawVisible ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.6s ease, transform 0.6s ease', minHeight: 140 }}>
            <blockquote style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 400, fontStyle: 'italic', color: '#f0efeb', lineHeight: 1.5, letterSpacing: -0.3, marginBottom: 20, borderLeft: `3px solid ${SAGE}`, paddingLeft: 24 }}>
              "{currentLaw.text}"
            </blockquote>
            <p style={{ fontSize: '0.82rem', color: SAGE, fontWeight: 600, letterSpacing: '0.04em', paddingLeft: 24 }}>— {currentLaw.author}</p>
          </div>
        </div>
      </section>

      {/* APPS ROTATING */}
      <section style={{ background: '#fafaf8', padding: '80px 24px', minHeight: 400, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
          <Reveal>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: 40 }}>The ecosystem</p>
          </Reveal>
          <div style={{ opacity: appVisible ? 1 : 0, transform: appVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
              <span style={{ fontSize: '3.5rem' }}>{currentApp.emoji}</span>
              <div>
                <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 400, letterSpacing: -2, lineHeight: 1, color: currentApp.color }}>{currentApp.name}</h2>
                <p style={{ fontSize: '1rem', color: '#666', marginTop: 8 }}>{currentApp.desc}</p>
              </div>
            </div>
            <Link href={currentApp.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', background: currentApp.color, color: '#fff', borderRadius: 100, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
              Explore {currentApp.name} →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 32 }}>
            {APPS.map((a, i) => (
              <div key={i} style={{ width: appIdx === i ? 20 : 6, height: 6, borderRadius: 3, background: appIdx === i ? currentApp.color : '#ddd', transition: 'all 0.4s ease' }} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: '#070908', padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(74,124,89,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <Reveal>
          <div style={{ position: 'relative' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" width={56} height={56}>
              <defs><clipPath id="qcta"><circle cx="55" cy="55" r="32" /></clipPath></defs>
              <circle cx="55" cy="55" r="38" fill="none" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
              <line x1="81" y1="79" x2="98" y2="98" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
              <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55" fill="none" stroke={SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qcta)" style={waveStyle} />
            </svg>
            <h2 style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, letterSpacing: -2, lineHeight: 1.05, color: '#f0efeb', margin: '20px 0 16px' }}>
              One account.<br /><span style={{ color: SAGE, fontStyle: 'italic' }}>Everything.</span>
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(240,239,235,0.4)', marginBottom: 36 }}>Free, forever.</p>
            <Link href="/auth/register" style={{ display: 'inline-block', padding: '14px 36px', background: SAGE, color: '#fff', borderRadius: 100, textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}>
              Get started — it's free
            </Link>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#070908', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" width={16} height={16} style={{ flexShrink: 0 }}>
              <defs><clipPath id="qcf"><circle cx="55" cy="55" r="32" /></clipPath></defs>
              <circle cx="55" cy="55" r="38" fill="none" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
              <line x1="81" y1="79" x2="98" y2="98" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
              <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55" fill="none" stroke={SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qcf)" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#f0efeb' }}>
              <span style={{ opacity: 0.4 }}>ueren</span><span style={{ color: SAGE }}>cia</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'rgba(240,239,235,0.2)', marginLeft: 8 }}>© 2026 · Tech and more</span>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {[{ l: 'Privacy', h: '/pages/privacy' }, { l: 'Terms', h: '/pages/terms' }, { l: 'Security', h: '/pages/security' }, { l: 'Pricing', h: '/pricing' }].map(item => (
              <Link key={item.l} href={item.h} style={{ fontSize: '0.78rem', color: 'rgba(240,239,235,0.3)', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = SAGE)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,239,235,0.3)')}
              >{item.l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
