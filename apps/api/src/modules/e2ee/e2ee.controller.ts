import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { E2eeService } from './e2ee.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('api/v1/e2ee')
export class E2eeController {
  constructor(private readonly svc: E2eeService) {}

  @Post('keys')
  uploadKeys(@CurrentUser() user: any, @Body() body: any) {
    return this.svc.uploadKeyBundle(user.id, body);
  }

  @Get('keys/:userId')
  getKeys(@CurrentUser() user: any, @Param('userId') targetId: string) {
    return this.svc.getKeyBundle(user.id, targetId);
  }

  @Post('keys/prekeys')
  uploadMorePreKeys(@CurrentUser() user: any, @Body() body: { preKeys: any[] }) {
    return this.svc.uploadMorePreKeys(user.id, body.preKeys);
  }
}
