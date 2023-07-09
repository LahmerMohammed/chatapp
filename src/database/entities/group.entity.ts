import { BaseEntity } from '@database/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { MessageEntity } from './message.entity';

@Entity()
export class GroupEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @Column({ type: 'uuid', name: 'owner_id' })
  owner_id: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  name: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  memebers: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.group)
  messages: MessageEntity[];
}
