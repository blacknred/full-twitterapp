import {
  Body,
  Controller,
  Delete,
  Get,
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
import { BlocksService } from './blocks.service';
import { BlockResponseDto } from './dto/block-response.dto';
import { BlocksResponseDto } from './dto/blocks-response.dto';
import { CreateBlockDto } from './dto/create-block.dto';
import { DeleteBlockDto } from './dto/delete-block.dto';
import { GetBlocksDto } from './dto/get-blocks.dto';

@ApiTags('Blocks')
@Controller('blocks')
@UseFilters(AllExceptionFilter)
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  @WithCreatedApi(BlockResponseDto, 'Create new block')
  async create(@Body() createBlockDto: CreateBlockDto): Promise<BlockResponseDto> {
    return this.blocksService.create(createBlockDto);
  }

  @Get()
  @WithAuth()
  @WithOkApi(BlocksResponseDto, 'List all blocks of authorized user')
  async getAll(
    @Auth() { id },
    @Query() getBlocksDto: GetBlocksDto,
  ): Promise<BlocksResponseDto> {
    return this.blocksService.findAll(id, getBlocksDto);
  }

  @Delete()
  @WithAuth()
  @WithOkApi(EmptyResponseDto, 'Delete block')
  async remove(@Body() { uid }: DeleteBlockDto): Promise<EmptyResponseDto> {
    return this.blocksService.remove(uid);
  }
}
