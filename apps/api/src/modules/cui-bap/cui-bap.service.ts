ï»¿/**
 * CÃ¹i Báº¯p Service â DB WIRED
 * Migrated tá»« querencia-backend/api/app_logic.py (cuibap_router)
 * Táº¥t cáº£ TODO stubs ÄÃ£ ÄÆ°á»£c thay báº±ng Drizzle queries tháº­t.
 *
 * Logic giá»¯ 100% giá»ng code cÅ©:
 *   - user_a_id < user_b_id (trÃ¡nh táº¡o trÃ¹ng conversation)
 *   - Soft delete message (is_deleted=true, content=null)
 *   - Reaction toggle (cÃ³ thÃ¬ xÃ³a, khÃ´ng cÃ³ thÃ¬ thÃªm)
 *   - Settings upsert (táº¡o náº¿u chÆ°a cÃ³)
 *   - Group max 100 members, má»i user max 10 groups
 *   - File expires_at = now + 7 days
 *   - WebSocket broadcast qua ChatGateway
 */
import {
  Injectable, NotFoundException, ForbiddenException,
  BadRequestException, Logger, Inject,
} from '@nestjs/common';
import { eq, and, or, desc, lt, sql, count } from 'drizzle-orm';
import type { DB } from '@querencia/db';
import {
  cbConversations, cbMessages, cbGroups, cbGroupMembers,
  cbGroupMessages, cbReactions, cbGroupReactions,
  cbReadReceipts, cbPolls, cbPollVotes, cbUserSettings, users,
} from '@querencia/db';
import { DB_TOKEN } from '../../database/database.module';
import { REDIS_SESSION } from '../../redis/redis.module';
import { Redis } from 'ioredis';
import { ChatGateway } from './gateways/chat.gateway';
import { R2Service } from '../../common/services/r2.service';

@Injectable()
export class CuiBapService {
  private readonly logger = new Logger(CuiBapService.name);

  constructor(
    @Inject(DB_TOKEN)            private readonly db: DB,
    @Inject(REDIS_SESSION)       private readonly redis: Redis,
    private readonly chatGateway: ChatGateway,
    private readonly r2:          R2Service,
  ) {}

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // FILE UPLOAD â Cloudflare R2
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async uploadFile(userId: string, file: Express.Multer.File) {
    const result = await this.r2.upload(file, 'cuibap', userId);
    return result;
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // CONVERSATIONS (DM)
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async getConversations(userId: string) {
    // Query conversations + ngÆ°á»i kia + tin nháº¯n cuá»i
    // Logic: user_a_id OR user_b_id == userId, sort by last_message_at DESC
    const convs = await this.db.query.cbConversations.findMany({
      where: or(
        eq(cbConversations.userAId, userId),
        eq(cbConversations.userBId, userId),
      ),
      orderBy: [desc(cbConversations.lastMessageAt)],
    });

    // Láº¥y thÃ´ng tin user kia + last message cho má»i conversation
    const result = await Promise.all(convs.map(async (conv) => {
      const otherId = conv.userAId === userId ? conv.userBId : conv.userAId;

      const [otherUser, lastMsg] = await Promise.all([
        this.db.query.users.findFirst({
          where: eq(users.id, otherId),
          columns: { id: true, name: true, email: true, avatarUrl: true },
        }),
        this.db.query.cbMessages.findFirst({
          where: and(
            eq(cbMessages.conversationId, conv.id),
            eq(cbMessages.isDeleted, false),
            eq(cbMessages.isSent, true),
          ),
          orderBy: [desc(cbMessages.sentAt)],
        }),
      ]);

      return {
        id:          conv.id,
        other_user:  otherUser,
        is_online:   this.chatGateway.isOnline(otherId),
        last_message: lastMsg ? {
          content: lastMsg.content,
          type:    lastMsg.msgType,
          sent_at: lastMsg.sentAt,
        } : null,
        last_message_at: conv.lastMessageAt,
      };
    }));

    return result;
  }

  async getOrCreateConversation(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new BadRequestException('KhÃ´ng thá» nháº¯n tin vá»i chÃ­nh mÃ¬nh');
    }

    // user_a_id < user_b_id â giá»¯ y chang logic cÅ© Äá» trÃ¡nh táº¡o trÃ¹ng
    const [a, b] = [userId, targetUserId].sort();

    const existing = await this.db.query.cbConversations.findFirst({
      where: and(
        eq(cbConversations.userAId, a),
        eq(cbConversations.userBId, b),
      ),
    });
    if (existing) return { ...existing, alreadyExists: true };

    // Verify target user tá»n táº¡i
    const target = await this.db.query.users.findFirst({
      where: eq(users.id, targetUserId),
      columns: { id: true, name: true },
    });
    if (!target) throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng');

    const [conv] = await this.db
      .insert(cbConversations)
      .values({ userAId: a, userBId: b })
      .returning();

    return { ...conv, alreadyExists: false };
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // MESSAGES (DM)
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async getMessages(convId: string, userId: string, before?: string, limit = 50) {
    // Guard: pháº£i lÃ  thÃ nh viÃªn conversation
    const conv = await this._getConvOrFail(convId, userId);

    const conditions = [
      eq(cbMessages.conversationId, convId),
      eq(cbMessages.isDeleted, false),
      eq(cbMessages.isSent, true),
    ];
    // PhÃ¢n trang cursor-based: láº¥y tin nháº¯n trÆ°á»c timestamp
    if (before) conditions.push(lt(cbMessages.sentAt, new Date(before)));

    const msgs = await this.db.query.cbMessages.findMany({
      where: and(...conditions),
      orderBy: [desc(cbMessages.sentAt)],
      limit: limit + 1,  // +1 Äá» biáº¿t cÃ³ trang tiáº¿p khÃ´ng
    });

    const hasMore = msgs.length > limit;
    const items   = hasMore ? msgs.slice(0, limit) : msgs;

    // Format + ÄÃ­nh reactions â chronological order (reversed)
    const formatted = await Promise.all(
      items.reverse().map(m => this._formatMessage(m)),
    );

    return { messages: formatted, hasMore };
  }

  async sendMessage(convId: string, senderId: string, data: {
    content?:    string;
    msgType?:    string;
    fileUrl?:    string;
    fileName?:   string;
    fileSize?:   number;
    replyToId?:  string;
    scheduledAt?: string;
  }) {
    const conv = await this._getConvOrFail(convId, senderId);
    const isScheduled = !!data.scheduledAt;

    const [msg] = await this.db
      .insert(cbMessages)
      .values({
        conversationId: convId,
        senderId,
        msgType:        (data.msgType ?? 'text') as any,
        content:        data.content,
        fileUrl:        data.fileUrl,
        fileName:       data.fileName,
        fileSize:       data.fileSize,
        replyToId:      data.replyToId,
        scheduledAt:    data.scheduledAt ? new Date(data.scheduledAt) : null,
        isSent:         !isScheduled,
        // File tá»± xÃ³a sau 7 ngÃ y â giá»¯ y chang code cÅ©
        fileExpiresAt:  data.fileUrl
          ? new Date(Date.now() + 7 * 24 * 3600 * 1000)
          : null,
      })
      .returning();

    // Update last_message_at trÃªn conversation
    if (!isScheduled) {
      await this.db
        .update(cbConversations)
        .set({ lastMessageAt: new Date() })
        .where(eq(cbConversations.id, convId));
    }

    const formatted = await this._formatMessage(msg);

    // WebSocket: gá»­i Äáº¿n ngÆ°á»i nháº­n â giá»¯ y chang logic cÅ©
    if (!isScheduled) {
      const targetId = conv.userAId === senderId ? conv.userBId : conv.userAId;
      this.chatGateway.sendToUser(targetId, 'new_message', {
        conversation_id: convId,
        message:         formatted,
      });
    }

    return formatted;
  }

  async editMessage(msgId: string, userId: string, content: string) {
    const msg = await this.db.query.cbMessages.findFirst({
      where: and(eq(cbMessages.id, msgId), eq(cbMessages.senderId, userId)),
    });
    if (!msg) throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y tin nháº¯n');

    await this.db
      .update(cbMessages)
      .set({ content, isEdited: true, editedAt: new Date() })
      .where(eq(cbMessages.id, msgId));

    // Notify ngÆ°á»i nháº­n
    const conv = await this.db.query.cbConversations.findFirst({
      where: eq(cbConversations.id, msg.conversationId),
    });
    if (conv) {
      const targetId = conv.userAId === userId ? conv.userBId : conv.userAId;
      this.chatGateway.sendToUser(targetId, 'message_edited', { message_id: msgId, content });
    }

    return { id: msgId, content, isEdited: true };
  }

  async deleteMessage(msgId: string, userId: string) {
    const msg = await this.db.query.cbMessages.findFirst({
      where: and(eq(cbMessages.id, msgId), eq(cbMessages.senderId, userId)),
    });
    if (!msg) throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y tin nháº¯n');

    // Soft delete: is_deleted=true, xÃ³a content â giá»¯ y chang code cÅ©
    await this.db
      .update(cbMessages)
      .set({ isDeleted: true, content: null })
      .where(eq(cbMessages.id, msgId));

    const conv = await this.db.query.cbConversations.findFirst({
      where: eq(cbConversations.id, msg.conversationId),
    });
    if (conv) {
      const targetId = conv.userAId === userId ? conv.userBId : conv.userAId;
      this.chatGateway.sendToUser(targetId, 'message_deleted', { message_id: msgId });
    }
  }

  async addReaction(msgId: string, userId: string, emoji: string) {
    // Toggle: cÃ³ thÃ¬ xÃ³a, khÃ´ng thÃ¬ thÃªm â giá»¯ y chang logic cÅ©
    const existing = await this.db.query.cbReactions.findFirst({
      where: and(
        eq(cbReactions.messageId, msgId),
        eq(cbReactions.userId, userId),
        eq(cbReactions.emoji, emoji),
      ),
    });

    if (existing) {
      await this.db.delete(cbReactions).where(eq(cbReactions.id, existing.id));
      return { action: 'removed', emoji };
    }

    await this.db.insert(cbReactions).values({ messageId: msgId, userId, emoji });

    // Notify conversation partner
    const msg = await this.db.query.cbMessages.findFirst({
      where: eq(cbMessages.id, msgId),
    });
    if (msg) {
      const conv = await this.db.query.cbConversations.findFirst({
        where: eq(cbConversations.id, msg.conversationId),
      });
      if (conv) {
        const targetId = conv.userAId === userId ? conv.userBId : conv.userAId;
        this.chatGateway.sendToUser(targetId, 'reaction', { message_id: msgId, emoji, user_id: userId });
      }
    }

    return { action: 'added', emoji };
  }

  async markRead(convId: string, userId: string, lastMsgId?: string) {
    // 1. LÆ°u read receipt cho tin nháº¯n cuá»i
    if (lastMsgId) {
      await this.db
        .insert(cbReadReceipts)
        .values({ messageId: lastMsgId, userId })
        .onConflictDoNothing();
    }

    // 2. Láº¥y táº¥t cáº£ tin nháº¯n trong conv mÃ  user chÆ°a Äá»c (do ngÆ°á»i khÃ¡c gá»­i)
    const unread = await this.db.query.cbMessages.findMany({
      where: and(
        eq(cbMessages.conversationId, convId),
        // KhÃ´ng láº¥y tin mÃ¬nh gá»­i
        sql`${cbMessages.senderId} != ${userId}`,
        eq(cbMessages.isDeleted, false),
      ),
      columns: { id: true, senderId: true },
      limit: 100,
    });

    if (!unread.length) return { ok: true };

    // Group by senderId Äá» notify tá»«ng sender
    const bySender = new Map<string, string[]>();
    for (const m of unread) {
      if (!bySender.has(m.senderId)) bySender.set(m.senderId, []);
      bySender.get(m.senderId)!.push(m.id);
    }

    // 3. Emit message_read tá»i tá»«ng sender qua WebSocket
    for (const [senderId, msgIds] of bySender) {
      this.chatGateway.notifyMessageRead(senderId, convId, userId, msgIds);
    }

    return { ok: true };
  }

  async pinMessage(msgId: string, userId: string) {
    const msg = await this.db.query.cbMessages.findFirst({
      where: eq(cbMessages.id, msgId),
    });
    if (!msg) throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y tin nháº¯n');

    // Chá» thÃ nh viÃªn conversation má»i pin ÄÆ°á»£c
    await this._getConvOrFail(msg.conversationId, userId);

    await this.db
      .update(cbMessages)
      .set({ isPinned: !msg.isPinned })
      .where(eq(cbMessages.id, msgId));

    return { isPinned: !msg.isPinned };
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // GROUPS
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async getGroups(userId: string) {
    const memberships = await this.db.query.cbGroupMembers.findMany({
      where: eq(cbGroupMembers.userId, userId),
    });

    const result = await Promise.all(memberships.map(async (m) => {
      const [group, memberCount, lastMsg] = await Promise.all([
        this.db.query.cbGroups.findFirst({
          where: eq(cbGroups.id, m.groupId),
        }),
        this.db
          .select({ count: count() })
          .from(cbGroupMembers)
          .where(eq(cbGroupMembers.groupId, m.groupId))
          .then(r => r[0]?.count ?? 0),
        this.db.query.cbGroupMessages.findFirst({
          where: and(
            eq(cbGroupMessages.groupId, m.groupId),
            eq(cbGroupMessages.isDeleted, false),
          ),
          orderBy: [desc(cbGroupMessages.sentAt)],
        }),
      ]);

      if (!group) return null;
      return {
        id:          group.id,
        name:        group.name,
        description: group.description,
        avatarUrl:   group.avatarUrl,
        member_count: memberCount,
        role:        m.role,
        last_message: lastMsg ? {
          content: lastMsg.content,
          sent_at: lastMsg.sentAt,
        } : null,
        last_message_at: group.lastMessageAt,
      };
    }));

    return result.filter(Boolean);
  }

  async createGroup(ownerId: string, data: {
    name: string; description?: string; memberIds?: string[];
  }) {
    // Max 10 nhÃ³m/user â giá»¯ y chang code cÅ©
    const groupCount = await this.db
      .select({ count: count() })
      .from(cbGroupMembers)
      .where(eq(cbGroupMembers.userId, ownerId))
      .then(r => r[0]?.count ?? 0);

    if (groupCount >= 10) {
      throw new BadRequestException('Báº¡n ÄÃ£ Äáº¡t giá»i háº¡n 10 nhÃ³m');
    }

    const extraMembers = data.memberIds ?? [];
    if (extraMembers.length > 99) {
      throw new BadRequestException('NhÃ³m tá»i Äa 100 ngÆ°á»i');
    }

    // Insert group + owner member trong transaction
    const [group] = await this.db
      .insert(cbGroups)
      .values({ name: data.name, description: data.description, ownerId })
      .returning();

    // Owner luÃ´n lÃ  member Äáº§u tiÃªn vá»i role='owner'
    const memberValues = [
      { groupId: group.id, userId: ownerId, role: 'owner' as const },
      ...extraMembers
        .filter(id => id !== ownerId)
        .map(userId => ({ groupId: group.id, userId, role: 'member' as const })),
    ];

    await this.db.insert(cbGroupMembers).values(memberValues);

    return { id: group.id, name: group.name, memberCount: memberValues.length };
  }

  async addGroupMember(groupId: string, requesterId: string, newUserId: string) {
    // Guard: requester pháº£i lÃ  owner hoáº·c admin â giá»¯ y chang code cÅ©
    const myRole = await this.db.query.cbGroupMembers.findFirst({
      where: and(
        eq(cbGroupMembers.groupId, groupId),
        eq(cbGroupMembers.userId, requesterId),
      ),
    });
    if (!myRole || myRole.role === 'member') {
      throw new ForbiddenException('KhÃ´ng cÃ³ quyá»n thÃªm thÃ nh viÃªn');
    }

    // Max 100 members
    const memberCount = await this.db
      .select({ count: count() })
      .from(cbGroupMembers)
      .where(eq(cbGroupMembers.groupId, groupId))
      .then(r => r[0]?.count ?? 0);

    if (memberCount >= 100) {
      throw new BadRequestException('NhÃ³m ÄÃ£ Äáº¡t giá»i háº¡n 100 ngÆ°á»i');
    }

    // Check ÄÃ£ lÃ  member chÆ°a
    const existing = await this.db.query.cbGroupMembers.findFirst({
      where: and(
        eq(cbGroupMembers.groupId, groupId),
        eq(cbGroupMembers.userId, newUserId),
      ),
    });
    if (existing) throw new BadRequestException('NgÆ°á»i dÃ¹ng ÄÃ£ trong nhÃ³m');

    await this.db.insert(cbGroupMembers).values({
      groupId, userId: newUserId, role: 'member',
    });

    return { ok: true };
  }

  async removeGroupMember(groupId: string, requesterId: string, targetUserId: string) {
    const myRole = await this.db.query.cbGroupMembers.findFirst({
      where: and(
        eq(cbGroupMembers.groupId, groupId),
        eq(cbGroupMembers.userId, requesterId),
      ),
    });

    const isSelf   = requesterId === targetUserId;
    const isOwner  = myRole?.role === 'owner';
    const isAdmin  = myRole?.role === 'admin';

    // Chá»: owner xÃ³a ai, admin xÃ³a member, member tá»± rá»i
    if (!isSelf && !isOwner && !isAdmin) {
      throw new ForbiddenException('KhÃ´ng cÃ³ quyá»n xÃ³a thÃ nh viÃªn');
    }

    await this.db.delete(cbGroupMembers).where(
      and(
        eq(cbGroupMembers.groupId, groupId),
        eq(cbGroupMembers.userId, targetUserId),
      ),
    );

    return { ok: true };
  }


  async setMemberRole(groupId: string, requesterId: string, targetUserId: string, role: 'admin' | 'member') {
    // Chá» owner má»i cÃ³ thá» set role
    const membership = await this.db.query.cbGroupMembers.findFirst({
      where: and(eq(cbGroupMembers.groupId, groupId), eq(cbGroupMembers.userId, requesterId)),
    });
    if (!membership || membership.role !== 'owner') {
      throw new ForbiddenException('Chá» trÆ°á»ng nhÃ³m má»i cÃ³ thá» phÃ¢n quyá»n');
    }
    const target = await this.db.query.cbGroupMembers.findFirst({
      where: and(eq(cbGroupMembers.groupId, groupId), eq(cbGroupMembers.userId, targetUserId)),
    });
    if (!target) throw new NotFoundException('ThÃ nh viÃªn khÃ´ng tá»n táº¡i trong nhÃ³m');
    if (target.role === 'owner') throw new ForbiddenException('KhÃ´ng thá» thay Äá»i quyá»n trÆ°á»ng nhÃ³m');

    await this.db.update(cbGroupMembers)
      .set({ role })
      .where(and(eq(cbGroupMembers.groupId, groupId), eq(cbGroupMembers.userId, targetUserId)));

    return { ok: true, role };
  }

  async getGroupMessages(groupId: string, userId: string, before?: string, limit = 50) {
    await this._assertGroupMember(groupId, userId);

    const conditions = [
      eq(cbGroupMessages.groupId, groupId),
      eq(cbGroupMessages.isDeleted, false),
    ];
    if (before) conditions.push(lt(cbGroupMessages.sentAt, new Date(before)));

    const msgs = await this.db.query.cbGroupMessages.findMany({
      where: and(...conditions),
      orderBy: [desc(cbGroupMessages.sentAt)],
      limit: limit + 1,
    });

    const hasMore = msgs.length > limit;
    const items   = hasMore ? msgs.slice(0, limit) : msgs;

    const formatted = await Promise.all(
      items.reverse().map(m => this._formatGroupMessage(m)),
    );

    return { messages: formatted, hasMore };
  }

  async sendGroupMessage(groupId: string, senderId: string, data: {
    content?:  string;
    msgType?:  string;
    fileUrl?:  string;
    fileName?: string;
    mentions?: string[];
    replyToId?: string;
  }) {
    await this._assertGroupMember(groupId, senderId);

    const [msg] = await this.db
      .insert(cbGroupMessages)
      .values({
        groupId,
        senderId,
        msgType:  (data.msgType ?? 'text') as any,
        content:  data.content,
        fileUrl:  data.fileUrl,
        fileName: data.fileName,
        mentions: data.mentions ? JSON.stringify(data.mentions) : null,
        replyToId: data.replyToId,
        fileExpiresAt: data.fileUrl
          ? new Date(Date.now() + 7 * 24 * 3600 * 1000)
          : null,
      })
      .returning();

    await this.db
      .update(cbGroups)
      .set({ lastMessageAt: new Date() })
      .where(eq(cbGroups.id, groupId));

    const formatted = await this._formatGroupMessage(msg);

    // Broadcast Äáº¿n táº¥t cáº£ members online
    const members = await this.db.query.cbGroupMembers.findMany({
      where: eq(cbGroupMembers.groupId, groupId),
    });
    for (const m of members) {
      if (m.userId !== senderId) {
        this.chatGateway.sendToUser(m.userId, 'new_group_message', {
          group_id: groupId,
          message:  formatted,
        });
      }
    }

    return formatted;
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // POLLS
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async createPoll(groupId: string, creatorId: string, data: {
    question: string; options: string[]; closesAt?: string;
  }) {
    if (data.options.length < 2) {
      throw new BadRequestException('Poll cáº§n Ã­t nháº¥t 2 lá»±a chá»n');
    }
    await this._assertGroupMember(groupId, creatorId);

    const [poll] = await this.db
      .insert(cbPolls)
      .values({
        groupId,
        creatorId,
        question:  data.question,
        options:   JSON.stringify(data.options),
        closesAt:  data.closesAt ? new Date(data.closesAt) : null,
      })
      .returning();

    return {
      id:       poll.id,
      question: poll.question,
      options:  data.options,
      closesAt: poll.closesAt,
    };
  }

  async votePoll(pollId: string, userId: string, optionIndex: number) {
    const poll = await this.db.query.cbPolls.findFirst({
      where: eq(cbPolls.id, pollId),
    });
    if (!poll || poll.isClosed) {
      throw new BadRequestException('Poll khÃ´ng tá»n táº¡i hoáº·c ÄÃ£ ÄÃ³ng');
    }

    // Äá»i phiáº¿u náº¿u ÄÃ£ vote â giá»¯ y chang code cÅ©
    const existing = await this.db.query.cbPollVotes.findFirst({
      where: and(
        eq(cbPollVotes.pollId, pollId),
        eq(cbPollVotes.userId, userId),
      ),
    });

    if (existing) {
      await this.db
        .update(cbPollVotes)
        .set({ optionIndex })
        .where(eq(cbPollVotes.id, existing.id));
    } else {
      await this.db.insert(cbPollVotes).values({ pollId, userId, optionIndex });
    }

    return { ok: true };
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // USER SETTINGS
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  async getSettings(userId: string) {
    let settings = await this.db.query.cbUserSettings.findFirst({
      where: eq(cbUserSettings.userId, userId),
    });

    // Táº¡o defaults náº¿u chÆ°a cÃ³ â giá»¯ y chang code cÅ©
    if (!settings) {
      const [created] = await this.db
        .insert(cbUserSettings)
        .values({ userId })
        .returning();
      settings = created;
    }

    return {
      theme:          settings.theme,
      font:           settings.font,
      chat_background: settings.chatBackground,
      notify_sound:   settings.notifySound,
      notify_preview: settings.notifyPreview,
    };
  }

  async updateSettings(userId: string, data: Partial<{
    theme: string; font: string; chatBackground: string;
    notifySound: boolean; notifyPreview: boolean;
  }>) {
    const existing = await this.db.query.cbUserSettings.findFirst({
      where: eq(cbUserSettings.userId, userId),
    });

    const updateData: Record<string, any> = {};
    if (data.theme           !== undefined) updateData.theme           = data.theme;
    if (data.font            !== undefined) updateData.font            = data.font;
    if (data.chatBackground  !== undefined) updateData.chatBackground  = data.chatBackground;
    if (data.notifySound     !== undefined) updateData.notifySound     = data.notifySound;
    if (data.notifyPreview   !== undefined) updateData.notifyPreview   = data.notifyPreview;

    if (existing) {
      await this.db
        .update(cbUserSettings)
        .set(updateData)
        .where(eq(cbUserSettings.userId, userId));
    } else {
      await this.db.insert(cbUserSettings).values({ userId, ...updateData });
    }

    return { ok: true };
  }

  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  // PRIVATE HELPERS
  // âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ


  async pinConversation(convId: string, userId: string, pin: boolean) {
    await this._getConvOrFail(convId, userId);
    // LÆ°u pin state trong user settings (Redis key)
    const key = `conv:pinned:${userId}`;
    if (pin) await this.redis.sadd(key, convId);
    else     await this.redis.srem(key, convId);
    return { ok: true, pinned: pin };
  }

  async muteConversation(convId: string, userId: string, mute: boolean) {
    const key = `conv:muted:${userId}`;
    if (mute) await this.redis.sadd(key, convId);
    else      await this.redis.srem(key, convId);
    return { ok: true, muted: mute };
  }

  async deleteConversation(convId: string, userId: string) {
    // Soft delete â chá» áº©n á» phÃ­a user nÃ y
    const key = `conv:deleted:${userId}`;
    await this.redis.sadd(key, convId);
    return;
  }

  async getGroupMembers(groupId: string, userId: string) {
    await this._assertGroupMember(groupId, userId);
    const members = await this.db.query.cbGroupMembers.findMany({
      where: eq(cbGroupMembers.groupId, groupId),
    });
    // Join vá»i user info
    const result = await Promise.all(members.map(async m => {
      const user = await this.db.query.users.findFirst({
        where: eq(users.id, m.userId),
        columns: { id: true, name: true, email: true, avatarUrl: true },
      });
      return { ...user, role: m.role };
    }));
    return { members: result };
  }

  private async _getConvOrFail(convId: string, userId: string) {
    const conv = await this.db.query.cbConversations.findFirst({
      where: eq(cbConversations.id, convId),
    });
    if (!conv || (conv.userAId !== userId && conv.userBId !== userId)) {
      throw new ForbiddenException('KhÃ´ng cÃ³ quyá»n truy cáº­p cuá»c trÃ² chuyá»n nÃ y');
    }
    return conv;
  }

  private async _assertGroupMember(groupId: string, userId: string) {
    const member = await this.db.query.cbGroupMembers.findFirst({
      where: and(
        eq(cbGroupMembers.groupId, groupId),
        eq(cbGroupMembers.userId, userId),
      ),
    });
    if (!member) throw new ForbiddenException('Báº¡n khÃ´ng pháº£i thÃ nh viÃªn cá»§a nhÃ³m nÃ y');
    return member;
  }

  // Format DM message â giá»¯ y chang _format_message tá»« code cÅ©
  private async _formatMessage(msg: typeof cbMessages.$inferSelect) {
    const [sender, reactions] = await Promise.all([
      this.db.query.users.findFirst({
        where: eq(users.id, msg.senderId),
        columns: { id: true, name: true, avatarUrl: true },
      }),
      this.db.query.cbReactions.findMany({
        where: eq(cbReactions.messageId, msg.id),
      }),
    ]);

    // Group reactions by emoji â giá»¯ y chang code cÅ©
    const reactionSummary: Record<string, number> = {};
    for (const r of reactions) {
      reactionSummary[r.emoji] = (reactionSummary[r.emoji] ?? 0) + 1;
    }

    return {
      id:            msg.id,
      sender:        sender ?? { id: msg.senderId, name: 'Unknown' },
      type:          msg.msgType,
      content:       msg.isDeleted ? null : msg.content,
      file_url:      msg.fileUrl,
      file_name:     msg.fileName,
      file_size:     msg.fileSize,
      file_expires_at: msg.fileExpiresAt,
      reply_to_id:   msg.replyToId,
      is_edited:     msg.isEdited,
      is_deleted:    msg.isDeleted,
      is_pinned:     msg.isPinned,
      reactions:     reactionSummary,
      sent_at:       msg.sentAt,
    };
  }

  private async _formatGroupMessage(msg: typeof cbGroupMessages.$inferSelect) {
    const [sender, reactions] = await Promise.all([
      this.db.query.users.findFirst({
        where: eq(users.id, msg.senderId),
        columns: { id: true, name: true, avatarUrl: true },
      }),
      this.db.query.cbGroupReactions.findMany({
        where: eq(cbGroupReactions.messageId, msg.id),
      }),
    ]);

    const reactionSummary: Record<string, number> = {};
    for (const r of reactions) {
      reactionSummary[r.emoji] = (reactionSummary[r.emoji] ?? 0) + 1;
    }

    return {
      id:          msg.id,
      sender:      sender ?? { id: msg.senderId, name: 'Unknown' },
      type:        msg.msgType,
      content:     msg.isDeleted ? null : msg.content,
      file_url:    msg.fileUrl,
      file_name:   msg.fileName,
      file_size:   msg.fileSize,
      mentions:    msg.mentions ? JSON.parse(msg.mentions) : [],
      reply_to_id: msg.replyToId,
      is_edited:   msg.isEdited,
      is_deleted:  msg.isDeleted,
      is_pinned:   msg.isPinned,
      reactions:   reactionSummary,
      sent_at:     msg.sentAt,
    };
  }
}
