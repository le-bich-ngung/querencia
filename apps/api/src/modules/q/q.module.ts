import { Module } from '@nestjs/common';
import { QController } from './q.controller';
import { QService }    from './q.service';

@Module({
  controllers: [QController],
  providers:   [QService],
  exports:     [QService],
})
export class QModule {}
