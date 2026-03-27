export interface Tool {
  slug:        string;
  name:        string;
  description: string;
  category:    string;
  tier:        'free' | 'paid';
  qCost:       number;
  icon:        string;
  tags:        string[];
}

export const TOOLS: Tool[] = [
  { slug: 'pdf-to-word',      name: 'PDF → Word',        description: 'Chuyển PDF thành file Word có thể chỉnh sửa',        category: 'Tài liệu',   tier: 'free', qCost: 0, icon: '📄', tags: ['pdf', 'word', 'convert'] },
  { slug: 'image-compress',   name: 'Nén ảnh',           description: 'Giảm dung lượng ảnh mà không mất chất lượng',        category: 'Hình ảnh',   tier: 'free', qCost: 0, icon: '🖼️', tags: ['image', 'compress'] },
  { slug: 'text-summarize',   name: 'Tóm tắt văn bản',  description: 'AI tóm tắt bài viết, tài liệu dài',                 category: 'AI',         tier: 'paid', qCost: 2, icon: '📝', tags: ['ai', 'summarize'] },
  { slug: 'flashcard-gen',    name: 'Tạo Flashcard',     description: 'AI tạo flashcard từ tài liệu học',                  category: 'Học tập',    tier: 'paid', qCost: 3, icon: '🃏', tags: ['ai', 'study', 'flashcard'] },
  { slug: 'grammar-check',    name: 'Kiểm tra ngữ pháp', description: 'Sửa lỗi chính tả và ngữ pháp tiếng Việt/Anh',      category: 'Viết lách',  tier: 'free', qCost: 0, icon: '✍️', tags: ['grammar', 'writing'] },
  { slug: 'qr-generator',     name: 'Tạo QR Code',       description: 'Tạo QR code cho link, text, contact',               category: 'Tiện ích',   tier: 'free', qCost: 0, icon: '📱', tags: ['qr', 'utility'] },
  { slug: 'password-gen',     name: 'Tạo mật khẩu',      description: 'Tạo mật khẩu mạnh ngẫu nhiên',                      category: 'Bảo mật',    tier: 'free', qCost: 0, icon: '🔐', tags: ['password', 'security'] },
  { slug: 'cv-builder',       name: 'Tạo CV',            description: 'AI giúp tạo CV chuyên nghiệp',                      category: 'Nghề nghiệp', tier: 'paid', qCost: 5, icon: '💼', tags: ['cv', 'resume', 'ai'] },
];

export function getToolsByCategory() {
  const map = new Map<string, Tool[]>();
  for (const t of TOOLS) {
    if (!map.has(t.category)) map.set(t.category, []);
    map.get(t.category)!.push(t);
  }
  return map;
}
