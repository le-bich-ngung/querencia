ï»¿/**
 * Nope â App chia sáº» kinh nghiá»m sá»ng
 * Migrated tá»« querencia-backend/api/models.py (NopePost, NopeComment, etc.)
 * Giá»¯ nguyÃªn tÃªn báº£ng Äá» data production an toÃ n
 */
import {
  pgTable, uuid, text, integer, timestamp, boolean
} from 'drizzle-orm/pg-core';
import { users } from './users';

// ââ Posts ââââââââââââââââââââââââââââââââââââââââââââââââââââ
export const nopePosts = pgTable('nope_posts', {
  id:         uuid('id').primaryKey().defaultRandom(),
  authorId:   uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  authorName: text('author_name').notNull(),          // tÃªn tháº­t hoáº·c nickname
  title:      text('title').notNull(),
  body:       text('body').notNull(),
  imageUrl:   text('image_url'),                       // R2 URL
  tags:       text('tags').default('[]').notNull(),    // JSON array
  createdAt:  timestamp('created_at').defaultNow().notNull(),
  updatedAt:  timestamp('updated_at').defaultNow().notNull(),
});

// ââ Comments âââââââââââââââââââââââââââââââââââââââââââââââââ
export const nopeComments = pgTable('nope_comments', {
  id:         uuid('id').primaryKey().defaultRandom(),
  postId:     uuid('post_id').references(() => nopePosts.id, { onDelete: 'cascade' }).notNull(),
  authorId:   uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  authorName: text('author_name').notNull(),
  body:       text('body').notNull(),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
});

// ââ Thanks (â¤ï¸ bÃ i viáº¿t) ââââââââââââââââââââââââââââââââââââââ
export const nopeThanks = pgTable('nope_thanks', {
  id:        uuid('id').primaryKey().defaultRandom(),
  postId:    uuid('post_id').references(() => nopePosts.id, { onDelete: 'cascade' }).notNull(),
  userId:    uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ââ Saves (Äá»c sau) ââââââââââââââââââââââââââââââââââââââââââ
export const nopeSaves = pgTable('nope_saves', {
  id:        uuid('id').primaryKey().defaultRandom(),
  postId:    uuid('post_id').references(() => nopePosts.id, { onDelete: 'cascade' }).notNull(),
  userId:    uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ââ Follows ââââââââââââââââââââââââââââââââââââââââââââââââââ
export const nopeFollows = pgTable('nope_follows', {
  id:          uuid('id').primaryKey().defaultRandom(),
  followerId:  uuid('follower_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  followingId: uuid('following_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

// ââ Reports ââââââââââââââââââââââââââââââââââââââââââââââââââ
export const nopeReports = pgTable('nope_reports', {
  id:        uuid('id').primaryKey().defaultRandom(),
  postId:    uuid('post_id').references(() => nopePosts.id, { onDelete: 'cascade' }).notNull(),
  userId:    uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  reason:    text('reason').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
