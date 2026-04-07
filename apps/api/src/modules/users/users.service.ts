ï»¿import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DB_TOKEN } from '../../database/database.module';
import { REDIS_SESSION } from '../../redis/redis.module';
import { users, userBlocks, userReports } from '@querencia/db';
import type { DB } from '@querencia/db';
import type { Redis } from 'ioredis';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DB_TOKEN)      private readonly db: DB,
    @Inject(REDIS_SESSION) private readonly redis: Redis,
  ) {}

  async blockUser(blockerId: string, targetId: string) {
    if (blockerId === targetId) throw new ForbiddenException('KhÃ´ng thá» tá»± cháº·n');

    const target = await this.db.query.users.findFirst({ where: eq(users.id, targetId) });
    if (!target) throw new NotFoundException('NgÆ°á»i dÃ¹ng khÃ´ng tá»n táº¡i');

    await this.db.insert(userBlocks)
      .values({ blockerId, blockedId: targetId })
      .onConflictDoNothing();

    // Cache block list trong Redis (TTL 1h) Äá» guard check nhanh
    await this.redis.sadd(`blocks:${blockerId}`, targetId);
    await this.redis.expire(`blocks:${blockerId}`, 3600);

    return { ok: true, blocked: true };
  }

  async unblockUser(blockerId: string, targetId: string) {
    await this.db.delete(userBlocks).where(
      and(eq(userBlocks.blockerId, blockerId), eq(userBlocks.blockedId, targetId))
    );
    await this.redis.srem(`blocks:${blockerId}`, targetId);
    return { ok: true, blocked: false };
  }

  async isBlocked(blockerId: string, targetId: string): Promise<boolean> {
    // Check Redis cache trÆ°á»c
    const cached = await this.redis.sismember(`blocks:${blockerId}`, targetId);
    if (cached) return true;
    const row = await this.db.query.userBlocks.findFirst({
      where: and(eq(userBlocks.blockerId, blockerId), eq(userBlocks.blockedId, targetId)),
    });
    return !!row;
  }

  async reportUser(reporterId: string, targetId: string, reason: string) {
    if (reporterId === targetId) throw new ForbiddenException('KhÃ´ng thá» tá»± bÃ¡o cÃ¡o');

    await this.db.insert(userReports)
      .values({ reporterId, reportedId: targetId, reason })
      .onConflictDoNothing();

    return { ok: true };
  }

  async getBlockList(userId: string) {
    const blocks = await this.db.query.userBlocks.findMany({
      where: eq(userBlocks.blockerId, userId),
    });
    return { blocks };
  }

  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }) {
    const [updated] = await this.db.update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning({ id: users.id, name: users.name, email: users.email, avatarUrl: users.avatarUrl });
    return updated;
  }
}
