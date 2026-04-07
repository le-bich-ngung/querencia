// pgvector — Phase 2 feature, disabled for v1.0
// Will be enabled when RAG is needed for LàNo
// import { vector } from 'pgvector/drizzle-orm';

import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';

// Placeholder — empty for now
export const embeddings = pgTable('embeddings', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    uuid('user_id').notNull(),
  content:   text('content').notNull(),
  model:     text('model').default('text-embedding-3-small').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
