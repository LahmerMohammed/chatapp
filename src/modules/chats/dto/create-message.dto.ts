import { IsString, IsUUID, Length } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateMessageDto {
  @Expose()
  @IsUUID()
  sender_id: string;

  @Expose()
  @IsUUID()
  group_id: string;

  @Expose()
  @IsString()
  @Length(1)
  message: string;
}
