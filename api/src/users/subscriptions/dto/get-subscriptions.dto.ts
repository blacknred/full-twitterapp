import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumberString } from 'class-validator';

import { PaginatedRequestDto } from '../../../__shared__/dto/request.dto';

export class GetSubscriptionsDto extends PaginatedRequestDto {
  @ApiProperty({ type: 'number', example: 1 })
  @IsNumberString({ message: 'Must be a number' })
  uid: number;

  @ApiProperty({
    type: 'string',
    example: 'FOLLOWING',
    enum: ['FOLLOWERS', 'FOLLOWING'],
  })
  @IsIn(['FOLLOWERS', 'FOLLOWING'], {
    message: 'Must be an FOLLOWERS or FOLLOWING',
  })
  variant: 'FOLLOWERS' | 'FOLLOWING';
}
