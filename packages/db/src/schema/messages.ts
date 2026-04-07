import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const conversations = pgTable('conversations', {
  id:           uuid('id').primaryKey().defaultRandom(),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
});

export const conversationMembers = pgTable('conversation_members', {
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  userId:         uuid('user_id').references(() => users.id).notNull(),
  joinedAt:       timestamp('joined_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id:             uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  senderId:       uuid('sender_id').references(() => users.id).notNull(),
  body:           text('body').notNull(),         // encrypted E2E
  iv:             text('iv'),                      // encryption IV
  isRead:         boolean('is_read').default(false).notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
});
