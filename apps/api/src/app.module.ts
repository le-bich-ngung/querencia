import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { MulterModule } from '@nestjs/platform-express';

import { DatabaseModule }  from './database/database.module';
import { RedisModule }     from './redis/redis.module';
import { AuthModule }      from './modules/auth/auth.module';
import { CuiBapModule }    from './modules/cui-bap/cui-bap.module';
import { NopeModule }      from './modules/nope/nope.module';
import { ToolsModule }     from './modules/tools/tools.module';
import { UsersModule }     from './modules/users/users.module';
import { QModule }         from './modules/q/q.module';
import { PaymentsModule }  from './modules/payments/payments.module';
import { WebhooksModule }  from './modules/webhooks/webhooks.module';
import { MetaModule }      from './modules/meta/meta.module';
import { E2eeModule }      from './modules/e2ee/e2ee.module';
import { VocabModule }     from './modules/vocab/vocab.module';

import { JwtAuthGuard }       from './common/guards/jwt-auth.guard';
import { ThrottleGuard }      from './common/guards/throttle.guard';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { APP_FILTER }         from '@nestjs/core';
import { AppController }      from './app.controller';
// T?M T?T - thi?u dependency (typeorm, @nestjs/schedule), ???ng d?n sai. B?t l?i khi ho?n thi?n.
// import { FileShareModule } from './modules/tools/file-share/file-share.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RedisModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    MulterModule.register({ limits: { fileSize: 50 * 1024 * 1024 } }), // 50MB
    AuthModule,
    CuiBapModule,
    NopeModule,
    ToolsModule,
    UsersModule,
    QModule,
    PaymentsModule,
    WebhooksModule,
    E2eeModule,
    MetaModule,
    // FileShareModule,
    VocabModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD,  useClass: JwtAuthGuard },
    { provide: APP_GUARD,  useClass: ThrottleGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}
