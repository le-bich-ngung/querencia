ï»¿/**
 * Contextual Links â tá»± nháº­n biáº¿t context vÃ  táº¡o deep link ÄÃºng
 *
 * DÃ¹ng cho:
 *   - LÃ No: khi AI Äá» cáº­p tool â táº¡o link vÃ o tool ÄÃ³
 *   - Read: link ná»i bá» trong bÃ i viáº¿t
 *   - Nope: mention tool â link vÃ o tools page
 *   - Tools: suggest related tools
 */

export interface ContextLink {
  text: string;        // text hiá»n thá»
  href: string;        // URL ÄÃ­ch
  type: 'tool' | 'app' | 'page' | 'external';
  description?: string;
}

// Keyword â deep link mapping
const TOOL_KEYWORDS: Record<string, { href: string; name: string }> = {
  'pdf': { href: '/tools/pdf-to-word', name: 'PDF â Word' },
  'word': { href: '/tools/pdf-to-word', name: 'PDF â Word' },
  'áº£nh': { href: '/tools/image-editor', name: 'Image Editor' },
  'hÃ¬nh áº£nh': { href: '/tools/image-editor', name: 'Image Editor' },
  'image': { href: '/tools/image-editor', name: 'Image Editor' },
  'nÃ©n áº£nh': { href: '/tools/compressor', name: 'Image Compressor' },
  'compress': { href: '/tools/compressor', name: 'Image Compressor' },
  'qr': { href: '/tools/qr-generator', name: 'QR Generator' },
  'mÃ£ qr': { href: '/tools/qr-generator', name: 'QR Generator' },
  'máº­t kháº©u': { href: '/tools/password-generator', name: 'Password Generator' },
  'password': { href: '/tools/password-generator', name: 'Password Generator' },
  'flashcard': { href: '/tools/flashcards', name: 'Flashcards' },
  'tháº» ghi nhá»': { href: '/tools/flashcards', name: 'Flashcards' },
  'markdown': { href: '/tools/markdown-editor', name: 'Markdown Editor' },
  'link tá»± há»§y': { href: '/tools/vault', name: 'Vault' },
  'vault': { href: '/tools/vault', name: 'Vault' },
  'ghi chÃº': { href: '/tools/notes', name: 'Notes' },
  'notes': { href: '/tools/notes', name: 'Notes' },
  'pomodoro': { href: '/tools/pomodoro', name: 'Pomodoro' },
  'json': { href: '/tools/json-formatter', name: 'JSON Formatter' },
  'regex': { href: '/tools/regex-tester', name: 'Regex Tester' },
};

const APP_KEYWORDS: Record<string, { href: string; name: string }> = {
  'lano': { href: '/dashboard/lano', name: 'LÃ No' },
  'lÃ no': { href: '/dashboard/lano', name: 'LÃ No' },
  'nope': { href: '/dashboard/nope', name: 'Nope' },
  'cÃ¹i báº¯p': { href: '/dashboard/cui-bap', name: 'CÃ¹i Báº¯p' },
  'cuibap': { href: '/dashboard/cui-bap', name: 'CÃ¹i Báº¯p' },
};

/**
 * Parse text vÃ  tÃ¬m contextual links
 * Tráº£ vá» danh sÃ¡ch link gá»£i Ã½ dá»±a trÃªn ná»i dung
 */
export function extractContextLinks(text: string): ContextLink[] {
  const lower = text.toLowerCase();
  const links: ContextLink[] = [];
  const seen = new Set<string>();

  for (const [keyword, target] of Object.entries(TOOL_KEYWORDS)) {
    if (lower.includes(keyword) && !seen.has(target.href)) {
      seen.add(target.href);
      links.push({
        text:  target.name,
        href:  target.href,
        type:  'tool',
        description: `Má» ${target.name}`,
      });
    }
  }

  for (const [keyword, target] of Object.entries(APP_KEYWORDS)) {
    if (lower.includes(keyword) && !seen.has(target.href)) {
      seen.add(target.href);
      links.push({
        text:  target.name,
        href:  target.href,
        type:  'app',
        description: `VÃ o ${target.name}`,
      });
    }
  }

  return links.slice(0, 3); // Max 3 gá»£i Ã½ táº¡i má»t thá»i Äiá»m
}

/**
 * Táº¡o deep link tá»« context cá»¥ thá»
 */
export function buildDeepLink(context: {
  app?: 'lano' | 'nope' | 'cui-bap' | 'tools';
  toolSlug?: string;
  postId?: string;
  query?: string;
}): string {
  if (context.toolSlug) return `/tools/${context.toolSlug}`;
  if (context.postId)   return `/dashboard/nope?post=${context.postId}`;
  if (context.app)      return `/dashboard/${context.app}`;
  return '/';
}

/**
 * Smart suggest: dá»±a trÃªn tool vá»«a dÃ¹ng â suggest related
 */
export const RELATED_TOOLS: Record<string, string[]> = {
  'pdf-to-word':         ['pdf-reader', 'pdf-tool', 'markdown-editor'],
  'image-editor':        ['compressor', 'crop-image', 'add-watermark'],
  'compressor':          ['image-editor', 'resize-image', 'convert-image'],
  'flashcards':          ['notes', 'pomodoro', 'word-counter'],
  'json-formatter':      ['api-tester', 'regex-tester', 'encode-tools'],
  'password-generator':  ['hash-generator', 'encode-tools', 'secure-notes'],
  'qr-generator':        ['barcode-scanner', 'url-shortener'],
  'vault':               ['file-vault', 'secure-notes', 'password-generator'],
  'markdown-editor':     ['word-counter', 'text-diff', 'readability'],
};

export function getRelatedTools(slug: string): string[] {
  return RELATED_TOOLS[slug] ?? [];
}
