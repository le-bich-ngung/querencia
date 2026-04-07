/**
 * Paddle Service — tạo checkout session và verify webhook
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

// Giá theo số ngày ($0.50/ngày)
const PRICE_PER_DAY_CENTS = 50; // $0.50

@Injectable()
export class PaddleService {
  private readonly logger = new Logger(PaddleService.name);
  private readonly apiKey:    string;
  private readonly sellerId:  string;
  private readonly webhookKey: string;
  private readonly isSandbox: boolean;

  constructor(private readonly config: ConfigService) {
    this.apiKey    = config.get('PADDLE_API_KEY')     ?? '';
    this.sellerId  = config.get('PADDLE_SELLER_ID')   ?? '';
    this.webhookKey = config.get('PADDLE_WEBHOOK_SECRET') ?? '';
    this.isSandbox = config.get('NODE_ENV') !== 'production';
  }

  private get apiBase() {
    return this.isSandbox
      ? 'https://sandbox-api.paddle.com'
      : 'https://api.paddle.com';
  }

  /** Tạo price dynamically cho số ngày cụ thể */
  async createCheckoutSession(userId: string, userEmail: string, days: number) {
    const amount = days * PRICE_PER_DAY_CENTS; // cents

    const res = await fetch(`${this.apiBase}/prices`, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        product_id:   this.config.get('PADDLE_PRODUCT_ID'),
        description:  `Querencia Pro — ${days} ngày`,
        unit_price:   { amount: String(amount), currency_code: 'USD' },
        billing_cycle: null, // one-time
        custom_data:  { userId, days: String(days) },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      this.logger.error('Paddle create price failed:', err);
      throw new Error('Không thể tạo checkout');
    }

    const data = await res.json();
    return {
      priceId:    data.data.id,
      checkoutId: null,
    };
  }

  /** Verify Paddle webhook signature */
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!this.webhookKey) return true; // dev mode: bypass

    // Paddle v2 HMAC-SHA256
    const expected = crypto
      .createHmac('sha256', this.webhookKey)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
  }

  /** Parse và validate webhook event */
  parseWebhookEvent(body: any): {
    type:      string;
    userId?:   string;
    days?:     number;
    orderId?:  string;
  } {
    const event = body.event_type ?? body.alert_name;
    const data  = body.data ?? body;

    // transaction.completed → payment successful
    if (event === 'transaction.completed') {
      const customData = data.custom_data ?? {};
      return {
        type:    'payment_completed',
        userId:  customData.userId ?? data.customer?.id,
        days:    parseInt(customData.days ?? '0'),
        orderId: data.id,
      };
    }

    // transaction.payment_failed
    if (event === 'transaction.payment_failed') {
      return { type: 'payment_failed', orderId: data.id };
    }

    return { type: event };
  }
}
