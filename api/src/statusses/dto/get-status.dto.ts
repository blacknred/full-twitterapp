import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class GetStatusDto {
  @ApiProperty({ type: 'number', example: 1 })
  @IsInt()
  id: number;
}
