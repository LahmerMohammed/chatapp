import { IsEmail, IsString, Length } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateUserDto {
  @Expose()
  @IsString()
  @Length(4)
  password: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  @Length(4)
  fullname: string;

  @Expose()
  @IsString()
  @Length(4)
  username: string;
}
