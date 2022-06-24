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
import { CreateLikeDto } from './dto/create-like.dto';
import { DeleteLikeDto } from './dto/delete-like.dto';
import { GetLikesDto } from './dto/get-likes.dto';
import { LikeResponseDto } from './dto/like-response.dto';
import { LikesResponseDto } from './dto/likes-response.dto';
import { LikesService } from './likes.service';

@ApiTags('Likes')
@Controller('likes')
@UseFilters(AllExceptionFilter)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @WithCreatedApi(LikeResponseDto, 'Create new like')
  async create(@Body() createLikeDto: CreateLikeDto): Promise<LikeResponseDto> {
    return this.likesService.create(createLikeDto);
  }

  @Get()
  @WithAuth()
  @WithOkApi(LikesResponseDto, 'List all likes')
  async getAll(@Query() getLikesDto: GetLikesDto): Promise<LikesResponseDto> {
    return this.likesService.findAll(getLikesDto);
  }

  @Delete()
  @WithAuth()
  @WithOkApi(EmptyResponseDto, 'Delete like')
  async remove(
    @Auth('user') { id },
    @Body() deleteLikeDto: DeleteLikeDto,
  ): Promise<EmptyResponseDto> {
    return this.likesService.remove(id, deleteLikeDto);
  }
}
