// Nguon chan ly duy nhat cho danh sach locale trong toan bo he sinh thai Querencia.
// KHONG duoc dinh nghia lai danh sach ngon ngu o bat ky app nao khac (web/mobile/ai-service).
// Moi noi deu phai import tu day.
//
// enabled=false nghia la: co san file dich (co the rong), nhung UI chua cho phep chon.
// Thu tu kich hoat (rolloutPriority) phai theo dung ke hoach da chot:
// 1) en  2) ja  3) de  4) es  5) vi  ... roi den cac ngon ngu con lai theo tier.

export type Direction = 'ltr' | 'rtl';

export interface LocaleMeta {
  /** Ma locale, dung lam ten thu muc trong locales/ va key tra cuu */
  code: string;
  /** Ten hien thi bang chinh ngon ngu do (vd: '日本語') */
  nativeName: string;
  /** Ten hien thi bang tieng Anh (vd: 'Japanese') */
  englishName: string;
  /** Huong van ban */
  direction: Direction;
  /** Co duoc phep chon trong UI hay chua (khac voi "co file dich hay chua") */
  enabled: boolean;
  /** Thu tu uu tien kich hoat trong roadmap (1 = da active dau tien) */
  rolloutPriority: number;
}

export const DEFAULT_LOCALE = 'en';

// Danh sach day du 60 locale, sap theo tier uu tien dan so/GDP.
// CHI sua field `enabled` khi thuc hien dung buoc trong ke hoach rollout.
// KHONG them/bot locale khoi danh sach nay khi chua co quyet dinh moi.
export const LOCALES: LocaleMeta[] = [
  // --- Tier 1: 15 ngon ngu launch som ---
  { code: 'en',    nativeName: 'English',        englishName: 'English',            direction: 'ltr', enabled: true,  rolloutPriority: 1 },
  { code: 'vi',    nativeName: 'Tiếng Việt',      englishName: 'Vietnamese',         direction: 'ltr', enabled: false, rolloutPriority: 5 },
  { code: 'es',    nativeName: 'Español',         englishName: 'Spanish',            direction: 'ltr', enabled: false, rolloutPriority: 4 },
  { code: 'pt',    nativeName: 'Português',       englishName: 'Portuguese',         direction: 'ltr', enabled: false, rolloutPriority: 11 },
  { code: 'hi',    nativeName: 'हिन्दी',           englishName: 'Hindi',              direction: 'ltr', enabled: false, rolloutPriority: 12 },
  { code: 'ar',    nativeName: 'العربية',         englishName: 'Arabic',             direction: 'rtl', enabled: false, rolloutPriority: 13 },
  { code: 'zh-CN', nativeName: '中文（简体）',      englishName: 'Chinese (Simplified)', direction: 'ltr', enabled: false, rolloutPriority: 14 },
  { code: 'fr',    nativeName: 'Français',        englishName: 'French',             direction: 'ltr', enabled: false, rolloutPriority: 15 },
  { code: 'ru',    nativeName: 'Русский',         englishName: 'Russian',            direction: 'ltr', enabled: false, rolloutPriority: 16 },
  { code: 'id',    nativeName: 'Bahasa Indonesia', englishName: 'Indonesian',        direction: 'ltr', enabled: false, rolloutPriority: 17 },
  { code: 'ja',    nativeName: '日本語',            englishName: 'Japanese',           direction: 'ltr', enabled: false, rolloutPriority: 2 },
  { code: 'de',    nativeName: 'Deutsch',         englishName: 'German',             direction: 'ltr', enabled: false, rolloutPriority: 3 },
  { code: 'ko',    nativeName: '한국어',            englishName: 'Korean',             direction: 'ltr', enabled: false, rolloutPriority: 18 },
  { code: 'it',    nativeName: 'Italiano',        englishName: 'Italian',            direction: 'ltr', enabled: false, rolloutPriority: 19 },
  { code: 'tr',    nativeName: 'Türkçe',          englishName: 'Turkish',            direction: 'ltr', enabled: false, rolloutPriority: 20 },

  // --- Tier 2: 20 ngon ngu mo rong vua ---
  { code: 'pl',    nativeName: 'Polski',          englishName: 'Polish',             direction: 'ltr', enabled: false, rolloutPriority: 21 },
  { code: 'nl',    nativeName: 'Nederlands',      englishName: 'Dutch',              direction: 'ltr', enabled: false, rolloutPriority: 22 },
  { code: 'th',    nativeName: 'ไทย',             englishName: 'Thai',               direction: 'ltr', enabled: false, rolloutPriority: 23 },
  { code: 'uk',    nativeName: 'Українська',      englishName: 'Ukrainian',          direction: 'ltr', enabled: false, rolloutPriority: 24 },
  { code: 'ms',    nativeName: 'Bahasa Melayu',   englishName: 'Malay',              direction: 'ltr', enabled: false, rolloutPriority: 25 },
  { code: 'ur',    nativeName: 'اردو',            englishName: 'Urdu',               direction: 'rtl', enabled: false, rolloutPriority: 26 },
  { code: 'bn',    nativeName: 'বাংলা',            englishName: 'Bengali',            direction: 'ltr', enabled: false, rolloutPriority: 27 },
  { code: 'ta',    nativeName: 'தமிழ்',            englishName: 'Tamil',              direction: 'ltr', enabled: false, rolloutPriority: 28 },
  { code: 'te',    nativeName: 'తెలుగు',           englishName: 'Telugu',             direction: 'ltr', enabled: false, rolloutPriority: 29 },
  { code: 'mr',    nativeName: 'मराठी',            englishName: 'Marathi',            direction: 'ltr', enabled: false, rolloutPriority: 30 },
  { code: 'gu',    nativeName: 'ગુજરાતી',          englishName: 'Gujarati',           direction: 'ltr', enabled: false, rolloutPriority: 31 },
  { code: 'pa',    nativeName: 'ਪੰਜਾਬੀ',           englishName: 'Punjabi',            direction: 'ltr', enabled: false, rolloutPriority: 32 },
  { code: 'ro',    nativeName: 'Română',          englishName: 'Romanian',           direction: 'ltr', enabled: false, rolloutPriority: 33 },
  { code: 'el',    nativeName: 'Ελληνικά',        englishName: 'Greek',              direction: 'ltr', enabled: false, rolloutPriority: 34 },
  { code: 'cs',    nativeName: 'Čeština',         englishName: 'Czech',              direction: 'ltr', enabled: false, rolloutPriority: 35 },
  { code: 'hu',    nativeName: 'Magyar',          englishName: 'Hungarian',          direction: 'ltr', enabled: false, rolloutPriority: 36 },
  { code: 'sv',    nativeName: 'Svenska',         englishName: 'Swedish',            direction: 'ltr', enabled: false, rolloutPriority: 37 },
  { code: 'da',    nativeName: 'Dansk',           englishName: 'Danish',             direction: 'ltr', enabled: false, rolloutPriority: 38 },
  { code: 'fi',    nativeName: 'Suomi',           englishName: 'Finnish',            direction: 'ltr', enabled: false, rolloutPriority: 39 },
  { code: 'zh-TW', nativeName: '中文（繁體）',      englishName: 'Chinese (Traditional)', direction: 'ltr', enabled: false, rolloutPriority: 40 },

  // --- Tier 3: 25 ngon ngu mo rong dai han ---
  { code: 'he',    nativeName: 'עברית',           englishName: 'Hebrew',             direction: 'rtl', enabled: false, rolloutPriority: 41 },
  { code: 'hr',    nativeName: 'Hrvatski',        englishName: 'Croatian',           direction: 'ltr', enabled: false, rolloutPriority: 42 },
  { code: 'sk',    nativeName: 'Slovenčina',      englishName: 'Slovak',             direction: 'ltr', enabled: false, rolloutPriority: 43 },
  { code: 'bg',    nativeName: 'Български',       englishName: 'Bulgarian',          direction: 'ltr', enabled: false, rolloutPriority: 44 },
  { code: 'sr',    nativeName: 'Српски',          englishName: 'Serbian',            direction: 'ltr', enabled: false, rolloutPriority: 45 },
  { code: 'no',    nativeName: 'Norsk',           englishName: 'Norwegian',          direction: 'ltr', enabled: false, rolloutPriority: 46 },
  { code: 'sl',    nativeName: 'Slovenščina',     englishName: 'Slovenian',          direction: 'ltr', enabled: false, rolloutPriority: 47 },
  { code: 'fil',   nativeName: 'Filipino',        englishName: 'Filipino',           direction: 'ltr', enabled: false, rolloutPriority: 48 },
  { code: 'sw',    nativeName: 'Kiswahili',       englishName: 'Swahili',            direction: 'ltr', enabled: false, rolloutPriority: 49 },
  { code: 'fa',    nativeName: 'فارسی',           englishName: 'Persian',            direction: 'rtl', enabled: false, rolloutPriority: 50 },
  { code: 'km',    nativeName: 'ភាសាខ្មែរ',        englishName: 'Khmer',              direction: 'ltr', enabled: false, rolloutPriority: 51 },
  { code: 'my',    nativeName: 'မြန်မာ',           englishName: 'Burmese',            direction: 'ltr', enabled: false, rolloutPriority: 52 },
  { code: 'lo',    nativeName: 'ລາວ',             englishName: 'Lao',                direction: 'ltr', enabled: false, rolloutPriority: 53 },
  { code: 'kn',    nativeName: 'ಕನ್ನಡ',           englishName: 'Kannada',            direction: 'ltr', enabled: false, rolloutPriority: 54 },
  { code: 'ml',    nativeName: 'മലയാളം',          englishName: 'Malayalam',          direction: 'ltr', enabled: false, rolloutPriority: 55 },
  { code: 'or',    nativeName: 'ଓଡ଼ିଆ',            englishName: 'Odia',               direction: 'ltr', enabled: false, rolloutPriority: 56 },
  { code: 'ca',    nativeName: 'Català',          englishName: 'Catalan',            direction: 'ltr', enabled: false, rolloutPriority: 57 },
  { code: 'lt',    nativeName: 'Lietuvių',        englishName: 'Lithuanian',         direction: 'ltr', enabled: false, rolloutPriority: 58 },
  { code: 'lv',    nativeName: 'Latviešu',        englishName: 'Latvian',            direction: 'ltr', enabled: false, rolloutPriority: 59 },
  { code: 'et',    nativeName: 'Eesti',           englishName: 'Estonian',           direction: 'ltr', enabled: false, rolloutPriority: 60 },
  { code: 'az',    nativeName: 'Azərbaycan',      englishName: 'Azerbaijani',        direction: 'ltr', enabled: false, rolloutPriority: 61 },
  { code: 'kk',    nativeName: 'Қазақ',           englishName: 'Kazakh',             direction: 'ltr', enabled: false, rolloutPriority: 62 },
  { code: 'uz',    nativeName: "O'zbek",          englishName: 'Uzbek',              direction: 'ltr', enabled: false, rolloutPriority: 63 },
  { code: 'am',    nativeName: 'አማርኛ',            englishName: 'Amharic',            direction: 'ltr', enabled: false, rolloutPriority: 64 },
  { code: 'zu',    nativeName: 'isiZulu',         englishName: 'Zulu',               direction: 'ltr', enabled: false, rolloutPriority: 65 },
];

export const LOCALE_CODES = LOCALES.map((l) => l.code);

export function getLocaleMeta(code: string): LocaleMeta | undefined {
  return LOCALES.find((l) => l.code === code);
}

export function getEnabledLocales(): LocaleMeta[] {
  return LOCALES.filter((l) => l.enabled).sort((a, b) => a.rolloutPriority - b.rolloutPriority);
}

export function isRtl(code: string): boolean {
  return getLocaleMeta(code)?.direction === 'rtl';
}
