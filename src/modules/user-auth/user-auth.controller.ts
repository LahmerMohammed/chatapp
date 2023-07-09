import { TokenBlacklist } from '@database/entities/token-blacklist.entity';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserAuthService } from '@modules/user-auth/user-auth.service';
import { CreateUserDto } from '@modules/user-auth/dtos/create-user.dto';
import { LocalAuthGuard } from '@modules/user-auth/guards/local.guard';
import { EmailConfirmedGuard } from '@guards/email-confirmed.guard';
import { UserLoginDto } from '@modules/user-auth/dtos/user-login.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class UserAuthController {
  constructor(private service: UserAuthService) {}

  @Post('/logout')
  logout(@Body() tokenBlacklist: TokenBlacklist) {
    this.service.logout(tokenBlacklist);
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.service.register(createUserDto);
  }

  @ApiBody({ type: UserLoginDto })
  @UseGuards(LocalAuthGuard, EmailConfirmedGuard)
  @Post('/login')
  async login(@Request() req: any) {
    const { user } = req;

    return await this.service.login(user);
  }
}
