import {
  Controller, Post, Get, Param,
  UseInterceptors, UploadedFile,
  Body, Res, HttpCode, Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileShareService } from './file-share.service';
import { Public } from '../../common/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('file-share')
export class FileShareController {
  private readonly logger = new Logger(FileShareController.name);

  constructor(private readonly service: FileShareService) {}

  // ── Upload ────────────────────────────────────────────────
  // Public - no account needed
  @Post('upload')
  @Public()
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 3600000 } }) // 10 uploads/hour per IP
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB
  }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('expiry') expiry: string,
    @Body('dlLimit') dlLimit: string,
  ) {
    const expiryHours = Math.min(168, Math.max(1, parseInt(expiry) || 24));
    const limit = Math.max(0, parseInt(dlLimit) || 0);
    return this.service.upload(file, expiryHours, limit);
  }

  // ── Get metadata ──────────────────────────────────────────
  @Get('meta/:id')
  @Public()
  async getMeta(@Param('id') id: string) {
    return this.service.getMeta(id);
  }

  // ── Download ──────────────────────────────────────────────
  @Get('download/:id')
  @Public()
  @Throttle({ default: { limit: 20, ttl: 3600000 } }) // 20 downloads/hour per IP
  async download(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.service.download(id);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="encrypted.bin"`,
      'Content-Length': buffer.length,
      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    });
    res.send(buffer);
  }
}
