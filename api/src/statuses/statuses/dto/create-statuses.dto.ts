import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateStatusDto } from './create-status.dto';

export class CreateStatusesDto {
  @ApiProperty({
    type: CreateStatusDto,
    isArray: true,
  })
  @IsArray({ message: 'Must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateStatusDto)
  statuses: CreateStatusDto[];
}
