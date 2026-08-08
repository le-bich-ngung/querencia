'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useI18n } from '../lib/i18n';
import { QUOTES } from '../lib/quotes';

var SAGE = '#4a7c59';

var COMPANY_QUOTE_EN = "It's not that the world is too dark but that we've grown used to not lighting ourselves up.";

var FREE_TOOLS = [
  { name: 'Password Generator', href: '/tools/password-generator' },
  { name: 'QR Generator', href: '/tools/qr-generator' },
  { name: 'Color Picker', href: '/tools/color-picker' },
  { name: 'CSS Gradient', href: '/tools/css-gradient' },
  { name: 'Lorem Ipsum', href: '/tools/lorem-ipsum' },
  { name: 'Hash Generator', href: '/tools/hash-generator' },
  { name: 'Encode Tools', href: '/tools/encode-tools' },
  { name: 'JSON Formatter', href: '/tools/json-formatter' },
  { name: 'Regex Tester', href: '/tools/regex-tester' },
  { name: 'Unit Converter', href: '/tools/unit-converter' },
  { name: 'Currency', href: '/tools/currency' },
  { name: 'Word Counter', href: '/tools/word-counter' },
  { name: 'World Clock', href: '/tools/world-clock' },
  { name: 'IP Lookup', href: '/tools/ip-lookup' },
  { name: 'Random', href: '/tools/random' },
  { name: 'Text Diff', href: '/tools/text-diff' },
  { name: 'Readability', href: '/tools/readability' },
  { name: 'Markdown Editor', href: '/tools/markdown-editor' },
  { name: 'Notes', href: '/tools/notes' },
  { name: 'Secure Notes', href: '/tools/secure-notes' },
  { name: 'Temp Email', href: '/tools/temp-email' },
  { name: 'Metadata Remover', href: '/tools/metadata-remover' },
  { name: 'Pomodoro', href: '/tools/pomodoro' },
  { name: 'Typing Trainer', href: '/tools/typing_trainer_10_fingers' },
  { name: 'Barcode Scanner', href: '/tools/barcode-scanner' },
];

var PAID_TOOLS = [
  { name: 'OCR', desc: 'Recognize text from images', icon: '🔍', href: '/tools/ocr' },
  { name: 'Screenshot Translator', desc: 'Translate content in images', icon: '🌐', href: '/tools/screenshot-translator' },
  { name: 'Smart Table Extractor', desc: 'Extract tables from images & PDFs', icon: '📊', href: '/tools/smart-table-extractor' },
  { name: 'Image Editor', desc: 'Advanced image editing', icon: '🖼️', href: '/tools/image-editor' },
  { name: 'Collage', desc: 'Artistic photo collage', icon: '🎨', href: '/tools/collage' },
  { name: 'Add Watermark', desc: 'Add watermark to images', icon: '💧', href: '/tools/add-watermark' },
  { name: 'Convert Image', desc: 'Convert image formats', icon: '🔄', href: '/tools/convert-image' },
  { name: 'Compress Image', desc: 'High-quality image compression', icon: '📦', href: '/tools/compress-image' },
  { name: 'PDF Tool', desc: 'Comprehensive PDF processing', icon: '📄', href: '/tools/pdf-tool' },
  { name: 'PDF to Word', desc: 'Convert PDF to Word', icon: '📝', href: '/tools/pdf-to-word' },
  { name: 'PDF Reader', desc: 'Read & annotate PDFs', icon: '📖', href: '/tools/pdf-reader' },
  { name: 'CV Builder', desc: 'Build professional CVs', icon: '💼', href: '/tools/cv-builder' },
  { name: 'Audio Recorder', desc: 'Record & store audio', icon: '🎙️', href: '/tools/audio-recorder' },
  { name: 'Screen Recorder', desc: 'Screen recording', icon: '🎬', href: '/tools/screen-recorder' },
  { name: 'File Vault', desc: 'Secure file storage', icon: '🔒', href: '/tools/file-vault' },
  { name: 'Diary', desc: 'Personal diary', icon: '📓', href: '/tools/diary' },
  { name: 'Flashcards', desc: 'Smart vocabulary learning', icon: '🃏', href: '/tools/flashcards' },
];

var MENTAL_MODELS = [
  { title: 'First Principles Thinking', sub: 'Think from first principles', desc: 'Break problems down to fundamental truths and rebuild from scratch. How Elon Musk designed rockets 10x cheaper.', icon: '⚗️' },
  { title: 'Second-Order Thinking', sub: 'Think about consequences of consequences', desc: 'Not just asking what this causes, but what that causes next. See beyond immediate effects.', icon: '♟️' },
  { title: 'Mental Models', sub: 'Thinking frameworks of geniuses', desc: 'A collection of frameworks from physics, psychology, economics - to solve complex problems.', icon: '🧠' },
  { title: 'Dangerous Questions', sub: 'The art of world-changing questions', desc: 'The right question matters more than the right answer. The most naive questions often lead to the biggest breakthroughs.', icon: '💡' },
];


var CONVENTIONS_EN = [
  { name: 'UN Convention on the Law of the Sea (UNCLOS)', year: 1982, summary: 'Defines the rights and responsibilities of nations regarding ocean use, marine environment protection, and management of natural resources.' },
  { name: 'Convention on the Rights of the Child (CRC)', year: 1989, summary: 'Protects the civil, political, economic, social and cultural rights of children worldwide.' },
  { name: 'Convention Against Torture (CAT)', year: 1984, summary: 'Prevents torture and other cruel, inhuman or degrading treatment or punishment.' },
  { name: 'Convention on the Elimination of Discrimination Against Women (CEDAW)', year: 1979, summary: 'Eliminates all forms of discrimination against women and ensures equal rights in all areas.' },
  { name: 'Paris Agreement on Climate Change', year: 2015, summary: 'Reduces greenhouse gas emissions and limits global temperature rise to below 2°C above pre-industrial levels.' },
];

var MOCK_Q_POOL = [
  { id: '1', amount: 2, type: 'expiring', expiresIn: '1g 42p', donor: null, claimed: 0 },
  { id: '2', amount: 1, type: 'expiring', expiresIn: '2g 15p', donor: 'An N.', claimed: 3 },
  { id: '3', amount: 1, type: 'permanent', expiresIn: null, donor: null, claimed: 0 },
  { id: '4', amount: 2, type: 'expiring', expiresIn: '0g 28p', donor: 'Minh T.', claimed: 1 },
];

function Typewriter({ text }) {
  var cycleState = useState(0);
  var cycle = cycleState[0]; var setCycle = cycleState[1];
  var displayState = useState('');
  var displayed = displayState[0]; var setDisplayed = displayState[1];
  var doneState = useState(false);
  var done = doneState[0]; var setDone = doneState[1];

  useEffect(function() {
    setDisplayed(''); setDone(false);
    var i = 0;
    var t = setInterval(function() {
      if (i < text.length) { i++; setDisplayed(text.slice(0, i)); }
      else { setDone(true); clearInterval(t); }
    }, 70);
    return function() { clearInterval(t); };
  }, [text, cycle]);

  useEffect(function() {
    if (!done) return;
    var timer = setTimeout(function() {
      setCycle(function(c) { return c + 1; });
    }, 10000);
    return function() { clearTimeout(timer); };
  }, [done]);

  return (
    <span>
      {displayed}
      {!done && (
        <span style={{
          display: 'inline-block', width: '2px', height: '1em',
          background: 'rgba(240,239,235,0.5)',
          marginLeft: '2px', verticalAlign: 'text-bottom',
          animation: 'blink 0.8s step-end infinite',
        }} />
      )}
    </span>
  );
}

function LetterDrop() {
  var letters = ['u','e','r','e','n','c','i','a'];
  var cycle = useState(0);
  var key = cycle[0]; var setKey = cycle[1];
  useEffect(function() {
    var timer = setInterval(function() { setKey(function(k) { return k + 1; }); }, 8000);
    return function() { clearInterval(timer); };
  }, []);
  // Last letter 'a' is index 7, delay = 7 * 0.18 = 1.26s
  // Heart slides in after 'a' finishes: delay = 1.26 + 0.4 = 1.66s
  // Shimmer fires after heart lands: delay = 1.66 + 0.5 = 2.16s + 0.8s total anim = ~3s
  var heartDelay = 7 * 0.18 + 0.4;
  var heartLands = heartDelay + 2.8;
  var shimmerDelay = heartLands;
  return (
    <div key={key} style={{ display: 'inline-flex', alignItems: 'baseline', letterSpacing: -3, lineHeight: 1, position: 'relative' }}>
      {letters.map(function(letter, i) {
        var isCia = i >= 5;
        var fallDelay = i * 0.18;
        return (
          <span key={i} style={{
            display: 'inline-block', position: 'relative',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(3rem, 9vw, 7rem)', fontWeight: 300,
            color: isCia ? '#4a7c59' : '#f0efeb',
            opacity: isCia ? 1 : 0.3,
            animation: 'letterSlide 1.2s cubic-bezier(0.34,1,0.64,1) ' + fallDelay + 's both, shimmerFlash 8s ease 4.56s infinite',
          }}>
            {letter}
          </span>
        );
      })}
      {/* Heart slides in from right after 'a', rests leaning against 'a' */}
      <span style={{
        display: 'inline-block',
        alignSelf: 'baseline',
        verticalAlign: 'baseline',
        marginLeft: '0.05em',
        position: 'relative',
        bottom: '-0.05em',
        animation: 'heartEnter 2.8s cubic-bezier(0.25,0.46,0.45,0.94) ' + heartDelay + 's both, shimmerFlash 8s ease 4.56s infinite',
      }}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
          style={{ width: 'clamp(0.7rem, 2vw, 1.6rem)', height: 'clamp(0.7rem, 2vw, 1.6rem)', display: 'block' }}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ef4444"/>
        </svg>
      </span>
    </div>
  );
}

function QSymbol({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size}>
      <defs><clipPath id="qSymClip"><circle cx="55" cy="55" r="32"/></clipPath></defs>
      <circle cx="55" cy="55" r="38" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"/>
      <line x1="81" y1="79" x2="98" y2="98" stroke={color} strokeWidth="9" strokeLinecap="round"/>
      <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
        fill="none" stroke={color} strokeWidth="4"
        strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qSymClip)"/>
    </svg>
  );
}

function BookNotifyForm() {
  var i18n = useI18n();
  var t = i18n.t;
  var emailState = useState('');
  var email = emailState[0]; var setEmail = emailState[1];
  var sentState = useState(false);
  var sent = sentState[0]; var setSent = sentState[1];
  function handleSubmit() {
    if (!email.includes('@')) return;
    setSent(true);
  }
  if (sent) return (
    <div style={{ padding: '16px 24px', background: 'rgba(74,124,89,0.08)', border: '1px solid rgba(74,124,89,0.15)', borderRadius: 12, color: SAGE, fontSize: '0.9rem' }}>
      {t('home.book.sent')}.
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
      <input
        type="email"
        value={email}
        onChange={function(e) { setEmail(e.target.value); }}
        placeholder={t('home.book.email') || 'Your email'}
        style={{ padding: '11px 18px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 100, fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit', minWidth: 240, background: '#fff' }}
      />
      <button onClick={handleSubmit} style={{ padding: '11px 24px', background: SAGE, color: '#fff', border: 'none', borderRadius: 100, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 600 }}>
        {t('home.book.btn')}
      </button>
    </div>
  );
}

export default function HomePage() {
  var session = useSession().data;
  var i18n = useI18n();
  var t = i18n.t;

  var quoteIdxState = useState(function() { return Math.floor(Math.random() * QUOTES.length); });
  var quoteIdx = quoteIdxState[0]; var setQuoteIdx = quoteIdxState[1];
  var quoteVisState = useState(true);
  var quoteVisible = quoteVisState[0]; var setQuoteVisible = quoteVisState[1];

  var claimedState = useState([]);
  var claimedQ = claimedState[0]; var setClaimedQ = claimedState[1];
  var loadingState = useState(null);
  var loadingQ = loadingState[0]; var setLoadingQ = loadingState[1];

  var feedbackState = useState('');
  var feedback = feedbackState[0]; var setFeedback = feedbackState[1];
  var feedbackSentState = useState(false);
  var feedbackSent = feedbackSentState[0]; var setFeedbackSent = feedbackSentState[1];

  var convIdxState = useState(0);
  var convIdx = convIdxState[0]; var setConvIdx = convIdxState[1];
  var convVisState = useState(true);
  var convVisible = convVisState[0]; var setConvVisible = convVisState[1];

  useEffect(function() {
    var timer = setInterval(function() {
      setQuoteVisible(false);
      setTimeout(function() {
        setQuoteIdx(function() { return Math.floor(Math.random() * QUOTES.length); });
        setQuoteVisible(true);
      }, 600);
    }, 15000);
    return function() { clearInterval(timer); };
  }, []);

  useEffect(function() {
    var timer = setInterval(function() {
      setConvVisible(false);
      setTimeout(function() {
        setConvIdx(function(i) { return (i + 1) % CONVENTIONS_EN.length; });
        setConvVisible(true);
      }, 500);
    }, 8000);
    return function() { clearInterval(timer); };
  }, []);

  async function handleClaim(id) {
    if (!session) return;
    setLoadingQ(id);
    await new Promise(function(r) { setTimeout(r, 800); });
    setClaimedQ(function(c) { return [...c, id]; });
    setLoadingQ(null);
  }

  async function handleFeedback() {
    if (!session || !feedback.trim()) return;
    setFeedbackSent(true);
    setFeedback('');
  }

  var currentQuote = QUOTES[quoteIdx];
  var companyQuote = COMPANY_QUOTE_EN;
  var currentConv = CONVENTIONS_EN[convIdx];
  var availableQ = MOCK_Q_POOL.filter(function(p) { return !claimedQ.includes(p.id); });

  var LogoSVG = function(props) {
    var sz = props.size || 22;
    var col = props.color || SAGE;
    var animStyle = props.animated ? { strokeDasharray: 160, animation: 'waveRun 2s linear infinite' } : {};
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="13 13 86 86" width={sz} height={sz} style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'text-bottom', marginRight: 1 }}>
        <defs><clipPath id={'qc' + (props.id || '')}><circle cx="55" cy="55" r="32"/></clipPath></defs>
        <circle cx="55" cy="55" r="38" fill="none" stroke={col} strokeWidth="7" strokeLinecap="round"/>
        <line x1="81" y1="79" x2="98" y2="98" stroke={col} strokeWidth="7" strokeLinecap="round"/>
        <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
          fill="none" stroke={col} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          clipPath={'url(#qc' + (props.id || '') + ')'} style={animStyle}/>
      </svg>
    );
  };

  return (
    <div>
      {/* PILL NAV */}
      <nav style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 200, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(8,10,8,0.88)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '7px 14px 7px 10px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 0, textDecoration: 'none' }}>
          <LogoSVG size={11} animated={false} id="nav" />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, fontSize: '0.85rem', color: '#f0efeb', lineHeight: 1 }}>
            <span style={{ opacity: 0.3 }}>ueren</span>
            <span style={{ color: '#4a7c59' }}>c</span>
            <span style={{ color: '#4a7c59' }}>i</span>
            <span style={{ color: '#4a7c59' }}>a</span>
          </span>
        </Link>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
        {session ? (
          <Link href="/dashboard" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', background: SAGE, borderRadius: 100, padding: '5px 13px', textDecoration: 'none' }}>Dashboard</Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => signIn('google')} style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', background: SAGE, border: 'none', borderRadius: 100, padding: '5px 13px', cursor: 'pointer' }}>{t('nav.getstarted')}</button>
          </div>
        )}
      </nav>

      {/* 1. HERO */}
      <section style={{ minHeight: '100vh', background: '#070908', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', top: '5%', left: '15%', background: 'radial-gradient(circle, rgba(74,124,89,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bottom: '10%', right: '10%', background: 'radial-gradient(circle, rgba(74,124,89,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginRight: -8, marginBottom: 16 }}>
          <div style={{ display: 'inline-block', marginRight: -2 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" style={{ width: 'clamp(2.8rem, 8.5vw, 6.5rem)', height: 'clamp(2.8rem, 8.5vw, 6.5rem)', animation: 'shimmerFlash 8s ease 4.56s infinite' }}>
              <defs><clipPath id="qchero"><circle cx="55" cy="55" r="32"/></clipPath></defs>
              <circle cx="55" cy="55" r="38" fill="none" stroke={SAGE} strokeWidth="7" strokeLinecap="round"/>
              <line x1="81" y1="79" x2="98" y2="98" stroke={SAGE} strokeWidth="7" strokeLinecap="round"/>
              <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55" fill="none" stroke={SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qchero)" style={{ strokeDasharray: '203 9999', animation: 'waveRun 4s linear infinite' }}/>
            </svg>
          </div>
          <h1 style={{ margin: 0, padding: 0, lineHeight: 1 }}><LetterDrop /></h1>
        </div>
        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontWeight: 600, color: SAGE, marginBottom: 32 }}>Tech and more</p>
        <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 'clamp(0.82rem, 1.6vw, 1rem)', color: 'rgba(240,239,235,0.5)', lineHeight: 1.5, maxWidth: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <Typewriter text={companyQuote} />
        </div>
      </section>

      {/* 2. Q POOL */}
      <section style={{ background: '#0c0e0c', padding: '80px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(74,124,89,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <QSymbol size={22} color={SAGE} />
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#f0efeb', letterSpacing: -0.5, margin: 0 }}>Q Pool</h2>
          </div>
          
          <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
            {[{ label: t('home.qpool.available'), value: String(availableQ.length) }, { label: t('home.qpool.claimed'), value: '47' }, { label: t('home.qpool.donors'), value: '12' }].map(function(s) {
              return (
                <div key={s.label} style={{ flex: 1, minWidth: 100, background: 'rgba(74,124,89,0.06)', border: '1px solid rgba(74,124,89,0.12)', borderRadius: 12, padding: '14px 18px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: SAGE }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(240,239,235,0.35)', marginTop: 2 }}>{s.label}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {availableQ.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(240,239,235,0.3)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🌿</div>
                <p style={{ fontSize: '0.88rem' }}>{t('home.qpool.empty')}</p>
              </div>
            ) : availableQ.map(function(item) {
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.15s' }}
                  onMouseEnter={function(e) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,124,89,0.3)'; }}
                  onMouseLeave={function(e) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: item.type === 'permanent' ? 'rgba(74,124,89,0.12)' : 'rgba(245,158,11,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, flexShrink: 0 }}>
                    <QSymbol size={18} color={item.type === 'permanent' ? SAGE : '#b45309'} />
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: item.type === 'permanent' ? SAGE : '#b45309' }}>{item.amount}Q</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f0efeb' }}>{item.amount} Q</span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, background: item.type === 'permanent' ? 'rgba(74,124,89,0.15)' : 'rgba(245,158,11,0.1)', color: item.type === 'permanent' ? SAGE : '#b45309', padding: '1px 7px', borderRadius: 999 }}>
                        {item.type === 'permanent' ? t('home.qpool.permanent') : t('home.qpool.expires') + ' ' + item.expiresIn}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(240,239,235,0.3)' }}>
                      {item.donor ? t('home.qpool.by') + ' ' + item.donor : t('home.qpool.anon')}{item.claimed > 0 ? ' · ' + item.claimed + ' ' + t('home.qpool.people') : ''}
                    </div>
                  </div>
                  {session ? (
                    <button onClick={function() { handleClaim(item.id); }} disabled={!!loadingQ} style={{ padding: '7px 16px', borderRadius: 8, background: loadingQ === item.id ? 'rgba(74,124,89,0.2)' : SAGE, color: '#fff', border: 'none', cursor: loadingQ ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>
                      {loadingQ === item.id ? '...' : t('home.qpool.claim')}
                    </button>
                  ) : (
                    <Link href="/auth/login" style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,239,235,0.4)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>{t('home.qpool.login')}</Link>
                  )}
                </div>
              );
            })}
          </div>
          {session && (
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Link href="/wallet/gift?pool=true" style={{ fontSize: '0.82rem', color: SAGE, textDecoration: 'none', fontWeight: 500, opacity: 0.7 }}>{t('home.qpool.gift')}</Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. FREE TOOLS */}
      <section style={{ background: '#fafaf8', padding: '80px 0 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#bbb', marginBottom: 8 }}></p>
          
          
        </div>
        <div style={{ position: 'relative', overflow: 'hidden', marginBottom: 48 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, #fafaf8, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, #fafaf8, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', gap: 12, animation: 'scrollLeft 32s linear infinite', whiteSpace: 'nowrap' }}>
            {[...FREE_TOOLS, ...FREE_TOOLS, ...FREE_TOOLS].map(function(tool, i) {
              return (
                <Link key={i} href={tool.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 16px', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 100, fontSize: '0.8rem', color: '#555', flexShrink: 0, textDecoration: 'none', background: '#fff', transition: 'all 0.15s' }}
                  onMouseEnter={function(e) { (e.currentTarget as HTMLElement).style.borderColor = SAGE; (e.currentTarget as HTMLElement).style.color = SAGE; }}
                  onMouseLeave={function(e) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.07)'; (e.currentTarget as HTMLElement).style.color = '#555'; }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: SAGE, display: 'inline-block', opacity: 0.5 }} />{tool.name}
                </Link>
              );
            })}
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {FREE_TOOLS.map(function(tool) {
              return (
                <Link key={tool.name} href={tool.href} style={{ padding: '12px 16px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 10, textDecoration: 'none', fontSize: '0.82rem', color: '#333', fontWeight: 500, transition: 'all 0.15s', display: 'block' }}
                  onMouseEnter={function(e) { (e.currentTarget as HTMLElement).style.borderColor = SAGE; (e.currentTarget as HTMLElement).style.color = SAGE; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={function(e) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.06)'; (e.currentTarget as HTMLElement).style.color = '#333'; (e.currentTarget as HTMLElement).style.transform = ''; }}>
                  {tool.name}
                </Link>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link href="/tools" style={{ fontSize: '0.82rem', color: SAGE, textDecoration: 'none', fontWeight: 600, opacity: 0.8 }}>Xem tat ca tools →</Link>
          </div>
        </div>
      </section>

      {/* 4. PAID TOOLS */}
      <section style={{ background: '#0c0e0c', padding: '80px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 60%, rgba(74,124,89,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          
          
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {PAID_TOOLS.map(function(tool) {
              return (
                <Link key={tool.name} href={tool.href} style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, textDecoration: 'none', transition: 'all 0.18s', display: 'block' }}
                  onMouseEnter={function(e) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,124,89,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(74,124,89,0.05)'; }}
                  onMouseLeave={function(e) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{tool.icon}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f0efeb', marginBottom: 4 }}>{tool.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(240,239,235,0.35)', lineHeight: 1.4 }}>{tool.desc}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. APPS */}
      <section style={{ background: '#fafaf8', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '2rem', fontWeight: 400, color: '#4a7c59', margin: 0, letterSpacing: -0.5 }}>Nope</h3>
              <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.5, margin: 0 }}>{t('home.nope.desc')}</p>
              <Link href="/dashboard/nope" style={{ display: 'inline-block', padding: '9px 20px', background: '#4a7c59', color: '#fff', borderRadius: 100, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, alignSelf: 'flex-start' }}>Use now →</Link>
            </div>
            <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '2rem', fontWeight: 400, color: '#f59e0b', margin: 0, letterSpacing: -0.5 }}>Cùi Bắp</h3>
              <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.5, margin: 0 }}>{t('home.cuibap.desc')}</p>
              <Link href="/dashboard/cui-bap" style={{ display: 'inline-block', padding: '9px 20px', background: '#f59e0b', color: '#fff', borderRadius: 100, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, alignSelf: 'flex-start' }}>Use now →</Link>
            </div>
            <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '2rem', fontWeight: 400, color: '#8b5cf6', margin: 0, letterSpacing: -0.5 }}>LàNo</h3>
              <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.5, margin: 0 }}>{t('home.lano.desc')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Link href="/dashboard/lano" style={{ display: 'inline-block', padding: '9px 20px', background: '#8b5cf6', color: '#fff', borderRadius: 100, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>Use now →</Link>
                <Link href="/dashboard/lano/setup" style={{ display: 'inline-block', padding: '9px 20px', background: 'rgba(139,92,246,0.08)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 100, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>{t('home.lano.btn2')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. QUOTES */}
      <section style={{ background: '#070908', padding: '90px 24px', minHeight: 340, display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(74,124,89,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', width: '100%', position: 'relative' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(240,239,235,0.2)', marginBottom: 32 }}>From Read</p>
          <div style={{ opacity: quoteVisible ? 1 : 0, transition: 'opacity 0.6s ease', minHeight: 140 }}>
            <blockquote style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 'clamp(1.1rem, 2.8vw, 1.7rem)', fontWeight: 400, fontStyle: 'italic', color: 'rgba(240,239,235,0.75)', lineHeight: 1.65, marginBottom: 18 }}>
              "{currentQuote.text}"
            </blockquote>
            {currentQuote.author && (
              <p style={{ fontSize: '0.8rem', color: SAGE, fontWeight: 600 }}>{currentQuote.author}</p>
            )}
          </div>
        </div>
      </section>

      {/* 7. INTERNATIONAL CONVENTIONS */}
      <section style={{ background: '#fafaf8', padding: '80px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#bbb', marginBottom: 8 }}>{t('home.conventions.label')}</p>
          <h2 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 400, letterSpacing: -0.5, color: '#111', margin: '0 0 40px' }}>{t('home.conventions.title')}</h2>
          <div style={{ opacity: convVisible ? 1 : 0, transition: 'opacity 0.5s ease', minHeight: 160 }}>
            <div style={{ borderLeft: '3px solid ' + SAGE, paddingLeft: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: SAGE, background: 'rgba(74,124,89,0.08)', padding: '2px 10px', borderRadius: 999 }}>{currentConv.year}</span>
              </div>
              <h3 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontWeight: 400, color: '#111', margin: '0 0 12px', lineHeight: 1.4 }}>{currentConv.name}</h3>
              <p style={{ fontSize: '0.88rem', color: '#666', lineHeight: 1.7, margin: 0 }}>{currentConv.summary}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 28 }}>
            {CONVENTIONS_EN.map(function(_, i) {
              return <div key={i} style={{ width: convIdx === i ? 18 : 5, height: 4, borderRadius: 2, background: convIdx === i ? SAGE : '#ddd', transition: 'all 0.4s ease' }} />;
            })}
          </div>
        </div>
      </section>

      {/* 8. MENTAL MODELS */}
      <section style={{ background: '#0c0e0c', padding: '80px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 30%, rgba(74,124,89,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {MENTAL_MODELS.map(function(model) {
              return (
                <div key={model.title} style={{ padding: '24px 22px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, transition: 'all 0.18s' }}
                  onMouseEnter={function(e) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,124,89,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(74,124,89,0.04)'; }}
                  onMouseLeave={function(e) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{model.icon}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: SAGE, marginBottom: 6 }}>{model.sub}</div>
                  <h3 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '1.15rem', fontWeight: 400, color: '#f0efeb', margin: '0 0 10px', lineHeight: 1.3 }}>{model.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(240,239,235,0.35)', lineHeight: 1.6, margin: 0 }}>{model.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. SACH LA */}
      <section style={{ background: '#fafaf8', padding: '80px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#bbb', marginBottom: 16 }}>{t('home.book.label')}</p>
          <h2 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, letterSpacing: -1.5, color: '#111', margin: '0 0 18px', lineHeight: 1.1 }}>
            Book
          </h2>
          
          <BookNotifyForm />
        </div>
      </section>

      {/* 10. FEEDBACK */}
      <section style={{ background: '#070908', padding: '80px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center bottom, rgba(74,124,89,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          
          <h2 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 400, letterSpacing: -0.5, color: '#f0efeb', margin: '0 0 10px' }}>{t('home.feedback.title')}</h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(240,239,235,0.3)', marginBottom: 32 }}>{t('home.feedback.sub')}</p>
          {feedbackSent ? (
            <div style={{ padding: '20px', background: 'rgba(74,124,89,0.1)', border: '1px solid rgba(74,124,89,0.2)', borderRadius: 12, color: SAGE, fontSize: '0.9rem' }}>
              {t('home.feedback.sent')}.
            </div>
          ) : session ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <textarea value={feedback} onChange={function(e) { setFeedback(e.target.value); }} placeholder={t('home.feedback.placeholder')} style={{ width: '100%', minHeight: 120, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f0efeb', fontSize: '0.88rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={handleFeedback} disabled={!feedback.trim()} style={{ padding: '12px 28px', background: feedback.trim() ? SAGE : 'rgba(74,124,89,0.2)', color: '#fff', border: 'none', borderRadius: 100, cursor: feedback.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.15s', alignSelf: 'center' }}>
                {t('home.feedback.btn')}
              </button>
            </div>
          ) : (
            <Link href="/auth/login" style={{ display: 'inline-block', padding: '11px 28px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,239,235,0.6)', borderRadius: 100, textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>{t('home.feedback.login')}</Link>
          )}
        </div>
      </section>

      <style>{`
        @keyframes letterSlide { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
        @keyframes shimmerStrong { 0%{filter:brightness(1);} 8%{filter:brightness(2);} 16%{filter:brightness(5) drop-shadow(0 0 30px rgba(255,255,255,1)) drop-shadow(0 0 60px rgba(200,255,200,1));} 30%{filter:brightness(2);} 45%{filter:brightness(1);} 100%{filter:brightness(1);} }
        @keyframes shimmerLogo { 0%,85%,100%{filter:brightness(1);} 90%{filter:brightness(1.8) drop-shadow(0 0 6px rgba(74,124,89,0.8));} }
        @keyframes shimmerHero { 0%{filter:brightness(1);} 15%{filter:brightness(2);} 35%{filter:brightness(6) drop-shadow(0 0 40px rgba(74,124,89,1)) drop-shadow(0 0 80px rgba(150,255,150,1));} 65%{filter:brightness(2.5);} 100%{filter:brightness(1);} }
        @keyframes shimmerSync { 0%{filter:brightness(1);} 35%{filter:brightness(1.5);} 43%{filter:brightness(5) drop-shadow(0 0 30px rgba(255,255,255,1)) drop-shadow(0 0 60px rgba(200,255,200,1));} 55%{filter:brightness(2);} 70%{filter:brightness(1);} 100%{filter:brightness(1);} }
        @keyframes waveRun { 0%{stroke-dashoffset:160;} 100%{stroke-dashoffset:-160;} }
        @keyframes scrollLeft { 0%{transform:translateX(0);} 100%{transform:translateX(-33.33%);} }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @keyframes blurReveal { 0%{opacity:0;filter:blur(16px);} 60%{opacity:1;filter:blur(4px);} 100%{opacity:1;filter:blur(0px);} }
        @keyframes textReveal { 0%{opacity:0;} 20%{opacity:0.2;} 100%{opacity:1;} }
        @keyframes lightSweep { 0%{background-position:200% 0;opacity:1;} 80%{background-position:-20% 0;opacity:1;} 100%{background-position:-40% 0;opacity:0;} }
        @keyframes shimmerFlash { 0%{filter:brightness(1);} 10%{filter:brightness(1.5);} 18%{filter:brightness(5) drop-shadow(0 0 40px rgba(255,255,255,1)) drop-shadow(0 0 70px rgba(100,255,150,1));} 30%{filter:brightness(1.5);} 45%{filter:brightness(1);} 100%{filter:brightness(1);} }
        @keyframes heartSlide { 0%{opacity:0;transform:translateX(90px);} 100%{opacity:1;transform:translateX(0px);} }
        @keyframes heartLean { 0%{transform:translateX(0) rotate(0deg);} 100%{transform:translateX(0) rotate(-22deg);} }
        @keyframes heartEnter { 0%{opacity:0;transform:translateX(60px) rotate(0deg);} 42%{opacity:1;transform:translateX(0px) rotate(0deg);} 100%{opacity:1;transform:translateX(-6px) rotate(-28deg);} }
      `}</style>
    </div>
  );
}
