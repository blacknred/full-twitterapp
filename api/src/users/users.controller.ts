import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Agent } from 'src/__shared__/decorators/agent.decorator';
import { AgentGuard } from 'src/__shared__/guards/agent.guard';
import { ResponseDto } from '../__shared__/dto/response.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { GetWorkspaceDto } from './dto/get-workspace.dto';
import { GetWorkspacesDto } from './dto/get-workspaces.dto';
import {
  WorkspaceResponseDto,
  WorkspacesResponseDto,
} from './dto/response.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspacesService } from './users.service';

@Controller()
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @MessagePattern('create')
  async create(
    @Payload() createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<WorkspaceResponseDto> {
    return this.workspacesService.create(createWorkspaceDto);
  }

  @MessagePattern('getAll')
  async getAll(
    @Payload() getWorkspacesDto: GetWorkspacesDto,
  ): Promise<WorkspacesResponseDto> {
    return this.workspacesService.findAll(getWorkspacesDto);
  }

  @UseGuards(AgentGuard)
  @MessagePattern('getOne')
  async getOne(
    @Agent() agent,
    @Payload() { id }: GetWorkspaceDto,
  ): Promise<WorkspaceResponseDto> {
    return this.workspacesService.findOne(id, agent);
  }

  @UseGuards(AgentGuard)
  @MessagePattern('update')
  async update(
    @Agent() agent,
    @Payload() updateWorkspaceDto: UpdateWorkspaceDto,
  ): Promise<WorkspaceResponseDto> {
    return this.workspacesService.update(updateWorkspaceDto, agent);
  }

  @MessagePattern('delete')
  async remove(@Payload() { id, uid }: GetWorkspaceDto): Promise<ResponseDto> {
    return this.workspacesService.remove(id, uid);
  }

  @MessagePattern('restore')
  async restore(
    @Payload() { id, uid }: GetWorkspaceDto,
  ): Promise<WorkspaceResponseDto> {
    return this.workspacesService.restore(id, uid);
  }
}
