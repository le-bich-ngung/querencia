/**
 * Cùi Bắp — WebSocket Gateway
 * Events đầy đủ gồm cả read receipts:
 *   → message_delivered  : khi recipient connect và có tin chưa nhận
 *   → message_read       : khi recipient gọi markRead
 *   → typing / stop_typing
 *   → call signaling (offer/answer/ice/end/reject)
 */
import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect,
  MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { eq, and, isNull, ne } from 'drizzle-orm';
import { DB_TOKEN } from '../../../database/database.module';
import { users, cbMessages, cbConversations, cbGroupMessages, cbGroupMembers } from '@querencia/db';
import type { DB } from '@querencia/db';

@WebSocketGateway({
  namespace:  '/cuibap',
  cors: {
    origin:      process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  // userId → Set<socketId>
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly config:     ConfigService,
    @Inject(DB_TOKEN) private readonly db: DB,
  ) {}

  // ── Connection ────────────────────────────────────────────────
  async handleConnection(client: Socket) {
    try {
      const token = (client.handshake.auth?.token
        ?? client.handshake.query?.token) as string;
      if (!token) { client.disconnect(); return; }

      const payload = this.jwtService.verify<{ sub: string }>(token, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
      });

      const user = await this.db.query.users.findFirst({
        where: eq(users.email, payload.sub),
        columns: { id: true, name: true },
      });
      if (!user) { client.disconnect(); return; }

      client.data.userId = user.id;
      client.data.name   = user.name;

      if (!this.userSockets.has(user.id)) {
        this.userSockets.set(user.id, new Set());
      }
      this.userSockets.get(user.id)!.add(client.id);
      this.logger.log(`[WS] ${user.name} connected (${client.id})`);

      // Sau khi connect → notify senders các tin nhắn đã delivered
      await this._notifyPendingDeliveries(user.id);

      // Broadcast online status đến những người đang chat với user này
      await this._broadcastPresence(user.id, true);

    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      this.userSockets.get(userId)?.delete(client.id);
      if (this.userSockets.get(userId)?.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  // ── Public API (gọi từ CuiBapService) ────────────────────────
  sendToUser(userId: string, event: string, data: unknown) {
    const sockets = this.userSockets.get(userId);
    if (sockets?.size) {
      for (const sid of sockets) {
        this.server.to(sid).emit(event, data);
      }
    }
  }

  isOnline(userId: string): boolean {
    return (this.userSockets.get(userId)?.size ?? 0) > 0;
  }

  /**
   * Emit message_read đến sender khi recipient đọc conv
   * Gọi từ CuiBapService.markRead()
   */
  notifyMessageRead(senderId: string, convId: string, readByUserId: string, messageIds: string[]) {
    if (!messageIds.length) return;
    this.sendToUser(senderId, 'message_read', {
      conversation_id: convId,
      read_by:         readByUserId,
      message_ids:     messageIds,
    });
  }

  // ── Private: notify deliveries khi user vừa connect ──────────
  private async _notifyPendingDeliveries(recipientId: string) {
    try {
      // Tìm các conversations mà user này là người nhận
      const convs = await this.db.query.cbConversations.findMany({
        where: eq(cbConversations.userBId, recipientId),
      });
      // Cũng check conversations mà user là user1
      const convs2 = await this.db.query.cbConversations.findMany({
        where: eq(cbConversations.userAId, recipientId),
      });
      const allConvIds = [...convs, ...convs2].map(c => c.id);

      if (!allConvIds.length) return;

      // Tìm tin nhắn chưa có deliveredAt (gửi cho mình, chưa được nhận)
      // — chỉ lấy tin nhắn KHÔNG do mình gửi
      for (const conv of [...convs, ...convs2]) {
        const otherUserId = conv.userAId === recipientId ? conv.userBId : conv.userAId;

        const undelivered = await this.db.query.cbMessages.findMany({
          where: and(
            eq(cbMessages.conversationId, conv.id),
            eq(cbMessages.senderId, otherUserId), // tin do người kia gửi
            isNull(cbMessages.deliveredAt),        // chưa delivered
            eq(cbMessages.isDeleted, false),
          ),
          columns: { id: true },
          limit: 100,
        });

        if (!undelivered.length) continue;

        const ids = undelivered.map(m => m.id);

        // Cập nhật deliveredAt trong DB
        await this.db.update(cbMessages)
          .set({ deliveredAt: new Date() })
          .where(
            and(
              eq(cbMessages.conversationId, conv.id),
              eq(cbMessages.senderId, otherUserId),
              isNull(cbMessages.deliveredAt),
            )
          );

        // Emit message_delivered đến sender
        this.sendToUser(otherUserId, 'message_delivered', {
          conversation_id: conv.id,
          message_ids:     ids,
        });
      }
      // Group messages — notify undelivered
      const memberships = await this.db.query.cbGroupMembers.findMany({
        where: eq(cbGroupMembers.userId, recipientId),
      });
      for (const m of memberships) {
        const undelivered = await this.db.query.cbGroupMessages.findMany({
          where: and(
            eq(cbGroupMessages.groupId, m.groupId),
            ne(cbGroupMessages.senderId, recipientId),
            isNull(cbGroupMessages.deliveredAt),
            eq(cbGroupMessages.isDeleted, false),
          ),
          columns: { id: true, senderId: true },
          limit: 50,
        });
        if (!undelivered.length) continue;
        const ids = undelivered.map(msg => msg.id);
        await this.db.update(cbGroupMessages)
          .set({ deliveredAt: new Date() })
          .where(and(
            eq(cbGroupMessages.groupId, m.groupId),
            ne(cbGroupMessages.senderId, recipientId),
            isNull(cbGroupMessages.deliveredAt),
          ));
        // Notify mỗi sender trong nhóm
        const senderIds = [...new Set(undelivered.map(msg => msg.senderId))];
        for (const sid of senderIds) {
          this.sendToUser(sid as string, 'message_delivered', {
            group_id:    m.groupId,
            message_ids: ids.filter(id => undelivered.find(u => u.id === id && u.senderId === sid)),
          });
        }
      }
    } catch (e) {
      this.logger.warn('_notifyPendingDeliveries error:', e);
    }
  }

  // ── TYPING ────────────────────────────────────────────────────

  // ── PRESENCE ─────────────────────────────────────────────────
  private async _broadcastPresence(userId: string, online: boolean) {
    try {
      // Tìm tất cả user đang chat với userId này (conversations)
      const convs = await this.db.query.cbConversations.findMany({
        where: (c, { or, eq }) => or(
          eq(c.userAId, userId),
          eq(c.userBId, userId),
        ),
      });

      // Notify từng đối tác
      for (const conv of convs) {
        const otherId = conv.userAId === userId ? conv.userBId : conv.userAId;
        this.sendToUser(otherId, 'presence', {
          user_id:       userId,
          online,
          conversation_id: conv.id,
        });
      }
    } catch {}
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversation_id: string; target_user_id: string },
  ) {
    this.sendToUser(data.target_user_id, 'typing', {
      from_user_id:    client.data.userId,
      conversation_id: data.conversation_id,
    });
  }

  @SubscribeMessage('stop_typing')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { target_user_id: string },
  ) {
    this.sendToUser(data.target_user_id, 'stop_typing', {
      from_user_id: client.data.userId,
    });
  }

  // ── WEBRTC SIGNALING ──────────────────────────────────────────
  @SubscribeMessage('call_offer')
  handleCallOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { target_user_id: string; conversation_id: string; call_type: 'voice'|'video'; sdp: string },
  ) {
    this.sendToUser(data.target_user_id, 'call_offer', {
      from_user_id: client.data.userId, from_name: client.data.name,
      conversation_id: data.conversation_id, call_type: data.call_type ?? 'voice', sdp: data.sdp,
    });
  }

  @SubscribeMessage('call_answer')
  handleCallAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { target_user_id: string; sdp: string },
  ) {
    this.sendToUser(data.target_user_id, 'call_answer', {
      from_user_id: client.data.userId, sdp: data.sdp,
    });
  }

  @SubscribeMessage('call_ice')
  handleCallIce(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { target_user_id: string; candidate: unknown },
  ) {
    this.sendToUser(data.target_user_id, 'call_ice', {
      from_user_id: client.data.userId, candidate: data.candidate,
    });
  }

  @SubscribeMessage('call_end')
  handleCallEnd(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { target_user_id: string },
  ) {
    this.sendToUser(data.target_user_id, 'call_end', { from_user_id: client.data.userId });
  }

  @SubscribeMessage('call_reject')
  handleCallReject(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { target_user_id: string },
  ) {
    this.sendToUser(data.target_user_id, 'call_reject', { from_user_id: client.data.userId });
  }
}
