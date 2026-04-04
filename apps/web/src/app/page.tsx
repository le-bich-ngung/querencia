'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type Theme = 'mixed' | 'light' | 'dark';

function AnimatedLogo({ size = 36, color = '#4a7c59' }: { size?: number; color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="14 14 88 88" width={size} height={size}>
      <style>{`
        @keyframes waveAnim {
          0%   { stroke-dashoffset: 160; }
          100% { stroke-dashoffset: -160; }
        }
        .qwave { stroke-dasharray: 160; animation: waveAnim 2s linear infinite; }
      `}</style>
      <defs><clipPath id="qClipMain"><circle cx="55" cy="55" r="32"/></clipPath></defs>
      <circle cx="55" cy="55" r="38" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      <line x1="81" y1="79" x2="98" y2="98" stroke={color} strokeWidth="7" strokeLinecap="round"/>
      <polyline className="qwave" points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55"
        fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qClipMain)"/>
    </svg>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>{children}</div>
  );
}

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const { ref, visible } = useReveal();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let n = 0; const step = to / 50;
    const t = setInterval(() => { n += step; if (n >= to) { setVal(to); clearInterval(t); } else setVal(Math.floor(n)); }, 20);
    return () => clearInterval(t);
  }, [visible, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function HomePage() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<Theme>('mixed');
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const words = ['question.', 'connect.', 'be heard.', 'explore.'];

  useEffect(() => {
    const t = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % words.length); setWordVisible(true); }, 400);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  const S = (dark: boolean) => {
    const d = theme === 'mixed' ? dark : theme === 'dark';
    return {
      bg:     d ? '#0c0e0c' : '#fafaf8',
      bg2:    d ? '#111814' : '#f0f0ec',
      text:   d ? '#f0efeb' : '#111110',
      text2:  d ? 'rgba(240,239,235,0.5)' : '#6b7280',
      border: d ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
      card:   d ? 'rgba(255,255,255,0.04)' : '#ffffff',
    };
  };

  const sage = '#4a7c59';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        @keyframes orb { 0%,100% { transform:translate(0,0); } 50% { transform:translate(20px,-15px); } }
        @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .btn-p {
          display:inline-flex; align-items:center; gap:8px;
          padding:13px 28px; background:#4a7c59; color:#fff;
          border-radius:100px; text-decoration:none; font-weight:600;
          font-size:0.92rem; transition:all 0.2s; border:none; cursor:pointer;
          font-family:'DM Sans',sans-serif; letter-spacing:-0.1px;
        }
        .btn-p:hover { background:#3d6b4a; transform:translateY(-2px); box-shadow:0 8px 24px rgba(74,124,89,0.35); }
        .btn-g {
          display:inline-flex; align-items:center;
          padding:12px 24px; background:transparent;
          border-radius:100px; text-decoration:none; font-weight:500;
          font-size:0.88rem; transition:all 0.2s; cursor:pointer;
          font-family:'DM Sans',sans-serif;
        }
        .ch { transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1); cursor:pointer; }
        .ch:hover { transform:translateY(-4px) scale(1.015); }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:rgba(74,124,89,0.25); border-radius:3px; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200,
        height:58, padding:'0 28px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'rgba(8,10,8,0.75)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.05)',
      }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:4, textDecoration:'none' }}>
          <AnimatedLogo size={22} color={sage} />
          <span style={{ fontWeight:700, fontSize:'0.95rem', color:'#f0efeb', letterSpacing:-0.3 }}>
            <span style={{ opacity:0.5 }}>ueren</span><span style={{ color:sage }}>cia</span>
          </span>
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ display:'flex', gap:2, background:'rgba(255,255,255,0.05)', borderRadius:100, padding:3 }}>
            {(['mixed','light','dark'] as Theme[]).map(t => (
              <button key={t} onClick={() => setTheme(t)} style={{
                padding:'4px 11px', borderRadius:100, border:'none',
                background: theme===t ? 'rgba(74,124,89,0.85)' : 'transparent',
                color: theme===t ? '#fff' : 'rgba(240,239,235,0.4)',
                fontSize:'0.68rem', fontWeight:600, cursor:'pointer',
                transition:'all 0.2s', fontFamily:'DM Sans,sans-serif',
              }}>{t==='mixed'?'✦':t==='light'?'☀':'◐'}</button>
            ))}
          </div>
          <Link href="/pricing" style={{ color:'rgba(240,239,235,0.5)', textDecoration:'none', fontSize:'0.82rem', padding:'0 8px' }}>Pricing</Link>
          {session ? (
            <Link href="/dashboard/nope" className="btn-p" style={{ padding:'7px 16px', fontSize:'0.8rem' }}>Dashboard</Link>
          ) : (
            <>
              <Link href="/auth/login" style={{ color:'rgba(240,239,235,0.6)', textDecoration:'none', fontSize:'0.82rem', padding:'0 10px' }}>Sign in</Link>
              <Link href="/auth/register" className="btn-p" style={{ padding:'7px 16px', fontSize:'0.8rem' }}>Get started</Link>
            </>
          )}
        </div>
      </nav>

      {/* 1. HERO */}
      <section style={{
        minHeight:'100vh', background:'#070908', position:'relative',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'120px 24px 80px', overflow:'hidden', textAlign:'center',
      }}>
        <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%', top:'5%', left:'10%', background:'radial-gradient(circle, rgba(74,124,89,0.12) 0%, transparent 70%)', animation:'orb 14s ease-in-out infinite', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', bottom:'10%', right:'10%', background:'radial-gradient(circle, rgba(74,124,89,0.07) 0%, transparent 70%)', animation:'orb 18s ease-in-out infinite reverse', pointerEvents:'none' }}/>

        <div style={{ position:'relative', maxWidth:820 }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.1em',
            color:sage, textTransform:'uppercase',
            border:'1px solid rgba(74,124,89,0.25)', padding:'5px 16px',
            borderRadius:100, marginBottom:44,
            animation:'fadeIn 1s ease forwards',
          }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:sage, display:'inline-block', animation:'spin 4s linear infinite' }}/>
            One account · Four experiences
          </div>

          <h1 style={{
            fontFamily:'Instrument Serif, Georgia, serif',
            fontSize:'clamp(3.8rem, 9vw, 7.5rem)',
            fontWeight:400, lineHeight:1.0, letterSpacing:-3,
            color:'#f0efeb', marginBottom:4,
            animation:'fadeUp 0.9s ease both',
          }}>A place to</h1>

          <div style={{
            fontFamily:'Instrument Serif, Georgia, serif',
            fontSize:'clamp(3.8rem, 9vw, 7.5rem)',
            fontWeight:400, lineHeight:1.0, letterSpacing:-3,
            color:sage, fontStyle:'italic',
            height:'clamp(4.2rem, 10vw, 8.5rem)',
            overflow:'hidden', marginBottom:44,
          }}>
            <span style={{
              display:'block',
              opacity: wordVisible ? 1 : 0,
              transform: wordVisible ? 'translateY(0) skewY(0)' : 'translateY(16px) skewY(1deg)',
              transition:'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}>{words[wordIdx]}</span>
          </div>

          <p style={{
            fontFamily:'Instrument Serif, Georgia, serif',
            fontSize:'clamp(1rem, 2.2vw, 1.3rem)',
            color:'rgba(240,239,235,0.38)', lineHeight:1.8,
            maxWidth:520, margin:'0 auto 52px', fontStyle:'italic',
            animation:'fadeUp 1s ease 0.3s both',
          }}>
            "It's not that the world is too dark but that we've grown used to not lighting ourselves up."
          </p>

          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', animation:'fadeUp 1s ease 0.5s both' }}>
            <Link href="/auth/register" className="btn-p">Start for free</Link>
            <a href="#apps" className="btn-g" style={{ color:'rgba(240,239,235,0.5)', border:'1px solid rgba(240,239,235,0.15)' }}>Explore ↓</a>
          </div>
        </div>

        <div style={{
          position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:6,
          opacity:0.25, animation:'float 2.5s ease-in-out infinite',
        }}>
          <div style={{ width:1, height:36, background:`linear-gradient(to bottom, ${sage}, transparent)` }}/>
          <span style={{ fontSize:'0.6rem', letterSpacing:'0.16em', color:'#f0efeb' }}>SCROLL</span>
        </div>
      </section>

      {/* 2. APPS */}
      <section id="apps" style={{ background:S(false).bg, padding:'100px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <Reveal>
            <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:sage, marginBottom:12 }}>The ecosystem</p>
            <h2 style={{ fontFamily:'Instrument Serif, Georgia, serif', fontSize:'clamp(2.4rem, 5vw, 3.8rem)', fontWeight:400, letterSpacing:-1.5, lineHeight:1.1, color:S(false).text, marginBottom:60 }}>
              Four apps. One account.<br/><span style={{ color:sage, fontStyle:'italic' }}>Zero compromise.</span>
            </h2>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(230px, 1fr))', gap:16 }}>
            {[
              { emoji:'🌽', name:'Cùi Bắp', tag:'Messaging', desc:'Private 1-on-1 & group chat. File sharing. Video calls. No ads, no surveillance.', href:'/dashboard/cui-bap', accent:'#f59e0b', delay:0 },
              { emoji:'🌿', name:'Nope', tag:'Community', desc:'Real stories from real people. Share what you wish someone had told you earlier.', href:'/dashboard/nope', accent:sage, delay:80 },
              { emoji:'🎧', name:'LàNo', tag:'Coming soon', desc:'An AI that listens without judgment. Here for you at 2am when no one else is.', href:'/dashboard/lano', accent:'#8b5cf6', delay:160 },
              { emoji:'🔧', name:'Tools', tag:'44+ free', desc:'Browser-based everyday tools. Private, fast, no upload required.', href:'/tools', accent:'#ef4444', delay:240 },
            ].map(app => (
              <Reveal key={app.name} delay={app.delay}>
                <Link href={app.href} style={{ textDecoration:'none', display:'block', height:'100%' }}>
                  <div className="ch" style={{ padding:28, borderRadius:20, border:`1px solid ${S(false).border}`, background:S(false).card, height:'100%', display:'flex', flexDirection:'column', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize:'2rem', marginBottom:16 }}>{app.emoji}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                      <span style={{ fontWeight:700, fontSize:'1.05rem', color:S(false).text }}>{app.name}</span>
                      <span style={{ fontSize:'0.63rem', fontWeight:600, padding:'2px 8px', borderRadius:100, background:`${app.accent}18`, color:app.accent }}>{app.tag}</span>
                    </div>
                    <p style={{ fontSize:'0.84rem', color:S(false).text2, lineHeight:1.65, flex:1 }}>{app.desc}</p>
                    <div style={{ marginTop:20, fontSize:'0.78rem', fontWeight:600, color:app.accent }}>Explore →</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CUIBAP */}
      <section style={{ background:S(true).bg, padding:'100px 24px', overflow:'hidden' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}>
          <Reveal>
            <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#f59e0b', marginBottom:14 }}>Cùi Bắp</p>
            <h2 style={{ fontFamily:'Instrument Serif, Georgia, serif', fontSize:'clamp(2rem, 4vw, 3.2rem)', fontWeight:400, letterSpacing:-1, lineHeight:1.15, color:S(true).text, marginBottom:18 }}>
              Message like it's<br/><span style={{ color:'#f59e0b', fontStyle:'italic' }}>nobody's business.</span>
            </h2>
            <p style={{ fontSize:'0.95rem', color:S(true).text2, lineHeight:1.75, maxWidth:380, marginBottom:32 }}>End-to-end encrypted. No ads. No one reads your messages — not even us.</p>
            <Link href="/auth/register" className="btn-p">Start messaging</Link>
          </Reveal>
          <Reveal delay={150}>
            <div style={{ borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)', background:'#111814', boxShadow:'0 40px 80px rgba(0,0,0,0.5)' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:sage, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', color:'#fff', fontWeight:700 }}>A</div>
                <div>
                  <div style={{ fontSize:'0.82rem', fontWeight:600, color:'#f0efeb' }}>An Nguyen</div>
                  <div style={{ fontSize:'0.65rem', color:sage }}>● online</div>
                </div>
              </div>
              <div style={{ padding:18, display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { out:false, text:'done with the auth PR! 🎉' },
                  { out:true,  text:'already? nice work 🔥' },
                  { out:false, text:"merge when ready, I'll test on staging" },
                  { out:true,  text:'on it — 5 min ⚡' },
                ].map((m, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:m.out?'flex-end':'flex-start' }}>
                    <div style={{ padding:'8px 13px', borderRadius:m.out?'14px 14px 3px 14px':'14px 14px 14px 3px', background:m.out?sage:'rgba(255,255,255,0.07)', color:m.out?'#fff':'#f0efeb', fontSize:'0.81rem', maxWidth:'76%' }}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding:'10px 14px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:8 }}>
                <div style={{ flex:1, height:34, borderRadius:17, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)' }}/>
                <div style={{ width:34, height:34, borderRadius:'50%', background:sage, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.9rem' }}>↑</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. NOPE */}
      <section style={{ background:S(false).bg, padding:'100px 24px', overflow:'hidden' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}>
          <Reveal delay={150}>
            <div style={{ borderRadius:20, overflow:'hidden', border:`1px solid ${S(false).border}`, background:S(false).card, boxShadow:'0 16px 40px rgba(0,0,0,0.06)' }}>
              {[
                { n:'M', tag:'Career', title:'From 3M to 40M — how I learned to negotiate my salary', thanks:'847', c:'#4a7c59' },
                { n:'A', tag:'Health',  title:'How I recovered from 2 years of burnout', thanks:'1.2k', c:'#8b5cf6' },
                { n:'H', tag:'Finance', title:'5 money lessons I wish I knew at 22', thanks:'2.1k', c:'#f59e0b' },
              ].map((p, i) => (
                <div key={i} style={{ padding:'15px 18px', borderBottom:i<2?`1px solid ${S(false).border}`:'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:7 }}>
                    <div style={{ width:26, height:26, borderRadius:'50%', background:p.c, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', color:'#fff', fontWeight:700 }}>{p.n}</div>
                    <span style={{ fontSize:'0.68rem', fontWeight:600, color:p.c }}>{p.tag}</span>
                  </div>
                  <p style={{ fontSize:'0.84rem', fontWeight:500, color:S(false).text, marginBottom:7, lineHeight:1.4 }}>{p.title}</p>
                  <span style={{ fontSize:'0.7rem', color:S(false).text2 }}>♥ {p.thanks}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:sage, marginBottom:14 }}>Nope</p>
            <h2 style={{ fontFamily:'Instrument Serif, Georgia, serif', fontSize:'clamp(2rem, 4vw, 3.2rem)', fontWeight:400, letterSpacing:-1, lineHeight:1.15, color:S(false).text, marginBottom:18 }}>
              Real stories.<br/><span style={{ color:sage, fontStyle:'italic' }}>Real people.</span>
            </h2>
            <p style={{ fontSize:'0.95rem', color:S(false).text2, lineHeight:1.75, maxWidth:380, marginBottom:32 }}>Share what you wish someone had told you. No algorithm, no influencers, no clout-chasing.</p>
            <Link href="/auth/register" className="btn-p">Join the conversation</Link>
          </Reveal>
        </div>
      </section>

      {/* 5. LANO */}
      <section style={{ background:'#090b12', padding:'100px 24px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 60%, rgba(139,92,246,0.09) 0%, transparent 60%)', pointerEvents:'none' }}/>
        <div style={{ maxWidth:640, margin:'0 auto', position:'relative' }}>
          <Reveal>
            <div style={{ width:60, height:60, borderRadius:'50%', background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', margin:'0 auto 28px', animation:'float 3s ease-in-out infinite' }}>🎧</div>
            <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#8b5cf6', marginBottom:14 }}>LàNo</p>
            <h2 style={{ fontFamily:'Instrument Serif, Georgia, serif', fontSize:'clamp(2.5rem, 5vw, 4rem)', fontWeight:400, letterSpacing:-1.5, lineHeight:1.1, color:'#f0efeb', marginBottom:18 }}>
              Someone to listen.<br/><span style={{ color:'#8b5cf6', fontStyle:'italic' }}>Without judgment.</span>
            </h2>
            <p style={{ fontSize:'0.95rem', color:'rgba(240,239,235,0.45)', lineHeight:1.75, maxWidth:440, margin:'0 auto 36px' }}>Built not to replace therapy, but to be there when no one else is. Free, always.</p>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 22px', borderRadius:100, border:'1px solid rgba(139,92,246,0.25)', color:'rgba(139,92,246,0.7)', fontSize:'0.82rem', fontWeight:500 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#8b5cf6', opacity:0.6, display:'inline-block' }}/>
              Coming soon
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. TOOLS */}
      <section style={{ background:S(false).bg, padding:'100px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <Reveal>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48, flexWrap:'wrap', gap:16 }}>
              <div>
                <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#ef4444', marginBottom:12 }}>Tools</p>
                <h2 style={{ fontFamily:'Instrument Serif, Georgia, serif', fontSize:'clamp(2rem, 4vw, 3.2rem)', fontWeight:400, letterSpacing:-1, lineHeight:1.1, color:S(false).text }}>
                  44 tools. All free.<br/><span style={{ color:'#ef4444', fontStyle:'italic' }}>Run in your browser.</span>
                </h2>
              </div>
              <Link href="/tools" style={{ fontSize:'0.84rem', color:sage, textDecoration:'none', fontWeight:500 }}>See all tools →</Link>
            </div>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(155px, 1fr))', gap:12 }}>
            {[
              { icon:'🖼', name:'Image Editor', free:true },
              { icon:'📄', name:'PDF → Word', q:'1Q' },
              { icon:'🃏', name:'Flashcards', free:true },
              { icon:'🔗', name:'Self-destruct Link', free:true },
              { icon:'🌐', name:'Screenshot Translate', q:'2Q' },
              { icon:'🔑', name:'Password Generator', free:true },
              { icon:'📊', name:'Grammar Check', free:true },
              { icon:'🎯', name:'QR Generator', free:true },
            ].map((tool, i) => (
              <Reveal key={tool.name} delay={i * 40}>
                <div className="ch" style={{ padding:'18px 14px', borderRadius:14, border:`1px solid ${S(false).border}`, background:S(false).card, display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ fontSize:'1.4rem' }}>{tool.icon}</div>
                  <div style={{ fontSize:'0.78rem', fontWeight:500, color:S(false).text, lineHeight:1.3 }}>{tool.name}</div>
                  <div style={{ fontSize:'0.62rem', fontWeight:600, padding:'2px 7px', borderRadius:100, display:'inline-flex', alignSelf:'flex-start', background:tool.free?'rgba(74,124,89,0.1)':'rgba(245,158,11,0.1)', color:tool.free?sage:'#f59e0b' }}>{tool.free?'Free':tool.q}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PRIVACY */}
      <section style={{ background:'#0c0e0c', padding:'100px 24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 50%, rgba(74,124,89,0.06) 0%, transparent 60%)', pointerEvents:'none' }}/>
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative' }}>
          <Reveal>
            <h2 style={{ fontFamily:'Instrument Serif, Georgia, serif', fontSize:'clamp(2.5rem, 5vw, 3.8rem)', fontWeight:400, letterSpacing:-1.5, lineHeight:1.1, color:'#f0efeb', marginBottom:60, maxWidth:560 }}>
              Built different.<br/><span style={{ color:sage, fontStyle:'italic' }}>On purpose.</span>
            </h2>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(270px, 1fr))', gap:20 }}>
            {[
              { icon:'◎', title:'Zero ads. Ever.', desc:'No advertisers, no tracking pixels, no sponsored content. Our only revenue is tools — not your attention.', delay:0 },
              { icon:'◑', title:'Your data stays yours.', desc:"We don't sell, share, or analyze your personal data. What you share stays between you and the people you choose.", delay:100 },
              { icon:'◐', title:'Transparent pricing.', desc:'Free forever for core features. Pay only when you need more — by the day, no subscriptions required.', delay:200 },
            ].map(item => (
              <Reveal key={item.title} delay={item.delay}>
                <div style={{ padding:'30px 26px', borderRadius:18, border:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize:'1.4rem', marginBottom:14, color:sage }}>{item.icon}</div>
                  <h3 style={{ fontFamily:'Instrument Serif, Georgia, serif', fontSize:'1.25rem', fontWeight:400, color:'#f0efeb', marginBottom:10 }}>{item.title}</h3>
                  <p style={{ fontSize:'0.85rem', color:'rgba(240,239,235,0.4)', lineHeight:1.7 }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STATS */}
      <section style={{ background:S(false).bg, padding:'80px 24px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <Reveal>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:1, borderRadius:18, overflow:'hidden', border:`1px solid ${S(false).border}`, background:S(false).border }}>
              {[
                { to:44, suffix:'+', label:'Free tools' },
                { to:0,  suffix:'',  label:'Ads. Ever.' },
                { to:4,  suffix:'',  label:'Apps in one' },
                { to:0,  suffix:'',  label:'Data sold' },
              ].map(s => (
                <div key={s.label} style={{ padding:'36px 24px', background:S(false).bg, textAlign:'center' }}>
                  <div style={{ fontFamily:'Instrument Serif, Georgia, serif', fontSize:'clamp(2.5rem, 4vw, 3.5rem)', fontWeight:400, color:sage, letterSpacing:-1, lineHeight:1 }}>
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize:'0.78rem', color:S(false).text2, marginTop:6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9. PRICING */}
      <section style={{ background:S(true).bg, padding:'100px 24px' }}>
        <div style={{ maxWidth:780, margin:'0 auto', textAlign:'center' }}>
          <Reveal>
            <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:sage, marginBottom:14 }}>Pricing</p>
            <h2 style={{ fontFamily:'Instrument Serif, Georgia, serif', fontSize:'clamp(2.5rem, 5vw, 3.8rem)', fontWeight:400, letterSpacing:-1.5, lineHeight:1.1, color:S(true).text, marginBottom:14 }}>
              Free forever.<br/><span style={{ color:sage, fontStyle:'italic' }}>Pay when you want more.</span>
            </h2>
            <p style={{ fontSize:'0.95rem', color:S(true).text2, marginBottom:52 }}>No subscriptions. No tricks. Buy by the day.</p>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[
              { name:'Free', price:'$0', period:'forever', highlight:false, features:['LàNo AI (coming soon)','Nope — read & share','Cùi Bắp messaging','40+ free tools','No ads, ever'], cta:'Get started' },
              { name:'Pro',  price:'$0.50', period:'/day', highlight:true,  features:['Everything in Free','10 Q daily (24h expiry)','1 Q daily (never expires)','PDF→Word, Screenshot Translate','Refund unused days'], cta:'Go Pro' },
            ].map(plan => (
              <Reveal key={plan.name}>
                <div style={{ padding:'30px 24px', borderRadius:18, border:plan.highlight?`2px solid ${sage}`:`1.5px solid ${S(true).border}`, background:plan.highlight?'rgba(74,124,89,0.05)':S(true).card, position:'relative', textAlign:'left' }}>
                  {plan.highlight && <div style={{ position:'absolute', top:-11, left:20, background:sage, color:'#fff', fontSize:'0.62rem', fontWeight:700, padding:'3px 12px', borderRadius:100, letterSpacing:'0.06em' }}>RECOMMENDED</div>}
                  <div style={{ fontWeight:700, fontSize:'0.95rem', color:S(true).text, marginBottom:6 }}>{plan.name}</div>
                  <div style={{ marginBottom:22 }}>
                    <span style={{ fontFamily:'Instrument Serif', fontSize:'2.4rem', color:plan.highlight?sage:S(true).text }}>{plan.price}</span>
                    <span style={{ fontSize:'0.82rem', color:S(true).text2 }}> {plan.period}</span>
                  </div>
                  <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:9, marginBottom:26 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display:'flex', gap:7, fontSize:'0.81rem', color:S(true).text2 }}>
                        <span style={{ color:sage, fontWeight:700 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register" style={{ display:'block', textAlign:'center', padding:'11px', borderRadius:100, textDecoration:'none', fontWeight:600, fontSize:'0.86rem', transition:'all 0.2s', background:plan.highlight?sage:'transparent', border:plan.highlight?'none':`1.5px solid ${S(true).border}`, color:plan.highlight?'#fff':S(true).text }}>{plan.cta}</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10. QUOTE */}
      <section style={{ background:'#070908', padding:'120px 24px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(74,124,89,0.04) 0%, transparent 60%)', pointerEvents:'none' }}/>
        <Reveal>
          <p style={{ fontFamily:'Instrument Serif, Georgia, serif', fontSize:'clamp(1.8rem, 4vw, 3rem)', fontWeight:400, fontStyle:'italic', color:'rgba(240,239,235,0.3)', lineHeight:1.55, textAlign:'center', maxWidth:680, margin:'0 auto', letterSpacing:-0.5 }}>
            "It's not that the world is too dark but that we've grown used to{' '}
            <span style={{ color:sage }}>not lighting ourselves up.</span>"
          </p>
        </Reveal>
      </section>

      {/* 11. LANGUAGES */}
      <section style={{ background:S(false).bg, padding:'72px 24px' }}>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <Reveal>
            <p style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:S(false).text2, marginBottom:28 }}>Available in</p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              {[
                { flag:'🇬🇧', lang:'English', def:true },
                { flag:'🇻🇳', lang:'Tiếng Việt' },
                { flag:'🇯🇵', lang:'日本語' },
                { flag:'🇪🇸', lang:'Español' },
              ].map(l => (
                <div key={l.lang} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:100, border:`1px solid ${l.def?sage:S(false).border}`, background:l.def?'rgba(74,124,89,0.07)':'transparent', fontSize:'0.84rem', color:l.def?sage:S(false).text2 }}>
                  <span>{l.flag}</span><span>{l.lang}</span>
                  {l.def && <span style={{ fontSize:'0.6rem', fontWeight:700 }}>DEFAULT</span>}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section style={{ background:'#0c0e0c', padding:'120px 24px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(74,124,89,0.1) 0%, transparent 60%)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', maxWidth:580, margin:'0 auto' }}>
          <Reveal>
            <div style={{ marginBottom:24 }}><AnimatedLogo size={52} color={sage} /></div>
            <h2 style={{ fontFamily:'Instrument Serif, Georgia, serif', fontSize:'clamp(2.8rem, 6vw, 4.5rem)', fontWeight:400, letterSpacing:-2, lineHeight:1.05, color:'#f0efeb', marginBottom:18 }}>
              One account.<br/><span style={{ color:sage, fontStyle:'italic' }}>Everything.</span>
            </h2>
            <p style={{ fontSize:'0.95rem', color:'rgba(240,239,235,0.4)', marginBottom:40, lineHeight:1.7 }}>Join Querencia — free, forever.</p>
            <Link href="/auth/register" className="btn-p" style={{ fontSize:'1rem', padding:'15px 36px' }}>Get started — it's free</Link>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'#070908', padding:'44px 24px', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1.5fr repeat(3, 1fr)', gap:40, alignItems:'start' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:10 }}>
              <AnimatedLogo size={22} color={sage} />
              <span style={{ fontWeight:700, fontSize:'0.9rem', color:'#f0efeb' }}><span style={{ opacity:0.4 }}>ueren</span><span style={{ color:sage }}>cia</span></span>
            </div>
            <p style={{ fontSize:'0.76rem', color:'rgba(240,239,235,0.25)', lineHeight:1.6, maxWidth:180 }}>Thoughtful tools for curious minds.</p>
            <p style={{ fontSize:'0.7rem', color:'rgba(240,239,235,0.18)', marginTop:14 }}>© 2026 Querencia</p>
          </div>
          {[
            { title:'Apps', links:[{l:'Cùi Bắp',h:'/dashboard/cui-bap'},{l:'Nope',h:'/dashboard/nope'},{l:'LàNo',h:'/dashboard/lano'},{l:'Tools',h:'/tools'}] },
            { title:'Tools', links:[{l:'Image Editor',h:'/tools/image-editor'},{l:'PDF → Word',h:'/tools/pdf-to-word'},{l:'Flashcards',h:'/tools/flashcard-gen'},{l:'See all →',h:'/tools'}] },
            { title:'Legal', links:[{l:'Privacy',h:'/pages/privacy'},{l:'Terms',h:'/pages/terms'},{l:'Security',h:'/pages/security'}] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize:'0.66rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(240,239,235,0.22)', marginBottom:12 }}>{col.title}</div>
              <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:9 }}>
                {col.links.map(l => (
                  <li key={l.l}><Link href={l.h} style={{ fontSize:'0.8rem', color:'rgba(240,239,235,0.35)', textDecoration:'none', transition:'color 0.15s' }}
                    onMouseEnter={e=>(e.currentTarget.style.color=sage)}
                    onMouseLeave={e=>(e.currentTarget.style.color='rgba(240,239,235,0.35)')}
                  >{l.l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </>
  );
}
