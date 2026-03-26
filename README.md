# Querencia — Hệ sinh thái

> **Nope** · **Cùi Bắp** · **LàNo** · **Tools**

Monorepo Turborepo với NestJS (TypeScript) + FastAPI (Python) + Next.js.

---

## Cấu trúc

```
querencia/
├── apps/
│   ├── web/           # Next.js — Website (Tầng 0)
│   ├── api/           # NestJS — Business logic (Tầng 2–3)
│   └── ai-service/    # FastAPI — AI/ML pipeline (Tầng 3 FastAPI)
├── packages/
│   ├── db/            # Drizzle ORM + Supabase schema (Tầng 4)
│   ├── redis/         # Redis db0–4 tách index (Cache layer)
│   ├── queue/         # BullMQ workers (Queue/Async layer)
│   ├── types/         # Shared TypeScript types
│   ├── ui/            # Shared React components
│   └── config/        # ESLint + TypeScript config
└── infra/
    ├── fly/           # Fly.io deploy config
    ├── cloudflare/    # WAF + Rate limit rules
    └── github-actions/ # CI/CD pipelines
```

## Redis DB Index Map

| DB  | Dùng cho         | TTL       |
|-----|------------------|-----------|
| db0 | Session / Auth   | Token TTL |
| db1 | Q Quota engine   | 24h       |
| db2 | AI result cache  | 1h        |
| db3 | App cache / Feed | 5m        |
| db4 | BullMQ queue     | —         |

## Khởi động dev

```bash
# Install
pnpm install

# Copy env
cp .env.example .env

# Dev tất cả
pnpm dev

# Dev từng app
pnpm dev:web    # Next.js :3000
pnpm dev:api    # NestJS :3001
pnpm dev:ai     # FastAPI :8000

# DB
pnpm db:generate   # Tạo migration
pnpm db:migrate    # Chạy migration
pnpm db:seed       # Seed data
```

## Tech Stack

| Layer        | Tech                                  |
|--------------|---------------------------------------|
| Edge         | Cloudflare (WAF, DDoS, CDN, R2)      |
| Auth         | NextAuth.js + JWT + SSO               |
| Gateway      | NestJS + Swagger                      |
| Quota        | Redis db1 atomic INCR                 |
| Payment      | Paddle (tax auto, merchant of record) |
| AI Primary   | Anthropic + prompt caching            |
| AI Fallback  | OpenAI (Vercel AI SDK)                |
| Queue        | BullMQ + DLQ retry 3x                 |
| DB           | Supabase PostgreSQL + pgvector        |
| Storage      | Cloudflare R2                         |
| Deploy       | Fly.io (Singapore)                    |
| CI/CD        | GitHub Actions                        |
| Monitoring   | Better Stack + Sentry                 |
