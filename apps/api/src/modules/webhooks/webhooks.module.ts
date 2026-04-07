import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { PaymentsModule }     from '../payments/payments.module';
import { QModule }            from '../q/q.module';

@Module({
  imports:     [PaymentsModule, QModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
