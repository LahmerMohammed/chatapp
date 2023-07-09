import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class EmailConfirmedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const isEmailConfirmed = request.user.isEmailConfirmed;

    if (!isEmailConfirmed) {
      throw new UnauthorizedException('Please confirm your email');
    }

    return isEmailConfirmed;
  }
}
