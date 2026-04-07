import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { QService } from './q.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Q Wallet')
@ApiBearerAuth()
@Controller('q')
export class QController {
  constructor(private readonly svc: QService) {}

  @Get('balance')
  getBalance(@CurrentUser('id') userId: string) {
    return this.svc.getBalance(userId);
  }

  @Get('history')
  getHistory(@CurrentUser('id') userId: string, @Query('limit') limit = 50) {
    return this.svc.getHistory(userId, limit);
  }

  @Post('gift')
  giftQ(@CurrentUser('id') userId: string, @Body() body: {
    toEmail?: string;
    toPool:   boolean;
    amount:   number;
    qType:    'expiring' | 'permanent';
  }) {
    return this.svc.giftQ(userId, body);
  }
}
