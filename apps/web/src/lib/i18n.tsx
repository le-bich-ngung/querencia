'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Buoc 2: he sinh thai chi hien thi tieng Anh, chua co nut chon ngon ngu.
// Cau truc 60-locale day du nam o packages/i18n (xem README). File nay se
// duoc noi voi @querencia/i18n khi lam Buoc 3 (them nut globe + kich hoat JA).
export type Locale = 'en';

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

// Translations
const T: Record<Locale, Record<string, string>> = {
  en: {
    'nav.pricing':       'Pricing',
    'nav.signin':        'Sign in',
    'nav.getstarted':    'Get started',
    'nav.dashboard':     'Dashboard',
    'footer.tagline':    'Querencia is ad-free and always respects your privacy.',
    'footer.rights':     '© 2026 Querencia · All rights reserved',
    'lano.coming':       'Coming soon',
    'lano.feedback':     'What would you want LàNo to help you with?',
    'lano.placeholder':  'Share your thoughts - this helps us build LàNo for you...',
    'lano.send':         'Send',
    'lano.sent':         'Thank you - your feedback helps shape LàNo ♥',
    'home.freetools.title': 'Use freely, no limits.',
    'home.freetools.sub': 'No account needed. No ads. No data collection.',
    'home.paidtools.label': 'Paid tools · Our only revenue',
    'home.paidtools.title': 'Advanced tools, worth every Q.',
    'home.paidtools.sub': 'Pay with Q. No subscription. Pay as you go.',
    'home.apps.label': 'Apps',
    'home.apps.title': 'Three apps. One account.',
    'home.nope.desc': 'Real stories from real people. No ads, no algorithm.',
    'home.cuibap.desc': 'Private messaging. No ads. No data selling.',
    'home.lano.desc': 'AI that listens. No judgment. No memory.',
    'home.lano.btn2': 'Choose how to chat',
    'home.quotes.label': 'From Read',
    'home.conventions.label': 'International Conventions',
    'home.conventions.title': 'Documents that shaped the world.',
    'home.mental.label': 'Thinking',
    'home.mental.title': 'Four frameworks that change how you think.',
    'home.book.label': 'Coming soon',
    'home.book.desc': 'A book being written. About being yourself - nothing more, nothing less. Register to be notified when it launches.',
    'home.book.btn': 'Notify me',
    'home.book.sent': 'Registered! We will notify you when the book launches.',
    'home.feedback.label': 'Talk to us',
    'home.feedback.title': 'How do you want Querencia to be?',
    'home.feedback.sub': 'Your feedback shapes Querencia. Login required.',
    'home.feedback.placeholder': 'Share your thoughts about Querencia...',
    'home.feedback.btn': 'Send feedback',
    'home.feedback.login': 'Login to send feedback',
    'home.feedback.sent': 'Thank you! We received your feedback.',
    'home.qpool.desc': 'Q gifted by the community - take what you need. Expiring Q expires in 24h.',
    'home.qpool.available': 'Q available',
    'home.qpool.claimed': 'Claimed today',
    'home.qpool.donors': 'Donors',
    'home.qpool.empty': 'Pool is empty. Check back later!',
    'home.qpool.claim': 'Claim',
    'home.qpool.login': 'Login',
    'home.qpool.gift': 'Have expiring Q? Gift to Pool →',
    'home.qpool.permanent': 'no expiry',
    'home.qpool.expires': 'expires in',
    'home.qpool.by': 'Gifted by',
    'home.qpool.anon': 'Anonymous gift',
    'home.qpool.people': 'people claimed',
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
