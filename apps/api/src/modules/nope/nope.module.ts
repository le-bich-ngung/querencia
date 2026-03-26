import { Module } from '@nestjs/common';
import { NopeController } from './nope.controller';
import { NopeService }    from './nope.service';

@Module({
  controllers: [NopeController],
  providers:   [NopeService],
  exports:     [NopeService],
})
export class NopeModule {}
