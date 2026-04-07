/**
 * Q Service — quản lý Q tokens, lịch sử, tặng Q
 */
import { Injectable, ForbiddenException, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { eq, desc, and } from 'drizzle-orm';
import { DB_TOKEN } from '../../database/database.module';
import { REDIS_QUOTA } from '../../redis/redis.module';
import { qUsageLogs, users } from '@querencia/db';
import type { DB } from '@querencia/db';
import type { Redis } from 'ioredis';

const Q_EXPIRY_TTL = 24 * 3600; // 24h

@Injectable()
export class QService {
  constructor(
    @Inject(DB_TOKEN)    private readonly db: DB,
    @Inject(REDIS_QUOTA) private readonly redis: Redis,
  ) {}

  // ── Lấy số dư Q ─────────────────────────────────────────────
  async getBalance(userId: string) {
    const [exp, perm] = await Promise.all([
      this.redis.get(`q:expiring:${userId}`),
      this.redis.get(`q:permanent:${userId}`),
    ]);
    return {
      expiring:  parseInt(exp  ?? '0'),
      permanent: parseInt(perm ?? '0'),
      isPro:     (parseInt(exp ?? '0') + parseInt(perm ?? '0')) > 0,
    };
  }

  // ── Lịch sử sử dụng Q ────────────────────────────────────────
  async getHistory(userId: string, limit = 50) {
    const logs = await this.db.query.qUsageLogs.findMany({
      where:   eq(qUsageLogs.userId, userId),
      orderBy: [desc(qUsageLogs.createdAt)],
      limit,
    });
    return { logs };
  }

  // ── Tặng Q ───────────────────────────────────────────────────
  async giftQ(
    senderId: string,
    opts: {
      toEmail?: string;
      toPool:   boolean;
      amount:   number;
      qType:    'expiring' | 'permanent';
    },
  ) {
    const { toEmail, toPool, amount, qType } = opts;

    if (amount < 1 || amount > 100) throw new BadRequestException('Số Q hợp lệ: 1–100');

    // Kiểm tra số dư người gửi
    const balanceKey = qType === 'expiring'
      ? `q:expiring:${senderId}`
      : `q:permanent:${senderId}`;
    const balance = parseInt(await this.redis.get(balanceKey) ?? '0');
    if (balance < amount) {
      throw new ForbiddenException(`Không đủ ${qType === 'expiring' ? 'Q expiring' : 'Q permanent'}`);
    }

    // Trừ Q người gửi
    await this.redis.decrby(balanceKey, amount);

    if (toPool) {
      // Tặng vào Q Pool — lưu vào DB để hiển thị
      await this.db.insert(qUsageLogs).values({
        userId:    senderId,
        toolSlug:  'q_pool',
        qCost:     amount,
        qTokenIds: '[]',
      });
      return { ok: true, message: `Đã tặng ${amount}Q vào Q Pool 🌊` };
    }

    // Tặng cho người dùng cụ thể
    const target = await this.db.query.users.findFirst({
      where: eq(users.email, toEmail!.toLowerCase()),
    });
    if (!target) throw new NotFoundException('Không tìm thấy người dùng với email này');
    if (target.id === senderId) throw new ForbiddenException('Không thể tự tặng Q cho mình');

    // Cộng Q cho người nhận (permanent Q khi nhận gift)
    await this.redis.incrby(`q:permanent:${target.id}`, amount);

    // Log cả 2 phía
    await Promise.all([
      this.db.insert(qUsageLogs).values({
        userId:    senderId,
        toolSlug:  `gift_to:${target.id}`,
        qCost:     amount,
        qTokenIds: '[]',
      }),
      this.db.insert(qUsageLogs).values({
        userId:    target.id,
        toolSlug:  `gift_from:${senderId}`,
        qCost:     -amount,
        qTokenIds: '[]',
      }),
    ]);

    return { ok: true, message: `Đã tặng ${amount}Q cho ${target.name ?? target.email}` };
  }

  // ── Grant Q sau khi mua Pro (gọi từ Paddle webhook) ──────────
  async grantQForPurchase(userId: string, days: number) {
    const pipeline = this.redis.pipeline();

    // 10Q expiring mỗi ngày (hết hạn sau 24h)
    const expiringTotal = days * 10;
    pipeline.incrby(`q:expiring:${userId}`, expiringTotal);
    pipeline.expire(`q:expiring:${userId}`, Q_EXPIRY_TTL);

    // 1Q permanent mỗi ngày
    const permanentTotal = days * 1;
    pipeline.incrby(`q:permanent:${userId}`, permanentTotal);

    await pipeline.exec();

    // Log
    await this.db.insert(qUsageLogs).values({
      userId,
      toolSlug:  `plan_${days}days`,
      qCost:     -expiringTotal,
      qTokenIds: '[]',
    });

    return { ok: true, expiringGranted: expiringTotal, permanentGranted: permanentTotal };
  }
}
