-- Migration 0001: Thêm auth fields vào bảng users
-- Chạy khi nâng cấp từ schema cũ (SQLAlchemy) sang Drizzle
-- Tất cả cột đều NULLABLE hoặc có DEFAULT để không break data cũ

-- Bảng users cũ đã có: id (integer), email, username, hashed_password,
--   is_active, plan, is_verified, verification_token, google_id, created_at
-- Bảng users mới dùng UUID, thêm: name (alias username), avatar_url, fcm_token, updated_at

-- NOTE: Nếu migrate từ production cũ (Integer PK), cần script riêng để convert ID.
-- File này chỉ dành cho database MỚI hoàn toàn.

-- Tạo enum plan nếu chưa có
DO $$ BEGIN
  CREATE TYPE plan AS ENUM ('free', 'pro', 'enterprise');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- users table
CREATE TABLE IF NOT EXISTS users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT NOT NULL UNIQUE,
  name                TEXT,
  avatar_url          TEXT,
  plan                plan NOT NULL DEFAULT 'free',
  hashed_password     TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  is_verified         BOOLEAN NOT NULL DEFAULT false,
  verification_token  TEXT,
  google_id           TEXT UNIQUE,
  fcm_token           TEXT,
  fcm_token_updated_at TIMESTAMP WITH TIME ZONE,
  created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- accounts table (OAuth providers)
CREATE TABLE IF NOT EXISTS accounts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider             TEXT NOT NULL,
  provider_account_id  TEXT NOT NULL,
  access_token         TEXT,
  refresh_token        TEXT,
  expires_at           TIMESTAMP WITH TIME ZONE,
  created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_google_id_idx ON users(google_id);
CREATE INDEX IF NOT EXISTS users_verification_token_idx ON users(verification_token);
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);

-- updated_at auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Apple Sign-In support
ALTER TABLE users ADD COLUMN IF NOT EXISTS apple_id TEXT UNIQUE;

-- User blocks + reports
CREATE TABLE IF NOT EXISTS user_blocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS user_reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(reporter_id, reported_id)
);

-- FCM token
ALTER TABLE users ADD COLUMN IF NOT EXISTS fcm_token TEXT;
