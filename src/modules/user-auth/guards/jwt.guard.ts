import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthService } from '@modules/user-auth/user-auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly userAuthService: UserAuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isValid = await super.canActivate(context);

    const authorization: string = context.switchToHttp().getRequest()
      .headers.authorization;

    const token = authorization.substring(7);

    const isBlacklisted = await this.userAuthService.isTokenBlacklisted(token);

    return isValid && !isBlacklisted;
  }
}
