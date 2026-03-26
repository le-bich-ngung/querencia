/**
 * Tools Registry — danh sách 44 tools
 * Phân loại: client-side (HTML tĩnh) vs backend (cần API)
 * Nguồn thu duy nhất: tools có phí (tier: 'paid')
 */

export type ToolTier = 'free' | 'paid';
export type ToolBackend = 'none' | 'ai-service' | 'external-api';

export interface Tool {
  slug:        string;
  name:        string;
  nameVi:      string;
  description: string;
  descVi:      string;
  emoji:       string;
  tier:        ToolTier;
  qCost:       number;        // Q deducted per use (0 = free)
  backend:     ToolBackend;
  htmlFile:    string;        // tên file trong /public/tools/
  category:    string;
  isNew?:      boolean;
}

export const TOOLS: Tool[] = [
  // ── IMAGE TOOLS ──────────────────────────────────────────────
  {
    slug: 'image-editor', name: 'Image Editor', nameVi: 'Chỉnh ảnh',
    description: 'Crop, resize, rotate, filters — all in browser',
    descVi: 'Cắt, chỉnh kích thước, xoay, thêm filter — không cần upload',
    emoji: '🖼️', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'image-editor.html', category: 'image',
  },
  {
    slug: 'compressor', name: 'Image Compressor', nameVi: 'Nén ảnh',
    description: 'Reduce image file size without losing quality',
    descVi: 'Giảm dung lượng ảnh mà không mất chất lượng',
    emoji: '🗜️', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'compressor.html', category: 'image',
  },
  {
    slug: 'collage', name: 'Collage Maker', nameVi: 'Ghép ảnh',
    description: 'Create photo collages with custom layouts',
    descVi: 'Tạo ảnh ghép với bố cục tự chọn',
    emoji: '🎨', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'collage.html', category: 'image',
  },
  {
    slug: 'metadata-remover', name: 'Metadata Remover', nameVi: 'Xóa metadata ảnh',
    description: 'Strip EXIF data from photos before sharing',
    descVi: 'Xóa thông tin EXIF khỏi ảnh trước khi chia sẻ',
    emoji: '🧹', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'metadata-remover.html', category: 'image',
  },
  {
    slug: 'image-to-pdf', name: 'Image → PDF', nameVi: 'Ảnh sang PDF',
    description: 'Convert images to PDF in one click',
    descVi: 'Chuyển ảnh sang PDF chỉ một click',
    emoji: '📄', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'image-to-pdf.html', category: 'image',
  },
  {
    slug: 'ocr', name: 'OCR — Image to Text', nameVi: 'Nhận dạng văn bản',
    description: 'Extract text from images',
    descVi: 'Trích xuất chữ từ ảnh — chạy hoàn toàn trên trình duyệt',
    emoji: '🔍', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'ocr.html', category: 'image',
  },
  {
    slug: 'screenshot-translator', name: 'Screenshot Translator', nameVi: 'Dịch ảnh chụp màn hình',
    description: 'Take a screenshot and translate the text instantly',
    descVi: 'Chụp màn hình và dịch văn bản ngay lập tức bằng AI',
    emoji: '🌐', tier: 'paid', qCost: 2, backend: 'ai-service',
    htmlFile: 'screenshot-translator.html', category: 'image', isNew: true,
  },

  // ── PDF TOOLS ────────────────────────────────────────────────
  {
    slug: 'pdf-reader', name: 'PDF Reader', nameVi: 'Đọc PDF',
    description: 'Read and annotate PDFs in your browser',
    descVi: 'Đọc và ghi chú PDF trực tiếp trên trình duyệt',
    emoji: '📖', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'pdf-reader.html', category: 'pdf',
  },
  {
    slug: 'pdf-tool', name: 'PDF Tools', nameVi: 'Công cụ PDF',
    description: 'Merge, split, compress PDFs',
    descVi: 'Gộp, tách, nén file PDF',
    emoji: '📑', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'pdf-tool.html', category: 'pdf',
  },
  {
    slug: 'pdf-to-word', name: 'PDF → Word', nameVi: 'PDF sang Word',
    description: 'Convert PDF to editable Word document',
    descVi: 'Chuyển PDF sang Word chỉnh sửa được',
    emoji: '📝', tier: 'free', qCost: 1, backend: 'ai-service',
    htmlFile: 'pdf-to-word.html', category: 'pdf',
  },

  // ── TEXT & CODE TOOLS ─────────────────────────────────────────
  {
    slug: 'markdown-editor', name: 'Markdown Editor', nameVi: 'Editor Markdown',
    description: 'Write and preview Markdown in real-time',
    descVi: 'Viết và xem trước Markdown theo thời gian thực',
    emoji: '✍️', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'markdown-editor.html', category: 'text',
  },
  {
    slug: 'text-diff', name: 'Text Diff', nameVi: 'So sánh văn bản',
    description: 'Compare two texts and highlight differences',
    descVi: 'So sánh hai đoạn văn bản và tô màu phần khác nhau',
    emoji: '🔀', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'text-diff.html', category: 'text',
  },
  {
    slug: 'word-counter', name: 'Word Counter', nameVi: 'Đếm từ',
    description: 'Count words, characters, sentences, reading time',
    descVi: 'Đếm từ, ký tự, câu, thời gian đọc',
    emoji: '🔢', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'word-counter.html', category: 'text',
  },
  {
    slug: 'regex-tester', name: 'Regex Tester', nameVi: 'Test Regex',
    description: 'Test and debug regular expressions',
    descVi: 'Kiểm tra và debug biểu thức chính quy',
    emoji: '⚙️', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'regex-tester.html', category: 'text',
  },
  {
    slug: 'json-formatter', name: 'JSON Formatter', nameVi: 'Format JSON',
    description: 'Format, validate and minify JSON',
    descVi: 'Format, validate và minify JSON',
    emoji: '{ }', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'json-formatter.html', category: 'text',
  },
  {
    slug: 'encode-tools', name: 'Encode / Decode', nameVi: 'Mã hóa / Giải mã',
    description: 'Base64, URL encode, HTML entities and more',
    descVi: 'Base64, URL encode, HTML entities và nhiều hơn',
    emoji: '🔐', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'encode-tools.html', category: 'text',
  },
  {
    slug: 'hash-generator', name: 'Hash Generator', nameVi: 'Tạo hash',
    description: 'Generate MD5, SHA-1, SHA-256 and more',
    descVi: 'Tạo MD5, SHA-1, SHA-256 và nhiều hơn',
    emoji: '#️⃣', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'hash-generator.html', category: 'text',
  },
  {
    slug: 'lorem-ipsum', name: 'Lorem Ipsum', nameVi: 'Tạo văn bản mẫu',
    description: 'Generate placeholder text',
    descVi: 'Tạo văn bản placeholder cho design',
    emoji: '📄', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'lorem-ipsum.html', category: 'text',
  },
  {
    slug: 'readability', name: 'Readability Score', nameVi: 'Điểm dễ đọc',
    description: 'Analyze text readability and complexity',
    descVi: 'Phân tích mức độ dễ đọc và phức tạp của văn bản',
    emoji: '📊', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'readability.html', category: 'text',
  },

  // ── PRODUCTIVITY TOOLS ────────────────────────────────────────
  {
    slug: 'flashcards', name: 'Flashcards', nameVi: 'Thẻ ghi nhớ',
    description: 'Create and study flashcard decks',
    descVi: 'Tạo và học bằng thẻ ghi nhớ — sync đám mây',
    emoji: '🃏', tier: 'free', qCost: 0, backend: 'ai-service',
    htmlFile: 'flashcards.html', category: 'productivity',
  },
  {
    slug: 'notes', name: 'Notes', nameVi: 'Ghi chú',
    description: 'Quick notes that stay in your browser',
    descVi: 'Ghi chú nhanh lưu trong trình duyệt',
    emoji: '📒', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'notes.html', category: 'productivity',
  },
  {
    slug: 'diary', name: 'Diary', nameVi: 'Nhật ký',
    description: 'Private diary that stays on your device',
    descVi: 'Nhật ký riêng tư lưu trên thiết bị của bạn',
    emoji: '📔', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'diary.html', category: 'productivity',
  },
  {
    slug: 'secure-notes', name: 'Secure Notes', nameVi: 'Ghi chú bảo mật',
    description: 'Encrypted notes that never leave your device',
    descVi: 'Ghi chú mã hóa, không rời khỏi thiết bị',
    emoji: '🔒', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'secure-notes.html', category: 'productivity',
  },
  {
    slug: 'pomodoro', name: 'Pomodoro Timer', nameVi: 'Hẹn giờ Pomodoro',
    description: 'Focus timer with Pomodoro technique',
    descVi: 'Hẹn giờ tập trung theo kỹ thuật Pomodoro',
    emoji: '🍅', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'pomodoro.html', category: 'productivity',
  },
  {
    slug: 'typing-trainer', name: 'Typing Trainer', nameVi: 'Luyện gõ 10 ngón',
    description: 'Train 10-finger typing speed and accuracy',
    descVi: 'Luyện tốc độ và độ chính xác gõ 10 ngón',
    emoji: '⌨️', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'typing_trainer_10_fingers.html', category: 'productivity',
  },
  {
    slug: 'cv-builder', name: 'CV Builder', nameVi: 'Tạo CV',
    description: 'Build a clean professional resume',
    descVi: 'Tạo CV chuyên nghiệp đẹp và sạch',
    emoji: '📋', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'cv-builder.html', category: 'productivity',
  },

  // ── SECURITY / PRIVACY ────────────────────────────────────────
  {
    slug: 'vault', name: 'Vault — Self-destruct Link', nameVi: 'Link tự hủy',
    description: 'Share files with auto-destruct links',
    descVi: 'Chia sẻ file với link tự hủy sau khi đọc',
    emoji: '💣', tier: 'free', qCost: 0, backend: 'ai-service',
    htmlFile: 'vault.html', category: 'security',
  },
  {
    slug: 'file-vault', name: 'File Vault', nameVi: 'Két file',
    description: 'Encrypt and store files locally',
    descVi: 'Mã hóa và lưu file trên trình duyệt của bạn',
    emoji: '🗄️', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'file-vault.html', category: 'security',
  },
  {
    slug: 'password-generator', name: 'Password Generator', nameVi: 'Tạo mật khẩu',
    description: 'Generate strong, customizable passwords',
    descVi: 'Tạo mật khẩu mạnh và tùy chỉnh',
    emoji: '🔑', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'password-generator.html', category: 'security',
  },

  // ── DEVELOPER TOOLS ───────────────────────────────────────────
  {
    slug: 'api-tester', name: 'API Tester', nameVi: 'Test API',
    description: 'Test REST APIs directly from your browser',
    descVi: 'Test REST API trực tiếp từ trình duyệt',
    emoji: '🚀', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'api-tester.html', category: 'dev',
  },
  {
    slug: 'css-gradient', name: 'CSS Gradient', nameVi: 'CSS Gradient',
    description: 'Visual CSS gradient generator',
    descVi: 'Tạo CSS gradient bằng giao diện trực quan',
    emoji: '🌈', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'css-gradient.html', category: 'dev',
  },
  {
    slug: 'color-picker', name: 'Color Picker', nameVi: 'Bảng màu',
    description: 'Pick colors, convert formats, build palettes',
    descVi: 'Chọn màu, chuyển đổi format, tạo bảng màu',
    emoji: '🎨', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'color-picker.html', category: 'dev',
  },
  {
    slug: 'qr-generator', name: 'QR Generator', nameVi: 'Tạo mã QR',
    description: 'Generate QR codes for URLs, text, and more',
    descVi: 'Tạo mã QR cho URL, văn bản và nhiều hơn',
    emoji: '📱', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'qr-generator.html', category: 'dev',
  },
  {
    slug: 'barcode-scanner', name: 'Barcode Scanner', nameVi: 'Quét mã vạch',
    description: 'Scan barcodes and QR codes with your camera',
    descVi: 'Quét mã vạch và QR bằng camera',
    emoji: '📷', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'barcode-scanner.html', category: 'dev',
  },

  // ── MEDIA TOOLS ──────────────────────────────────────────────
  {
    slug: 'audio-recorder', name: 'Audio Recorder', nameVi: 'Ghi âm',
    description: 'Record and download audio directly in browser',
    descVi: 'Ghi âm và tải về trực tiếp trên trình duyệt',
    emoji: '🎙️', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'audio-recorder.html', category: 'media',
  },
  {
    slug: 'screen-recorder', name: 'Screen Recorder', nameVi: 'Quay màn hình',
    description: 'Record your screen without any extension',
    descVi: 'Quay màn hình không cần cài extension',
    emoji: '🖥️', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'screen-recorder.html', category: 'media',
  },

  // ── CONVERSION / LOOKUP ───────────────────────────────────────
  {
    slug: 'converter', name: 'File Converter', nameVi: 'Chuyển đổi file',
    description: 'Convert between various file formats',
    descVi: 'Chuyển đổi giữa các định dạng file khác nhau',
    emoji: '🔄', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'converter.html', category: 'convert',
  },
  {
    slug: 'currency', name: 'Currency Converter', nameVi: 'Đổi ngoại tệ',
    description: 'Live currency conversion rates',
    descVi: 'Tỷ giá ngoại tệ cập nhật theo thời gian thực',
    emoji: '💱', tier: 'free', qCost: 0, backend: 'external-api',
    htmlFile: 'currency.html', category: 'convert',
  },
  {
    slug: 'unit-converter', name: 'Unit Converter', nameVi: 'Đổi đơn vị',
    description: 'Convert length, weight, temperature and more',
    descVi: 'Đổi độ dài, khối lượng, nhiệt độ và nhiều hơn',
    emoji: '📐', tier: 'free', qCost: 0, backend: 'external-api',
    htmlFile: 'unit-converter.html', category: 'convert',
  },
  {
    slug: 'ip-lookup', name: 'IP Lookup', nameVi: 'Tra cứu IP',
    description: 'Look up IP address information and geolocation',
    descVi: 'Tra cứu thông tin địa chỉ IP và vị trí địa lý',
    emoji: '🌍', tier: 'free', qCost: 0, backend: 'external-api',
    htmlFile: 'ip-lookup.html', category: 'convert',
  },
  {
    slug: 'world-clock', name: 'World Clock', nameVi: 'Giờ thế giới',
    description: 'Check current time in multiple time zones',
    descVi: 'Xem giờ hiện tại ở nhiều múi giờ khác nhau',
    emoji: '🕐', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'world-clock.html', category: 'convert',
  },

  // ── FUN / MISC ────────────────────────────────────────────────
  {
    slug: 'random', name: 'Random Generator', nameVi: 'Ngẫu nhiên',
    description: 'Numbers, names, colors, decisions — all random',
    descVi: 'Số, tên, màu, quyết định — hoàn toàn ngẫu nhiên',
    emoji: '🎲', tier: 'free', qCost: 0, backend: 'none',
    htmlFile: 'random.html', category: 'misc',
  },
  {
    slug: 'temp-email', name: 'Temp Email', nameVi: 'Email tạm',
    description: 'Generate a temporary email address',
    descVi: 'Tạo địa chỉ email tạm thời để tránh spam',
    emoji: '📧', tier: 'free', qCost: 0, backend: 'external-api',
    htmlFile: 'temp-email.html', category: 'misc',
  },
];

// Helper functions
export const getToolBySlug = (slug: string) =>
  TOOLS.find(t => t.slug === slug);

export const getToolsByCategory = (category: string) =>
  TOOLS.filter(t => t.category === category);

export const getPaidTools = () =>
  TOOLS.filter(t => t.tier === 'paid' || t.qCost > 0);

export const getFreeTools = () =>
  TOOLS.filter(t => t.tier === 'free' && t.qCost === 0);

export const CATEGORIES = [
  { id: 'image',        label: 'Image',       labelVi: 'Hình ảnh',   emoji: '🖼️' },
  { id: 'pdf',          label: 'PDF',          labelVi: 'PDF',        emoji: '📄' },
  { id: 'text',         label: 'Text & Code',  labelVi: 'Văn bản',    emoji: '✍️' },
  { id: 'productivity', label: 'Productivity', labelVi: 'Năng suất',  emoji: '⚡' },
  { id: 'security',     label: 'Security',     labelVi: 'Bảo mật',    emoji: '🔒' },
  { id: 'dev',          label: 'Developer',    labelVi: 'Lập trình',  emoji: '💻' },
  { id: 'media',        label: 'Media',        labelVi: 'Đa phương tiện', emoji: '🎬' },
  { id: 'convert',      label: 'Convert',      labelVi: 'Chuyển đổi', emoji: '🔄' },
  { id: 'misc',         label: 'Misc',         labelVi: 'Khác',       emoji: '🎲' },
];
