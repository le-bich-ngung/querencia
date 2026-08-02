/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║   Querencia - Smart Table Extractor · Cloudflare Worker     ║
 * ║   Proxy Claude API với Rate Limiting 2 lớp                  ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * DEPLOY INSTRUCTIONS:
 * 1. Vào https://dash.cloudflare.com → Workers & Pages → Create Worker
 * 2. Paste toàn bộ file này vào editor
 * 3. Settings → Variables → thêm Secret:
 *      ANTHROPIC_API_KEY = sk-ant-...
 * 4. Settings → Variables → thêm KV Namespace binding:
 *      Tạo KV namespace tên "RATE_LIMIT_KV"
 *      Bind với variable name: RATE_LIMIT_KV
 * 5. Deploy → copy Worker URL
 * 6. Trong smart-table-extractor.html, đổi endpoint thành Worker URL
 *
 * RATE LIMITS (điều chỉnh ở CONFIG bên dưới):
 *   - 3 requests / phút / IP   → chặn burst abuse
 *   - 10 requests / ngày / IP  → giới hạn free tier
 *
 * COST ESTIMATE (Claude Sonnet 4):
 *   ~$0.003–0.008 per extract
 *   10 users × 10 req/ngày = ~$0.30–0.80/ngày
 *   Anthropic free tier: $5 credit → ~600–1600 extracts miễn phí
 */

// ─────────────────────────────────────────────
//  CONFIG - chỉnh ở đây, không cần đụng code
// ─────────────────────────────────────────────
const CONFIG = {
  // Allowed origins - thêm domain production khi go-live
  ALLOWED_ORIGINS: [
    "https://querencia.com.vn",
    "https://www.querencia.com.vn",
    "http://localhost",          // dev local
    "http://127.0.0.1",         // dev local
    // thêm staging nếu có: "https://staging.querencia.com.vn"
  ],

  // Rate limit - PER IP
  RATE_MINUTE: 3,         // tối đa 3 requests / phút
  RATE_DAILY:  10,        // tối đa 10 requests / ngày (free tier MVP)

  // Claude model
  MODEL: "claude-sonnet-4-20250514",
  MAX_TOKENS: 4096,

  // Giới hạn payload size (bytes) để tránh abuse với ảnh cực lớn
  MAX_BODY_BYTES: 10 * 1024 * 1024, // 10MB

  // KV TTL (seconds)
  TTL_MINUTE: 60,
  TTL_DAY:    86400,
};

// ─────────────────────────────────────────────
//  MAIN HANDLER
// ─────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    // ── Handle CORS preflight ──
    if (request.method === "OPTIONS") {
      return corsResponse(null, 204, origin);
    }

    // ── Only POST allowed ──
    if (request.method !== "POST") {
      return corsResponse(json({ error: "Method not allowed" }), 405, origin);
    }

    // ── Validate origin ──
    if (!isAllowedOrigin(origin)) {
      return corsResponse(
        json({ error: "Origin không được phép truy cập." }),
        403,
        origin
      );
    }

    // ── Check API key configured ──
    if (!env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY chưa được cấu hình");
      return corsResponse(
        json({ error: "Server chưa được cấu hình. Vui lòng liên hệ admin." }),
        500,
        origin
      );
    }

    // ── Identify client ──
    const clientIP = getClientIP(request);

    // ── Rate limiting ──
    const rateLimitResult = await checkRateLimit(env, clientIP);
    if (!rateLimitResult.allowed) {
      return corsResponse(
        json({
          error: rateLimitResult.message,
          retryAfter: rateLimitResult.retryAfter,
          limitType: rateLimitResult.limitType,
        }),
        429,
        origin,
        { "Retry-After": String(rateLimitResult.retryAfter) }
      );
    }

    // ── Validate & parse body ──
    let body;
    try {
      const contentLength = parseInt(request.headers.get("Content-Length") || "0");
      if (contentLength > CONFIG.MAX_BODY_BYTES) {
        return corsResponse(
          json({ error: `Payload quá lớn. Tối đa ${CONFIG.MAX_BODY_BYTES / 1024 / 1024}MB.` }),
          413,
          origin
        );
      }
      body = await request.json();
    } catch {
      return corsResponse(json({ error: "Request body không hợp lệ." }), 400, origin);
    }

    // ── Validate messages ──
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return corsResponse(json({ error: "Thiếu trường messages." }), 400, origin);
    }

    // ── Strip any fields client shouldn't control ──
    const safePayload = {
      model:      CONFIG.MODEL,
      max_tokens: CONFIG.MAX_TOKENS,
      system:     body.system || undefined,
      messages:   sanitizeMessages(body.messages),
    };

    // ── Call Anthropic API ──
    let anthropicRes;
    try {
      anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method:  "POST",
        headers: {
          "Content-Type":      "application/json",
          "x-api-key":         env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(safePayload),
      });
    } catch (e) {
      console.error("Anthropic API network error:", e.message);
      return corsResponse(
        json({ error: "Không thể kết nối đến AI service. Thử lại sau." }),
        502,
        origin
      );
    }

    // ── Handle Anthropic errors ──
    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.json().catch(() => ({}));
      const statusCode = anthropicRes.status;

      // Map Anthropic errors → user-friendly messages
      const errMessages = {
        401: "API key không hợp lệ. Liên hệ admin.",
        403: "Không có quyền truy cập AI service.",
        429: "AI service đang quá tải. Thử lại sau ít phút.",
        500: "AI service gặp sự cố. Thử lại sau.",
        529: "AI service đang bận. Thử lại sau.",
      };

      const userMessage = errMessages[statusCode]
        || errBody.error?.message
        || `AI service lỗi (${statusCode}).`;

      console.error(`Anthropic error ${statusCode}:`, errBody);
      return corsResponse(json({ error: userMessage }), statusCode >= 500 ? 502 : statusCode, origin);
    }

    // ── Stream/return response ──
    const result = await anthropicRes.json();

    // ── Log usage (optional, for monitoring) ──
    const usage = result.usage || {};
    console.log(`[Extract] IP:${clientIP} in:${usage.input_tokens} out:${usage.output_tokens}`);

    // ── Attach remaining quota info to response ──
    const quota = await getRemainingQuota(env, clientIP);

    return corsResponse(
      json({
        ...result,
        _quota: {
          remaining_minute: quota.remainingMinute,
          remaining_daily:  quota.remainingDaily,
          resets_at_minute: quota.resetsAtMinute,
          resets_at_daily:  quota.resetsAtDaily,
        },
      }),
      200,
      origin
    );
  },
};

// ─────────────────────────────────────────────
//  RATE LIMITING  (Cloudflare KV)
//  Keys:
//    rl:min:{ip}:{minute_bucket}  → count (TTL 60s)
//    rl:day:{ip}:{day_bucket}     → count (TTL 86400s)
// ─────────────────────────────────────────────
async function checkRateLimit(env, ip) {
  if (!env.RATE_LIMIT_KV) {
    // KV not configured - allow but warn
    console.warn("RATE_LIMIT_KV chưa được bind. Rate limiting bị tắt.");
    return { allowed: true };
  }

  const now      = Date.now();
  const minKey   = `rl:min:${ip}:${Math.floor(now / 60000)}`;
  const dayKey   = `rl:day:${ip}:${new Date().toISOString().slice(0, 10)}`; // YYYY-MM-DD

  // Fetch both counts in parallel
  const [minRaw, dayRaw] = await Promise.all([
    env.RATE_LIMIT_KV.get(minKey),
    env.RATE_LIMIT_KV.get(dayKey),
  ]);

  const minCount = parseInt(minRaw || "0");
  const dayCount = parseInt(dayRaw || "0");

  // Check daily limit first (harder limit)
  if (dayCount >= CONFIG.RATE_DAILY) {
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    const secsUntilTomorrow = Math.ceil((tomorrow - now) / 1000);
    return {
      allowed:   false,
      limitType: "daily",
      message:   `Bạn đã dùng hết ${CONFIG.RATE_DAILY} lượt hôm nay. Quay lại vào ngày mai hoặc nâng cấp tài khoản Pro.`,
      retryAfter: secsUntilTomorrow,
    };
  }

  // Check per-minute limit
  if (minCount >= CONFIG.RATE_MINUTE) {
    const secsUntilNextMin = 60 - Math.floor((now % 60000) / 1000);
    return {
      allowed:   false,
      limitType: "minute",
      message:   `Bạn đang gửi quá nhanh. Vui lòng chờ ${secsUntilNextMin} giây rồi thử lại.`,
      retryAfter: secsUntilNextMin,
    };
  }

  // Increment both counters
  await Promise.all([
    env.RATE_LIMIT_KV.put(minKey, String(minCount + 1), { expirationTtl: CONFIG.TTL_MINUTE }),
    env.RATE_LIMIT_KV.put(dayKey, String(dayCount + 1), { expirationTtl: CONFIG.TTL_DAY    }),
  ]);

  return { allowed: true };
}

async function getRemainingQuota(env, ip) {
  if (!env.RATE_LIMIT_KV) return {};
  const now    = Date.now();
  const minKey = `rl:min:${ip}:${Math.floor(now / 60000)}`;
  const dayKey = `rl:day:${ip}:${new Date().toISOString().slice(0, 10)}`;
  const [minRaw, dayRaw] = await Promise.all([
    env.RATE_LIMIT_KV.get(minKey),
    env.RATE_LIMIT_KV.get(dayKey),
  ]);
  const nextMin  = new Date(Math.ceil(now / 60000) * 60000).toISOString();
  const tomorrow = new Date(); tomorrow.setUTCHours(24, 0, 0, 0);
  return {
    remainingMinute: Math.max(0, CONFIG.RATE_MINUTE - parseInt(minRaw || "0")),
    remainingDaily:  Math.max(0, CONFIG.RATE_DAILY  - parseInt(dayRaw || "0")),
    resetsAtMinute:  nextMin,
    resetsAtDaily:   tomorrow.toISOString(),
  };
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function isAllowedOrigin(origin) {
  if (!origin) return false;
  return CONFIG.ALLOWED_ORIGINS.some(
    (allowed) => origin === allowed || origin.startsWith(allowed)
  );
}

function getClientIP(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function sanitizeMessages(messages) {
  // Only allow role + content (text/image). Strip any injected fields.
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: sanitizeContent(msg.content),
  }));
}

function sanitizeContent(content) {
  if (typeof content === "string") return content.substring(0, 50000);
  if (Array.isArray(content)) {
    return content
      .filter((block) => ["text", "image"].includes(block.type))
      .map((block) => {
        if (block.type === "text") {
          return { type: "text", text: String(block.text || "").substring(0, 50000) };
        }
        if (block.type === "image") {
          // Validate image block structure
          if (block.source?.type === "base64" && block.source?.data && block.source?.media_type) {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
            if (!allowedTypes.includes(block.source.media_type)) return null;
            return {
              type: "image",
              source: {
                type:       "base64",
                media_type: block.source.media_type,
                data:       block.source.data,
              },
            };
          }
          return null;
        }
        return null;
      })
      .filter(Boolean);
  }
  return String(content).substring(0, 50000);
}

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

function corsResponse(body, status = 200, origin = "", extraHeaders = {}) {
  const headers = {
    "Access-Control-Allow-Origin":  isAllowedOrigin(origin) ? origin : CONFIG.ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age":       "86400",
    "X-Content-Type-Options":       "nosniff",
    ...extraHeaders,
  };
  if (!body) return new Response(null, { status, headers });
  return new Response(body.body, { status, headers: { ...headers, ...Object.fromEntries(body.headers) } });
}
