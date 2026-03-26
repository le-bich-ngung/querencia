# Querencia Security & Feature Modules

## 1. Smart History (`smart-history.ts`)
- **Lưu hoàn toàn trong browser** (localStorage) — không gửi server
- **GDPR/PDPA safe**: dữ liệu không rời thiết bị, user xóa browser = xóa hết
- Track: tools đã dùng, LàNo conversation context, bài đã đọc, Nope posts đã xem
- Usage: `toolHistory.record(slug, name, emoji)` sau mỗi lần dùng tool

## 2. Contextual Links (`contextual-links.ts`)
- Parse text → tìm keywords → gợi ý link tool/app phù hợp
- Dùng trong: LàNo chat response, Nope posts, Read articles
- `extractContextLinks(text)` → trả về tối đa 3 links
- `getRelatedTools(slug)` → tools liên quan

## 3. Lumen Mode (`components/ui/LumenMode.tsx`)
- `<CursorGlow>` — glow theo cursor (tắt nếu prefers-reduced-motion)
- `<SpotlightCard>` — spotlight effect khi hover card
- `<QPulse>` — pulse animation khi nhận Q
- `<AmbientGlow>` — ambient light cho LàNo bubbles
- `<LumenProvider>` — wrap toàn app (đã wire vào layout.tsx)

## 4. Gamification (`gamification.ts`)
- **Badges** (18 badges): tool_explorer, helpful, streak_30, pool_angel...
- **Streaks**: touch() mỗi ngày khi vào app → auto-unlock badge
- **Stats**: toolsUsed, qGifted, cbMessages...
- Browser-side, sync server optional
- Usage: `gameStats.recordToolUse(slug)` → tự check và unlock badge

## 5. Watermarking (`watermark.ts`)
- `addImageWatermark(file, opts)` → Canvas API, thêm "querencia.com.vn" vào ảnh
- `downloadWithWatermark(file, name)` → download kèm watermark tự động
- `getPDFWatermarkCSS()` → footer cho PDF export
- Scale watermark theo kích thước ảnh (không bị quá to/nhỏ)

## 6. Token Expiry (`jwt-auth.guard.ts` + `token.service.ts`)
- Access token: **15 phút**
- Refresh token: **7 ngày**, rotation mỗi lần dùng
- Revocation list trong Redis (`revoked:{jti}`)
- `TokenService.revokeAll(userId)` → force logout tất cả thiết bị

## 7. Rate Limiting (`throttle.guard.ts`)
- Redis sliding window — chính xác hơn fixed window
- **Auth endpoints**: 20 req/15 phút
- **Free plan**: 200 req/giờ
- **Pro plan**: 1000 req/giờ
- Headers chuẩn: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- Decorator: `@Throttle({ limit: 20, window: 900, keyExtra: 'login' })`

## 8. Captcha Trigger (`captcha.guard.ts`)
- Cloudflare Turnstile (server-side verify)
- Bật với decorator: `@RequireCaptcha()`
- Dùng trên: `/auth/register`, `/auth/login`
- Fail open nếu Cloudflare unreachable (không block user thật)

## 9. CORS & Security Headers (`security.middleware.ts`)
- CORS whitelist chặt: chỉ querencia.com.vn + localhost (dev)
- Headers: X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy
- Xóa: X-Powered-By (không lộ Express/NestJS)

## 10. Quota Guard (`quota.guard.ts`)
- Trừ Q trước khi dùng tool có phí
- Expiring Q trừ trước, permanent Q trừ sau
- `@QuotaCost(2)` → 2Q/lần dùng
- Trả 403 với message rõ ràng nếu không đủ Q

## 11. Obfuscation (next.config.js)
- `removeConsole: true` trong production (trừ error/warn)
- `poweredByHeader: false`
- Security headers trên tất cả routes
- React Strict Mode
