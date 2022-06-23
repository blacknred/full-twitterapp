import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/__shared__/decorators/auth.decorator';
import {
  WithCreatedApi,
  WithOkApi,
} from 'src/__shared__/decorators/with-api.decorator';
import { WithAuth } from 'src/__shared__/decorators/with-auth.decorator';
import { EmptyResponseDto } from 'src/__shared__/dto/response.dto';
import { AllExceptionFilter } from 'src/__shared__/filters/all-exception.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersResponseDto } from './dto/users-response.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseFilters(AllExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @WithCreatedApi(UserResponseDto, 'Create new user')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @WithAuth()
  @WithOkApi(UsersResponseDto, 'List all users')
  async getAll(
    @Auth('user') { isAdmin },
    @Query() getUsersDto: GetUsersDto,
  ): Promise<UsersResponseDto> {
    if (!isAdmin) getUsersDto.recommended = true;
    return this.usersService.findAll(getUsersDto);
  }

  @Get(':id')
  @WithAuth()
  @WithOkApi(UserResponseDto, 'Get user by id')
  async getOne(@Param() { id }: GetUserDto): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch()
  @WithAuth()
  @WithOkApi(UserResponseDto, 'Update authorized user')
  async update(
    @Auth('user') { id },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete()
  @WithAuth()
  @WithOkApi(EmptyResponseDto, 'Delete authorized user')
  async remove(@Auth('user') { id }): Promise<EmptyResponseDto> {
    return this.usersService.remove(id);
  }
}
