ï»¿import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ToolsService } from './tools.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Tools')
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Danh sÃ¡ch táº¥t cáº£ tools' })
  getTools(@CurrentUser('id') userId?: string): any[] {
    return this.toolsService.getTools(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('quota')
  @ApiOperation({ summary: 'Q quota hÃ´m nay cá»§a user' })
  getQuota(@CurrentUser('id') userId: string) {
    return this.toolsService.getQuota(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':slug/use')
  @ApiOperation({ summary: 'DÃ¹ng tool (deduct Q náº¿u cáº§n)' })
  useTool(@Param('slug') slug: string, @CurrentUser() user: any) {
    return this.toolsService.useTool(slug, user.id, user.plan);
  }
}
