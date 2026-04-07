ï»¿export interface Tool {
  slug:        string;
  name:        string;
  nameVi:      string;
  descVi:      string;
  description: string;
  category:    string;   // id cá»§a category
  tier:        'free' | 'paid';
  qCost:       number;
  icon:        string;   // giá»¯ láº¡i Äá» tÆ°Æ¡ng thÃ­ch
  emoji:       string;   // dÃ¹ng trong ToolCard & ToolFrame
  htmlFile:    string;   // tÃªn file HTML trong /public/tools/
  tags:        string[];
  isNew?:      boolean;
}

export interface Category {
  id:      string;
  labelVi: string;
  emoji:   string;
}

export const CATEGORIES: Category[] = [
  { id: 'tai-lieu',    labelVi: 'TÃ i liá»u',     emoji: 'ð' },
  { id: 'hinh-anh',   labelVi: 'HÃ¬nh áº£nh',     emoji: 'ð¼ï¸' },
  { id: 'ai',         labelVi: 'AI',            emoji: 'ð¤' },
  { id: 'hoc-tap',    labelVi: 'Há»c táº­p',       emoji: 'ð' },
  { id: 'viet-lach',  labelVi: 'Viáº¿t lÃ¡ch',     emoji: 'âï¸' },
  { id: 'tien-ich',   labelVi: 'Tiá»n Ã­ch',      emoji: 'ð ï¸' },
  { id: 'bao-mat',    labelVi: 'Báº£o máº­t',       emoji: 'ð' },
  { id: 'nghe-nghiep',labelVi: 'Nghá» nghiá»p',   emoji: 'ð¼' },
];

export const TOOLS: Tool[] = [
  {
    slug: 'pdf-to-word',
    name: 'PDF â Word', nameVi: 'PDF sang Word',
    descVi: 'Chuyá»n PDF thÃ nh file Word cÃ³ thá» chá»nh sá»­a',
    description: 'Chuyá»n PDF thÃ nh file Word cÃ³ thá» chá»nh sá»­a',
    category: 'tai-lieu', tier: 'free', qCost: 0,
    icon: 'ð', emoji: 'ð', htmlFile: 'pdf-to-word.html',
    tags: ['pdf', 'word', 'convert'],
  },
  {
    slug: 'image-compress',
    name: 'NÃ©n áº£nh', nameVi: 'NÃ©n áº£nh',
    descVi: 'Giáº£m dung lÆ°á»£ng áº£nh mÃ  khÃ´ng máº¥t cháº¥t lÆ°á»£ng',
    description: 'Giáº£m dung lÆ°á»£ng áº£nh mÃ  khÃ´ng máº¥t cháº¥t lÆ°á»£ng',
    category: 'hinh-anh', tier: 'free', qCost: 0,
    icon: 'ð¼ï¸', emoji: 'ð¼ï¸', htmlFile: 'image-compress.html',
    tags: ['image', 'compress'],
  },
  {
    slug: 'text-summarize',
    name: 'TÃ³m táº¯t vÄn báº£n', nameVi: 'TÃ³m táº¯t vÄn báº£n',
    descVi: 'AI tÃ³m táº¯t bÃ i viáº¿t, tÃ i liá»u dÃ i',
    description: 'AI tÃ³m táº¯t bÃ i viáº¿t, tÃ i liá»u dÃ i',
    category: 'ai', tier: 'paid', qCost: 2,
    icon: 'ð', emoji: 'ð', htmlFile: 'text-summarize.html',
    tags: ['ai', 'summarize'],
  },
  {
    slug: 'flashcard-gen',
    name: 'Táº¡o Flashcard', nameVi: 'Táº¡o Flashcard',
    descVi: 'AI táº¡o flashcard tá»« tÃ i liá»u há»c',
    description: 'AI táº¡o flashcard tá»« tÃ i liá»u há»c',
    category: 'hoc-tap', tier: 'paid', qCost: 3,
    icon: 'ð', emoji: 'ð', htmlFile: 'flashcard-gen.html',
    tags: ['ai', 'study', 'flashcard'], isNew: true,
  },
  {
    slug: 'grammar-check',
    name: 'Kiá»m tra ngá»¯ phÃ¡p', nameVi: 'Kiá»m tra ngá»¯ phÃ¡p',
    descVi: 'Sá»­a lá»i chÃ­nh táº£ vÃ  ngá»¯ phÃ¡p tiáº¿ng Viá»t/Anh',
    description: 'Sá»­a lá»i chÃ­nh táº£ vÃ  ngá»¯ phÃ¡p tiáº¿ng Viá»t/Anh',
    category: 'viet-lach', tier: 'free', qCost: 0,
    icon: 'âï¸', emoji: 'âï¸', htmlFile: 'grammar-check.html',
    tags: ['grammar', 'writing'],
  },
  {
    slug: 'qr-generator',
    name: 'Táº¡o QR Code', nameVi: 'Táº¡o QR Code',
    descVi: 'Táº¡o QR code cho link, text, contact',
    description: 'Táº¡o QR code cho link, text, contact',
    category: 'tien-ich', tier: 'free', qCost: 0,
    icon: 'ð±', emoji: 'ð±', htmlFile: 'qr-generator.html',
    tags: ['qr', 'utility'],
  },
  {
    slug: 'password-gen',
    name: 'Táº¡o máº­t kháº©u', nameVi: 'Táº¡o máº­t kháº©u',
    descVi: 'Táº¡o máº­t kháº©u máº¡nh ngáº«u nhiÃªn',
    description: 'Táº¡o máº­t kháº©u máº¡nh ngáº«u nhiÃªn',
    category: 'bao-mat', tier: 'free', qCost: 0,
    icon: 'ð', emoji: 'ð', htmlFile: 'password-gen.html',
    tags: ['password', 'security'],
  },
  {
    slug: 'cv-builder',
    name: 'Táº¡o CV', nameVi: 'Táº¡o CV',
    descVi: 'AI giÃºp táº¡o CV chuyÃªn nghiá»p',
    description: 'AI giÃºp táº¡o CV chuyÃªn nghiá»p',
    category: 'nghe-nghiep', tier: 'paid', qCost: 5,
    icon: 'ð¼', emoji: 'ð¼', htmlFile: 'cv-builder.html',
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
