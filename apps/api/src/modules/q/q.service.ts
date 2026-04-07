ï»¿/**
 * Q Service â quáº£n lÃ½ Q tokens, lá»ch sá»­, táº·ng Q
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

  // ââ Láº¥y sá» dÆ° Q âââââââââââââââââââââââââââââââââââââââââââââ
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

  // ââ Lá»ch sá»­ sá»­ dá»¥ng Q ââââââââââââââââââââââââââââââââââââââââ
  async getHistory(userId: string, limit = 50) {
    const logs = await this.db.query.qUsageLogs.findMany({
      where:   eq(qUsageLogs.userId, userId),
      orderBy: [desc(qUsageLogs.createdAt)],
      limit,
    });
    return { logs };
  }

  // ââ Táº·ng Q âââââââââââââââââââââââââââââââââââââââââââââââââââ
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

    if (amount < 1 || amount > 100) throw new BadRequestException('Sá» Q há»£p lá»: 1â100');

    // Kiá»m tra sá» dÆ° ngÆ°á»i gá»­i
    const balanceKey = qType === 'expiring'
      ? `q:expiring:${senderId}`
      : `q:permanent:${senderId}`;
    const balance = parseInt(await this.redis.get(balanceKey) ?? '0');
    if (balance < amount) {
      throw new ForbiddenException(`KhÃ´ng Äá»§ ${qType === 'expiring' ? 'Q expiring' : 'Q permanent'}`);
    }

    // Trá»« Q ngÆ°á»i gá»­i
    await this.redis.decrby(balanceKey, amount);

    if (toPool) {
      // Táº·ng vÃ o Q Pool â lÆ°u vÃ o DB Äá» hiá»n thá»
      await this.db.insert(qUsageLogs).values({
        userId:    senderId,
        toolSlug:  'q_pool',
        qCost:     amount,
        qTokenIds: '[]',
      });
      return { ok: true, message: `ÄÃ£ táº·ng ${amount}Q vÃ o Q Pool ð` };
    }

    // Táº·ng cho ngÆ°á»i dÃ¹ng cá»¥ thá»
    const target = await this.db.query.users.findFirst({
      where: eq(users.email, toEmail!.toLowerCase()),
    });
    if (!target) throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng vá»i email nÃ y');
    if (target.id === senderId) throw new ForbiddenException('KhÃ´ng thá» tá»± táº·ng Q cho mÃ¬nh');

    // Cá»ng Q cho ngÆ°á»i nháº­n (permanent Q khi nháº­n gift)
    await this.redis.incrby(`q:permanent:${target.id}`, amount);

    // Log cáº£ 2 phÃ­a
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

    return { ok: true, message: `ÄÃ£ táº·ng ${amount}Q cho ${target.name ?? target.email}` };
  }

  // ââ Grant Q sau khi mua Pro (gá»i tá»« Paddle webhook) ââââââââââ
  async grantQForPurchase(userId: string, days: number) {
    const pipeline = this.redis.pipeline();

    // 10Q expiring má»i ngÃ y (háº¿t háº¡n sau 24h)
    const expiringTotal = days * 10;
    pipeline.incrby(`q:expiring:${userId}`, expiringTotal);
    pipeline.expire(`q:expiring:${userId}`, Q_EXPIRY_TTL);

    // 1Q permanent má»i ngÃ y
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
