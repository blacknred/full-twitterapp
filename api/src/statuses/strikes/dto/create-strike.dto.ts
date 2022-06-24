import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class CreateStrikeDto {
  @ApiProperty({ type: 'number', example: 1 })
  @IsNumberString({ message: 'Must be a number' })
  sid: number;

  @ApiProperty({ type: 'string', example: 'strong reason' })
  @IsString({ message: 'Must be a string' })
  reason: string;
}
