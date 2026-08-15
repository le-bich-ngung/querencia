'use client';
/**
 * Cloudflare Turnstile widget - bot verification without a traditional CAPTCHA.
 * Renders invisibly in most cases; only shows a small checkbox if Cloudflare
 * flags the visitor as suspicious.
 *
 * Usage:
 *   const [token, setToken] = useState('');
 *   <Turnstile onVerify={setToken} />
 *   ... send `token` as `captchaToken` in the request body ...
 */
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, any>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

let scriptLoadPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve) => {
    if (window.turnstile) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
    script.async = true;
    window.onTurnstileLoad = () => resolve();
    document.head.appendChild(script);
  });
  return scriptLoadPromise;
}

export function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef   = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadTurnstileScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
        theme: 'light',
        size: 'flexible',
        callback: (token: string) => onVerify(token),
        'expired-callback': () => onVerify(''),
        'error-callback': () => onVerify(''),
      });
    });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} style={{ margin: '4px 0' }} />;
}
