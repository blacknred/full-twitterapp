import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Agent } from 'src/agents/entities/agent.entity';
import { IAgent } from 'src/agents/interfaces/agent.interface';
import { Task } from 'src/tasks/entities/task.entity';
import { ResponseDto } from 'src/__shared__/dto/response.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { GetWorkspacesDto } from './dto/get-workspaces.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from './entities/user.entity';
import { BaseRole, Privilege } from './interfaces/user.interface';

@Injectable()
export class WorkspacesService {
  private readonly logger = new Logger(WorkspacesService.name);

  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: EntityRepository<Workspace>,
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

  async findOne(id: string, agent?: IAgent, withDeleted?: boolean) {
    const params = withDeleted ? id : { id, deletedAt: null };
    const data = await this.workspaceRepository.findOne(params);

    if (!data) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
      };
    }

    delete agent?.workspace;
    data.agent = agent;

    return {
      status: HttpStatus.OK,
      data,
    };
  }

  async update(updateWorkspaceDto: UpdateWorkspaceDto, agent: IAgent) {
    try {
      const { id, stages, labels, roles, ...rest } = updateWorkspaceDto;
      const res = await this.findOne(id);
      if (!res.data) return res as ResponseDto;

      // creator | EDIT_WORKSPACE
      if (
        res.data.creatorId !== agent.userId &&
        !agent.hasPrivilege(Privilege.EDIT_WORKSPACE)
      ) {
        return {
          status: HttpStatus.FORBIDDEN,
          data: null,
        };
      }

      // stages
      if (stages) {
        for (const stage of res.data.stages) {
          if (!stages.includes(stage)) {
            const inUse = await this.taskRepository.count({ stage });
            if (inUse)
              return {
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: [
                  {
                    field: 'stages',
                    message: `Stage ${stage} in use`,
                  },
                ],
              };
          }
        }
      }

      // labels
      if (labels) {
        for (const label of res.data.labels) {
          if (!labels.includes(label)) {
            const inUse = await this.taskRepository.count({ label });
            if (inUse)
              return {
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: [
                  {
                    field: 'labels',
                    message: `Label ${label} in use`,
                  },
                ],
              };
          }
        }
      }

      // roles
      if (roles) {
        for (const { name: role } of res.data.roles) {
          if (roles.every((r) => r.name !== role)) {
            const inUse = await this.agentRepository.count({ role });
            if (inUse)
              return {
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: [
                  {
                    field: 'roles',
                    message: `Role ${role} in use`,
                  },
                ],
              };
          }
        }
      }

      this.workspaceRepository.assign(res.data, rest);
      await this.workspaceRepository.flush();

      return {
        status: HttpStatus.OK,
        data: res.data,
      };
    } catch (e) {
      throw new RpcException({
        status: HttpStatus.PRECONDITION_FAILED,
      });
    }
  }

  async remove(id: string, userId: number) {
    try {
      const res = await this.findOne(id);
      if (!res.data) return res as ResponseDto;

      // creator
      if (res.data.creatorId !== userId) {
        return {
          status: HttpStatus.FORBIDDEN,
          data: null,
        };
      }

      res.data.deletedAt = new Date();
      await this.workspaceRepository.flush();

      return {
        status: HttpStatus.OK,
        data: null,
      };
    } catch (e) {
      throw new RpcException({
        status: HttpStatus.PRECONDITION_FAILED,
      });
    }
  }

  async restore(id: string, userId: number) {
    try {
      const res = await this.findOne(id, null, true);
      if (!res.data) return res as ResponseDto;

      // creator
      if (res.data.creatorId !== userId) {
        return {
          status: HttpStatus.FORBIDDEN,
          data: null,
        };
      }

      res.data.deletedAt = null;
      await this.workspaceRepository.flush();

      return {
        status: HttpStatus.OK,
        data: res.data,
      };
    } catch (e) {
      throw new RpcException({
        status: HttpStatus.PRECONDITION_FAILED,
      });
    }
  }
}
