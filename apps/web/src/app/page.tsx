'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useI18n, LOCALES } from '../lib/i18n';
import { QUOTES } from '../lib/quotes';

var SAGE = '#4a7c59';

var LAW_QUOTES = [
  { text: "The law is reason, free from passion.", author: "Aristotle" },
  { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
  { text: "Justice delayed is justice denied.", author: "William E. Gladstone" },
  { text: "No man is above the law and no man is below it.", author: "Theodore Roosevelt" },
  { text: "The good of the people is the greatest law.", author: "Marcus Tullius Cicero" },
];

var APPS = [
  { name: 'Cui Bap', emoji: '🌽', color: '#f59e0b', desc: 'Private messaging. No ads.', href: '/dashboard/cui-bap' },
  { name: 'Nope', emoji: '🌿', color: '#4a7c59', desc: 'Real stories from real people.', href: '/dashboard/nope' },
  { name: 'LaNo', emoji: '🎧', color: '#8b5cf6', desc: 'Someone to listen. Without judgment.', href: '/dashboard/lano' },
  { name: 'Tools', emoji: '🔧', color: '#ef4444', desc: '44+ free browser-based tools.', href: '/tools' },
];

var TOOLS = ['Image Editor','PDF to Word','Flashcards','Self-destruct Link','Screenshot Translate','Password Generator','Grammar Check','QR Generator'];

export default function HomePage() {
  var session = useSession().data;
  var i18n = useI18n();
  var locale = i18n.locale;
  var setLocale = i18n.setLocale;
  var t = i18n.t;

  var quoteState = useState(0);
  var quoteIdx = quoteState[0];
  var setQuoteIdx = quoteState[1];

  var appState = useState(0);
  var appIdx = appState[0];
  var setAppIdx = appState[1];

  var langState = useState(false);
  var langOpen = langState[0];
  var setLangOpen = langState[1];

  var quoteVisState = useState(true);
  var quoteVisible = quoteVisState[0];
  var setQuoteVisible = quoteVisState[1];

  var appVisState = useState(true);
  var appVisible = appVisState[0];
  var setAppVisible = appVisState[1];

  useEffect(function() {
    var timer = setInterval(function() {
      setQuoteVisible(false);
      setTimeout(function() {
        setQuoteIdx(function(i) { return (i + 1) % QUOTES.length; });
        setQuoteVisible(true);
      }, 600);
    }, 10000);
    return function() { clearInterval(timer); };
  }, []);

  useEffect(function() {
    var timer = setInterval(function() {
      setAppVisible(false);
      setTimeout(function() {
        setAppIdx(function(i) { return (i + 1) % APPS.length; });
        setAppVisible(true);
      }, 500);
    }, 3500);
    return function() { clearInterval(timer); };
  }, []);

  var currentQuote = QUOTES[quoteIdx];
  var currentApp = APPS[appIdx];
  var waveStyle = { strokeDasharray: 160, animation: 'waveRun 2s linear infinite' };

  return (
    <div>
      <nav style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 200, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(8,10,8,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '8px 16px 8px 12px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" width={20} height={20}>
            <defs><clipPath id="qcn"><circle cx="55" cy="55" r="32" /></clipPath></defs>
            <circle cx="55" cy="55" r="38" fill="none" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
            <line x1="81" y1="79" x2="98" y2="98" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
            <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55" fill="none" stroke={SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qcn)" style={waveStyle} />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', letterSpacing: -0.3, color: '#f0efeb' }}>
              <span style={{ opacity: 0.5 }}>ueren</span><span style={{ color: SAGE }}>cia</span>
            </span>
            <span style={{ fontSize: '0.52rem', color: SAGE, opacity: 0.7, fontWeight: 500 }}>Tech and more</span>
          </div>
        </Link>

        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)' }} />

        <div style={{ position: 'relative' }}>
          <button onClick={function() { setLangOpen(function(o) { return !o; }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: 'rgba(240,239,235,0.6)', display: 'flex', alignItems: 'center', gap: 4, padding: '2px 4px' }}>
            🌐 {(LOCALES.find(function(l) { return l.code === locale; }) || {}).flag}
          </button>
          {langOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: '#1a1d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 4, zIndex: 300, minWidth: 150 }}>
              {LOCALES.map(function(l) {
                return (
                  <button key={l.code} onClick={function() { setLocale(l.code); setLangOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', background: locale === l.code ? 'rgba(74,124,89,0.15)' : 'transparent', color: locale === l.code ? SAGE : 'rgba(240,239,235,0.7)', fontSize: '0.82rem', textAlign: 'left' }}>
                    <span>{l.flag}</span><span>{l.label}</span>
                  </button>
                );
              })}
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

      <section style={{ minHeight: '100vh', background: '#070908', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', top: '10%', left: '20%', background: 'radial-gradient(circle, rgba(74,124,89,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ marginBottom: 24 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" width={100} height={100}>
            <defs><clipPath id="qClipHome"><circle cx="55" cy="55" r="32" /></clipPath></defs>
            <circle cx="55" cy="55" r="38" fill="none" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
            <line x1="81" y1="79" x2="98" y2="98" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
            <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55" fill="none" stroke={SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qClipHome)" style={waveStyle} />
          </svg>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: 400, letterSpacing: -4, lineHeight: 0.95, color: '#f0efeb', marginBottom: 8 }}>
          <span style={{ opacity: 0.35 }}>ueren</span><span style={{ color: SAGE }}>cia</span>
        </h1>
        <p style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: SAGE, opacity: 0.7, marginBottom: 40 }}>Tech and more</p>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: 'rgba(240,239,235,0.4)', lineHeight: 1.7, maxWidth: 580, fontStyle: 'italic' }}>
          "It's not that the world is too dark but that we've grown used to not lighting ourselves up."
        </p>
      </section>

      <section style={{ background: '#111814', padding: '40px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 24, animation: 'scrollLeft 25s linear infinite', whiteSpace: 'nowrap' }}>
          {[...TOOLS, ...TOOLS, ...TOOLS].map(function(tool, i) {
            return (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', border: '1px solid rgba(74,124,89,0.2)', borderRadius: 100, fontSize: '0.85rem', color: 'rgba(240,239,235,0.6)', flexShrink: 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: SAGE, display: 'inline-block', opacity: 0.5 }} />
                {tool}
              </span>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/tools" style={{ fontSize: '0.78rem', color: SAGE, textDecoration: 'none', fontWeight: 500 }}>44+ free tools →</Link>
        </div>
      </section>

      <section style={{ background: '#fafaf8', padding: '80px 24px', minHeight: 320, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', width: '100%' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: 32 }}>From Read</p>
          <div style={{ opacity: quoteVisible ? 1 : 0, transition: 'opacity 0.6s ease', minHeight: 120 }}>
            <blockquote style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', fontWeight: 400, fontStyle: 'italic', color: '#111', lineHeight: 1.55, marginBottom: 16 }}>
              "{currentQuote.text}"
            </blockquote>
            {currentQuote.author && (
              <p style={{ fontSize: '0.82rem', color: SAGE, fontWeight: 600 }}>— {currentQuote.author}</p>
            )}
          </div>
        </div>
      </section>

      <section style={{ background: '#0c0e0c', padding: '80px 24px', minHeight: 320, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '1.2rem' }}>⚖️</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,239,235,0.3)' }}>Law and Justice · From Read</span>
          </div>
          <blockquote style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 400, fontStyle: 'italic', color: '#f0efeb', lineHeight: 1.5, marginBottom: 16, borderLeft: '3px solid ' + SAGE, paddingLeft: 24 }}>
            "{LAW_QUOTES[0].text}"
          </blockquote>
          <p style={{ fontSize: '0.82rem', color: SAGE, fontWeight: 600, paddingLeft: 24 }}>— {LAW_QUOTES[0].author}</p>
        </div>
      </section>

      <section style={{ background: '#fafaf8', padding: '80px 24px', minHeight: 360, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: 40 }}>The ecosystem</p>
          <div style={{ opacity: appVisible ? 1 : 0, transition: 'opacity 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
              <span style={{ fontSize: '3.5rem' }}>{currentApp.emoji}</span>
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 400, letterSpacing: -2, lineHeight: 1, color: currentApp.color }}>{currentApp.name}</h2>
                <p style={{ fontSize: '1rem', color: '#666', marginTop: 8 }}>{currentApp.desc}</p>
              </div>
            </div>
            <Link href={currentApp.href} style={{ display: 'inline-flex', padding: '10px 22px', background: currentApp.color, color: '#fff', borderRadius: 100, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
              Explore {currentApp.name} →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 32 }}>
            {APPS.map(function(a, i) {
              return <div key={i} style={{ width: appIdx === i ? 20 : 6, height: 6, borderRadius: 3, background: appIdx === i ? currentApp.color : '#ddd', transition: 'all 0.4s ease' }} />;
            })}
          </div>
        </div>
      </section>

      <section style={{ background: '#070908', padding: '100px 24px', textAlign: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" width={56} height={56}>
          <defs><clipPath id="qcta"><circle cx="55" cy="55" r="32" /></clipPath></defs>
          <circle cx="55" cy="55" r="38" fill="none" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
          <line x1="81" y1="79" x2="98" y2="98" stroke={SAGE} strokeWidth="7" strokeLinecap="round" />
          <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55" fill="none" stroke={SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qcta)" />
        </svg>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, letterSpacing: -2, lineHeight: 1.05, color: '#f0efeb', margin: '20px 0 16px' }}>
          One account.<br /><span style={{ color: SAGE, fontStyle: 'italic' }}>Everything.</span>
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'rgba(240,239,235,0.4)', marginBottom: 36 }}>Free, forever.</p>
        <Link href="/auth/register" style={{ display: 'inline-block', padding: '14px 36px', background: SAGE, color: '#fff', borderRadius: 100, textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}>
          Get started — it's free
        </Link>
      </section>

      <footer style={{ background: '#070908', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#f0efeb' }}>
              <span style={{ opacity: 0.4 }}>ueren</span><span style={{ color: SAGE }}>cia</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'rgba(240,239,235,0.2)', marginLeft: 8 }}>© 2026 · Tech and more</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/pages/privacy" style={{ fontSize: '0.78rem', color: 'rgba(240,239,235,0.3)', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/pages/terms" style={{ fontSize: '0.78rem', color: 'rgba(240,239,235,0.3)', textDecoration: 'none' }}>Terms</Link>
            <Link href="/pricing" style={{ fontSize: '0.78rem', color: 'rgba(240,239,235,0.3)', textDecoration: 'none' }}>Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
