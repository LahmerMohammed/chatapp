import { IsUUID } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateMessageDto {
  @Expose()
  @IsUUID()
  user_id: string;

  @Expose()
  @IsUUID()
  group_id: string;
}
