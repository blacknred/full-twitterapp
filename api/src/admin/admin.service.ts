import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { RedisService } from 'nestjs-redis';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const client = await this.redisService.getClient('users');
    // client.pipeline().zadd().exec()
    // // unique case: username
    // const { username, email } = createUserDto;

    // if (username) {
    //   if (await this.userRepository.findOne({ username })) {
    //     throw new ConflictException({
    //       errors: [{ field: 'username', message: 'Username allready in use' }],
    //     });
    //   }
    // }

    // // unique case: email
    // if (email) {
    //   if (await this.userRepository.findOne({ email })) {
    //     throw new ConflictException({
    //       errors: [{ field: 'email', message: 'Email allready in use' }],
    //     });
    //   }
    // }

    // const user = new User(createUserDto);
    // await this.userRepository.persistAndFlush(user);

    // return { data: user };
 // this.password = await bcrypt.hash(this.password, 8);
  }

  async findAll({ limit, cursor, ...rest }: GetUsersDto) {
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

  async findOne(id: number, withDeleted?: boolean) {
    // const params = withDeleted ? id : { id, deletedAt: null };
    // const data = await this.userRepository.findOne(params);
    // if (!data) throw new NotFoundException();
    // return { data };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // const res = await this.findOne(id);
    // const { username, email } = updateUserDto;
    // // unique case: username
    // if (username) {
    //   if (await this.userRepository.findOne({ username })) {
    //     throw new ConflictException({
    //       errors: [{ field: 'username', message: 'Username allready in use' }],
    //     });
    //   }
    // }
    // // unique case: email
    // if (email) {
    //   if (await this.userRepository.findOne({ email })) {
    //     throw new ConflictException({
    //       errors: [{ field: 'email', message: 'Email allready in use' }],
    //     });
    //   }
    // }
    // // password case
    // if (updateUserDto.password) {
    //   res.data.password = updateUserDto.password;
    //   await res.data.hashPassword();
    // }
    // this.userRepository.assign(res.data, updateUserDto);
    // await this.userRepository.persistAndFlush(res.data);
    // return { data: res.data };
  }

  async remove(id: number) {
    // const res = await this.findOne(id);
    // res.data.deletedAt = new Date();
    // await this.userRepository.persistAndFlush(res.data);
    // return { data: null };

    // #if user not exists
    // if (conn.zscore(deleted, uid)) return Err
    // #soft delete user
    // conn.zadd(deleted,uid,now())
  }
}
