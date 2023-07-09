import { BaseEntity } from '@database/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

/**
 * This model isn't being used at the moment
 */

@Entity()
export class ConversationEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  userA: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  userB: UserEntity;

  @Column({ type: 'text' })
  description: string;

  @Column()
  name: string;
}
