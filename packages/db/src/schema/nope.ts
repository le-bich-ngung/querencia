/**
 * Nope - App chia sẻ kinh nghiệm sống
 * Migrated từ querencia-backend/api/models.py (NopePost, NopeComment, etc.)
 * Giữ nguyên tên bảng để data production an toàn
 */
import {
  pgTable, uuid, text, integer, timestamp, boolean
} from 'drizzle-orm/pg-core';
import { users } from './users';

// ── Posts ────────────────────────────────────────────────────
export const nopePosts = pgTable('nope_posts', {
  id:         uuid('id').primaryKey().defaultRandom(),
  authorId:   uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  authorName: text('author_name').notNull(),          // tên thật hoặc nickname
  title:      text('title').notNull(),
  body:       text('body').notNull(),
  imageUrl:   text('image_url'),                       // R2 URL
  tags:       text('tags').default('[]').notNull(),    // JSON array
  createdAt:  timestamp('created_at').defaultNow().notNull(),
  updatedAt:  timestamp('updated_at').defaultNow().notNull(),
});

// ── Comments ─────────────────────────────────────────────────
export const nopeComments = pgTable('nope_comments', {
  id:         uuid('id').primaryKey().defaultRandom(),
  postId:     uuid('post_id').references(() => nopePosts.id, { onDelete: 'cascade' }).notNull(),
  authorId:   uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  authorName: text('author_name').notNull(),
  body:       text('body').notNull(),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
});

// ── Thanks (❤️ bài viết) ──────────────────────────────────────
export const nopeThanks = pgTable('nope_thanks', {
  id:        uuid('id').primaryKey().defaultRandom(),
  postId:    uuid('post_id').references(() => nopePosts.id, { onDelete: 'cascade' }).notNull(),
  userId:    uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Saves (đọc sau) ──────────────────────────────────────────
export const nopeSaves = pgTable('nope_saves', {
  id:        uuid('id').primaryKey().defaultRandom(),
  postId:    uuid('post_id').references(() => nopePosts.id, { onDelete: 'cascade' }).notNull(),
  userId:    uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Follows ──────────────────────────────────────────────────
export const nopeFollows = pgTable('nope_follows', {
  id:          uuid('id').primaryKey().defaultRandom(),
  followerId:  uuid('follower_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  followingId: uuid('following_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

// ── Reports ──────────────────────────────────────────────────
export const nopeReports = pgTable('nope_reports', {
  id:        uuid('id').primaryKey().defaultRandom(),
  postId:    uuid('post_id').references(() => nopePosts.id, { onDelete: 'cascade' }).notNull(),
  userId:    uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  reason:    text('reason').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
