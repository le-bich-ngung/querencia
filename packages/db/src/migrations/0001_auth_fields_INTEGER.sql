-- ============================================================
-- Migration 0001 - PHIÊN BẢN DÀNH CHO DATABASE CŨ
-- Database cũ dùng INTEGER primary key (không phải UUID)
-- File này CHỈ thêm cột mới, KHÔNG tạo lại bảng đã có
-- An toàn với data cũ: tất cả dùng IF NOT EXISTS / ADD COLUMN IF NOT EXISTS
-- ============================================================

-- ── 1. Thêm cột vào bảng users cũ ───────────────────────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS name       TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS apple_id   TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS fcm_token  TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Copy username → name (nếu name chưa có)
UPDATE users SET name = username WHERE name IS NULL AND username IS NOT NULL;

-- ── 2. Bảng accounts (OAuth - tham chiếu INTEGER users.id) ──
CREATE TABLE IF NOT EXISTS accounts (
  id                   SERIAL PRIMARY KEY,
  user_id              INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider             TEXT NOT NULL,
  provider_account_id  TEXT NOT NULL,
  access_token         TEXT,
  refresh_token        TEXT,
  expires_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);

-- ── 3. User blocks + reports ──────────────────────────────────
CREATE TABLE IF NOT EXISTS user_blocks (
  id         SERIAL PRIMARY KEY,
  blocker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS user_reports (
  id          SERIAL PRIMARY KEY,
  reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(reporter_id, reported_id)
);

-- ── 4. updated_at trigger ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 5. Thêm cột mới vào bảng CB đã có ─────────────────────────
-- cb_messages
ALTER TABLE cb_messages ADD COLUMN IF NOT EXISTS is_edited     BOOLEAN DEFAULT false;
ALTER TABLE cb_messages ADD COLUMN IF NOT EXISTS is_deleted    BOOLEAN DEFAULT false;
ALTER TABLE cb_messages ADD COLUMN IF NOT EXISTS is_pinned     BOOLEAN DEFAULT false;
ALTER TABLE cb_messages ADD COLUMN IF NOT EXISTS reply_to_id   INTEGER REFERENCES cb_messages(id);
ALTER TABLE cb_messages ADD COLUMN IF NOT EXISTS edited_at     TIMESTAMPTZ;
ALTER TABLE cb_messages ADD COLUMN IF NOT EXISTS deleted_at    TIMESTAMPTZ;
ALTER TABLE cb_messages ADD COLUMN IF NOT EXISTS auto_delete_at TIMESTAMPTZ;
ALTER TABLE cb_messages ADD COLUMN IF NOT EXISTS delivered_at  TIMESTAMPTZ;
ALTER TABLE cb_messages ADD COLUMN IF NOT EXISTS reactions     JSONB DEFAULT '{}';

-- cb_group_messages
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS is_edited      BOOLEAN DEFAULT false;
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS is_deleted     BOOLEAN DEFAULT false;
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS is_pinned      BOOLEAN DEFAULT false;
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS reply_to_id    INTEGER REFERENCES cb_group_messages(id);
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS auto_delete_at TIMESTAMPTZ;
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS delivered_at   TIMESTAMPTZ;
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS reactions       JSONB DEFAULT '{}';

-- cb_group_members: thêm role nếu chưa có
ALTER TABLE cb_group_members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';

-- ── 6. Index cho read receipts và self-destruct ──────────────
CREATE INDEX IF NOT EXISTS cb_msg_autodel   ON cb_messages(auto_delete_at) WHERE auto_delete_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS cb_msg_delivered ON cb_messages(delivered_at)   WHERE delivered_at IS NULL;
CREATE INDEX IF NOT EXISTS cb_gmsg_autodel  ON cb_group_messages(auto_delete_at) WHERE auto_delete_at IS NOT NULL;

-- ── 7. Q token tables (mới hoàn toàn) ────────────────────────
CREATE TABLE IF NOT EXISTS q_usage_logs (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action     TEXT NOT NULL,
  q_type     TEXT NOT NULL DEFAULT 'expiring',
  q_cost     INTEGER NOT NULL DEFAULT 0,
  tool_slug  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS q_usage_user_idx ON q_usage_logs(user_id);

CREATE TABLE IF NOT EXISTS pro_orders (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  paddle_order_id  TEXT UNIQUE NOT NULL,
  days             INTEGER NOT NULL,
  amount_cents     INTEGER NOT NULL,
  status           TEXT NOT NULL DEFAULT 'completed',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 8. E2EE key storage ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS e2ee_keys (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  registration_id   INTEGER NOT NULL,
  identity_key      TEXT NOT NULL,
  signed_pre_key_id INTEGER NOT NULL,
  signed_pre_key    TEXT NOT NULL,
  signed_pre_key_sig TEXT NOT NULL,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS e2ee_pre_keys (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_id     INTEGER NOT NULL,
  public_key TEXT NOT NULL,
  used       BOOLEAN NOT NULL DEFAULT false,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 9. Nope tables - thêm cột nếu chưa có ────────────────────
ALTER TABLE nope_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Nope reports - đổi tên column nếu cần (tùy schema cũ)
-- Bỏ qua nếu đã có

DO $$ BEGIN RAISE NOTICE 'Migration 0001 (INTEGER version) completed successfully!'; END $$;
