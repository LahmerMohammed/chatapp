import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './services/chats.service';

@Module({
  providers: [ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
