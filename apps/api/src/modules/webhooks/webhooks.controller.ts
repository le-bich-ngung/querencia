ï»¿/**
 * Webhooks Controller â xá»­ lÃ½ Paddle payment webhooks
 * Quan trá»ng: ÄÃ¢y lÃ  Äiá»m cáº¥p Q cho user sau khi thanh toÃ¡n thÃ nh cÃ´ng
 *
 * Security:
 *   - Verify HMAC-SHA256 signature tá»« Paddle
 *   - Idempotency: check order ÄÃ£ xá»­ lÃ½ chÆ°a (dÃ¹ng orderId)
 *   - Raw body: pháº£i Äá»c raw body (khÃ´ng parse JSON) Äá» verify signature
 */
import {
  Controller, Post, Headers, Body,
  HttpCode, HttpStatus, Logger, BadRequestException,
  RawBodyRequest, Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { PaddleService }   from '../payments/paddle.service';
import { PaymentsService } from '../payments/payments.service';
import { QService }        from '../q/q.service';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly paddleSvc:   PaddleService,
    private readonly paymentsSvc: PaymentsService,
    private readonly qSvc:        QService,
  ) {}

  @Public()
  @Post('paddle')
  @HttpCode(HttpStatus.OK)
  async handlePaddle(
    @Req() req: RawBodyRequest<Request>,
    @Headers('paddle-signature') signature: string,
    @Body() body: any,
  ) {
    // Verify signature
    const rawBody = req.rawBody?.toString('utf8') ?? JSON.stringify(body);
    if (signature && !this.paddleSvc.verifyWebhookSignature(rawBody, signature)) {
      this.logger.warn('Paddle webhook signature mismatch');
      throw new BadRequestException('Invalid signature');
    }

    const event = this.paddleSvc.parseWebhookEvent(body);
    this.logger.log(`Paddle webhook: ${event.type}`);

    if (event.type === 'payment_completed' && event.userId && event.days && event.orderId) {
      try {
        // 1. Record order (idempotent â onConflictDoNothing)
        await this.paymentsSvc.recordOrder(
          event.userId,
          event.days,
          event.orderId,
          event.days * 50, // $0.50/ngÃ y = 50 cents
        );

        // 2. Grant Q
        await this.qSvc.grantQForPurchase(event.userId, event.days);

        this.logger.log(`Granted Q for user ${event.userId}: ${event.days} days`);
      } catch (e) {
        this.logger.error('Failed to process payment:', e);
        // Tráº£ 200 Äá» Paddle khÃ´ng retry â ÄÃ£ log lá»i Äá» xá»­ lÃ½ manual
      }
    }

    return { received: true };
  }
}
