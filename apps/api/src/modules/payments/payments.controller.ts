ï»¿import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { PaddleService }   from './paddle.service';
import { CurrentUser }     from '../../common/decorators/current-user.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsSvc: PaymentsService,
    private readonly paddleSvc:   PaddleService,
  ) {}

  @Post('create-checkout')
  async createCheckout(
    @CurrentUser() user: any,
    @Body() body: { days: number },
  ) {
    return this.paddleSvc.createCheckoutSession(user.id, user.email, body.days);
  }

  @Get('orders')
  getOrders(@CurrentUser('id') userId: string) {
    return this.paymentsSvc.getOrders(userId);
  }
}
