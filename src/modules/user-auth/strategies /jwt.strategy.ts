import { UserSerializer } from '@modules/user-auth/serializers/user.serializer';
import { plainToClass } from 'class-transformer';
import { JwtPayload } from '@modules/user-auth/interfaces/payload.interface';
import { UserAuthService } from '@modules/user-auth/user-auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserAuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (
        request: any,
        rawJwtToken: string,
        done: (error: any, secretOrKey?: string | Buffer) => void,
      ) => {
        const jwtSecret = this.configService.get<string>('JWT_SECRET');
        done(null, jwtSecret);
      },
    });
  }

  async validate(payload: JwtPayload): Promise<UserSerializer> {
    const user_id = payload.sub;

    const user = await this.userService.findOne({ where: { id: user_id } });

    return plainToClass(UserSerializer, user);
  }
}
