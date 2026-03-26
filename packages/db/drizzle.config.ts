import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Giữ nguyên tên bảng (không prefix) để tương thích data production cũ
  tablesFilter: ['users', 'accounts', 'nope_*', 'cb_*', 'tools', 'tool_usage_logs',
    'flashcard_*', 'vault_files', 'conversations', 'messages', 'subscriptions',
    'embeddings', 'payments'],
} satisfies Config;
