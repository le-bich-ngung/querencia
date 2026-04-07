/**
 * Nope Controller — REST endpoints
 * Migrated từ querencia-backend/api/app_logic.py (nope_router)
 */
import {
  Controller, Get, Post, Delete, Param, Body, Query,
  UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { NopeService } from './nope.service';

@ApiTags('Nope')
@Controller('nope')
export class NopeController {
  constructor(private readonly nopeService: NopeService) {}

  @Get('posts')
  getFeed(@Query('page') page: number = 1, @Query('limit') limit: number = 20, @CurrentUser('id') userId?: string) {
    return this.nopeService.getFeed(page, limit, userId);
  }

  @Get('posts/search')
  search(@Query('q') query: string, @Query('tags') tags?: string) {
    return this.nopeService.searchPosts(query, tags?.split(','));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('posts/saved')
  getSaved(@CurrentUser('id') userId: string) {
    return this.nopeService.getSavedPosts(userId);
  }

  @Get('posts/:id')
  getPost(@Param('id') postId: string, @CurrentUser('id') userId?: string) {
    return this.nopeService.getPostById(postId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('posts')
  createPost(@CurrentUser() user: any, @Body() body: any) {
    return this.nopeService.createPost({
      authorId: user.id,
      authorName: user.name ?? user.email,
      ...body,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('posts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id') postId: string, @CurrentUser('id') userId: string) {
    return this.nopeService.deletePost(postId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('posts/:id/thank')
  toggleThank(@Param('id') postId: string, @CurrentUser('id') userId: string) {
    return this.nopeService.toggleThank(postId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('posts/:id/save')
  toggleSave(@Param('id') postId: string, @CurrentUser('id') userId: string) {
    return this.nopeService.toggleSave(postId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('posts/:id/comments')
  addComment(@Param('id') postId: string, @CurrentUser() user: any, @Body() body: { content: string }) {
    return this.nopeService.addComment(postId, {
      authorId: user.id,
      authorName: user.name ?? user.email,
      body: body.content,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('posts/:id/comments/:commentId')
  deleteComment(@Param('commentId') commentId: string, @CurrentUser('id') userId: string) {
    return this.nopeService.deleteComment(commentId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('users/:id/follow')
  toggleFollow(@Param('id') followingId: string, @CurrentUser('id') followerId: string) {
    return this.nopeService.toggleFollow(followerId, followingId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('users/me/profile')
  getMyProfile(@CurrentUser('id') userId: string) {
    return this.nopeService.getUserProfile(userId);
  }

  @Get('users/:id/profile')
  getUserProfile(@Param('id') userId: string) {
    return this.nopeService.getUserProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('posts/:id/report')
  reportPost(@Param('id') postId: string, @CurrentUser('id') userId: string, @Body() body: { reason: string }) {
    return this.nopeService.reportPost(postId, userId, body.reason);
  }
}
