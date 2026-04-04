'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'en' | 'vi' | 'ja' | 'es';

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English',     flag: '🇬🇧' },
  { code: 'vi', label: 'Tiếng Việt',  flag: '🇻🇳' },
  { code: 'ja', label: '日本語',       flag: '🇯🇵' },
  { code: 'es', label: 'Español',     flag: '🇪🇸' },
];

// Translations
const T: Record<Locale, Record<string, string>> = {
  en: {
    'nav.pricing':       'Pricing',
    'nav.signin':        'Sign in',
    'nav.getstarted':    'Get started',
    'nav.dashboard':     'Dashboard',
    'footer.tagline':    "Querencia is ad-free and never sells your data. We're funded solely by our paid tools.",
    'footer.rights':     '© 2026 Querencia · All rights reserved',
    'lano.coming':       'Coming soon',
    'lano.feedback':     'What would you want LàNo to help you with?',
    'lano.placeholder':  'Share your thoughts — this helps us build LàNo for you...',
    'lano.send':         'Send',
    'lano.sent':         'Thank you — your feedback helps shape LàNo ♥',
  },
  vi: {
    'nav.pricing':       'Bảng giá',
    'nav.signin':        'Đăng nhập',
    'nav.getstarted':    'Bắt đầu',
    'nav.dashboard':     'Dashboard',
    'footer.tagline':    'Querencia không quảng cáo và không bán dữ liệu. Nguồn thu duy nhất là tools có phí.',
    'footer.rights':     '© 2026 Querencia · Bảo lưu mọi quyền',
    'lano.coming':       'Sắp ra mắt',
    'lano.feedback':     'Bạn muốn LàNo giúp bạn điều gì?',
    'lano.placeholder':  'Chia sẻ suy nghĩ của bạn — điều này giúp chúng mình xây dựng LàNo phù hợp hơn...',
    'lano.send':         'Gửi',
    'lano.sent':         'Cảm ơn bạn — phản hồi của bạn giúp định hình LàNo ♥',
  },
  ja: {
    'nav.pricing':       '料金',
    'nav.signin':        'ログイン',
    'nav.getstarted':    '始める',
    'nav.dashboard':     'ダッシュボード',
    'footer.tagline':    'Querenciaは広告なし、データ販売なし。収益はツールのみ。',
    'footer.rights':     '© 2026 Querencia · All rights reserved',
    'lano.coming':       'もうすぐ',
    'lano.feedback':     'LàNoに何を手伝ってほしいですか？',
    'lano.placeholder':  'あなたの考えをシェアしてください...',
    'lano.send':         '送信',
    'lano.sent':         'ありがとうございます ♥',
  },
  es: {
    'nav.pricing':       'Precios',
    'nav.signin':        'Iniciar sesión',
    'nav.getstarted':    'Comenzar',
    'nav.dashboard':     'Panel',
    'footer.tagline':    'Querencia no tiene anuncios y nunca vende tus datos. Nos financiamos solo con herramientas de pago.',
    'footer.rights':     '© 2026 Querencia · Todos los derechos reservados',
    'lano.coming':       'Próximamente',
    'lano.feedback':     '¿Para qué quieres que LàNo te ayude?',
    'lano.placeholder':  'Comparte tus pensamientos — esto nos ayuda a construir LàNo para ti...',
    'lano.send':         'Enviar',
    'lano.sent':         'Gracias — tus comentarios dan forma a LàNo ♥',
  },
};

interface I18nCtx { locale: Locale; setLocale: (l: Locale) => void; t: (key: string) => string; }
const I18nContext = createContext<I18nCtx>({ locale: 'en', setLocale: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('qrncia_locale') as Locale;
    if (saved && LOCALES.find(l => l.code === saved)) setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('qrncia_locale', l);
  };

  const t = (key: string) => T[locale][key] ?? T['en'][key] ?? key;

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
