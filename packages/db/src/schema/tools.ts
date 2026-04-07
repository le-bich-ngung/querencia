ï»¿import { pgTable, uuid, text, integer, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const toolTierEnum = pgEnum('tool_tier', ['free', 'paid']);

export const tools = pgTable('tools', {
  id:          uuid('id').primaryKey().defaultRandom(),
  slug:        text('slug').notNull().unique(), // "summarizer", "translator", ...
  name:        text('name').notNull(),
  description: text('description'),
  tier:        toolTierEnum('tier').default('free').notNull(),
  qCost:       integer('q_cost').default(1).notNull(), // Q deducted per use
  isActive:    boolean('is_active').default(true).notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

export const toolUsageLogs = pgTable('tool_usage_logs', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    uuid('user_id').references(() => users.id).notNull(),
  toolId:    uuid('tool_id').references(() => tools.id).notNull(),
  qDeducted: integer('q_deducted').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ââ Flashcards (migrated tá»« querencia-tools) âââââââââââââââââ
export const flashcardDecks = pgTable('flashcard_decks', {
  id:        text('id').primaryKey(),              // uuid string tá»« code cÅ©
  userId:    uuid('user_id').notNull(),
  name:      text('name').notNull(),
  emoji:     text('emoji').default('ð').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const flashcardCards = pgTable('flashcard_cards', {
  id:        text('id').primaryKey(),
  deckId:    text('deck_id').references(() => flashcardDecks.id, { onDelete: 'cascade' }).notNull(),
  front:     text('front').notNull(),
  back:      text('back').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ââ Vault (link chia sáº» tá»± há»§y â migrated tá»« querencia-tools) â
export const vaultFiles = pgTable('vault_files', {
  token:     text('token').primaryKey(),            // ngáº«u nhiÃªn, dÃ¹ng lÃ m URL
  filename:  text('filename').notNull(),
  filepath:  text('filepath').notNull(),            // R2 path hoáº·c local path
  filesize:  integer('filesize').default(0),
  expireAt:  timestamp('expire_at'),
  maxReads:  integer('max_reads'),
  readCount: integer('read_count').default(0).notNull(),
  password:  text('password'),
  mode:      text('mode').default('24h').notNull(), // "1read" | "1h" | "24h" | "7d" | "custom"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
