/**
 * Watermark — nhúng vào file/ảnh khi export khỏi tools
 * Client-side hoàn toàn (Canvas API)
 *
 * Dùng cho:
 *   - Image Editor: thêm watermark khi download
 *   - PDF export: footer "Created with Querencia"
 *   - Screenshot Translator output
 */

export interface WatermarkOptions {
  text?:      string;   // default: "querencia.com.vn"
  position?:  'bottom-right' | 'bottom-left' | 'bottom-center' | 'tile';
  opacity?:   number;   // 0–1, default 0.35
  fontSize?:  number;   // px, default 14
  color?:     string;   // default '#4a7c59'
  padding?:   number;   // px from edge, default 12
  visible?:   boolean;  // true = visible watermark, false = steganographic (invisible)
}

/**
 * Thêm watermark vào ảnh (Canvas API)
 * Input: File hoặc Blob của ảnh
 * Output: Blob đã có watermark
 */
export async function addImageWatermark(
  imageFile: File | Blob,
  opts: WatermarkOptions = {},
): Promise<Blob> {
  const {
    text     = 'querencia.com.vn',
    position = 'bottom-right',
    opacity  = 0.35,
    fontSize = 14,
    color    = '#4a7c59',
    padding  = 12,
    visible  = true,
  } = opts;

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(imageFile);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;

      // Draw original image
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      if (visible) {
        // ── Visible watermark ──────────────────────────────────
        const scale    = Math.min(canvas.width, canvas.height) / 800;
        const scaledFS = Math.max(10, fontSize * scale);
        const scaledPad = Math.max(8, padding * scale);

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.font        = `600 ${scaledFS}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle   = color;

        const metrics  = ctx.measureText(text);
        const tw       = metrics.width;
        const th       = scaledFS;

        // Background pill
        const bx = canvas.width  - tw - scaledPad * 2 - 4;
        const by = canvas.height - th - scaledPad * 2 - 4;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.roundRect(bx, by, tw + scaledPad * 2, th + scaledPad, 4);
        ctx.fill();

        // Text
        ctx.fillStyle = color;
        ctx.fillText(text, bx + scaledPad, by + th + scaledPad / 2);
        ctx.restore();
      } else {
        // ── Invisible steganographic watermark ─────────────────
        // Nhúng vào LSB của kênh alpha (không nhìn thấy)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const encoded = encodeToLSB(data, text);
        ctx.putImageData(encoded, 0, 0);
      }

      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/png');
    };
    img.onerror = reject;
    img.src = url;
  });
}

/** Nhúng text vào LSB (Least Significant Bit) của ảnh */
function encodeToLSB(imageData: ImageData, text: string): ImageData {
  const data   = imageData.data;
  const binary = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('') + '00000000';
  let bitIdx   = 0;
  for (let i = 0; i < data.length && bitIdx < binary.length; i += 4) {
    // Chỉ modify kênh Blue (i+2) — ít ảnh hưởng visual nhất
    data[i + 2] = (data[i + 2] & ~1) | parseInt(binary[bitIdx++] ?? '0');
  }
  return imageData;
}

/**
 * Watermark cho PDF (text footer)
 * Trả về string CSS để inject vào PDF content
 */
export function getPDFWatermarkCSS(): string {
  return `
    @page {
      margin-bottom: 24px;
    }
    body::after {
      content: 'Created with Querencia · querencia.com.vn';
      position: fixed;
      bottom: 8px;
      right: 12px;
      font-size: 9px;
      color: rgba(74, 124, 89, 0.5);
      font-family: sans-serif;
      pointer-events: none;
    }
  `;
}

/**
 * Hook để dùng trong tool pages
 */
export function downloadWithWatermark(
  file: File | Blob,
  fileName: string,
  options?: WatermarkOptions,
) {
  const isImage = (file as File).type?.startsWith('image/') || fileName.match(/\.(png|jpg|jpeg|webp|gif)$/i);

  if (isImage) {
    addImageWatermark(file, options).then(watermarked => {
      const url = URL.createObjectURL(watermarked);
      const a   = document.createElement('a');
      a.href    = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  } else {
    // Không phải ảnh → download thường
    const url = URL.createObjectURL(file);
    const a   = document.createElement('a');
    a.href    = url;
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
