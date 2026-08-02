/**
 * Cùi Bắp - App nhắn tin
 * Migrated từ querencia-backend/api/models.py (CBConversation, CBMessage, etc.)
 * Giữ nguyên tên bảng: cb_conversations, cb_messages, etc. để không mất data production
 */
import {
  pgTable, uuid, integer, text, boolean,
  timestamp, bigint, pgEnum
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const cbMemberRoleEnum = pgEnum('cb_member_role', ['owner', 'admin', 'member']);
export const cbMsgTypeEnum = pgEnum('cb_msg_type', ['text', 'image', 'file', 'audio', 'location', 'sticker']);

// ── DM Conversations ─────────────────────────────────────────
export const cbConversations = pgTable('cb_conversations', {
  id:            uuid('id').primaryKey().defaultRandom(),
  userAId:       uuid('user_a_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  userBId:       uuid('user_b_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
});

// ── DM Messages ──────────────────────────────────────────────
export const cbMessages = pgTable('cb_messages', {
  id:             uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => cbConversations.id, { onDelete: 'cascade' }).notNull(),
  senderId:       uuid('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  msgType:        cbMsgTypeEnum('msg_type').default('text').notNull(),
  content:        text('content'),
  fileUrl:        text('file_url'),                   // R2 URL
  fileName:       text('file_name'),
  fileSize:       bigint('file_size', { mode: 'number' }),
  fileExpiresAt:  timestamp('file_expires_at'),        // 7 ngày
  replyToId:      uuid('reply_to_id'),                 // self-reference
  isEdited:       boolean('is_edited').default(false).notNull(),
  editedAt:       timestamp('edited_at'),
  isDeleted:      boolean('is_deleted').default(false).notNull(),
  isPinned:       boolean('is_pinned').default(false).notNull(),
  scheduledAt:    timestamp('scheduled_at'),
  autoDeleteAt:   timestamp('auto_delete_at'),  // self-destruct
  deliveredAt:    timestamp('delivered_at'),       // khi recipient nhận được
  isSent:         boolean('is_sent').default(true).notNull(),
  sentAt:         timestamp('sent_at').defaultNow().notNull(),
});

// ── Groups ───────────────────────────────────────────────────
export const cbGroups = pgTable('cb_groups', {
  id:            uuid('id').primaryKey().defaultRandom(),
  name:          text('name').notNull(),
  description:   text('description'),
  avatarUrl:     text('avatar_url'),
  ownerId:       uuid('owner_id').references(() => users.id).notNull(),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
});

export const cbGroupMembers = pgTable('cb_group_members', {
  id:        uuid('id').primaryKey().defaultRandom(),
  groupId:   uuid('group_id').references(() => cbGroups.id, { onDelete: 'cascade' }).notNull(),
  userId:    uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role:      cbMemberRoleEnum('role').default('member').notNull(),
  joinedAt:  timestamp('joined_at').defaultNow().notNull(),
});

// ── Group Messages ───────────────────────────────────────────
// deliveredAt added for read receipts
export const cbGroupMessages = pgTable('cb_group_messages', {
  id:          uuid('id').primaryKey().defaultRandom(),
  groupId:     uuid('group_id').references(() => cbGroups.id, { onDelete: 'cascade' }).notNull(),
  senderId:    uuid('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  msgType:     cbMsgTypeEnum('msg_type').default('text').notNull(),
  content:     text('content'),
  fileUrl:     text('file_url'),
  fileName:    text('file_name'),
  fileSize:    bigint('file_size', { mode: 'number' }),
  fileExpiresAt: timestamp('file_expires_at'),
  mentions:    text('mentions'),                       // JSON "[userId, ...]"
  replyToId:   uuid('reply_to_id'),
  isEdited:    boolean('is_edited').default(false).notNull(),
  editedAt:    timestamp('edited_at'),
  isDeleted:   boolean('is_deleted').default(false).notNull(),
  isPinned:    boolean('is_pinned').default(false).notNull(),
  scheduledAt: timestamp('scheduled_at'),
  isSent:      boolean('is_sent').default(true).notNull(),
  sentAt:      timestamp('sent_at').defaultNow().notNull(),
  deliveredAt:  timestamp('delivered_at'),
});

// ── Reactions ─────────────────────────────────────────────────
export const cbReactions = pgTable('cb_reactions', {
  id:        uuid('id').primaryKey().defaultRandom(),
  messageId: uuid('message_id').references(() => cbMessages.id, { onDelete: 'cascade' }).notNull(),
  userId:    uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  emoji:     text('emoji').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cbGroupReactions = pgTable('cb_group_reactions', {
  id:        uuid('id').primaryKey().defaultRandom(),
  messageId: uuid('message_id').references(() => cbGroupMessages.id, { onDelete: 'cascade' }).notNull(),
  userId:    uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  emoji:     text('emoji').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Read Receipts ─────────────────────────────────────────────
export const cbReadReceipts = pgTable('cb_read_receipts', {
  id:        uuid('id').primaryKey().defaultRandom(),
  messageId: uuid('message_id').references(() => cbMessages.id, { onDelete: 'cascade' }).notNull(),
  userId:    uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  readAt:    timestamp('read_at').defaultNow().notNull(),
});

// ── Polls ─────────────────────────────────────────────────────
export const cbPolls = pgTable('cb_polls', {
  id:        uuid('id').primaryKey().defaultRandom(),
  groupId:   uuid('group_id').references(() => cbGroups.id, { onDelete: 'cascade' }).notNull(),
  creatorId: uuid('creator_id').references(() => users.id).notNull(),
  question:  text('question').notNull(),
  options:   text('options').notNull(),              // JSON ["Option A", "Option B"]
  isClosed:  boolean('is_closed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  closesAt:  timestamp('closes_at'),
});

export const cbPollVotes = pgTable('cb_poll_votes', {
  id:          uuid('id').primaryKey().defaultRandom(),
  pollId:      uuid('poll_id').references(() => cbPolls.id, { onDelete: 'cascade' }).notNull(),
  userId:      uuid('user_id').references(() => users.id).notNull(),
  optionIndex: integer('option_index').notNull(),
  votedAt:     timestamp('voted_at').defaultNow().notNull(),
});

// ── User Settings ─────────────────────────────────────────────
export const cbUserSettings = pgTable('cb_user_settings', {
  id:             uuid('id').primaryKey().defaultRandom(),
  userId:         uuid('user_id').references(() => users.id).unique().notNull(),
  theme:          text('theme').default('default').notNull(),
  font:           text('font').default('default').notNull(),
  chatBackground: text('chat_background'),
  notifySound:    boolean('notify_sound').default(true).notNull(),
  notifyPreview:  boolean('notify_preview').default(true).notNull(),
});
