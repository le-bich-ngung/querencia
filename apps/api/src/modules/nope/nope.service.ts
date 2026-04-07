/**
 * Nope Service — DB WIRED
 * Tất cả stubs đã thay bằng Drizzle queries thật
 */
import {
  Injectable, NotFoundException,
  ForbiddenException, Inject, Logger,
} from '@nestjs/common';
import { eq, and, desc, ilike, or, sql, count, inArray } from 'drizzle-orm';
import type { DB } from '@querencia/db';
import {
  nopePosts, nopeComments, nopeThanks,
  nopeSaves, nopeFollows, nopeReports, users,
} from '@querencia/db';
import { DB_TOKEN } from '../../database/database.module';
import { REDIS_SESSION } from '../../redis/redis.module';
import type { Redis } from 'ioredis';

const FEED_CACHE_TTL = 300; // 5 phút

@Injectable()
export class NopeService {
  private readonly logger = new Logger(NopeService.name);

  constructor(
    @Inject(DB_TOKEN)      private readonly db: DB,
    @Inject(REDIS_SESSION) private readonly redis: Redis,
  ) {}

  // ── Feed ──────────────────────────────────────────────────
  async getFeed(page = 1, limit = 20, userId?: string) {
    const cacheKey = `nope:feed:${page}:${limit}`;

    // Try cache (chỉ cache trang đầu, anonymous)
    if (page === 1 && !userId) {
      const cached = await this.redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const offset = (page - 1) * limit;

    const [posts, [{ total }]] = await Promise.all([
      this.db.query.nopePosts.findMany({
        orderBy: [desc(nopePosts.createdAt)],
        limit,
        offset,
      }),
      this.db.select({ total: count() }).from(nopePosts),
    ]);

    const enriched = await this._enrichPosts(posts, userId);
    const result   = { posts: enriched, total, page, hasMore: offset + limit < total };

    if (page === 1 && !userId) {
      this.redis.setex(cacheKey, FEED_CACHE_TTL, JSON.stringify(result));
    }

    return result;
  }

  // ── Search ────────────────────────────────────────────────
  async searchPosts(query: string, tags?: string[]) {
    const posts = await this.db.query.nopePosts.findMany({
      where: or(
        ilike(nopePosts.title, `%${query}%`),
        ilike(nopePosts.body,  `%${query}%`),
      ),
      orderBy: [desc(nopePosts.createdAt)],
      limit: 30,
    });

    let filtered = posts;
    if (tags?.length) {
      filtered = posts.filter(p => {
        const postTags: string[] = JSON.parse(p.tags ?? '[]');
        return tags.some(t => postTags.includes(t));
      });
    }

    return { posts: await this._enrichPosts(filtered) };
  }

  // ── Saved posts ───────────────────────────────────────────
  async getSavedPosts(userId: string) {
    const saves = await this.db.query.nopeSaves.findMany({
      where: eq(nopeSaves.userId, userId),
      orderBy: [desc(nopeSaves.createdAt)],
    });
    if (!saves.length) return { posts: [] };

    const postIds = saves.map(s => s.postId);
    const posts   = await this.db.query.nopePosts.findMany({
      where: inArray(nopePosts.id, postIds),
    });
    return { posts: await this._enrichPosts(posts, userId) };
  }

  // ── Post detail ───────────────────────────────────────────
  async getPostById(postId: string, userId?: string) {
    const post = await this.db.query.nopePosts.findFirst({
      where: eq(nopePosts.id, postId),
    });
    if (!post) throw new NotFoundException('Bài viết không tồn tại');

    const [comments, thanksCount, isThanked, isSaved] = await Promise.all([
      this.db.query.nopeComments.findMany({
        where:   eq(nopeComments.postId, postId),
        orderBy: [desc(nopeComments.createdAt)],
        limit: 50,
      }),
      this.db.select({ c: count() }).from(nopeThanks)
        .where(eq(nopeThanks.postId, postId))
        .then(r => r[0]?.c ?? 0),
      userId
        ? this.db.query.nopeThanks.findFirst({
            where: and(eq(nopeThanks.postId, postId), eq(nopeThanks.userId, userId)),
          }).then(Boolean)
        : false,
      userId
        ? this.db.query.nopeSaves.findFirst({
            where: and(eq(nopeSaves.postId, postId), eq(nopeSaves.userId, userId)),
          }).then(Boolean)
        : false,
    ]);

    return {
      ...post,
      tags:          JSON.parse(post.tags ?? '[]'),
      thanksCount,
      isThanked,
      isSaved,
      comments,
      commentCount:  comments.length,
    };
  }

  // ── Create post ───────────────────────────────────────────
  async createPost(data: {
    authorId:   string;
    authorName: string;
    title:      string;
    body:       string;
    imageUrl?:  string;
    tags?:      string[];
  }) {
    const [post] = await this.db.insert(nopePosts).values({
      authorId:   data.authorId,
      authorName: data.authorName,
      title:      data.title,
      body:       data.body,
      imageUrl:   data.imageUrl,
      tags:       JSON.stringify(data.tags ?? []),
    }).returning();

    // Invalidate feed cache
    this._invalidateFeedCache();

    return post;
  }

  // ── Delete post ───────────────────────────────────────────
  async deletePost(postId: string, userId: string) {
    const post = await this.db.query.nopePosts.findFirst({
      where: eq(nopePosts.id, postId),
    });
    if (!post) throw new NotFoundException('Bài viết không tồn tại');
    if (post.authorId !== userId) throw new ForbiddenException('Không có quyền xóa');

    await this.db.delete(nopePosts).where(eq(nopePosts.id, postId));
    this._invalidateFeedCache();
  }

  // ── Toggle thank ❤️ ────────────────────────────────────────
  async toggleThank(postId: string, userId: string) {
    const existing = await this.db.query.nopeThanks.findFirst({
      where: and(eq(nopeThanks.postId, postId), eq(nopeThanks.userId, userId)),
    });

    if (existing) {
      await this.db.delete(nopeThanks).where(eq(nopeThanks.id, existing.id));
    } else {
      await this.db.insert(nopeThanks).values({ postId, userId });
    }

    const [{ c }] = await this.db.select({ c: count() }).from(nopeThanks)
      .where(eq(nopeThanks.postId, postId));

    return { thanked: !existing, count: c };
  }

  // ── Toggle save ───────────────────────────────────────────
  async toggleSave(postId: string, userId: string) {
    const existing = await this.db.query.nopeSaves.findFirst({
      where: and(eq(nopeSaves.postId, postId), eq(nopeSaves.userId, userId)),
    });

    if (existing) {
      await this.db.delete(nopeSaves).where(eq(nopeSaves.id, existing.id));
    } else {
      await this.db.insert(nopeSaves).values({ postId, userId });
    }

    return { saved: !existing };
  }

  // ── Add comment ───────────────────────────────────────────
  async addComment(postId: string, data: {
    authorId:   string;
    authorName: string;
    body:       string;
  }) {
    const post = await this.db.query.nopePosts.findFirst({
      where: eq(nopePosts.id, postId),
    });
    if (!post) throw new NotFoundException('Bài viết không tồn tại');

    const [comment] = await this.db.insert(nopeComments).values({
      postId,
      authorId:   data.authorId,
      authorName: data.authorName,
      body:       data.body,
    }).returning();

    return comment;
  }

  // ── Delete comment ────────────────────────────────────────
  async deleteComment(commentId: string, userId: string) {
    const comment = await this.db.query.nopeComments.findFirst({
      where: eq(nopeComments.id, commentId),
    });
    if (!comment) throw new NotFoundException('Bình luận không tồn tại');
    if (comment.authorId !== userId) throw new ForbiddenException('Không có quyền xóa');

    await this.db.delete(nopeComments).where(eq(nopeComments.id, commentId));
  }

  // ── Toggle follow ─────────────────────────────────────────
  async toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new ForbiddenException('Không thể follow chính mình');

    const existing = await this.db.query.nopeFollows.findFirst({
      where: and(
        eq(nopeFollows.followerId,  followerId),
        eq(nopeFollows.followingId, followingId),
      ),
    });

    if (existing) {
      await this.db.delete(nopeFollows).where(eq(nopeFollows.id, existing.id));
    } else {
      await this.db.insert(nopeFollows).values({ followerId, followingId });
    }

    return { following: !existing };
  }

  // ── User profile ──────────────────────────────────────────
  async getUserProfile(userId: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true, name: true, email: true, avatarUrl: true, plan: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    const [[{ postCount }], [{ followerCount }], [{ followingCount }]] = await Promise.all([
      this.db.select({ postCount: count() }).from(nopePosts)
        .where(eq(nopePosts.authorId, userId)),
      this.db.select({ followerCount: count() }).from(nopeFollows)
        .where(eq(nopeFollows.followingId, userId)),
      this.db.select({ followingCount: count() }).from(nopeFollows)
        .where(eq(nopeFollows.followerId, userId)),
    ]);

    const recentPosts = await this.db.query.nopePosts.findMany({
      where:   eq(nopePosts.authorId, userId),
      orderBy: [desc(nopePosts.createdAt)],
      limit:   6,
    });

    return { ...user, postCount, followerCount, followingCount, recentPosts };
  }

  // ── Report post ───────────────────────────────────────────
  async reportPost(postId: string, userId: string, reason: string) {
    await this.db.insert(nopeReports).values({ postId, userId, reason })
      .onConflictDoNothing(); // không cho report 2 lần
  }

  // ── Private helpers ───────────────────────────────────────

  private async _enrichPosts(posts: any[], userId?: string) {
    if (!posts.length) return [];

    const postIds = posts.map(p => p.id);

    // Batch query: đếm thanks + comments
    const [thanksRows, commentRows] = await Promise.all([
      this.db.select({ postId: nopeThanks.postId, c: count() })
        .from(nopeThanks)
        .where(inArray(nopeThanks.postId, postIds))
        .groupBy(nopeThanks.postId),
      this.db.select({ postId: nopeComments.postId, c: count() })
        .from(nopeComments)
        .where(inArray(nopeComments.postId, postIds))
        .groupBy(nopeComments.postId),
    ]);

    const thanksMap   = Object.fromEntries(thanksRows.map(r => [r.postId, r.c]));
    const commentsMap = Object.fromEntries(commentRows.map(r => [r.postId, r.c]));

    // Check user interactions
    let thankedSet = new Set<string>();
    let savedSet   = new Set<string>();
    if (userId) {
      const [thanked, saved] = await Promise.all([
        this.db.query.nopeThanks.findMany({
          where: and(
            eq(nopeThanks.userId, userId),
            inArray(nopeThanks.postId, postIds),
          ),
        }),
        this.db.query.nopeSaves.findMany({
          where: and(
            eq(nopeSaves.userId, userId),
            inArray(nopeSaves.postId, postIds),
          ),
        }),
      ]);
      thankedSet = new Set(thanked.map(t => t.postId));
      savedSet   = new Set(saved.map(s => s.postId));
    }

    return posts.map(p => ({
      ...p,
      tags:         JSON.parse(p.tags ?? '[]'),
      thanksCount:  thanksMap[p.id]   ?? 0,
      commentCount: commentsMap[p.id] ?? 0,
      isThanked:    thankedSet.has(p.id),
      isSaved:      savedSet.has(p.id),
    }));
  }

  private async _invalidateFeedCache() {
    const keys = await this.redis.keys('nope:feed:*');
    if (keys.length) await this.redis.del(...keys);
  }
}
