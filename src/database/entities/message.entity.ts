import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { GroupEntity } from './group.entity';
import { UserEntity } from './user.entity';

@Entity()
export class MessageEntity extends BaseEntity {
  @ManyToOne(() => GroupEntity)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;

  @Column({ type: 'uuid', name: 'group_id' })
  group_id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @Column({ type: 'uuid', name: 'sender_id' })
  sender_id: string;

  @Column({ type: 'text' })
  message: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
