import {
  Injectable, Logger, NotFoundException,
  BadRequestException, GoneException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DB_TOKEN } from '../../database/database.module';
import { vaultFiles } from '@querencia/db';
import { eq, lt } from 'drizzle-orm';
import {
  S3Client, PutObjectCommand,
  GetObjectCommand, DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

@Injectable()
export class FileShareService {
  private readonly logger = new Logger(FileShareService.name);
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(
    @Inject(DB_TOKEN) private readonly db: any,
    private readonly config: ConfigService,
  ) {
    const accountId = config.get('R2_ACCOUNT_ID')!;
    this.bucket = config.get('R2_BUCKET_NAME') ?? 'querencia-files';
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.get('R2_ACCESS_KEY_ID')!,
        secretAccessKey: config.get('R2_SECRET_ACCESS_KEY')!,
      },
    });
  }

  // ── Upload encrypted blob ──────────────────────────────────
  async upload(
    file: Express.Multer.File,
    expiry: number,
    dlLimit: number,
  ): Promise<{ fileId: string }> {
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('File too large. Max 2GB.');
    }

    const token = randomUUID();
    const r2Key = `file-share/${token}.bin`;
    const expireAt = new Date(Date.now() + expiry * 3600 * 1000);

    // Upload encrypted blob to R2
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: r2Key,
      Body: file.buffer,
      ContentType: 'application/octet-stream',
    }));

    // Save to vaultFiles table (reuse existing schema)
    await this.db.insert(vaultFiles).values({
      token,
      filename: 'encrypted', // real name is encrypted in payload
      filepath: r2Key,
      filesize: file.size,
      expireAt,
      maxReads: dlLimit > 0 ? dlLimit : null,
      readCount: 0,
      password: null, // password handled client-side (E2EE)
      mode: expiry <= 1 ? '1h' : expiry <= 24 ? '24h' : '7d',
    });

    this.logger.log(`[FileShare] Uploaded: ${token} (${file.size} bytes)`);
    return { fileId: token };
  }

  // ── Get metadata ──────────────────────────────────────────
  async getMeta(fileId: string): Promise<{
    name: string; size: number; hasPassword: boolean;
    expiresAt: Date; dlLimit: number; dlCount: number;
  }> {
    const share = await this.findValid(fileId);
    return {
      name: share.filename,
      size: share.filesize ?? 0,
      hasPassword: !!share.password,
      expiresAt: share.expireAt!,
      dlLimit: share.maxReads ?? 0,
      dlCount: share.readCount,
    };
  }

  // ── Download encrypted blob ───────────────────────────────
  async download(fileId: string): Promise<Buffer> {
    const share = await this.findValid(fileId);

    // Get from R2
    const res = await this.client.send(new GetObjectCommand({
      Bucket: this.bucket,
      Key: share.filepath,
    }));

    const chunks: Uint8Array[] = [];
    for await (const chunk of res.Body as any) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    // Increment read count
    const newCount = share.readCount + 1;
    await this.db
      .update(vaultFiles)
      .set({ readCount: newCount })
      .where(eq(vaultFiles.token, fileId));

    // Auto-delete if limit reached
    if (share.maxReads && newCount >= share.maxReads) {
      await this.deleteShare(share);
      this.logger.log(`[FileShare] Auto-deleted after ${newCount} downloads: ${fileId}`);
    }

    return buffer;
  }

  // ── Delete expired (cron) ─────────────────────────────────
  async deleteExpired(): Promise<number> {
    const expired = await this.db
      .select()
      .from(vaultFiles)
      .where(lt(vaultFiles.expireAt, new Date()));

    for (const share of expired) await this.deleteShare(share);
    return expired.length;
  }

  // ── Helpers ───────────────────────────────────────────────
  private async findValid(fileId: string) {
    const rows = await this.db
      .select()
      .from(vaultFiles)
      .where(eq(vaultFiles.token, fileId))
      .limit(1);

    if (!rows.length) throw new NotFoundException('File not found or link expired.');

    const share = rows[0];
    if (share.expireAt && new Date() > share.expireAt) {
      await this.deleteShare(share);
      throw new GoneException('File link has expired.');
    }
    if (share.maxReads && share.readCount >= share.maxReads) {
      throw new GoneException('Download limit reached.');
    }
    return share;
  }

  private async deleteShare(share: any): Promise<void> {
    try {
      await this.client.send(new DeleteObjectCommand({
        Bucket: this.bucket, Key: share.filepath,
      }));
    } catch (e) {
      this.logger.warn(`[FileShare] R2 delete failed: ${share.filepath}`);
    }
    await this.db.delete(vaultFiles).where(eq(vaultFiles.token, share.token));
  }
}
