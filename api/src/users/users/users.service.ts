import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
  ) {
    // TODO: daily remove deleted more than 3month ago users with rabbitmq_delayed_message_exchange
  }

  async create(createUserDto: CreateUserDto) {
    const cache = await this.redisService.getClient('users');
    const { username, email } = createUserDto;

    if (username) {
      if (await this.userRepository.findOne({ username })) {
        throw new ConflictException({
          errors: [{ field: 'username', message: 'Username allready in use' }],
        });
      }
    }

    if (email) {
      if (await this.userRepository.findOne({ email })) {
        throw new ConflictException({
          errors: [{ field: 'email', message: 'Email allready in use' }],
        });
      }
    }

    const user = new User(createUserDto);
    user.id = await cache.incr(`USER:ID`);

    await cache.hmset(`USER:${user.id}`, ...user);
    await this.userRepository.persistAndFlush(user);

    return { data: user.toObject() };
  }

  async findAll(auid: number, { limit, cursor, order }: GetUsersDto) {
    // const sortField = rest['sort.field'] || 'id';
    // const sortOrder = rest['sort.order'] || 'ASC';
    // const _where = { deletedAt: null };
    // const where = Object.keys(rest).reduce((acc, key) => {
    //   if (!(User.isSearchable(key) && rest[key])) return acc;
    //   acc[key] = { $eq: rest[key] };
    //   return acc;
    // }, _where);
    // where[sortField] = sortOrder === 'ASC' ? { $gt: cursor } : { $lt: cursor };
    // const [items, total] = await this.userRepository.findAndCount(where, {
    //   orderBy: { [sortField]: sortOrder },
    //   limit: +limit + 1,
    // });
    // return {
    //   data: {
    //     hasMore: items.length === +limit + 1,
    //     items: items.slice(0, limit),
    //     total,
    //   },
    // };
  }

  async findOne(id: number) {
    // const params = withDeleted ? id : { id, deletedAt: null };
    // const data = await this.userRepository.findOne(params);
    // if (!data) throw new NotFoundException();
    // return { data };
  }

  async findValidatedOne(id: number) {}

  async update(auid: number, updateUserDto: UpdateUserDto) {
    const cache = this.redisService.getClient('users');
    const { username, email, password } = updateUserDto;

    if (!(await cache.exists(`USER:${auid}`))) {
      throw new ConflictException({
        errors: [{ field: 'uid', message: 'User not exists' }],
      });
    }

    if (username) {
      if (await this.userRepository.findOne({ username })) {
        throw new ConflictException({
          errors: [{ field: 'username', message: 'Username allready in use' }],
        });
      }
    }

    if (email) {
      if (await this.userRepository.findOne({ email })) {
        throw new ConflictException({
          errors: [{ field: 'email', message: 'Email allready in use' }],
        });
      }
    }

    // password case
    if (updateUserDto.password) {
      res.data.password = updateUserDto.password;
      await res.data.hashPassword();
    }
    // this.userRepository.assign(res.data, updateUserDto);
    // await this.userRepository.persistAndFlush(res.data);
    // return { data: res.data };
  }

  async remove(auid: number) {
    const cache = this.redisService.getClient('users');

    if (!(await cache.zscore(`DELETEDUSERS`, `${auid}`))) {
      throw new ConflictException({
        errors: [{ field: 'uid', message: 'User already deleted' }],
      });
    }

    await cache.zadd(`DELETEDUSERS`, auid, Date.now());

    return { data: null };
  }

   // public async getAuthenticatedUser(email: string, plainTextPassword: string) {
  //   try {
  //     const user = await this.usersService.getByEmail(email);
  //     await this.verifyPassword(plainTextPassword, user.password);
  //     user.password = undefined;
  //     return user;
  //   } catch (error) {
  //     throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
  //   }
  // }

  // private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
  //   const isPasswordMatching = await bcrypt.compare(
  //     plainTextPassword,
  //     hashedPassword
  //   );
  //   if (!isPasswordMatching) {
  //     throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
  //   }
  // }
}
