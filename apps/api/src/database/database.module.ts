/**
 * Database Module — inject Drizzle db vào toàn bộ NestJS app
 * Dùng: @Inject(DB_TOKEN) private db: DB
 */
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@querencia/db';

export const DB_TOKEN = Symbol('DRIZZLE_DB');

@Global()
@Module({
  providers: [
    {
      provide: DB_TOKEN,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pool = new Pool({
          connectionString: config.get('DATABASE_URL'),
          max: 20,
          idleTimeoutMillis: 30_000,
          connectionTimeoutMillis: 2_000,
          ssl: config.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
        });
        pool.on('error', (err) => console.error('[DB Pool Error]', err));
        return drizzle(pool, {
          schema,
          logger: config.get('NODE_ENV') === 'development',
        });
      },
    },
  ],
  exports: [DB_TOKEN],
})
export class DatabaseModule {}
