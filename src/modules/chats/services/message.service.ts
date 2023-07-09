import { MessageEntity } from '@database/entities/message.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from '../dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(message: CreateMessageDto) {
    return await this.messageRepository.save(message);
  }

  // TODO: add pagination
  async finGroupMessages(group_id: string) {
    return await this.messageRepository.find({
      where: { group_id: group_id },
      order: { created_at: 'ASC' },
    });
  }
}
