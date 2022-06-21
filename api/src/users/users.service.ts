import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  HttpStatus,
  Injectable,
  Logger,
  PreconditionFailedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Agent } from 'src/agents/entities/agent.entity';
import { IAgent } from 'src/agents/interfaces/agent.interface';
import { Task } from 'src/tasks/entities/task.entity';
import { BaseResponseDto } from 'src/__shared__/dto/response.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { GetWorkspacesDto } from './dto/get-workspaces.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { User, Workspace } from './entities/user.entity';
import { BaseRole, Privilege } from './interfaces/user.interface';

@Injectable()
export class WorkspacesService {
  private readonly logger = new Logger(WorkspacesService.name);

  constructor(
    @InjectRepository(Workspace)
    private userRepository: EntityRepository<User>,
    @InjectRepository(Agent)
    private agentRepository: EntityRepository<Agent>,
    @InjectRepository(Task)
    private taskRepository: EntityRepository<Task>,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto) {
    try {
      const { creator, ...rest } = createWorkspaceDto;

      // unique name
      const inUse = await this.workspaceRepository.findOne({ name: rest.name });
      if (inUse) {
        return {
          status: HttpStatus.CONFLICT,
          errors: [{ field: 'name', message: 'Name allready in use' }],
        };
      }

      // crate workspace
      const workspace = new Workspace({ creatorId: creator.userId, ...rest });

      // initial agents
      await this.agentRepository.persist([
        new Agent({
          workspace,
          role: BaseRole.ADMIN,
          ...creator,
        }),
        new Agent({
          workspace,
          role: BaseRole.WORKER,
          name: 'test worker',
          userId: 111111111,
        }),
      ]);

      await this.agentRepository.flush();

      return {
        status: HttpStatus.CREATED,
        data: workspace,
      };
    } catch (e) {
      console.log(e);

      throw new RpcException({
        status: HttpStatus.PRECONDITION_FAILED,
      });
    }
  }

  async findAll({ limit, offset, uid, ...rest }: GetWorkspacesDto) {
    const _where = { deletedAt: null };

    if (uid) {
      const wids = await this.agentRepository.find({ userId: uid });
      _where['id'] = wids.map((w) => w.workspace);
      console.log(uid, wids);
    }

    const where = Object.keys(rest).reduce((acc, key) => {
      if (!(Workspace.isSearchable(key) && rest[key])) return acc;
      acc[key] = { $eq: rest[key] };
      return acc;
    }, _where);

    const [items, total] = await this.workspaceRepository.findAndCount(where, {
      orderBy: { [rest['sort.field'] || 'id']: rest['sort.order'] || 'ASC' },
      limit: +limit + 1,
      offset: +offset,
    });

    return {
      status: HttpStatus.OK,
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

    if (!data) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        data: null,
      };
    }

    return {
      status: HttpStatus.OK,
      data,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const res = await this.findOne(id);
      if (!res.data) return res;

      const { username, email } = updateUserDto;

      // unique case: username
      if (username) {
        if (await this.userRepository.findOne({ username })) {
          re          ку

          return {
            statusCode: HttpStatus.CONFLICT,
            errors: [
              { field: 'username', message: 'Username allready in use' },
            ],
          };
        }
      }

      // unique case: email
      if (email) {
        if (await this.userRepository.findOne({ email })) {
          return {
            statusCode: HttpStatus.CONFLICT,
            errors: [{ field: 'email', message: 'Email allready in use' }],
          };
        }
      }

      // password case
      if (updateUserDto.password) {
        res.data.password = updateUserDto.password;
        await res.data.hashPassword();
      }

      this.userRepository.assign(res.data, updateUserDto);
      await this.userRepository.flush();

      return {
        status: HttpStatus.OK,
        data: res.data,
      };
    } catch (e) {
      throw new PreconditionFailedException();
    }
  }

  async remove(id: number) {
    try {
      const res = await this.findOne(id);
      if (!res.data) return res;

      res.data.deletedAt = new Date();
      await this.userRepository.flush();

      // TODO: use scheduler to run PG procedure to completely delete users and
      // related entries that not active during the time threshold e.g. 3 months

      return {
        status: HttpStatus.OK,
        data: null,
      };
    } catch (e) {
      throw new PreconditionFailedException();
    }
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
