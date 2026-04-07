ï»¿/**
 * CÃ¹i Báº¯p Controller â REST endpoints
 * Migrated tá»« querencia-backend/api/app_logic.py (cuibap_router)
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

@ApiTags('CÃ¹i Báº¯p')
@Controller('cuibap')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CuiBapController {
  constructor(private readonly cuiBapService: CuiBapService) {}

  // ââ FILE UPLOAD âââââââââââââââââââââââââââââââââââââââââââââ
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 25 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Upload file â Cloudflare R2 (max 25MB, tá»± xÃ³a 7 ngÃ y)' })
  uploadFile(@CurrentUser('id') userId: string, @UploadedFile() file: Express.Multer.File) {
    return this.cuiBapService.uploadFile(userId, file);
  }

  // ââ CONVERSATIONS ââââââââââââââââââââââââââââââââââââââââââââ
  @Get('conversations')
  @ApiOperation({ summary: 'Láº¥y danh sÃ¡ch cuá»c trÃ² chuyá»n DM' })
  getConversations(@CurrentUser('id') userId: string) {
    return this.cuiBapService.getConversations(userId);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Táº¡o hoáº·c láº¥y cuá»c trÃ² chuyá»n vá»i user khÃ¡c' })
  getOrCreate(@CurrentUser('id') userId: string, @Body('target_user_id') targetId: string) {
    return this.cuiBapService.getOrCreateConversation(userId, targetId);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Láº¥y tin nháº¯n trong DM' })
  getMessages(
    @Param('id') convId: string,
    @CurrentUser('id') userId: string,
    @Query('before') before?: string,
    @Query('limit') limit?: number,
  ) {
    return this.cuiBapService.getMessages(convId, userId, before, limit);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Gá»­i tin nháº¯n DM' })
  sendMessage(
    @Param('id') convId: string,
    @CurrentUser('id') senderId: string,
    @Body() body: any,
  ) {
    return this.cuiBapService.sendMessage(convId, senderId, body);
  }

  @Post('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ÄÃ¡nh dáº¥u ÄÃ£ Äá»c' })
  markRead(@Param('id') convId: string, @CurrentUser('id') userId: string) {
    return this.cuiBapService.markRead(convId, userId);
  }

  // ââ MESSAGES âââââââââââââââââââââââââââââââââââââââââââââââââ
  @Patch('messages/:id')
  @ApiOperation({ summary: 'Sá»­a tin nháº¯n' })
  editMessage(
    @Param('id') msgId: string,
    @CurrentUser('id') userId: string,
    @Body('content') content: string,
  ) {
    return this.cuiBapService.editMessage(msgId, userId, content);
  }

  @Delete('messages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'XÃ³a tin nháº¯n (soft delete)' })
  deleteMessage(@Param('id') msgId: string, @CurrentUser('id') userId: string) {
    return this.cuiBapService.deleteMessage(msgId, userId);
  }

  @Post('messages/:id/react')
  @ApiOperation({ summary: 'ThÃªm/xÃ³a reaction emoji' })
  addReaction(
    @Param('id') msgId: string,
    @CurrentUser('id') userId: string,
    @Body('emoji') emoji: string,
  ) {
    return this.cuiBapService.addReaction(msgId, userId, emoji);
  }

  @Post('messages/:id/pin')
  @ApiOperation({ summary: 'Ghim/bá» ghim tin nháº¯n' })
  pinMessage(@Param('id') msgId: string, @CurrentUser('id') userId: string) {
    return this.cuiBapService.pinMessage(msgId, userId);
  }

  // ââ GROUPS âââââââââââââââââââââââââââââââââââââââââââââââââââ
  @Get('groups')
  @ApiOperation({ summary: 'Láº¥y danh sÃ¡ch nhÃ³m' })
  getGroups(@CurrentUser('id') userId: string) {
    return this.cuiBapService.getGroups(userId);
  }

  @Post('groups')
  @ApiOperation({ summary: 'Táº¡o nhÃ³m má»i (max 100 members)' })
  createGroup(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.cuiBapService.createGroup(userId, body);
  }

  @Post('groups/:id/members')
  @ApiOperation({ summary: 'ThÃªm thÃ nh viÃªn vÃ o nhÃ³m' })
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
  @ApiOperation({ summary: 'XÃ³a thÃ nh viÃªn / rá»i nhÃ³m' })
  removeMember(
    @Param('id') groupId: string,
    @Param('userId') targetUserId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.cuiBapService.removeGroupMember(groupId, userId, targetUserId);
  }

  @Get('groups/:id/messages')
  @ApiOperation({ summary: 'Láº¥y tin nháº¯n trong nhÃ³m' })
  getGroupMessages(
    @Param('id') groupId: string,
    @CurrentUser('id') userId: string,
    @Query('before') before?: string,
    @Query('limit') limit?: number,
  ) {
    return this.cuiBapService.getGroupMessages(groupId, userId, before, limit);
  }

  @Post('groups/:id/messages')
  @ApiOperation({ summary: 'Gá»­i tin nháº¯n nhÃ³m' })
  sendGroupMessage(
    @Param('id') groupId: string,
    @CurrentUser('id') senderId: string,
    @Body() body: any,
  ) {
    return this.cuiBapService.sendGroupMessage(groupId, senderId, body);
  }

  // ââ POLLS ââââââââââââââââââââââââââââââââââââââââââââââââââââ
  @Post('groups/:id/polls')
  @ApiOperation({ summary: 'Táº¡o poll trong nhÃ³m' })
  createPoll(@Param('id') groupId: string, @CurrentUser('id') userId: string, @Body() body: any) {
    return this.cuiBapService.createPoll(groupId, userId, body);
  }

  @Post('polls/:id/vote')
  @ApiOperation({ summary: 'Bá» phiáº¿u poll' })
  votePoll(
    @Param('id') pollId: string,
    @CurrentUser('id') userId: string,
    @Body('option_index') optionIndex: number,
  ) {
    return this.cuiBapService.votePoll(pollId, userId, optionIndex);
  }

  // ââ SETTINGS âââââââââââââââââââââââââââââââââââââââââââââââââ
  @Get('settings')
  @ApiOperation({ summary: 'Láº¥y cÃ i Äáº·t CÃ¹i Báº¯p (theme, font, background, notifications)' })
  getSettings(@CurrentUser('id') userId: string) {
    return this.cuiBapService.getSettings(userId);
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Cáº­p nháº­t cÃ i Äáº·t' })
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
