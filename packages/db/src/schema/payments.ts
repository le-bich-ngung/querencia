ï»¿import { pgTable, uuid, text, timestamp, pgEnum, integer, boolean } from 'drizzle-orm/pg-core';
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


// ââ Q Wallet system âââââââââââââââââââââââââââââââââââââââââââ

export const qTypeEnum = pgEnum('q_type', ['expiring', 'permanent']);

// Má»i Q token riÃªng láº» â tracking rÃµ nguá»n gá»c vÃ  háº¡n dÃ¹ng
export const qTokens = pgTable('q_tokens', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  qType:       qTypeEnum('q_type').notNull(),             // 'expiring' | 'permanent'
  amount:      integer('amount').default(1).notNull(),    // sá» Q trong token nÃ y
  expiresAt:   timestamp('expires_at'),                   // null = permanent
  usedAt:      timestamp('used_at'),                      // null = chÆ°a dÃ¹ng
  // Nguá»n gá»c
  sourceType:  text('source_type').notNull(),             // 'purchase' | 'gift' | 'exchange' | 'pool_claimed'
  sourceId:    uuid('source_id'),                         // ID cá»§a purchase/gift
  // Táº·ng Q
  giftedFrom:  uuid('gifted_from'),                       // userId ngÆ°á»i táº·ng
  giftedTo:    uuid('gifted_to'),                         // userId ngÆ°á»i nháº­n (null = pool)
  isPooled:    boolean('is_pooled').default(false).notNull(), // táº·ng treo cho cá»ng Äá»ng
  claimedBy:   uuid('claimed_by'),                        // ai ÄÃ£ claim tá»« pool
  claimedAt:   timestamp('claimed_at'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

// Lá»ch sá»­ dÃ¹ng Q
export const qUsageLogs = pgTable('q_usage_logs', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    uuid('user_id').references(() => users.id).notNull(),
  toolSlug:  text('tool_slug').notNull(),
  qCost:     integer('q_cost').notNull(),
  qTokenIds: text('q_token_ids').notNull(),    // JSON array of token ids
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Giao dá»ch mua Q / Pro days
export const proOrders = pgTable('pro_orders', {
  id:            uuid('id').primaryKey().defaultRandom(),
  userId:        uuid('user_id').references(() => users.id).notNull(),
  days:          integer('days').notNull(),              // sá» ngÃ y mua
  pricePerDay:   integer('price_per_day_cents').notNull(), // giÃ¡ thá»±c táº¿ (cents)
  totalCents:    integer('total_cents').notNull(),       // tá»ng tiá»n ÄÃ£ tráº£
  paddleOrderId: text('paddle_order_id').unique(),
  status:        text('status').default('active').notNull(), // 'active' | 'refunded' | 'expired'
  // NgÃ y báº¯t Äáº§u/káº¿t thÃºc (track tá»«ng ngÃ y)
  startDate:     timestamp('start_date').notNull(),
  endDate:       timestamp('end_date').notNull(),
  // Refund tracking
  refundedDays:  integer('refunded_days').default(0),
  refundedCents: integer('refunded_cents').default(0),
  refundedAt:    timestamp('refunded_at'),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
});

// Q pool cÃ´ng khai â Q ÄÆ°á»£c táº·ng treo cho cá»ng Äá»ng
export const qPool = pgTable('q_pool', {
  id:          uuid('id').primaryKey().defaultRandom(),
  donorId:     uuid('donor_id').references(() => users.id),  // null = áº©n danh
  qTokenId:    uuid('q_token_id').references(() => qTokens.id).notNull(),
  amount:      integer('amount').notNull(),     // 1 hoáº·c 2 Q
  qType:       qTypeEnum('q_type').notNull(),
  expiresAt:   timestamp('expires_at'),         // káº¿ thá»«a tá»« token
  claimedBy:   uuid('claimed_by'),
  claimedAt:   timestamp('claimed_at'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});
