import { Module } from '@nestjs/common';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { QuotaService } from './quota.service';

@Module({
  controllers: [ToolsController],
  providers: [ToolsService, QuotaService],
  exports: [QuotaService],
})
export class ToolsModule {}
