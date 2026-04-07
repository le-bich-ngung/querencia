ï»¿import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  root() {
    return { message: 'Querencia API', docs: '/api/docs' };
  }

  @Public()
  @Get('health')
  health() {
    return { status: 'healthy', version: '1.0.0', ts: new Date().toISOString() };
  }
}
