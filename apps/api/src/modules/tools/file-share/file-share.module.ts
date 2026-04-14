import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FileShareService } from './file-share.service';
import { FileShareController } from './file-share.controller';
import { FileShareCron } from './file-share.cron';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [FileShareController],
  providers: [FileShareService, FileShareCron],
  exports: [FileShareService],
})
export class FileShareModule {}
