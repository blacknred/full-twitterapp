import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/__shared__/decorators/auth.decorator';
import {
  WithCreatedApi,
  WithOkApi,
} from 'src/__shared__/decorators/with-api.decorator';
import { WithAuth } from 'src/__shared__/decorators/with-auth.decorator';
import { AllExceptionFilter } from 'src/__shared__/filters/all-exception.filter';
import { CreateStrikeDto } from './dto/create-strike.dto';
import { GetStrikesDto } from './dto/get-strikes.dto';
import { StrikeResponseDto } from './dto/strike-response.dto';
import { StrikesResponseDto } from './dto/strikes-response.dto';
import { StrikesService } from './strikes.service';

@ApiTags('Strikes')
@Controller('strikes')
@UseFilters(AllExceptionFilter)
export class StrikesController {
  constructor(private readonly strikesService: StrikesService) {}

  @Post()
  @WithCreatedApi(StrikeResponseDto, 'Create new strike')
  async create(
    @Body() createStrikeDto: CreateStrikeDto,
  ): Promise<StrikeResponseDto> {
    return this.strikesService.create(createStrikeDto);
  }

  @Get()
  @WithAuth()
  @WithOkApi(StrikesResponseDto, 'List all strikes')
  async getAll(
    @Auth('user') { id, isAdmin },
    @Query() getStrikesDto: GetStrikesDto,
  ): Promise<StrikesResponseDto> {
    if (!isAdmin) getStrikesDto.uid = id;
    return this.strikesService.findAll(getStrikesDto);
  }
}
