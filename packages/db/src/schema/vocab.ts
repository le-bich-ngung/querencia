import { pgTable, uuid, integer, text, timestamp, boolean, jsonb, type PgTableWithColumns } from 'drizzle-orm/pg-core';
import { users } from './users';

// ── Vocab Sets ────────────────────────────────────────────────
// Mỗi bộ từ vựng do 1 user upload (từ file Excel/CSV/Markdown).
// words lưu dạng JSON array [{ w, p, m }] - không tách bảng riêng vì
// số lượng nhỏ (giới hạn 5.000 từ/bộ), tránh phải join phức tạp.
//
// LƯU Ý: users.id thật trên DB production là kiểu integer (int4),
// KHÔNG phải uuid như hầu hết schema .ts khác khai báo - đã kiểm tra
// trực tiếp qua information_schema.columns. Dùng integer ở đây cho khớp.
//
// Khai báo kiểu tường minh (: any) để tránh lỗi TS2883 khi build .d.ts
// (Drizzle sinh ra kiểu suy luận không "đặt tên" được rõ ràng qua module boundary).
export const vocabSets: any = pgTable('vocab_sets', {
  id:         uuid('id').primaryKey().defaultRandom(),
  userId:     integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name:       text('name').notNull(),
  isPublic:   boolean('is_public').default(false).notNull(),
  words:      jsonb('words').notNull(), // [{ w: string, p?: string, m: string }]
  wordCount:  integer('word_count').default(0).notNull(),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
  updatedAt:  timestamp('updated_at').defaultNow().notNull(),
});
