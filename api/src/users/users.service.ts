import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RedisService } from 'nestjs-redis';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { Connection } from 'amqplib';
import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Agent } from 'src/agents/entities/agent.entity';
import { IAgent } from 'src/agents/interfaces/agent.interface';
import { Task } from 'src/tasks/entities/task.entity';
import { BaseResponseDto } from 'src/__shared__/dto/response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { GetWorkspacesDto } from './dto/get-workspaces.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { User, Workspace } from './entities/user.entity';
import { BaseRole, Privilege } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectAmqpConnection() private readonly queueService: Connection,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const client = await this.redisService.getClient();

    // unique case: username
    const { username, email } = createUserDto;

    if (username) {
      if (await this.userRepository.findOne({ username })) {
        throw new ConflictException({
          errors: [{ field: 'username', message: 'Username allready in use' }],
        });
      }
    }

    // unique case: email
    if (email) {
      if (await this.userRepository.findOne({ email })) {
        throw new ConflictException({
          errors: [{ field: 'email', message: 'Email allready in use' }],
        });
      }
    }

    const user = new User(createUserDto);
    await this.userRepository.persistAndFlush(user);

    return { data: user };
  }

  async findAll({ limit, cursor, ...rest }: GetUsersDto) {
    const sortField = rest['sort.field'] || 'id';
    const sortOrder = rest['sort.order'] || 'ASC';

    const _where = { deletedAt: null };

    const where = Object.keys(rest).reduce((acc, key) => {
      if (!(User.isSearchable(key) && rest[key])) return acc;
      acc[key] = { $eq: rest[key] };
      return acc;
    }, _where);

    where[sortField] = sortOrder === 'ASC' ? { $gt: cursor } : { $lt: cursor };

    const [items, total] = await this.userRepository.findAndCount(where, {
      orderBy: { [sortField]: sortOrder },
      limit: +limit + 1,
    });

    return {
      data: {
        hasMore: items.length === +limit + 1,
        items: items.slice(0, limit),
        total,
      },
    };
  }

  async findOne(id: number, withDeleted?: boolean) {
    const params = withDeleted ? id : { id, deletedAt: null };
    const data = await this.userRepository.findOne(params);

    if (!data) throw new NotFoundException();
    return { data };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const res = await this.findOne(id);

    const { username, email } = updateUserDto;

    // unique case: username
    if (username) {
      if (await this.userRepository.findOne({ username })) {
        throw new ConflictException({
          errors: [{ field: 'username', message: 'Username allready in use' }],
        });
      }
    }

    // unique case: email
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

    this.userRepository.assign(res.data, updateUserDto);
    await this.userRepository.persistAndFlush(res.data);

    return { data: res.data };
  }

  async remove(id: number) {
    const res = await this.findOne(id);

    res.data.deletedAt = new Date();
    await this.userRepository.persistAndFlush(res.data);

    // TODO: use scheduler to run PG procedure to completely delete users and
    // related entries that not active during the time threshold e.g. 3 months
    // SELECT * FROM users WHERE deleted_at > NOW() - interval '3 month'

    return { data: null };
  }

  // async restore(id: string, userId: number) {
  //   try {
  //     const res = await this.findOne(id, null, true);
  //     if (!res.data) return res as ResponseDto;

  //     // creator
  //     if (res.data.creatorId !== userId) {
  //       return {
  //         status: HttpStatus.FORBIDDEN,
  //         data: null,
  //       };
  //     }

  //     res.data.deletedAt = null;
  //     await this.workspaceRepository.flush();

  //     return {
  //       status: HttpStatus.OK,
  //       data: res.data,
  //     };
  //   } catch (e) {
  //     throw new RpcException({
  //       status: HttpStatus.PRECONDITION_FAILED,
  //     });
  //   }
  // }
}
