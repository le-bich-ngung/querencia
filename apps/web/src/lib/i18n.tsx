ï»¿'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'en' | 'vi' | 'ja' | 'es';

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English',     flag: 'ð¬ð§' },
  { code: 'vi', label: 'Tiáº¿ng Viá»t',  flag: 'ð»ð³' },
  { code: 'ja', label: 'æ¥æ¬èª',       flag: 'ð¯ðµ' },
  { code: 'es', label: 'EspaÃ±ol',     flag: 'ðªð¸' },
];

// Translations
const T: Record<Locale, Record<string, string>> = {
  en: {
    'nav.pricing':       'Pricing',
    'nav.signin':        'Sign in',
    'nav.getstarted':    'Get started',
    'nav.dashboard':     'Dashboard',
    'footer.tagline':    "Querencia is ad-free and never sells your data. We're funded solely by our paid tools.",
    'footer.rights':     'Â© 2026 Querencia Â· All rights reserved',
    'lano.coming':       'Coming soon',
    'lano.feedback':     'What would you want LÃ No to help you with?',
    'lano.placeholder':  'Share your thoughts â this helps us build LÃ No for you...',
    'lano.send':         'Send',
    'lano.sent':         'Thank you â your feedback helps shape LÃ No â¥',
  },
  vi: {
    'nav.pricing':       'Báº£ng giÃ¡',
    'nav.signin':        'ÄÄng nháº­p',
    'nav.getstarted':    'Báº¯t Äáº§u',
    'nav.dashboard':     'Dashboard',
    'footer.tagline':    'Querencia khÃ´ng quáº£ng cÃ¡o vÃ  khÃ´ng bÃ¡n dá»¯ liá»u. Nguá»n thu duy nháº¥t lÃ  tools cÃ³ phÃ­.',
    'footer.rights':     'Â© 2026 Querencia Â· Báº£o lÆ°u má»i quyá»n',
    'lano.coming':       'Sáº¯p ra máº¯t',
    'lano.feedback':     'Báº¡n muá»n LÃ No giÃºp báº¡n Äiá»u gÃ¬?',
    'lano.placeholder':  'Chia sáº» suy nghÄ© cá»§a báº¡n â Äiá»u nÃ y giÃºp chÃºng mÃ¬nh xÃ¢y dá»±ng LÃ No phÃ¹ há»£p hÆ¡n...',
    'lano.send':         'Gá»­i',
    'lano.sent':         'Cáº£m Æ¡n báº¡n â pháº£n há»i cá»§a báº¡n giÃºp Äá»nh hÃ¬nh LÃ No â¥',
  },
  ja: {
    'nav.pricing':       'æé',
    'nav.signin':        'ã­ã°ã¤ã³',
    'nav.getstarted':    'å§ãã',
    'nav.dashboard':     'ããã·ã¥ãã¼ã',
    'footer.tagline':    'Querenciaã¯åºåãªãããã¼ã¿è²©å£²ãªããåçã¯ãã¼ã«ã®ã¿ã',
    'footer.rights':     'Â© 2026 Querencia Â· All rights reserved',
    'lano.coming':       'ãããã',
    'lano.feedback':     'LÃ Noã«ä½ãæä¼ã£ã¦ã»ããã§ããï¼',
    'lano.placeholder':  'ããªãã®èããã·ã§ã¢ãã¦ãã ãã...',
    'lano.send':         'éä¿¡',
    'lano.sent':         'ãããã¨ããããã¾ã â¥',
  },
  es: {
    'nav.pricing':       'Precios',
    'nav.signin':        'Iniciar sesiÃ³n',
    'nav.getstarted':    'Comenzar',
    'nav.dashboard':     'Panel',
    'footer.tagline':    'Querencia no tiene anuncios y nunca vende tus datos. Nos financiamos solo con herramientas de pago.',
    'footer.rights':     'Â© 2026 Querencia Â· Todos los derechos reservados',
    'lano.coming':       'PrÃ³ximamente',
    'lano.feedback':     'Â¿Para quÃ© quieres que LÃ No te ayude?',
    'lano.placeholder':  'Comparte tus pensamientos â esto nos ayuda a construir LÃ No para ti...',
    'lano.send':         'Enviar',
    'lano.sent':         'Gracias â tus comentarios dan forma a LÃ No â¥',
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
