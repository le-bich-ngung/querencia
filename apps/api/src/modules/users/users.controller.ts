ï»¿import { Controller, Post, Delete, Get, Patch, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Post(':id/block')
  @HttpCode(HttpStatus.OK)
  block(@Param('id') targetId: string, @CurrentUser('id') userId: string) {
    return this.svc.blockUser(userId, targetId);
  }

  @Delete(':id/block')
  @HttpCode(HttpStatus.OK)
  unblock(@Param('id') targetId: string, @CurrentUser('id') userId: string) {
    return this.svc.unblockUser(userId, targetId);
  }

  @Post(':id/report')
  @HttpCode(HttpStatus.OK)
  report(
    @Param('id') targetId: string,
    @CurrentUser('id') userId: string,
    @Body() body: { reason: string },
  ) {
    return this.svc.reportUser(userId, targetId, body.reason);
  }

  @Patch('me/profile')
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: { name?: string; avatarUrl?: string },
  ) {
    return this.svc.updateProfile(userId, body);
  }

  @Get('blocks')
  getBlocks(@CurrentUser('id') userId: string) {
    return this.svc.getBlockList(userId);
  }
}
