# Migration Status — Code cũ → Monorepo v3

Cập nhật: Tháng 3/2026

## ✅ Đã hoàn thành

### apps/api/src/ (NestJS)
- [x] main.ts — Bootstrap, Swagger, CORS, validation pipe
- [x] app.module.ts — All modules wired
- [x] **modules/auth/** — HOÀN CHỈNH
  - [x] auth.service.ts — register, login, verify, refresh, forgot/reset pw, Google OAuth
  - [x] auth.controller.ts — tất cả endpoints + HTML pages (verify, reset-password)
  - [x] auth.module.ts — JWT module async config
  - [x] jwt.strategy.ts — validate token, attach user to request
- [x] **modules/nope/** — HOÀN CHỈNH
  - [x] nope.service.ts — getFeed, search, getPost, create, delete, thank, save, comment, follow, report
  - [x] nope.controller.ts — 14 endpoints đầy đủ
- [x] **modules/cui-bap/** — HOÀN CHỈNH
  - [x] cui-bap.service.ts — DM conv, messages, file upload R2, groups, reactions, polls, settings
  - [x] cui-bap.controller.ts — 22 endpoints đầy đủ
  - [x] gateways/chat.gateway.ts — WebSocket multi-device (typing, events)
- [x] modules/tools/ — ToolsService (catalog), QuotaService (Redis db1), ToolsController
- [x] common/guards/ — JwtAuthGuard, QuotaGuard
- [x] common/decorators/ — @CurrentUser(), @Public()
- [x] common/filters/ — GlobalExceptionFilter

### apps/ai-service/ (FastAPI)
- [x] main.py — Tất cả routers
- [x] **routers/lano/chat.py** — LàNo AI chat endpoint
- [x] **routers/lano/stream.py** — LàNo AI streaming (SSE + Anthropic prompt caching)
  - System prompt đầy đủ từ code cũ (750+ words)
- [x] routers/tools/flashcards/ — Migrated từ querencia-tools
- [x] routers/tools/vault/ — Migrated từ querencia-tools (cleanup loop)
- [x] routers/tools/pdf/ — Migrated từ querencia-tools

### apps/web/ (Next.js)
- [x] package.json — dependencies đầy đủ
- [x] next.config.js — i18n EN/VI, image domains, API proxy
- [x] tailwind.config.ts — design tokens từ design-system.css cũ
- [x] src/styles/globals.css — CSS vars: --sage, --bg-warm, --border, v.v.
- [x] src/app/layout.tsx — metadata, font, Providers
- [x] src/components/providers.tsx — SessionProvider
- [x] src/app/api/auth/[...nextauth]/route.ts — Google OAuth + Credentials
- [x] **src/app/dashboard/lano/page.tsx** — LàNo chat UI (streaming, useChat hook)
- [x] src/lib/api-client.ts — apiRequest helper + authApi, nopeApi, cuiBapApi, toolsApi

### packages/db/src/schema/
- [x] users.ts, nope.ts, cui-bap.ts (13 tables), messages.ts, tools.ts, payments.ts, vectors.ts

### packages/redis/src/
- [x] db0-session.ts, db1-quota.ts, db2-ai-cache.ts, db3-app-cache.ts, db4-queue.ts

### packages/queue/src/
- [x] ai-job.ts, ai.worker.ts, dlq.processor.ts

### infra/
- [x] Dockerfiles (NestJS + FastAPI)
- [x] fly.toml (Singapore)
- [x] GitHub Actions CI + deploy pipelines

## 🔄 Cần làm tiếp (P1)

### apps/api — Wire DB thật (thay STUBs)
- [ ] auth.service.ts — replace STUB với Drizzle queries
- [ ] nope.service.ts — replace TODO với Drizzle queries
- [ ] cui-bap.service.ts — replace TODO với Drizzle queries
- [ ] tools.service.ts — replace TODO với Drizzle queries

### apps/web — UI còn lại
- [ ] dashboard/nope/page.tsx — Feed, create post, comments UI
- [ ] dashboard/cui-bap/page.tsx — Chat UI (WebSocket + REST)
  → Tái sử dụng logic từ _old/querencia-frontend/js/cuibap.js
- [ ] dashboard/tools/page.tsx — Tool listing (free/paid badges)
- [ ] app/tools/[slug]/page.tsx — Wrap 13 tool HTML vào Next.js route

### P2
- [ ] apps/api/modules/payments/ — Paddle webhook handler
- [ ] packages/redis — Gắn vào modules thật
- [ ] apps/ai-service/routers/rag/ — pgvector embed + retrieve

## 📁 Code cũ (tham chiếu)
Lưu tại `_old/`:
- `_old/querencia-backend/` — FastAPI monolith gốc
- `_old/querencia-tools/` — Tools backend gốc
- `_old/querencia-frontend/` — HTML/JS frontend gốc (13 tools HTML + cuibap.js)
