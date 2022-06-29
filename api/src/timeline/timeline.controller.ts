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
import { BanResponseDto } from './dto/ban-response.dto';
import { BansResponseDto } from './dto/bans-response.dto';
import { CreateBanDto } from './dto/create-ban.dto';
import { DeleteBanDto } from './dto/delete-ban.dto';
import { GetBansDto } from './dto/get-bans.dto';
import { TimelineService } from './timeline.service';

@ApiTags('Timeline')
@Controller('timeline')
@UseFilters(AllExceptionFilter)
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Post()
  @WithCreatedApi(BanResponseDto, 'Create new ban')
  async create(@Body() createBanDto: CreateBanDto): Promise<BanResponseDto> {
    return this.timelineService.create(createBanDto);
  }

  @Get()
  @WithAuth()
  @WithOkApi(BansResponseDto, 'List all bans of authorized user')
  async getAll(
    @Auth('user') { id: uid },
    @Query() getBansDto: GetBansDto,
  ): Promise<BansResponseDto> {
    return this.timelineService.findAll({ uid, ...getBansDto });
  }

  @Delete()
  @WithAuth()
  @WithOkApi(EmptyResponseDto, 'Delete ban')
  async remove(
    @Auth('user') { id },
    @Body() deleteBanDto: DeleteBanDto,
  ): Promise<EmptyResponseDto> {
    return this.timelineService.remove(id, deleteBanDto);
  }
}
