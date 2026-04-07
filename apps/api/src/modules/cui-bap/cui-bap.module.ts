ï»¿import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CuiBapController } from './cui-bap.controller';
import { CuiBapService }    from './cui-bap.service';
import { ChatGateway }      from './gateways/chat.gateway';
import { R2Service }        from '../../common/services/r2.service';

@Module({
  imports:     [JwtModule],
  controllers: [CuiBapController],
  providers:   [CuiBapService, ChatGateway, R2Service],
  exports:     [CuiBapService, ChatGateway, R2Service],
})
export class CuiBapModule {}
