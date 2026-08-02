import { pgTable, uuid, text, timestamp, pgEnum, integer, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active', 'trialing', 'past_due', 'canceled', 'paused'
]);

export const subscriptions = pgTable('subscriptions', {
  id:                 uuid('id').primaryKey().defaultRandom(),
  userId:             uuid('user_id').references(() => users.id).notNull(),
  paddleSubscriptionId: text('paddle_subscription_id').notNull().unique(),
  status:             subscriptionStatusEnum('status').notNull(),
  plan:               text('plan').notNull(), // "pro", "enterprise"
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd:   timestamp('current_period_end').notNull(),
  canceledAt:         timestamp('canceled_at'),
  createdAt:          timestamp('created_at').defaultNow().notNull(),
  updatedAt:          timestamp('updated_at').defaultNow().notNull(),
});


// ── Q Wallet system ───────────────────────────────────────────

export const qTypeEnum = pgEnum('q_type', ['expiring', 'permanent']);

// Mỗi Q token riêng lẻ - tracking rõ nguồn gốc và hạn dùng
export const qTokens = pgTable('q_tokens', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  qType:       qTypeEnum('q_type').notNull(),             // 'expiring' | 'permanent'
  amount:      integer('amount').default(1).notNull(),    // số Q trong token này
  expiresAt:   timestamp('expires_at'),                   // null = permanent
  usedAt:      timestamp('used_at'),                      // null = chưa dùng
  // Nguồn gốc
  sourceType:  text('source_type').notNull(),             // 'purchase' | 'gift' | 'exchange' | 'pool_claimed'
  sourceId:    uuid('source_id'),                         // ID của purchase/gift
  // Tặng Q
  giftedFrom:  uuid('gifted_from'),                       // userId người tặng
  giftedTo:    uuid('gifted_to'),                         // userId người nhận (null = pool)
  isPooled:    boolean('is_pooled').default(false).notNull(), // tặng treo cho cộng đồng
  claimedBy:   uuid('claimed_by'),                        // ai đã claim từ pool
  claimedAt:   timestamp('claimed_at'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

// Lịch sử dùng Q
export const qUsageLogs = pgTable('q_usage_logs', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    uuid('user_id').references(() => users.id).notNull(),
  toolSlug:  text('tool_slug').notNull(),
  qCost:     integer('q_cost').notNull(),
  qTokenIds: text('q_token_ids').notNull(),    // JSON array of token ids
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Giao dịch mua Q / Pro days
export const proOrders = pgTable('pro_orders', {
  id:            uuid('id').primaryKey().defaultRandom(),
  userId:        uuid('user_id').references(() => users.id).notNull(),
  days:          integer('days').notNull(),              // số ngày mua
  pricePerDay:   integer('price_per_day_cents').notNull(), // giá thực tế (cents)
  totalCents:    integer('total_cents').notNull(),       // tổng tiền đã trả
  paddleOrderId: text('paddle_order_id').unique(),
  status:        text('status').default('active').notNull(), // 'active' | 'refunded' | 'expired'
  // Ngày bắt đầu/kết thúc (track từng ngày)
  startDate:     timestamp('start_date').notNull(),
  endDate:       timestamp('end_date').notNull(),
  // Refund tracking
  refundedDays:  integer('refunded_days').default(0),
  refundedCents: integer('refunded_cents').default(0),
  refundedAt:    timestamp('refunded_at'),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
});

// Q pool công khai - Q được tặng treo cho cộng đồng
export const qPool = pgTable('q_pool', {
  id:          uuid('id').primaryKey().defaultRandom(),
  donorId:     uuid('donor_id').references(() => users.id),  // null = ẩn danh
  qTokenId:    uuid('q_token_id').references(() => qTokens.id).notNull(),
  amount:      integer('amount').notNull(),     // 1 hoặc 2 Q
  qType:       qTypeEnum('q_type').notNull(),
  expiresAt:   timestamp('expires_at'),         // kế thừa từ token
  claimedBy:   uuid('claimed_by'),
  claimedAt:   timestamp('claimed_at'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});
