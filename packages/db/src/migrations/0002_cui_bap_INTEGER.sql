-- ============================================================
-- Migration 0002 - Cùi Bắp tables (INTEGER version)
-- Tất cả bảng Cùi Bắp đã có trong DB cũ
-- File này chỉ thêm những gì còn thiếu
-- ============================================================

-- Polls (nếu chưa có)
-- Migration 0002 - Cùi Bắp tables (INTEGER version)

CREATE TABLE IF NOT EXISTS cb_polls (
  id         SERIAL PRIMARY KEY,
  group_id   INTEGER NOT NULL REFERENCES cb_groups(id) ON DELETE CASCADE,
  creator_id INTEGER NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  question   TEXT NOT NULL,
  options    TEXT NOT NULL,
  is_closed  BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  closes_at  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS cb_poll_votes (
  id           SERIAL PRIMARY KEY,
  poll_id      INTEGER NOT NULL REFERENCES cb_polls(id) ON DELETE CASCADE,
  user_id      INTEGER NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  voted_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

CREATE TABLE IF NOT EXISTS cb_user_settings (
  id                 SERIAL PRIMARY KEY,
  user_id            INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme              TEXT DEFAULT 'default',
  font               TEXT DEFAULT 'default',
  chat_background    TEXT,
  notification_sound BOOLEAN DEFAULT true,
  show_read_receipts BOOLEAN DEFAULT true,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cb_conv_user1  ON cb_conversations(user_a_id);
CREATE INDEX IF NOT EXISTS cb_conv_user2  ON cb_conversations(user_b_id);
CREATE INDEX IF NOT EXISTS cb_msg_conv    ON cb_messages(conversation_id);
CREATE INDEX IF NOT EXISTS cb_msg_sender  ON cb_messages(sender_id);
CREATE INDEX IF NOT EXISTS cb_member_user ON cb_group_members(user_id);
CREATE INDEX IF NOT EXISTS cb_read_msg    ON cb_read_receipts(message_id);
CREATE INDEX IF NOT EXISTS cb_read_user   ON cb_read_receipts(user_id);

ALTER TABLE cb_messages       ADD COLUMN IF NOT EXISTS file_size      BIGINT;
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS file_size      BIGINT;
ALTER TABLE cb_messages       ADD COLUMN IF NOT EXISTS is_edited      BOOLEAN DEFAULT false;
ALTER TABLE cb_messages       ADD COLUMN IF NOT EXISTS is_deleted     BOOLEAN DEFAULT false;
ALTER TABLE cb_messages       ADD COLUMN IF NOT EXISTS is_pinned      BOOLEAN DEFAULT false;
ALTER TABLE cb_messages       ADD COLUMN IF NOT EXISTS reply_to_id    INTEGER REFERENCES cb_messages(id);
ALTER TABLE cb_messages       ADD COLUMN IF NOT EXISTS auto_delete_at TIMESTAMPTZ;
ALTER TABLE cb_messages       ADD COLUMN IF NOT EXISTS delivered_at   TIMESTAMPTZ;
ALTER TABLE cb_messages       ADD COLUMN IF NOT EXISTS reactions       JSONB DEFAULT '{}';
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS is_edited      BOOLEAN DEFAULT false;
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS is_deleted     BOOLEAN DEFAULT false;
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS is_pinned      BOOLEAN DEFAULT false;
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS auto_delete_at TIMESTAMPTZ;
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS delivered_at   TIMESTAMPTZ;
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS reactions       JSONB DEFAULT '{}';
ALTER TABLE cb_group_members  ADD COLUMN IF NOT EXISTS role           TEXT DEFAULT 'member';

ALTER TABLE cb_conversations ADD COLUMN IF NOT EXISTS user1_id INTEGER;
ALTER TABLE cb_conversations ADD COLUMN IF NOT EXISTS user2_id INTEGER;
UPDATE cb_conversations SET user1_id = user_a_id WHERE user1_id IS NULL;
UPDATE cb_conversations SET user2_id = user_b_id WHERE user2_id IS NULL;

CREATE TABLE IF NOT EXISTS q_usage_logs (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action     TEXT NOT NULL,
  q_type     TEXT NOT NULL DEFAULT 'expiring',
  q_cost     INTEGER NOT NULL DEFAULT 0,
  tool_slug  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pro_orders (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  paddle_order_id TEXT UNIQUE NOT NULL,
  days            INTEGER NOT NULL,
  amount_cents    INTEGER NOT NULL,
  status          TEXT NOT NULL DEFAULT 'completed',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS e2ee_keys (
  id                 SERIAL PRIMARY KEY,
  user_id            INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  registration_id    INTEGER NOT NULL,
  identity_key       TEXT NOT NULL,
  signed_pre_key_id  INTEGER NOT NULL,
  signed_pre_key     TEXT NOT NULL,
  signed_pre_key_sig TEXT NOT NULL,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

ALTER TABLE nope_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();