import { Module } from '@nestjs/common';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenBlacklist } from '@database/entities/token-blacklist.entity';
import { UserEntity } from '@database/entities/user.entity';
import { LocalStrategy } from './strategies /local.strategy';
import { JwtStrategy } from './strategies /jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenBlacklist]),
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService, LocalStrategy, JwtStrategy],
})
export class UserAuthModule {}
