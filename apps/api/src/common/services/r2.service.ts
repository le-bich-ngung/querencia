/**
 * R2 Service - Cloudflare R2 file upload
 * Migrated từ querencia-backend/api/app_logic.py (boto3 r2 client)
 * Dùng cho: Cùi Bắp file upload, Nope image upload
 */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as path from 'path';
import { randomUUID } from 'crypto';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB - giữ y chang code cũ

// MIME type → extension safe list
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif',
  'image/webp': 'webp', 'application/pdf': 'pdf',
  'video/mp4': 'mp4', 'audio/mpeg': 'mp3', 'audio/ogg': 'ogg',
  'application/zip': 'zip', 'text/plain': 'txt',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    const accountId = config.get('R2_ACCOUNT_ID')!;
    this.bucket    = config.get('R2_BUCKET_NAME') ?? 'querencia-files';
    this.publicUrl = config.get('R2_PUBLIC_URL')  ?? 'https://files.querencia.com.vn';

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId:     config.get('R2_ACCESS_KEY_ID')!,
        secretAccessKey: config.get('R2_SECRET_ACCESS_KEY')!,
      },
    });
  }

  async upload(
    file: Express.Multer.File,
    folder: string,    // 'cuibap' | 'nope'
    userId: string,
  ): Promise<{ url: string; key: string; size: number; name: string; expiresAt?: Date }> {
    // 1. Validate size - giữ y chang code cũ (20MB)
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File quá lớn, tối đa 20MB');
    }

    // 2. Validate type
    const ext = ALLOWED_TYPES[file.mimetype]
      ?? (path.extname(file.originalname).replace('.', '') || 'bin');

    // 3. Unique key - giữ pattern từ code cũ: uploads/{userId}/{uuid}.{ext}
    const key = `${folder}/${userId}/${randomUUID()}.${ext}`;

    // 4. Upload lên R2
    await this.client.send(new PutObjectCommand({
      Bucket:      this.bucket,
      Key:         key,
      Body:        file.buffer,
      ContentType: file.mimetype || 'application/octet-stream',
    }));

    const url = `${this.publicUrl}/${key}`;
    this.logger.log(`[R2] Uploaded: ${key} (${file.size} bytes)`);

    return {
      url,
      key,
      size: file.size,
      name: file.originalname,
      // File tự xóa sau 7 ngày (giữ y chang code cũ)
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    };
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
      this.logger.log(`[R2] Deleted: ${key}`);
    } catch (e) {
      this.logger.warn(`[R2] Delete failed: ${key} - ${e}`);
    }
  }
}
