import { TokenBlacklist } from '@database/entities/token-blacklist.entity';
import { JwtPayload } from '@modules/user-auth/interfaces/payload.interface';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '@database/entities/user.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@modules/user-auth/dtos/create-user.dto';
import { UserSerializer } from '@modules/user-auth/serializers/user.serializer';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!user) {
      return null;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return null;
    }

    return user;
  }

  async login(user: UserEntity) {
    const payload: JwtPayload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: plainToClass(UserSerializer, user),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<UserSerializer> {
    const userExist = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }],
    });

    if (userExist) {
      throw new ConflictException('user already exist');
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userRepository.save(createUserDto);
    return user;
  }

  logout(tokenBlacklist: TokenBlacklist) {
    this.tokenBlacklistRepository.save(tokenBlacklist);
  }

  async findOne(
    options: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne(options);
  }

  async find(
    options: FindManyOptions<UserEntity>,
  ): Promise<UserEntity[] | null> {
    return this.userRepository.find(options);
  }
  async isTokenBlacklisted(token: string) {
    const isTokenBlacklisted = await this.tokenBlacklistRepository.exist({
      where: { token: token },
    });

    return isTokenBlacklisted;
  }

  async update(
    criteria: FindOptionsWhere<UserEntity>,
    partialEntity: QueryDeepPartialEntity<UserEntity>,
  ) {
    return this.userRepository.update(criteria, partialEntity);
  }

  async verifyJwt(jwtToken: string) {
    const isTokenIsBlacklsited = await this.isTokenBlacklisted(jwtToken);

    if (isTokenIsBlacklsited) return null;

    return await this.jwtService.verifyAsync(jwtToken);
  }
}
