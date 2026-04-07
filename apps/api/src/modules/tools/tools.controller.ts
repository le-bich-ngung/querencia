import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
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
  @ApiOperation({ summary: 'Danh sách tất cả tools' })
  getTools(@CurrentUser('id') userId?: string): any[] {
    return this.toolsService.getTools(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('quota')
  @ApiOperation({ summary: 'Q quota hôm nay của user' })
  getQuota(@CurrentUser('id') userId: string) {
    return this.toolsService.getQuota(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':slug/use')
  @ApiOperation({ summary: 'Dùng tool (deduct Q nếu cần)' })
  useTool(@Param('slug') slug: string, @CurrentUser() user: any) {
    return this.toolsService.useTool(slug, user.id, user.plan);
  }
}
