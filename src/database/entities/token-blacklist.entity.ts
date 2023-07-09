import { Entity, PrimaryColumn } from 'typeorm';

@Entity('token_blacklist')
export class TokenBlacklist {
  @PrimaryColumn()
  token: string;
}
