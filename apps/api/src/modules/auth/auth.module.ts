ï»¿import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService }    from './auth.service';
import { TokenService }   from './token.service';
import { JwtStrategy }    from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports:    [ConfigModule],
      inject:     [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret:     cfg.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: cfg.get('JWT_ACCESS_EXPIRES_IN') ?? '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers:   [AuthService, TokenService, JwtStrategy],
  exports:     [AuthService, TokenService, JwtModule],
})
export class AuthModule {}
