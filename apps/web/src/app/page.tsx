'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useI18n, LOCALES } from '../lib/i18n';
import { QUOTES } from '../lib/quotes';

var SAGE = '#4a7c59';

var COMPANY_QUOTES = {
  en: "It\'s not that the world is too dark but that we\'ve grown used to not lighting ourselves up.",
  vi: "Kh\u00f4ng ph\u1ea3i th\u1ebf gi\u1edbi qu\u00e1 t\u1ed1i, m\u00e0 l\u00e0 ch\u00fang ta \u0111\u00e3 quen kh\u00f4ng t\u1ef1 th\u1eafp s\u00e1ng ch\u00ednh m\u00ecnh.",
  ja: "\u4e16\u754c\u304c\u6697\u3059\u304e\u308b\u306e\u3067\u306f\u306a\u304f\u3001\u79c1\u305f\u3061\u304c\u81ea\u5206\u81ea\u8eab\u3092\u7167\u3089\u3059\u3053\u3068\u306b\u6151\u308c\u3066\u3044\u306a\u3044\u3060\u3051\u3060\u3002",
  es: "No es que el mundo sea demasiado oscuro, sino que nos hemos acostumbrado a no iluminarnos a nosotros mismos.",
};

var LAW_QUOTES = [
  { text: "The law is reason, free from passion.", author: "Aristotle" },
  { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
  { text: "Justice delayed is justice denied.", author: "William E. Gladstone" },
  { text: "No man is above the law and no man is below it.", author: "Theodore Roosevelt" },
  { text: "The good of the people is the greatest law.", author: "Marcus Tullius Cicero" },
  { text: "Wherever law ends, tyranny begins.", author: "John Locke" },
  { text: "Law is order, and good law is good order.", author: "Aristotle" },
];

var APPS = [
  { name: 'Cui Bap', emoji: '\ud83c\udf3d', color: '#f59e0b', desc: 'Private messaging. No ads.', href: '/dashboard/cui-bap' },
  { name: 'Nope', emoji: '\ud83c\udf3f', color: '#4a7c59', desc: 'Real stories from real people.', href: '/dashboard/nope' },
  { name: 'LaNo', emoji: '\ud83c\udfa7', color: '#8b5cf6', desc: 'Someone to listen. Without judgment.', href: '/dashboard/lano' },
  { name: 'Tools', emoji: '\ud83d\udd27', color: '#ef4444', desc: '44+ free browser-based tools.', href: '/tools' },
];

var TOOLS = ['Image Editor','PDF to Word','Flashcards','Self-destruct Link','Screenshot Translate','Password Generator','Grammar Check','QR Generator','CV Builder','Text Summarize','Pomodoro Timer'];

function Typewriter({ text }) {
  var state = useState('');
  var displayed = state[0];
  var setDisplayed = state[1];
  var doneState = useState(false);
  var done = doneState[0];
  var setDone = doneState[1];

  useEffect(function() {
    setDisplayed('');
    setDone(false);
    var i = 0;
    var t = setInterval(function() {
      if (i < text.length) { i++; setDisplayed(text.slice(0, i)); }
      else { setDone(true); clearInterval(t); }
    }, 32);
    return function() { clearInterval(t); };
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span style={{ borderRight: '2px solid rgba(240,239,235,0.4)', marginLeft: 1, animation: 'blink 0.7s step-end infinite' }} />}
    </span>
  );
}


function LetterDrop() {
  var letters = ['u','e','r','e','n','c','i','a'];
  var cycle = useState(0);
  var key = cycle[0];
  var setKey = cycle[1];

  useEffect(function() {
    var timer = setInterval(function() {
      setKey(function(k) { return k + 1; });
    }, 30000);
    return function() { clearInterval(timer); };
  }, []);

  // Mỗi chữ rớt cách nhau 0.18s, shimmer sau khi tất cả đã rớt
  // 8 chữ x 0.18s = 1.44s + 0.8s rớt = 2.24s trước shimmer
  return (
    <div key={key} style={{ display: 'inline-flex', alignItems: 'baseline', letterSpacing: -3, lineHeight: 1 }}>
      {letters.map(function(letter, i) {
        var isCia = i >= 5;
        var fallDelay = i * 0.18;
        var shimmerDelay = 8 * 0.18 + 0.8 + 0.3;
        return (
          <span key={i} style={{
            display: 'inline-block',
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(3rem, 9vw, 7rem)',
            fontWeight: 400,
            color: isCia ? '#4a7c59' : '#f0efeb',
            opacity: isCia ? 1 : 0.3,
            animation: 'letterFall 0.8s cubic-bezier(0.22,1,0.36,1) ' + fallDelay + 's both, shimmerStrong 2s ease ' + shimmerDelay + 's 1',
          }}>
            {letter}
          </span>
        );
      })}
    </div>
  );
}

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

  var langRef = useRef(null);

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

  useEffect(function() {
    var h = function(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', h);
    return function() { document.removeEventListener('mousedown', h); };
  }, []);

  var currentQuote = QUOTES[quoteIdx];
  var currentApp = APPS[appIdx];
  var companyQuote = COMPANY_QUOTES[locale] || COMPANY_QUOTES.en;

  var LogoSVG = function(props) {
    var sz = props.size || 22;
    var col = props.color || SAGE;
    var animStyle = props.animated ? { strokeDasharray: '203 9999', animation: 'waveRun 4s linear infinite' } : {};
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="13 13 86 86" width={sz} height={sz} style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
        <defs><clipPath id={"qc" + (props.id || "")}><circle cx="55" cy="55" r="32"/></clipPath></defs>
        <circle cx="55" cy="55" r="38" fill="none" stroke={col} strokeWidth="7" strokeLinecap="round"/>
        <line x1="81" y1="79" x2="98" y2="98" stroke={col} strokeWidth="7" strokeLinecap="round"/>
        <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
          fill="none" stroke={col} strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round"
          clipPath={"url(#qc" + (props.id || "") + ")"}
          style={animStyle}/>
      </svg>
    );
  };

  return (
    <div>
      {/* FLOATING PILL NAV */}
      <nav style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 200, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(8,10,8,0.88)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '7px 14px 7px 10px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
          <LogoSVG size={18} animated={true} id="nav" />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: -0.3, color: '#f0efeb', lineHeight: 1 }}>
            <span style={{ opacity: 0.45 }}>ueren</span><span style={{ color: SAGE }}>cia</span>
          </span>
        </Link>

        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

        <div ref={langRef} style={{ position: 'relative' }}>
          <button onClick={function() { setLangOpen(function(o) { return !o; }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'rgba(240,239,235,0.55)', display: 'flex', alignItems: 'center', gap: 3, padding: '2px 4px' }}>
            🌐 {(LOCALES.find(function(l) { return l.code === locale; }) || {}).flag}
          </button>
          {langOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: '#1a1d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 4, zIndex: 300, minWidth: 150, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
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

        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

        {session ? (
          <Link href="/dashboard/nope" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', background: SAGE, borderRadius: 100, padding: '5px 13px', textDecoration: 'none' }}>Dashboard</Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link href="/auth/login" style={{ fontSize: '0.78rem', color: 'rgba(240,239,235,0.55)', textDecoration: 'none', padding: '4px 8px' }}>{t('nav.signin')}</Link>
            <Link href="/auth/register" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', background: SAGE, borderRadius: 100, padding: '5px 13px', textDecoration: 'none' }}>{t('nav.getstarted')}</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', background: '#070908', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', top: '5%', left: '15%', background: 'radial-gradient(circle, rgba(74,124,89,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bottom: '10%', right: '10%', background: 'radial-gradient(circle, rgba(74,124,89,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo lớn + wordmark cùng hàng */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" width={80} height={80} style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
            <defs><clipPath id="qchero"><circle cx="55" cy="55" r="32"/></clipPath></defs>
            <circle cx="55" cy="55" r="38" fill="none" stroke={SAGE} strokeWidth="7" strokeLinecap="round"/>
            <line x1="81" y1="79" x2="98" y2="98" stroke={SAGE} strokeWidth="7" strokeLinecap="round"/>
            <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
              fill="none" stroke={SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              clipPath="url(#qchero)"
              style={{ strokeDasharray: '203 9999', animation: 'waveRun 4s linear infinite' }}/>
          </svg>
          <h1 style={{ margin: 0, padding: 0, lineHeight: 1 }}>
            <LetterDrop />
          </h1>
        </div>

        <p style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: SAGE, opacity: 0.65, marginBottom: 44 }}>Tech and more</p>

        {/* Typewriter quote - slogan chính thức đổi theo ngôn ngữ */}
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(0.95rem, 2.2vw, 1.25rem)', color: 'rgba(240,239,235,0.38)', lineHeight: 1.75, maxWidth: 580, fontStyle: 'italic', minHeight: 70 }}>
          <Typewriter text={'"' + companyQuote + '"'} />
        </div>
      </section>

      {/* TOOLS TICKER */}
      <section style={{ background: '#111814', padding: '36px 0', overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(to right, #111814, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(to left, #111814, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', gap: 20, animation: 'scrollLeft 28s linear infinite', whiteSpace: 'nowrap' }}>
            {[...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS].map(function(tool, i) {
              return (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', border: '1px solid rgba(74,124,89,0.18)', borderRadius: 100, fontSize: '0.82rem', color: 'rgba(240,239,235,0.55)', flexShrink: 0 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: SAGE, display: 'inline-block', opacity: 0.5 }} />
                  {tool}
                </span>
              );
            })}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/tools" style={{ fontSize: '0.75rem', color: SAGE, textDecoration: 'none', fontWeight: 500, opacity: 0.7 }}>44+ free tools →</Link>
        </div>
      </section>

      {/* QUOTES */}
      <section style={{ background: '#fafaf8', padding: '80px 24px', minHeight: 300, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', width: '100%' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#bbb', marginBottom: 28 }}>From Read</p>
          <div style={{ opacity: quoteVisible ? 1 : 0, transition: 'opacity 0.6s ease', minHeight: 110 }}>
            <blockquote style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.2rem, 2.8vw, 1.8rem)', fontWeight: 400, fontStyle: 'italic', color: '#111', lineHeight: 1.6, marginBottom: 14 }}>
              "{currentQuote.text}"
            </blockquote>
            {currentQuote.author && (
              <p style={{ fontSize: '0.8rem', color: SAGE, fontWeight: 600 }}>— {currentQuote.author}</p>
            )}
          </div>
        </div>
      </section>

      {/* LAW */}
      <section style={{ background: '#0c0e0c', padding: '80px 24px', minHeight: 300, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(74,124,89,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', width: '100%', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span>⚖️</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,239,235,0.25)' }}>Law and Justice · From Read</span>
          </div>
          <blockquote style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.2rem, 2.8vw, 2rem)', fontWeight: 400, fontStyle: 'italic', color: '#f0efeb', lineHeight: 1.55, marginBottom: 14, borderLeft: '3px solid ' + SAGE, paddingLeft: 22 }}>
            "{LAW_QUOTES[0].text}"
          </blockquote>
          <p style={{ fontSize: '0.8rem', color: SAGE, fontWeight: 600, paddingLeft: 22 }}>— {LAW_QUOTES[0].author}</p>
        </div>
      </section>

      {/* APPS ROTATING */}
      <section style={{ background: '#fafaf8', padding: '80px 24px', minHeight: 340, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#bbb', marginBottom: 36 }}>The ecosystem</p>
          <div style={{ opacity: appVisible ? 1 : 0, transition: 'opacity 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
              <span style={{ fontSize: '3rem' }}>{currentApp.emoji}</span>
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 400, letterSpacing: -1.5, lineHeight: 1, color: currentApp.color, margin: 0 }}>{currentApp.name}</h2>
                <p style={{ fontSize: '0.9rem', color: '#777', marginTop: 6 }}>{currentApp.desc}</p>
              </div>
            </div>
            <Link href={currentApp.href} style={{ display: 'inline-flex', padding: '9px 20px', background: currentApp.color, color: '#fff', borderRadius: 100, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
              Explore {currentApp.name} →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 28 }}>
            {APPS.map(function(a, i) {
              return <div key={i} style={{ width: appIdx === i ? 18 : 5, height: 5, borderRadius: 3, background: appIdx === i ? currentApp.color : '#ddd', transition: 'all 0.4s ease' }} />;
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#070908', padding: '90px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(74,124,89,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <LogoSVG size={50} animated={true} id="cta" />
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 400, letterSpacing: -1.5, lineHeight: 1.08, color: '#f0efeb', margin: '18px 0 14px' }}>
            One account.<br /><span style={{ color: SAGE, fontStyle: 'italic' }}>Everything.</span>
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(240,239,235,0.35)', marginBottom: 32 }}>Free, forever.</p>
          <Link href="/auth/register" style={{ display: 'inline-block', padding: '13px 34px', background: SAGE, color: '#fff', borderRadius: 100, textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
            Get started — it's free
          </Link>
        </div>
      </section>
    </div>
  );
}
