ï»¿/**
 * Redis Module â inject db0 (session) vÃ  db1 (quota) vÃ o app
 */
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const REDIS_SESSION = Symbol('REDIS_SESSION');   // db0
export const REDIS_QUOTA   = Symbol('REDIS_QUOTA');     // db1

function createRedis(url: string, db: number, config: ConfigService) {
  const client = new Redis(url, {
    db,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    retryStrategy: (times) => Math.min(times * 100, 3000),
  });
  client.on('error', (err) => console.error(`[Redis db${db}]`, err.message));
  return client;
}

@Global()
@Module({
  providers: [
    {
      provide: REDIS_SESSION,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createRedis(config.get('UPSTASH_REDIS_URL')!, 0, config),
    },
    {
      provide: REDIS_QUOTA,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createRedis(config.get('UPSTASH_REDIS_URL')!, 1, config),
    },
  ],
  exports: [REDIS_SESSION, REDIS_QUOTA],
})
export class RedisModule {}
