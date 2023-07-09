import { IsString, IsUUID, Length } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateGroupDto {
  @Expose()
  @IsUUID()
  owner_id: string;

  @Expose()
  @IsString()
  @Length(5)
  name: string;

  @Expose()
  @IsString()
  description: string;
}
