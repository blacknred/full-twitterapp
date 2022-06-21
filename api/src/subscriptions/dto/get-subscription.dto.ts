import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class GetUserDto {
  @ApiProperty({ type: 'number', example: 1 })
  @IsInt()
  id: number;
}
