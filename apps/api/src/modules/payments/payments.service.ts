import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB_TOKEN } from '../../database/database.module';
import { proOrders } from '@querencia/db';
import type { DB } from '@querencia/db';

@Injectable()
export class PaymentsService {
  constructor(@Inject(DB_TOKEN) private readonly db: DB) {}

  async recordOrder(userId: string, days: number, orderId: string, amountCents: number) {
    const now = new Date();
    const endDate = new Date(now.getTime() + days * 86400000);
    await this.db.insert(proOrders).values({
      userId,
      paddleOrderId: orderId,
      days,
      pricePerDay:  50,
      totalCents:   amountCents,
      status:       'active',
      startDate:    now,
      endDate:      endDate,
    }).onConflictDoNothing();
  }

  async getOrders(userId: string) {
    return this.db.query.proOrders.findMany({
      where: eq(proOrders.userId, userId),
      orderBy: (o, { desc }) => [desc(o.createdAt)],
      limit: 20,
    });
  }
}
