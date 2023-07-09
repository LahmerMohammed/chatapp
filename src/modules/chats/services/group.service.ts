import { GroupEntity } from '@database/entities/group.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateGroupDto } from '../dto/create-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto) {
    return await this.groupRepository.save(createGroupDto);
  }

  async findOne(options: FindOneOptions<GroupEntity>) {
    return await this.groupRepository.findOne(options);
  }

  // TODO: add pagination
  async getUserGroups(user_id: string) {
    return await this.groupRepository.find({ where: { owner_id: user_id } });
  }
}
