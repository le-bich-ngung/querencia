/**
 * Cùi Bắp Controller — REST endpoints
 * Migrated từ querencia-backend/api/app_logic.py (cuibap_router)
 * Prefix: /api/v1/cuibap
 */
import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  UseGuards, HttpCode, HttpStatus, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CuiBapService } from './cui-bap.service';

@ApiTags('Cùi Bắp')
@Controller('cuibap')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CuiBapController {
  constructor(private readonly cuiBapService: CuiBapService) {}

  // ── FILE UPLOAD ─────────────────────────────────────────────
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 25 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Upload file → Cloudflare R2 (max 25MB, tự xóa 7 ngày)' })
  uploadFile(@CurrentUser('id') userId: string, @UploadedFile() file: Express.Multer.File) {
    return this.cuiBapService.uploadFile(userId, file);
  }

  // ── CONVERSATIONS ────────────────────────────────────────────
  @Get('conversations')
  @ApiOperation({ summary: 'Lấy danh sách cuộc trò chuyện DM' })
  getConversations(@CurrentUser('id') userId: string) {
    return this.cuiBapService.getConversations(userId);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Tạo hoặc lấy cuộc trò chuyện với user khác' })
  getOrCreate(@CurrentUser('id') userId: string, @Body('target_user_id') targetId: string) {
    return this.cuiBapService.getOrCreateConversation(userId, targetId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Lấy tin nhắn trong DM' })
  getMessages(
    @Param('id') convId: string,
    @CurrentUser('id') userId: string,
    @Query('before') before?: string,
    @Query('limit') limit?: number,
  ) {
    return this.cuiBapService.getMessages(convId, userId, before, limit);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Gửi tin nhắn DM' })
  sendMessage(
    @Param('id') convId: string,
    @CurrentUser('id') senderId: string,
    @Body() body: any,
  ) {
    return this.cuiBapService.sendMessage(convId, senderId, body);
  }

  @Post('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đánh dấu đã đọc' })
  markRead(@Param('id') convId: string, @CurrentUser('id') userId: string) {
    return this.cuiBapService.markRead(convId, userId);
  }

  // ── MESSAGES ─────────────────────────────────────────────────
  @Patch('messages/:id')
  @ApiOperation({ summary: 'Sửa tin nhắn' })
  editMessage(
    @Param('id') msgId: string,
    @CurrentUser('id') userId: string,
    @Body('content') content: string,
  ) {
    return this.cuiBapService.editMessage(msgId, userId, content);
  }

  @Delete('messages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa tin nhắn (soft delete)' })
  deleteMessage(@Param('id') msgId: string, @CurrentUser('id') userId: string) {
    return this.cuiBapService.deleteMessage(msgId, userId);
  }

  @Post('messages/:id/react')
  @ApiOperation({ summary: 'Thêm/xóa reaction emoji' })
  addReaction(
    @Param('id') msgId: string,
    @CurrentUser('id') userId: string,
    @Body('emoji') emoji: string,
  ) {
    return this.cuiBapService.addReaction(msgId, userId, emoji);
  }

  @Post('messages/:id/pin')
  @ApiOperation({ summary: 'Ghim/bỏ ghim tin nhắn' })
  pinMessage(@Param('id') msgId: string, @CurrentUser('id') userId: string) {
    return this.cuiBapService.pinMessage(msgId, userId);
  }

  // ── GROUPS ───────────────────────────────────────────────────
  @Get('groups')
  @ApiOperation({ summary: 'Lấy danh sách nhóm' })
  getGroups(@CurrentUser('id') userId: string) {
    return this.cuiBapService.getGroups(userId);
  }

  @Post('groups')
  @ApiOperation({ summary: 'Tạo nhóm mới (max 100 members)' })
  createGroup(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.cuiBapService.createGroup(userId, body);
  }

  @Post('groups/:id/members')
  @ApiOperation({ summary: 'Thêm thành viên vào nhóm' })
  addMember(
    @Param('id') groupId: string,
    @CurrentUser('id') userId: string,
    @Body('user_id') newUserId: string,
  ) {
    return this.cuiBapService.addGroupMember(groupId, userId, newUserId);
  }


  @Patch('groups/:id/members/:userId/role')
  setMemberRole(
    @Param('id') groupId: string,
    @Param('userId') targetUserId: string,
    @CurrentUser() user: any,
    @Body() body: { role: 'admin' | 'member' },
  ) {
    return this.cuiBapService.setMemberRole(groupId, user.id, targetUserId, body.role);
  }

  @Delete('groups/:id/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa thành viên / rời nhóm' })
  removeMember(
    @Param('id') groupId: string,
    @Param('userId') targetUserId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.cuiBapService.removeGroupMember(groupId, userId, targetUserId);
  }

  @Get('groups/:id/messages')
  @ApiOperation({ summary: 'Lấy tin nhắn trong nhóm' })
  getGroupMessages(
    @Param('id') groupId: string,
    @CurrentUser('id') userId: string,
    @Query('before') before?: string,
    @Query('limit') limit?: number,
  ) {
    return this.cuiBapService.getGroupMessages(groupId, userId, before, limit);
  }

  @Post('groups/:id/messages')
  @ApiOperation({ summary: 'Gửi tin nhắn nhóm' })
  sendGroupMessage(
    @Param('id') groupId: string,
    @CurrentUser('id') senderId: string,
    @Body() body: any,
  ) {
    return this.cuiBapService.sendGroupMessage(groupId, senderId, body);
  }

  // ── POLLS ────────────────────────────────────────────────────
  @Post('groups/:id/polls')
  @ApiOperation({ summary: 'Tạo poll trong nhóm' })
  createPoll(@Param('id') groupId: string, @CurrentUser('id') userId: string, @Body() body: any) {
    return this.cuiBapService.createPoll(groupId, userId, body);
  }

  @Post('polls/:id/vote')
  @ApiOperation({ summary: 'Bỏ phiếu poll' })
  votePoll(
    @Param('id') pollId: string,
    @CurrentUser('id') userId: string,
    @Body('option_index') optionIndex: number,
  ) {
    return this.cuiBapService.votePoll(pollId, userId, optionIndex);
  }

  // ── SETTINGS ─────────────────────────────────────────────────
  @Get('settings')
  @ApiOperation({ summary: 'Lấy cài đặt Cùi Bắp (theme, font, background, notifications)' })
  getSettings(@CurrentUser('id') userId: string) {
    return this.cuiBapService.getSettings(userId);
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Cập nhật cài đặt' })
  updateSettings(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.cuiBapService.updateSettings(userId, body);
  }

  @Patch('conversations/:id/pin')
  pinConversation(@Param('id') convId: string, @CurrentUser('id') userId: string, @Body() body: { pin: boolean }) {
    return this.cuiBapService.pinConversation(convId, userId, body.pin);
  }

  @Patch('conversations/:id/mute')
  muteConversation(@Param('id') convId: string, @CurrentUser('id') userId: string, @Body() body: { mute: boolean }) {
    return this.cuiBapService.muteConversation(convId, userId, body.mute);
  }

  @Delete('conversations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteConversation(@Param('id') convId: string, @CurrentUser('id') userId: string) {
    return this.cuiBapService.deleteConversation(convId, userId);
  }

  @Get('groups/:id/members')
  getGroupMembers(@Param('id') groupId: string, @CurrentUser('id') userId: string) {
    return this.cuiBapService.getGroupMembers(groupId, userId);
  }

}
