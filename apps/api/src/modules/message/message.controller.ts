import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { Throttle } from '../../common/guards/throttle.guard';
import { CaptchaGuard, RequireCaptcha } from '../../common/guards/captcha.guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // Public: no sign-in required to send a message, per product design.
  // Rate-limited + Turnstile-protected since this is the most spam-exposed
  // endpoint in the ecosystem (no auth, no account needed).
  @Public()
  @UseGuards(CaptchaGuard)
  @RequireCaptcha()
  @Throttle({ limit: 5, window: 300, keyExtra: 'message' })
  @Post()
  async create(@Body() body: CreateMessageDto) {
    return this.messageService.create(body);
  }
}
