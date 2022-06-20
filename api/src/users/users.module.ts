import { Module } from '@nestjs/common';
import { userProvider } from './providers/user.provider';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Agent } from 'src/agents/entities/agent.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User, Workspace } from './entities/user.entity';
import { WorkspacesController } from './users.controller';
import { WorkspacesService } from './users.service';

@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
