/**
 * Contextual Links - tự nhận biết context và tạo deep link đúng
 *
 * Dùng cho:
 *   - LàNo: khi AI đề cập tool → tạo link vào tool đó
 *   - Read: link nội bộ trong bài viết
 *   - Nope: mention tool → link vào tools page
 *   - Tools: suggest related tools
 */

export interface ContextLink {
  text: string;        // text hiển thị
  href: string;        // URL đích
  type: 'tool' | 'app' | 'page' | 'external';
  description?: string;
}

// Keyword → deep link mapping
const TOOL_KEYWORDS: Record<string, { href: string; name: string }> = {
  'pdf': { href: '/tools/pdf-to-word', name: 'PDF → Word' },
  'word': { href: '/tools/pdf-to-word', name: 'PDF → Word' },
  'ảnh': { href: '/tools/image-editor', name: 'Image Editor' },
  'hình ảnh': { href: '/tools/image-editor', name: 'Image Editor' },
  'image': { href: '/tools/image-editor', name: 'Image Editor' },
  'nén ảnh': { href: '/tools/compressor', name: 'Image Compressor' },
  'compress': { href: '/tools/compressor', name: 'Image Compressor' },
  'qr': { href: '/tools/qr-generator', name: 'QR Generator' },
  'mã qr': { href: '/tools/qr-generator', name: 'QR Generator' },
  'mật khẩu': { href: '/tools/password-generator', name: 'Password Generator' },
  'password': { href: '/tools/password-generator', name: 'Password Generator' },
  'flashcard': { href: '/tools/flashcards', name: 'Flashcards' },
  'thẻ ghi nhớ': { href: '/tools/flashcards', name: 'Flashcards' },
  'markdown': { href: '/tools/markdown-editor', name: 'Markdown Editor' },
  'link tự hủy': { href: '/tools/vault', name: 'Vault' },
  'vault': { href: '/tools/vault', name: 'Vault' },
  'ghi chú': { href: '/tools/notes', name: 'Notes' },
  'notes': { href: '/tools/notes', name: 'Notes' },
  'pomodoro': { href: '/tools/pomodoro', name: 'Pomodoro' },
  'json': { href: '/tools/json-formatter', name: 'JSON Formatter' },
  'regex': { href: '/tools/regex-tester', name: 'Regex Tester' },
};

const APP_KEYWORDS: Record<string, { href: string; name: string }> = {
  'lano': { href: '/dashboard/lano', name: 'LàNo' },
  'làno': { href: '/dashboard/lano', name: 'LàNo' },
  'nope': { href: '/dashboard/nope', name: 'Nope' },
  'cùi bắp': { href: '/dashboard/cui-bap', name: 'Cùi Bắp' },
  'cuibap': { href: '/dashboard/cui-bap', name: 'Cùi Bắp' },
};

/**
 * Parse text và tìm contextual links
 * Trả về danh sách link gợi ý dựa trên nội dung
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
        description: `Mở ${target.name}`,
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
        description: `Vào ${target.name}`,
      });
    }
  }

  return links.slice(0, 3); // Max 3 gợi ý tại một thời điểm
}

/**
 * Tạo deep link từ context cụ thể
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
 * Smart suggest: dựa trên tool vừa dùng → suggest related
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
