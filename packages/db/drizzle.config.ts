ï»¿import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Giá»¯ nguyÃªn tÃªn báº£ng (khÃ´ng prefix) Äá» tÆ°Æ¡ng thÃ­ch data production cÅ©
  tablesFilter: ['users', 'accounts', 'nope_*', 'cb_*', 'tools', 'tool_usage_logs',
    'flashcard_*', 'vault_files', 'conversations', 'messages', 'subscriptions',
    'embeddings', 'payments'],
} satisfies Config;
