import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserSerializer {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  fullname: string;
}
