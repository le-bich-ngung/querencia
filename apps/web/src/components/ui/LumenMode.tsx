/**
 * Lumen Mode - hiệu ứng ánh sáng / glow cho toàn hệ sinh thái
 *
 * Dùng cho:
 *   - Cursor glow theo chuột
 *   - Spotlight effect trên hero sections
 *   - Glow pulse khi nhận Q
 *   - Ambient light xung quanh chat bubble của LàNo
 *   - Page transition glow
 *
 * Toggle: user có thể tắt trong Settings (prefers-reduced-motion)
 */
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

// ── Cursor Glow ────────────────────────────────────────────────
export function CursorGlow({
  color   = 'rgba(74,124,89,0.12)',
  size    = 400,
  enabled = true,
}: {
  color?: string; size?: number; enabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = ref.current;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      raf = requestAnimationFrame(() => {
        el.style.left = e.clientX - size / 2 + 'px';
        el.style.top  = e.clientY - size / 2 + 'px';
        el.style.opacity = '1';
      });
    };
    const onLeave = () => { el.style.opacity = '0'; };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled, size]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        transform: 'translateZ(0)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        willChange: 'left, top',
      }}
    />
  );
}

// ── Spotlight (hover glow trên card) ──────────────────────────
export function SpotlightCard({
  children,
  className,
  spotColor = 'rgba(74,124,89,0.08)',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  spotColor?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    ref.current.style.setProperty('--spot-x', `${x}%`);
    ref.current.style.setProperty('--spot-y', `${y}%`);
    ref.current.style.setProperty('--spot-opacity', '1');
  }, []);

  const onMouseLeave = useCallback(() => {
    ref.current?.style.setProperty('--spot-opacity', '0');
  }, []);

  return (
    <>
      <style>{`
        .spotlight-card {
          position: relative;
          overflow: hidden;
        }
        .spotlight-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at var(--spot-x, 50%) var(--spot-y, 50%),
            ${spotColor},
            transparent 60%
          );
          opacity: var(--spot-opacity, 0);
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 0;
          border-radius: inherit;
        }
        .spotlight-card > * { position: relative; z-index: 1; }
      `}</style>
      <div
        ref={ref}
        className={`spotlight-card ${className ?? ''}`}
        style={style}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    </>
  );
}

// ── Q Receive Pulse ────────────────────────────────────────────
export function QPulse({ trigger }: { trigger: boolean }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), 1000);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!active) return null;

  return (
    <>
      <style>{`
        @keyframes qpulse {
          0%   { transform: scale(0.8); opacity: 0.8; }
          50%  { transform: scale(1.6); opacity: 0.3; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          borderRadius: 'inherit',
          background: 'rgba(74,124,89,0.25)',
          animation: 'qpulse 1s ease-out forwards',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

// ── Ambient Glow (cho LàNo chat bubbles) ─────────────────────
export function AmbientGlow({
  color   = '#4a7c59',
  intensity = 0.08,
  children,
}: {
  color?: string; intensity?: number; children: React.ReactNode;
}) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -8,
          background: color,
          opacity: intensity,
          borderRadius: 24,
          filter: 'blur(12px)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

// ── Page Transition Glow ──────────────────────────────────────
export function PageGlow() {
  return (
    <>
      <style>{`
        @keyframes pageglow {
          0%   { opacity: 0.6; }
          100% { opacity: 0; }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'radial-gradient(ellipse at center, rgba(74,124,89,0.15) 0%, transparent 70%)',
          animation: 'pageglow 0.5s ease-out forwards',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

// ── Lumen Provider - wrap toàn app ────────────────────────────
export function LumenProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <>
      <CursorGlow enabled={!reduced}/>
      {children}
    </>
  );
}
