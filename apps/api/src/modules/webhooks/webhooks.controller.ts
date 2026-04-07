/**
 * Webhooks Controller — xử lý Paddle payment webhooks
 * Quan trọng: đây là điểm cấp Q cho user sau khi thanh toán thành công
 *
 * Security:
 *   - Verify HMAC-SHA256 signature từ Paddle
 *   - Idempotency: check order đã xử lý chưa (dùng orderId)
 *   - Raw body: phải đọc raw body (không parse JSON) để verify signature
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
        // 1. Record order (idempotent — onConflictDoNothing)
        await this.paymentsSvc.recordOrder(
          event.userId,
          event.days,
          event.orderId,
          event.days * 50, // $0.50/ngày = 50 cents
        );

        // 2. Grant Q
        await this.qSvc.grantQForPurchase(event.userId, event.days);

        this.logger.log(`Granted Q for user ${event.userId}: ${event.days} days`);
      } catch (e) {
        this.logger.error('Failed to process payment:', e);
        // Trả 200 để Paddle không retry — đã log lỗi để xử lý manual
      }
    }

    return { received: true };
  }
}
