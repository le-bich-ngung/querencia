import { pgTable, uuid, text, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';

export const planEnum = pgEnum('plan', ['free', 'pro', 'enterprise']);

export const users = pgTable('users', {
  id:                uuid('id').primaryKey().defaultRandom(),
  email:             text('email').notNull().unique(),
  name:              text('name'),
  avatarUrl:         text('avatar_url'),
  plan:              planEnum('plan').default('free').notNull(),

  // ── Auth fields (migrated từ SQLAlchemy User model) ────────
  hashedPassword:    text('hashed_password'),           // null nếu chỉ dùng OAuth
  isActive:          boolean('is_active').default(true).notNull(),
  isVerified:        boolean('is_verified').default(false).notNull(),
  verificationToken: text('verification_token'),        // email verify + password reset, dùng 1 lần
  googleId:          text('google_id').unique(),        // Google OAuth ID
  fcmToken:          text('fcm_token'),                 // Firebase push notification (MFA)
  fcmTokenUpdatedAt: timestamp('fcm_token_updated_at'),

  createdAt:         timestamp('created_at').defaultNow().notNull(),
  updatedAt:         timestamp('updated_at').defaultNow().notNull(),
});

// accounts — OAuth providers (Google, future: GitHub, Apple)
export const accounts = pgTable('accounts', {
  id:                uuid('id').primaryKey().defaultRandom(),
  userId:            uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  provider:          text('provider').notNull(),          // "google"
  providerAccountId: text('provider_account_id').notNull(),
  accessToken:       text('access_token'),
  refreshToken:      text('refresh_token'),
  expiresAt:         timestamp('expires_at'),
  createdAt:         timestamp('created_at').defaultNow().notNull(),
});

// Kiểu helper — dùng trong service
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ── E2EE public key storage ───────────────────────────────────
// Server chỉ lưu PUBLIC keys — không bao giờ thấy private keys

import { pgTable as _pgTable, uuid as _uuid, text as _text, integer as _int, boolean as _bool, timestamp as _ts } from 'drizzle-orm/pg-core';

export const e2eeKeys = _pgTable('e2ee_keys', {
  id:             _uuid('id').primaryKey().defaultRandom(),
  userId:         _uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  registrationId: _int('registration_id').notNull(),
  identityKey:    _text('identity_key').notNull(),       // base64 public key
  signedPreKeyId: _int('signed_pre_key_id').notNull(),
  signedPreKey:   _text('signed_pre_key').notNull(),     // base64 public key
  signedPreKeySig:_text('signed_pre_key_sig').notNull(), // base64 signature
  updatedAt:      _ts('updated_at').defaultNow().notNull(),
  createdAt:      _ts('created_at').defaultNow().notNull(),
});

export const e2eePreKeys = _pgTable('e2ee_pre_keys', {
  id:         _uuid('id').primaryKey().defaultRandom(),
  userId:     _uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  keyId:      _int('key_id').notNull(),
  publicKey:  _text('public_key').notNull(),  // base64
  used:       _bool('used').default(false).notNull(),
  usedAt:     _ts('used_at'),
  createdAt:  _ts('created_at').defaultNow().notNull(),
});


// ── User blocks ───────────────────────────────────────────────
import { pgTable as _pt2, uuid as _u2, timestamp as _t2 } from 'drizzle-orm/pg-core';

export const userBlocks = _pt2('user_blocks', {
  id:        _u2('id').primaryKey().defaultRandom(),
  blockerId: _u2('blocker_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  blockedId: _u2('blocked_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: _t2('created_at').defaultNow().notNull(),
});

export const userReports = _pt2('user_reports', {
  id:         _u2('id').primaryKey().defaultRandom(),
  reporterId: _u2('reporter_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  reportedId: _u2('reported_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  reason:     _u2('reason'),
  createdAt:  _t2('created_at').defaultNow().notNull(),
});
