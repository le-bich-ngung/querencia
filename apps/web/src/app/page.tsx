'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useI18n, LOCALES } from '../lib/i18n';
import { QUOTES } from '../lib/quotes';

var SAGE = '#4a7c59';

var COMPANY_QUOTES = {
  en: "It's not that the world is too dark but that we've grown used to not lighting ourselves up.",
  vi: "Không phải thế giới quá tối, mà là chúng ta đã quen không tự thắp sáng chính mình.",
  ja: "世界が暗すぎるのではなく、私たちが自分自身を照らすことに慑れていないだけだ。",
  es: "No es que el mundo sea demasiado oscuro, sino que nos hemos acostumbrado a no iluminarnos a nosotros mismos.",
};

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
  { name: 'OCR', desc: 'Nhan dang chu tu anh', icon: '🔍', href: '/tools/ocr' },
  { name: 'Screenshot Translator', desc: 'Dich noi dung trong anh', icon: '🌐', href: '/tools/screenshot-translator' },
  { name: 'Smart Table Extractor', desc: 'Trich bang tu anh & PDF', icon: '📊', href: '/tools/smart-table-extractor' },
  { name: 'Image Editor', desc: 'Chinh sua anh nang cao', icon: '🖼️', href: '/tools/image-editor' },
  { name: 'Collage', desc: 'Ghep anh nghe thuat', icon: '🎨', href: '/tools/collage' },
  { name: 'Add Watermark', desc: 'Them watermark vao anh', icon: '💧', href: '/tools/add-watermark' },
  { name: 'Convert Image', desc: 'Chuyen doi dinh dang anh', icon: '🔄', href: '/tools/convert-image' },
  { name: 'Compress Image', desc: 'Nen anh chat luong cao', icon: '📦', href: '/tools/compress-image' },
  { name: 'PDF Tool', desc: 'Xu ly PDF toan dien', icon: '📄', href: '/tools/pdf-tool' },
  { name: 'PDF to Word', desc: 'Chuyen PDF sang Word', icon: '📝', href: '/tools/pdf-to-word' },
  { name: 'PDF Reader', desc: 'Doc & annotate PDF', icon: '📖', href: '/tools/pdf-reader' },
  { name: 'CV Builder', desc: 'Tao CV chuyen nghiep', icon: '💼', href: '/tools/cv-builder' },
  { name: 'Audio Recorder', desc: 'Ghi am & luu tru', icon: '🎙️', href: '/tools/audio-recorder' },
  { name: 'Screen Recorder', desc: 'Quay man hinh', icon: '🎬', href: '/tools/screen-recorder' },
  { name: 'File Vault', desc: 'Luu tru file bao mat', icon: '🔒', href: '/tools/file-vault' },
  { name: 'Diary', desc: 'Nhat ky ca nhan', icon: '📓', href: '/tools/diary' },
  { name: 'Flashcards', desc: 'Hoc tu vung thong minh', icon: '🃏', href: '/tools/flashcards' },
];

var INTERNATIONAL_CONVENTIONS = [
  { name: 'Cong uoc Lien Hop Quoc ve Luat Bien (UNCLOS)', year: 1982, summary: 'Quy dinh quyen va nghia vu cua cac quoc gia doi voi viec su dung bien, bao ve moi truong bien va quan ly tai nguyen thien nhien.' },
  { name: 'Cong uoc ve Quyen Tre em (CRC)', year: 1989, summary: 'Bao ve quyen dan su, chinh tri, kinh te, xa hoi va van hoa cua tre em tren toan the gioi.' },
  { name: 'Cong uoc Chong Tra tan (CAT)', year: 1984, summary: 'Ngan chan tra tan va cac hinh thuc doi xu tan bao, vo nhan dao hoac ha thap pham gia con nguoi.' },
  { name: 'Cong uoc Xoa bo Phan biet Doi xu voi Phu nu (CEDAW)', year: 1979, summary: 'Xoa bo moi hinh thuc phan biet doi xu voi phu nu va dam bao quyen binh dang trong moi linh vuc.' },
  { name: 'Hiep uoc Paris ve Bien doi Khi hau', year: 2015, summary: 'Giam phat thai khi nha kinh va han che muc tang nhiet do toan cau xuong duoi 2 do C so voi thoi ky tien cong nghiep.' },
];

var MENTAL_MODELS = [
  { title: 'First Principles Thinking', sub: 'Tu duy tu nguyen ly goc', desc: 'Pha vo van de thanh cac su that co ban nhat, sau do xay dung lai tu dau. Cach Elon Musk thiet ke ten lua re hon 10 lan.', icon: '⚗️' },
  { title: 'Second-Order Thinking', sub: 'Tu duy hau qua bac hai', desc: 'Khong chi hoi "dieu nay gay ra gi?" ma con "dieu do gay ra gi tiep theo?" Nhin xa hon hau qua truc tiep.', icon: '♟️' },
  { title: 'Mental Models', sub: 'Mo hinh tu duy cua thien tai', desc: 'Tap hop cac khung tu duy tu nhieu linh vuc - vat ly, tam ly hoc, kinh te - de giai quyet van de phuc tap.', icon: '🧠' },
  { title: 'Dangerous Questions', sub: 'Nghe thuat dat cau hoi thay doi the gioi', desc: 'Cau hoi dung quan trong hon cau tra loi dung. Nhung cau hoi "ngoc ngech" nhat thuong dan den dot pha lon nhat.', icon: '💡' },
];

var MOCK_Q_POOL = [
  { id: '1', amount: 2, type: 'expiring', expiresIn: '1g 42p', donor: null, claimed: 0 },
  { id: '2', amount: 1, type: 'expiring', expiresIn: '2g 15p', donor: 'An N.', claimed: 3 },
  { id: '3', amount: 1, type: 'permanent', expiresIn: null, donor: null, claimed: 0 },
  { id: '4', amount: 2, type: 'expiring', expiresIn: '0g 28p', donor: 'Minh T.', claimed: 1 },
];

function Typewriter({ text }) {
  var state = useState('');
  var displayed = state[0]; var setDisplayed = state[1];
  var doneState = useState(false);
  var done = doneState[0]; var setDone = doneState[1];
  useEffect(function() {
    setDisplayed(''); setDone(false);
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
  var key = cycle[0]; var setKey = cycle[1];
  useEffect(function() {
    var timer = setInterval(function() { setKey(function(k) { return k + 1; }); }, 5000);
    return function() { clearInterval(timer); };
  }, []);
  // Last letter 'a' is index 7, delay = 7 * 0.18 = 1.26s
  // Heart slides in after 'a' finishes: delay = 1.26 + 0.4 = 1.66s
  // Shimmer fires after heart lands: delay = 1.66 + 0.5 = 2.16s + 0.8s total anim = ~3s
  var heartDelay = 7 * 0.18 + 0.4;
  var shimmerDelay = heartDelay + 0.5;
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
            animation: 'letterSlide 1.2s cubic-bezier(0.34,1,0.64,1) ' + fallDelay + 's both, shimmerStrong 2s ease ' + shimmerDelay + 's 1',
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
        animation: 'heartSlideIn 0.8s ease-out ' + heartDelay + 's both, shimmerStrong 2s ease ' + shimmerDelay + 's 1',
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
      Da dang ky! Chung minh se bao ban khi sach ra mat.
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
      <input
        type="email"
        value={email}
        onChange={function(e) { setEmail(e.target.value); }}
        placeholder="Email cua ban"
        style={{ padding: '11px 18px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 100, fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit', minWidth: 240, background: '#fff' }}
      />
      <button onClick={handleSubmit} style={{ padding: '11px 24px', background: SAGE, color: '#fff', border: 'none', borderRadius: 100, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 600 }}>
        Thong bao cho toi
      </button>
    </div>
  );
}

export default function HomePage() {
  var session = useSession().data;
  var i18n = useI18n();
  var locale = i18n.locale;
  var setLocale = i18n.setLocale;
  var t = i18n.t;

  var langState = useState(false);
  var langOpen = langState[0]; var setLangOpen = langState[1];
  var langRef = useRef(null);

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
        setConvIdx(function(i) { return (i + 1) % INTERNATIONAL_CONVENTIONS.length; });
        setConvVisible(true);
      }, 500);
    }, 8000);
    return function() { clearInterval(timer); };
  }, []);

  useEffect(function() {
    var h = function(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', h);
    return function() { document.removeEventListener('mousedown', h); };
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
  var companyQuote = COMPANY_QUOTES[locale] || COMPANY_QUOTES.en;
  var currentConv = INTERNATIONAL_CONVENTIONS[convIdx];
  var availableQ = MOCK_Q_POOL.filter(function(p) { return !claimedQ.includes(p.id); });

  var LogoSVG = function(props) {
    var sz = props.size || 22;
    var col = props.color || SAGE;
    var animStyle = props.animated ? { strokeDasharray: 160, animation: 'waveRun 2s linear infinite' } : {};
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="13 13 86 86" width={sz} height={sz} style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'text-bottom', marginRight: 3 }}>
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
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, fontSize: '0.85rem', letterSpacing: -0.3, color: '#f0efeb', lineHeight: 1 }}>
            <span style={{ opacity: 0.3 }}>ueren</span>
            <span style={{ color: '#4a7c59' }}>c</span>
            <span style={{ color: '#4a7c59' }}>i</span>
            <span style={{ color: '#4a7c59' }}>a</span>
          </span>
        </Link>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
        <div ref={langRef} style={{ position: 'relative' }}>
          <button onClick={function() { setLangOpen(function(o) { return !o; }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'rgba(240,239,235,0.55)', display: 'flex', alignItems: 'center', gap: 3, padding: '2px 4px' }}>
            {(LOCALES.find(function(l) { return l.code === locale; }) || {}).flag}
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

      {/* 1. HERO */}
      <section style={{ minHeight: '100vh', background: '#070908', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', top: '5%', left: '15%', background: 'radial-gradient(circle, rgba(74,124,89,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bottom: '10%', right: '10%', background: 'radial-gradient(circle, rgba(74,124,89,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginRight: -8, marginBottom: 16 }}>
          <div style={{ display: 'inline-block', marginRight: -2, animation: 'shimmerHero 1.8s ease 2.16s 1, shimmerLogo 5s ease 6s infinite' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" style={{ width: 'clamp(2.8rem, 8.5vw, 6.5rem)', height: 'clamp(2.8rem, 8.5vw, 6.5rem)' }}>
              <defs><clipPath id="qchero"><circle cx="55" cy="55" r="32"/></clipPath></defs>
              <circle cx="55" cy="55" r="38" fill="none" stroke={SAGE} strokeWidth="7" strokeLinecap="round"/>
              <line x1="81" y1="79" x2="98" y2="98" stroke={SAGE} strokeWidth="7" strokeLinecap="round"/>
              <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55" fill="none" stroke={SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qchero)" style={{ strokeDasharray: '203 9999', animation: 'waveRun 4s linear infinite' }}/>
            </svg>
          </div>
          <h1 style={{ margin: 0, padding: 0, lineHeight: 1 }}><LetterDrop /></h1>
        </div>
        <p style={{ fontSize: 'clamp(0.75rem, 1.8vw, 1rem)', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: SAGE, marginBottom: 48 }}>Tech and more</p>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(0.95rem, 2.2vw, 1.25rem)', color: 'rgba(240,239,235,0.38)', lineHeight: 1.75, maxWidth: 580, fontStyle: 'italic', minHeight: 70 }}>
          <Typewriter text={'"' + companyQuote + '"'} />
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
          <p style={{ fontSize: '0.88rem', color: 'rgba(240,239,235,0.4)', marginBottom: 36, lineHeight: 1.6 }}>Q duoc tang treo boi cong dong. Ai can vao nhan. Q expiring het han sau 24h.</p>
          <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
            {[{ label: 'Q dang treo', value: String(availableQ.length) }, { label: 'Da nhan hom nay', value: '47' }, { label: 'Nguoi tang', value: '12' }].map(function(s) {
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
                <p style={{ fontSize: '0.88rem' }}>Pool dang trong. Kiem tra lai sau!</p>
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
                        {item.type === 'permanent' ? 'khong het han' : 'het han trong ' + item.expiresIn}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(240,239,235,0.3)' }}>
                      {item.donor ? 'Tang boi ' + item.donor : 'Tang an danh'}{item.claimed > 0 ? ' · ' + item.claimed + ' nguoi da nhan' : ''}
                    </div>
                  </div>
                  {session ? (
                    <button onClick={function() { handleClaim(item.id); }} disabled={!!loadingQ} style={{ padding: '7px 16px', borderRadius: 8, background: loadingQ === item.id ? 'rgba(74,124,89,0.2)' : SAGE, color: '#fff', border: 'none', cursor: loadingQ ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>
                      {loadingQ === item.id ? '...' : 'Nhan'}
                    </button>
                  ) : (
                    <Link href="/auth/login" style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,239,235,0.4)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>Dang nhap</Link>
                  )}
                </div>
              );
            })}
          </div>
          {session && (
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Link href="/wallet/gift?pool=true" style={{ fontSize: '0.82rem', color: SAGE, textDecoration: 'none', fontWeight: 500, opacity: 0.7 }}>Co Q sap het han? Tang treo vao Pool →</Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. FREE TOOLS */}
      <section style={{ background: '#fafaf8', padding: '80px 0 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#bbb', marginBottom: 8 }}>Tools mien phi</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 400, letterSpacing: -1, color: '#111', margin: '0 0 10px' }}>Dung thoai mai, khong gioi han.</h2>
          <p style={{ fontSize: '0.88rem', color: '#888', marginBottom: 40 }}>Khong can tai khoan. Khong quang cao. Khong thu thap du lieu.</p>
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
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(74,124,89,0.6)', marginBottom: 8 }}>Tools co phi · Nguon thu duy nhat</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 400, letterSpacing: -1, color: '#f0efeb', margin: '0 0 10px' }}>Cong cu nang cao, dung gia tri.</h2>
          <p style={{ fontSize: '0.88rem', color: 'rgba(240,239,235,0.35)', marginBottom: 40 }}>Dung Q de tra phi. Khong can dang ky goi. Tra khi dung.</p>
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
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#bbb', marginBottom: 8 }}>Ung dung</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 400, letterSpacing: -1, color: '#111', margin: '0 0 40px' }}>Ba ung dung. Mot tai khoan.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: '2.5rem' }}>🌿</div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#4a7c59', margin: 0, letterSpacing: -0.5 }}>Nope</h3>
              <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.5, margin: 0 }}>Cau chuyen that tu nguoi that. Khong quang cao, khong thuat toan.</p>
              <Link href="/dashboard/nope" style={{ display: 'inline-block', padding: '9px 20px', background: '#4a7c59', color: '#fff', borderRadius: 100, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, alignSelf: 'flex-start' }}>Dung ngay →</Link>
            </div>
            <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: '2.5rem' }}>🌽</div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#f59e0b', margin: 0, letterSpacing: -0.5 }}>Cui Bap</h3>
              <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.5, margin: 0 }}>Nhan tin rieng tu. Khong quang cao. Khong ban du lieu.</p>
              <Link href="/dashboard/cui-bap" style={{ display: 'inline-block', padding: '9px 20px', background: '#f59e0b', color: '#fff', borderRadius: 100, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, alignSelf: 'flex-start' }}>Dung ngay →</Link>
            </div>
            <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: '2.5rem' }}>🎧</div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#8b5cf6', margin: 0, letterSpacing: -0.5 }}>LaNo</h3>
              <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.5, margin: 0 }}>AI lang nghe ban. Khong phan xet. Khong ghi nho.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Link href="/dashboard/lano" style={{ display: 'inline-block', padding: '9px 20px', background: '#8b5cf6', color: '#fff', borderRadius: 100, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>Dung ngay →</Link>
                <Link href="/dashboard/lano/setup" style={{ display: 'inline-block', padding: '9px 20px', background: 'rgba(139,92,246,0.08)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 100, textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>Chon cach tro chuyen</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. QUOTES */}
      <section style={{ background: '#070908', padding: '90px 24px', minHeight: 340, display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(74,124,89,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', width: '100%', position: 'relative' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,239,235,0.2)', marginBottom: 32 }}>From Read</p>
          <div style={{ opacity: quoteVisible ? 1 : 0, transition: 'opacity 0.6s ease', minHeight: 140 }}>
            <blockquote style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.1rem, 2.8vw, 1.7rem)', fontWeight: 400, fontStyle: 'italic', color: 'rgba(240,239,235,0.75)', lineHeight: 1.65, marginBottom: 18 }}>
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
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#bbb', marginBottom: 8 }}>Cong uoc quoc te da phuong</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 400, letterSpacing: -0.5, color: '#111', margin: '0 0 40px' }}>Nhung van ban dinh hinh the gioi.</h2>
          <div style={{ opacity: convVisible ? 1 : 0, transition: 'opacity 0.5s ease', minHeight: 160 }}>
            <div style={{ borderLeft: '3px solid ' + SAGE, paddingLeft: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: SAGE, background: 'rgba(74,124,89,0.08)', padding: '2px 10px', borderRadius: 999 }}>{currentConv.year}</span>
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontWeight: 400, color: '#111', margin: '0 0 12px', lineHeight: 1.4 }}>{currentConv.name}</h3>
              <p style={{ fontSize: '0.88rem', color: '#666', lineHeight: 1.7, margin: 0 }}>{currentConv.summary}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 28 }}>
            {INTERNATIONAL_CONVENTIONS.map(function(_, i) {
              return <div key={i} style={{ width: convIdx === i ? 18 : 5, height: 4, borderRadius: 2, background: convIdx === i ? SAGE : '#ddd', transition: 'all 0.4s ease' }} />;
            })}
          </div>
        </div>
      </section>

      {/* 8. MENTAL MODELS */}
      <section style={{ background: '#0c0e0c', padding: '80px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 30%, rgba(74,124,89,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(74,124,89,0.5)', marginBottom: 8 }}>Tu duy</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 400, letterSpacing: -1, color: '#f0efeb', margin: '0 0 40px' }}>Bon framework thay doi cach ban nghi.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {MENTAL_MODELS.map(function(model) {
              return (
                <div key={model.title} style={{ padding: '24px 22px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, transition: 'all 0.18s' }}
                  onMouseEnter={function(e) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(74,124,89,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(74,124,89,0.04)'; }}
                  onMouseLeave={function(e) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{model.icon}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: SAGE, marginBottom: 6 }}>{model.sub}</div>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: 400, color: '#f0efeb', margin: '0 0 10px', lineHeight: 1.3 }}>{model.title}</h3>
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
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#bbb', marginBottom: 16 }}>Sap ra mat</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, letterSpacing: -1.5, color: '#111', margin: '0 0 18px', lineHeight: 1.1 }}>
            Sach <span style={{ color: SAGE, fontStyle: 'italic' }}>La.</span>
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#777', lineHeight: 1.7, marginBottom: 36 }}>
            Mot cuon sach dang duoc viet. Ve viec la chinh minh — khong hon, khong kem. Dang ky de nhan thong bao khi sach ra mat.
          </p>
          <BookNotifyForm />
        </div>
      </section>

      {/* 10. FEEDBACK */}
      <section style={{ background: '#070908', padding: '80px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center bottom, rgba(74,124,89,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(74,124,89,0.5)', marginBottom: 12 }}>Noi voi chung minh</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 400, letterSpacing: -0.5, color: '#f0efeb', margin: '0 0 10px' }}>Ban muon Querencia the nao?</h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(240,239,235,0.3)', marginBottom: 32 }}>Feedback cua ban dinh hinh Querencia. Can dang nhap de gui.</p>
          {feedbackSent ? (
            <div style={{ padding: '20px', background: 'rgba(74,124,89,0.1)', border: '1px solid rgba(74,124,89,0.2)', borderRadius: 12, color: SAGE, fontSize: '0.9rem' }}>
              Cam on ban! Chung minh da nhan duoc feedback.
            </div>
          ) : session ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <textarea value={feedback} onChange={function(e) { setFeedback(e.target.value); }} placeholder="Chia se y kien cua ban ve Querencia..." style={{ width: '100%', minHeight: 120, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f0efeb', fontSize: '0.88rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={handleFeedback} disabled={!feedback.trim()} style={{ padding: '12px 28px', background: feedback.trim() ? SAGE : 'rgba(74,124,89,0.2)', color: '#fff', border: 'none', borderRadius: 100, cursor: feedback.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.15s', alignSelf: 'center' }}>
                Gui feedback
              </button>
            </div>
          ) : (
            <Link href="/auth/login" style={{ display: 'inline-block', padding: '11px 28px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,239,235,0.6)', borderRadius: 100, textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>Dang nhap de gui feedback</Link>
          )}
        </div>
      </section>

      <style>{`
        @keyframes letterSlide { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
        @keyframes shimmerStrong { 0%{filter:brightness(1);} 20%{filter:brightness(1.5);} 40%{filter:brightness(5) drop-shadow(0 0 30px rgba(255,255,255,1)) drop-shadow(0 0 60px rgba(200,255,200,1));} 70%{filter:brightness(2);} 100%{filter:brightness(1);} }
        @keyframes shimmerLogo { 0%,85%,100%{filter:brightness(1);} 90%{filter:brightness(1.8) drop-shadow(0 0 6px rgba(74,124,89,0.8));} }
        @keyframes shimmerHero { 0%{filter:brightness(1);} 15%{filter:brightness(2);} 35%{filter:brightness(6) drop-shadow(0 0 40px rgba(74,124,89,1)) drop-shadow(0 0 80px rgba(150,255,150,1));} 65%{filter:brightness(2.5);} 100%{filter:brightness(1);} }
        @keyframes waveRun { 0%{stroke-dashoffset:160;} 100%{stroke-dashoffset:-160;} }
        @keyframes scrollLeft { 0%{transform:translateX(0);} 100%{transform:translateX(-33.33%);} }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @keyframes heartSlideIn { 0%{opacity:0;transform:translateX(70px) rotate(0deg);} 60%{opacity:1;transform:translateX(-6px) rotate(-5deg);} 75%{transform:translateX(2px) rotate(-18deg);} 100%{opacity:1;transform:translateX(0px) rotate(-20deg);} }
      `}</style>
    </div>
  );
}
