# Hướng dẫn Deploy Querencia — Từ đầu đến production

> Thứ tự: Supabase → Upstash Redis → Fly.io (API) → Fly.io (AI) → Vercel (Web)

---

## Tổng quan kiến trúc deploy

```
Người dùng
    ↓ HTTPS
Cloudflare (WAF + CDN — bạn đã có domain querencia.com.vn)
    ↓
Vercel (Next.js web app)          ← DEPLOY MỚI
    ↓ /api/v1/*                   ↓ /ai/*
Fly.io: querencia-api (NestJS)    Fly.io: querencia-ai (FastAPI)
    ↓ DB + Queue                  ↓ AI cache
Supabase PostgreSQL (đã có)       Upstash Redis
```

---

## BƯỚC 1 — Supabase (đã có, chỉ cần chạy migration)

### 1.1 Lấy connection string
Bạn đã có DATABASE_URL trong .env cũ:
```
postgresql://postgres.adjamcmkwnevklmakjby:...@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
```
Giữ nguyên — **không tạo database mới**, data cũ còn nguyên.

### 1.2 Chạy migration SQL (thêm cột mới, không xóa cột cũ)
Vào **Supabase Dashboard → SQL Editor** → paste và chạy từng file:

1. `packages/db/src/migrations/0001_auth_fields.sql`
2. `packages/db/src/migrations/0002_cui_bap_tables.sql`

> ⚠️ Đọc kỹ mỗi file — đều dùng `CREATE TABLE IF NOT EXISTS` và `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
> nên **an toàn với data cũ**, không mất gì.

---

## BƯỚC 2 — Upstash Redis (tạo mới, miễn phí)

Redis cần cho: session (db0), quota (db1), AI cache (db2), app cache (db3), BullMQ (db4).

1. Vào https://console.upstash.com → **Create Database**
2. Chọn **Global** (multi-region) hoặc **ap-southeast-1** (Singapore gần nhất)
3. Tên: `querencia-redis`
4. Sau khi tạo xong → vào database → copy **REST URL** và **REST Token**

> Free tier: 10,000 commands/day — đủ để test. Upgrade khi có user thật.

Bạn sẽ có:
```
UPSTASH_REDIS_URL=https://xxx.upstash.io
UPSTASH_REDIS_TOKEN=AXxx...
```

---

## BƯỚC 3 — Fly.io: Deploy NestJS API

### 3.1 Cài flyctl (nếu chưa có)
```bash
# macOS
brew install flyctl

# Windows
iwr https://fly.io/install.ps1 -useb | iex

# Linux
curl -L https://fly.io/install.sh | sh
```

### 3.2 Login
```bash
flyctl auth login
```

### 3.3 Tạo app mới cho API
```bash
cd querencia  # thư mục monorepo gốc

# Tạo app (đặt tên khác querencia vì đã dùng)
flyctl apps create querencia-api --org personal
```

### 3.4 Set secrets (env vars)
Chạy từng lệnh — thay giá trị thật vào:

```bash
# Database (copy từ .env cũ)
flyctl secrets set \
  DATABASE_URL="postgresql://postgres.adjamcmkwnevklmakjby:2yXxXF7RQN3ZRgVK@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres" \
  --app querencia-api

# JWT secrets (tạo random)
flyctl secrets set \
  JWT_ACCESS_SECRET="$(openssl rand -base64 32)" \
  JWT_REFRESH_SECRET="$(openssl rand -base64 32)" \
  JWT_ACCESS_EXPIRES_IN="15m" \
  JWT_REFRESH_EXPIRES_IN="7d" \
  --app querencia-api

# Redis (từ Upstash bước 2)
flyctl secrets set \
  UPSTASH_REDIS_URL="https://xxx.upstash.io" \
  --app querencia-api

# Auth
flyctl secrets set \
  NEXTAUTH_URL="https://querencia.com.vn" \
  API_PUBLIC_URL="https://querencia-api.fly.dev" \
  GOOGLE_CLIENT_ID="your-google-client-id" \
  GOOGLE_CLIENT_SECRET="your-google-client-secret" \
  GOOGLE_REDIRECT_URI="https://querencia-api.fly.dev/api/v1/auth/google/callback" \
  --app querencia-api

# Email (Resend)
flyctl secrets set \
  RESEND_API_KEY="re_your_key" \
  --app querencia-api

# R2 Storage
flyctl secrets set \
  R2_ACCOUNT_ID="your-account-id" \
  R2_ACCESS_KEY_ID="your-key-id" \
  R2_SECRET_ACCESS_KEY="your-secret" \
  R2_BUCKET_NAME="querencia-files" \
  R2_PUBLIC_URL="https://files.querencia.com.vn" \
  --app querencia-api

flyctl secrets set NODE_ENV="production" --app querencia-api
```

### 3.5 Cập nhật fly.toml cho API
File: `infra/fly/api.fly.toml` — đổi tên app:
```toml
app = "querencia-api"   # ← tên bạn tạo ở bước 3.3
primary_region = "sin"
```

### 3.6 Deploy
```bash
flyctl deploy --config infra/fly/api.fly.toml --app querencia-api
```

Đợi 2-3 phút. Kiểm tra:
```bash
curl https://querencia-api.fly.dev/health
# → {"status":"healthy"}
```

---

## BƯỚC 4 — Fly.io: Deploy FastAPI AI Service

### 4.1 Tạo app
```bash
flyctl apps create querencia-ai --org personal
```

### 4.2 Set secrets
```bash
flyctl secrets set \
  ANTHROPIC_API_KEY="sk-ant-your-key" \
  OPENAI_API_KEY="sk-your-fallback" \
  DATABASE_URL="postgresql://..." \
  UPSTASH_REDIS_URL="https://xxx.upstash.io" \
  API_SERVICE_URL="https://querencia-api.fly.dev" \
  AI_SERVICE_INTERNAL_KEY="$(openssl rand -base64 32)" \
  ENV="production" \
  --app querencia-ai
```

### 4.3 Deploy
```bash
flyctl deploy --config infra/fly/ai-service.fly.toml --app querencia-ai
```

Kiểm tra:
```bash
curl https://querencia-ai.fly.dev/health
# → {"status":"ok","service":"ai-service"}
```

---

## BƯỚC 5 — Vercel: Deploy Next.js Web

### 5.1 Push code lên GitHub trước
```bash
cd querencia
git init
git add .
git commit -m "feat: Querencia monorepo v1"
git remote add origin https://github.com/your-username/querencia.git
git push -u origin main
```

### 5.2 Import vào Vercel
1. Vào https://vercel.com → **Add New Project**
2. Import repo `querencia` từ GitHub
3. **Framework Preset:** Next.js
4. **Root Directory:** `apps/web` ← quan trọng!
5. **Build Command:** `cd ../.. && pnpm build --filter=@querencia/web`
6. **Output Directory:** `.next`

### 5.3 Thêm Environment Variables trong Vercel Dashboard
Vào **Settings → Environment Variables** → thêm:

```
# NextAuth
NEXTAUTH_URL=https://querencia.com.vn
NEXTAUTH_SECRET=<openssl rand -base64 32>

# API
NEXT_PUBLIC_API_URL=/api/v1
API_SERVICE_URL=https://querencia-api.fly.dev
AI_SERVICE_URL=https://querencia-ai.fly.dev

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 5.4 Kết nối domain querencia.com.vn
1. Vercel → **Settings → Domains** → Add `querencia.com.vn`
2. Vercel sẽ hiện DNS records cần thêm
3. Vào **Cloudflare Dashboard → DNS** → thêm records đó

> Vì bạn đang dùng Cloudflare làm CDN, chọn **Proxy: OFF (DNS only)** cho CNAME Vercel
> hoặc dùng A record nếu Vercel yêu cầu.

### 5.5 Deploy
Vercel tự deploy khi push lên `main`. Hoặc bấm **Deploy** trong dashboard.

---

## BƯỚC 6 — Google OAuth setup

1. Vào https://console.cloud.google.com
2. **APIs & Services → Credentials → Create OAuth Client ID**
3. Application type: **Web application**
4. Authorized redirect URIs:
   ```
   https://querencia-api.fly.dev/api/v1/auth/google/callback
   https://querencia.com.vn/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
5. Copy Client ID và Client Secret → set vào Fly.io secrets và Vercel env vars

---

## BƯỚC 7 — Kiểm tra sau deploy

```bash
# 1. API health
curl https://querencia-api.fly.dev/health

# 2. AI health  
curl https://querencia-ai.fly.dev/health

# 3. Web
curl https://querencia.com.vn

# 4. Auth flow
# → Vào querencia.com.vn → Đăng ký → Nhận email xác nhận → Đăng nhập

# 5. LàNo AI
# → /dashboard/lano → Gõ thử → Xem streaming

# 6. Tools
# → /tools/pdf-to-word → Upload PDF → Xem convert
```

---

## Thứ tự ưu tiên nếu có lỗi

1. **Xem logs:** `flyctl logs --app querencia-api`
2. **Kiểm tra secrets:** `flyctl secrets list --app querencia-api`
3. **SSH vào app:** `flyctl ssh console --app querencia-api`

---

## Chi phí ước tính ban đầu

| Service | Free tier | Khi cần upgrade |
|---------|-----------|-----------------|
| Vercel  | Free (100GB bandwidth) | $20/tháng Pro |
| Fly.io API | ~$3-5/tháng (shared-cpu-1x, 512MB) | Tùy traffic |
| Fly.io AI  | ~$3-5/tháng (1GB RAM) | Tùy traffic |
| Supabase | Free (500MB DB) | $25/tháng Pro |
| Upstash Redis | Free (10K cmd/day) | $0.20/100K cmd |
| Resend email | Free (3K emails/tháng) | $20/tháng |

> Tổng ban đầu: ~$6-10/tháng (chỉ Fly.io)

