import { Module } from '@nestjs/common';
import ConfigModule from '@modules/config/config.module';
import { ChatsModule } from '@modules/chats/chats.module';
import { UserAuthModule } from '@modules/user-auth/user-auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import getDatabaseConfiguration from '@database/database.config';

@Module({
  imports: [
    ConfigModule,
    ChatsModule,
    UserAuthModule,
    TypeOrmModule.forRoot(getDatabaseConfiguration()),
  ],
})
export class AppModule {}
