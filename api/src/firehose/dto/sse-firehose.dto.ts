import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SseFirehoseDto {
  @ApiProperty({
    type: 'string',
    example: 'sample',
    enum: ['sample', 'mention', 'track'],
  })
  @ValidateIf(
    ({ filter, uid, q }) => {
      if (filter === 'mention' && uid) return true;
      if (filter === 'track' && q) return true;
      return filter === 'sample';
    },
    {
      message:
        'Param must be a sample, mention with related uid or track with q field',
    },
  )
  filter: 'sample' | 'mention' | 'track';

  @ApiProperty({ type: 'number', example: 1, required: false })
  @IsOptional()
  @IsNumberString({ message: 'Must be a number' })
  uid?: number;

  @ApiProperty({ type: 'string', example: '#test', required: false })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  q?: string;
}
