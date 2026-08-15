import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  subject: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;

  // Cloudflare Turnstile token from the client-side widget - verified
  // server-side by CaptchaGuard before this DTO's handler ever runs.
  @IsString()
  captchaToken: string;
}
