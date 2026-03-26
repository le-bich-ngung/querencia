-- Migration 0002: Cùi Bắp tables
-- Giữ nguyên tên bảng cb_* để tương thích data production cũ

-- Enums
DO $$ BEGIN
  CREATE TYPE cb_member_role AS ENUM ('owner', 'admin', 'member');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE cb_msg_type AS ENUM ('text', 'image', 'file', 'audio', 'location', 'sticker');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- DM Conversations
CREATE TABLE IF NOT EXISTS cb_conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT cb_conv_unique UNIQUE (user_a_id, user_b_id)
);
CREATE INDEX IF NOT EXISTS cb_conv_user_a ON cb_conversations(user_a_id);
CREATE INDEX IF NOT EXISTS cb_conv_user_b ON cb_conversations(user_b_id);
CREATE INDEX IF NOT EXISTS cb_conv_last_msg ON cb_conversations(last_message_at DESC);

-- DM Messages
CREATE TABLE IF NOT EXISTS cb_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES cb_conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  msg_type        cb_msg_type NOT NULL DEFAULT 'text',
  content         TEXT,
  file_url        TEXT,
  file_name       TEXT,
  file_size       BIGINT,
  file_expires_at TIMESTAMP WITH TIME ZONE,
  reply_to_id     UUID,
  is_edited       BOOLEAN NOT NULL DEFAULT false,
  edited_at       TIMESTAMP WITH TIME ZONE,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  is_pinned       BOOLEAN NOT NULL DEFAULT false,
  scheduled_at    TIMESTAMP WITH TIME ZONE,
  is_sent         BOOLEAN NOT NULL DEFAULT true,
  sent_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS cb_msg_conv ON cb_messages(conversation_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS cb_msg_sender ON cb_messages(sender_id);

-- Groups
CREATE TABLE IF NOT EXISTS cb_groups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  avatar_url      TEXT,
  owner_id        UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Group Members
CREATE TABLE IF NOT EXISTS cb_group_members (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id  UUID NOT NULL REFERENCES cb_groups(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role      cb_member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT cb_group_member_unique UNIQUE (group_id, user_id)
);
CREATE INDEX IF NOT EXISTS cb_gm_user ON cb_group_members(user_id);
CREATE INDEX IF NOT EXISTS cb_gm_group ON cb_group_members(group_id);

-- Group Messages
CREATE TABLE IF NOT EXISTS cb_group_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id        UUID NOT NULL REFERENCES cb_groups(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  msg_type        cb_msg_type NOT NULL DEFAULT 'text',
  content         TEXT,
  file_url        TEXT,
  file_name       TEXT,
  file_size       BIGINT,
  file_expires_at TIMESTAMP WITH TIME ZONE,
  mentions        TEXT,
  reply_to_id     UUID,
  is_edited       BOOLEAN NOT NULL DEFAULT false,
  edited_at       TIMESTAMP WITH TIME ZONE,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  is_pinned       BOOLEAN NOT NULL DEFAULT false,
  scheduled_at    TIMESTAMP WITH TIME ZONE,
  is_sent         BOOLEAN NOT NULL DEFAULT true,
  sent_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS cb_gmsg_group ON cb_group_messages(group_id, sent_at DESC);

-- Reactions (DM)
CREATE TABLE IF NOT EXISTS cb_reactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES cb_messages(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji      TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT cb_reaction_unique UNIQUE (message_id, user_id, emoji)
);

-- Reactions (Group)
CREATE TABLE IF NOT EXISTS cb_group_reactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES cb_group_messages(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji      TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT cb_group_reaction_unique UNIQUE (message_id, user_id, emoji)
);

-- Read Receipts
CREATE TABLE IF NOT EXISTS cb_read_receipts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES cb_messages(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  read_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT cb_read_unique UNIQUE (message_id, user_id)
);

-- Polls
CREATE TABLE IF NOT EXISTS cb_polls (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID NOT NULL REFERENCES cb_groups(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES users(id),
  question   TEXT NOT NULL,
  options    TEXT NOT NULL,
  is_closed  BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  closes_at  TIMESTAMP WITH TIME ZONE
);

-- Poll Votes
CREATE TABLE IF NOT EXISTS cb_poll_votes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id      UUID NOT NULL REFERENCES cb_polls(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(id),
  option_index INTEGER NOT NULL,
  voted_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT cb_poll_vote_unique UNIQUE (poll_id, user_id)
);

-- User Settings
CREATE TABLE IF NOT EXISTS cb_user_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) UNIQUE,
  theme           TEXT NOT NULL DEFAULT 'default',
  font            TEXT NOT NULL DEFAULT 'default',
  chat_background TEXT,
  notify_sound    BOOLEAN NOT NULL DEFAULT true,
  notify_preview  BOOLEAN NOT NULL DEFAULT true
);

-- Self-destruct messages
ALTER TABLE cb_messages ADD COLUMN IF NOT EXISTS auto_delete_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS auto_delete_at TIMESTAMP WITH TIME ZONE;
CREATE INDEX IF NOT EXISTS cb_msg_autodel ON cb_messages(auto_delete_at) WHERE auto_delete_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS cb_gmsg_autodel ON cb_group_messages(auto_delete_at) WHERE auto_delete_at IS NOT NULL;

-- Read receipts: delivered_at
ALTER TABLE cb_messages ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS cb_msg_delivered ON cb_messages(delivered_at) WHERE delivered_at IS NULL;

-- Group message delivery receipts
ALTER TABLE cb_group_messages ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
