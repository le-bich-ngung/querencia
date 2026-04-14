import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FileShareService } from './file-share.service';

@Injectable()
export class FileShareCron {
  private readonly logger = new Logger(FileShareCron.name);

  constructor(private readonly service: FileShareService) {}

  // Run every hour — clean up expired files
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpired() {
    const deleted = await this.service.deleteExpired();
    if (deleted > 0) {
      this.logger.log(`[Cron] Cleaned up ${deleted} expired file shares`);
    }
  }
}
