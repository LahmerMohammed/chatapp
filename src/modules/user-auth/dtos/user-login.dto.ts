import { IsEmail, IsString, Length } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserLoginDto {
  @Expose()
  @IsString()
  @Length(4)
  password: string;

  @Expose()
  @IsEmail()
  username: string;
}
