import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  private resend: Resend | null = null;

  constructor(private readonly config: ConfigService) {
    const resendKey = this.config.get<string>('RESEND_API_KEY');
    if (resendKey) this.resend = new Resend(resendKey);
  }

  async create(dto: CreateMessageDto) {
    try {
      if (this.resend) {
        await this.resend.emails.send({
          from:    'Querencia <no-reply@querencia.dev>',
          to:      'hello@querencia.dev',
          subject: `[Message] ${dto.subject}`,
          html:    `
            <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px">
              <p style="color:#999;font-size:0.8rem">New message from the Querencia contact form</p>
              <h2 style="color:#2d5a3d">${this._escape(dto.subject)}</h2>
              <p style="white-space:pre-wrap;color:#333">${this._escape(dto.content)}</p>
            </div>`,
        });
      } else {
        this.logger.warn('RESEND_API_KEY not set - message not emailed, logging instead');
      }
      this.logger.log(`[MESSAGE] "${dto.subject}" received`);
    } catch (e) {
      this.logger.error(`[MESSAGE EMAIL ERROR] ${e}`);
      // Don't fail the request just because the notification email failed to send -
      // the message itself was still validated.
    }

    return { success: true };
  }

  private _escape(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
