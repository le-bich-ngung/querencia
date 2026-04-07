export interface Tool {
  slug:        string;
  name:        string;
  nameVi:      string;
  descVi:      string;
  description: string;
  category:    string;   // id của category
  tier:        'free' | 'paid';
  qCost:       number;
  icon:        string;   // giữ lại để tương thích
  emoji:       string;   // dùng trong ToolCard & ToolFrame
  htmlFile:    string;   // tên file HTML trong /public/tools/
  tags:        string[];
  isNew?:      boolean;
}

export interface Category {
  id:      string;
  labelVi: string;
  emoji:   string;
}

export const CATEGORIES: Category[] = [
  { id: 'tai-lieu',    labelVi: 'Tài liệu',     emoji: '📄' },
  { id: 'hinh-anh',   labelVi: 'Hình ảnh',     emoji: '🖼️' },
  { id: 'ai',         labelVi: 'AI',            emoji: '🤖' },
  { id: 'hoc-tap',    labelVi: 'Học tập',       emoji: '📚' },
  { id: 'viet-lach',  labelVi: 'Viết lách',     emoji: '✍️' },
  { id: 'tien-ich',   labelVi: 'Tiện ích',      emoji: '🛠️' },
  { id: 'bao-mat',    labelVi: 'Bảo mật',       emoji: '🔐' },
  { id: 'nghe-nghiep',labelVi: 'Nghề nghiệp',   emoji: '💼' },
];

export const TOOLS: Tool[] = [
  {
    slug: 'pdf-to-word',
    name: 'PDF → Word', nameVi: 'PDF sang Word',
    descVi: 'Chuyển PDF thành file Word có thể chỉnh sửa',
    description: 'Chuyển PDF thành file Word có thể chỉnh sửa',
    category: 'tai-lieu', tier: 'free', qCost: 0,
    icon: '📄', emoji: '📄', htmlFile: 'pdf-to-word.html',
    tags: ['pdf', 'word', 'convert'],
  },
  {
    slug: 'image-compress',
    name: 'Nén ảnh', nameVi: 'Nén ảnh',
    descVi: 'Giảm dung lượng ảnh mà không mất chất lượng',
    description: 'Giảm dung lượng ảnh mà không mất chất lượng',
    category: 'hinh-anh', tier: 'free', qCost: 0,
    icon: '🖼️', emoji: '🖼️', htmlFile: 'image-compress.html',
    tags: ['image', 'compress'],
  },
  {
    slug: 'text-summarize',
    name: 'Tóm tắt văn bản', nameVi: 'Tóm tắt văn bản',
    descVi: 'AI tóm tắt bài viết, tài liệu dài',
    description: 'AI tóm tắt bài viết, tài liệu dài',
    category: 'ai', tier: 'paid', qCost: 2,
    icon: '📝', emoji: '📝', htmlFile: 'text-summarize.html',
    tags: ['ai', 'summarize'],
  },
  {
    slug: 'flashcard-gen',
    name: 'Tạo Flashcard', nameVi: 'Tạo Flashcard',
    descVi: 'AI tạo flashcard từ tài liệu học',
    description: 'AI tạo flashcard từ tài liệu học',
    category: 'hoc-tap', tier: 'paid', qCost: 3,
    icon: '🃏', emoji: '🃏', htmlFile: 'flashcard-gen.html',
    tags: ['ai', 'study', 'flashcard'], isNew: true,
  },
  {
    slug: 'grammar-check',
    name: 'Kiểm tra ngữ pháp', nameVi: 'Kiểm tra ngữ pháp',
    descVi: 'Sửa lỗi chính tả và ngữ pháp tiếng Việt/Anh',
    description: 'Sửa lỗi chính tả và ngữ pháp tiếng Việt/Anh',
    category: 'viet-lach', tier: 'free', qCost: 0,
    icon: '✍️', emoji: '✍️', htmlFile: 'grammar-check.html',
    tags: ['grammar', 'writing'],
  },
  {
    slug: 'qr-generator',
    name: 'Tạo QR Code', nameVi: 'Tạo QR Code',
    descVi: 'Tạo QR code cho link, text, contact',
    description: 'Tạo QR code cho link, text, contact',
    category: 'tien-ich', tier: 'free', qCost: 0,
    icon: '📱', emoji: '📱', htmlFile: 'qr-generator.html',
    tags: ['qr', 'utility'],
  },
  {
    slug: 'password-gen',
    name: 'Tạo mật khẩu', nameVi: 'Tạo mật khẩu',
    descVi: 'Tạo mật khẩu mạnh ngẫu nhiên',
    description: 'Tạo mật khẩu mạnh ngẫu nhiên',
    category: 'bao-mat', tier: 'free', qCost: 0,
    icon: '🔐', emoji: '🔐', htmlFile: 'password-gen.html',
    tags: ['password', 'security'],
  },
  {
    slug: 'cv-builder',
    name: 'Tạo CV', nameVi: 'Tạo CV',
    descVi: 'AI giúp tạo CV chuyên nghiệp',
    description: 'AI giúp tạo CV chuyên nghiệp',
    category: 'nghe-nghiep', tier: 'paid', qCost: 5,
    icon: '💼', emoji: '💼', htmlFile: 'cv-builder.html',
    tags: ['cv', 'resume', 'ai'],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug);
}

export function getToolsByCategory(): Map<string, Tool[]> {
  const map = new Map<string, Tool[]>();
  for (const t of TOOLS) {
    if (!map.has(t.category)) map.set(t.category, []);
    map.get(t.category)!.push(t);
  }
  return map;
}

export function getFreeTools(): Tool[] {
  return TOOLS.filter(t => t.tier === 'free');
}

export function getPaidTools(): Tool[] {
  return TOOLS.filter(t => t.tier === 'paid');
}
