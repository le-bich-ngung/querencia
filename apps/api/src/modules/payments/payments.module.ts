import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService }    from './payments.service';
import { PaddleService }      from './paddle.service';
import { QModule }            from '../q/q.module';

@Module({
  imports:     [QModule],
  controllers: [PaymentsController],
  providers:   [PaymentsService, PaddleService],
  exports:     [PaymentsService, PaddleService],
})
export class PaymentsModule {}
