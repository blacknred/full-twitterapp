import { ApiProperty } from '@nestjs/swagger';

import { statusMock } from 'src/statuses/statuses/dto/status-response.dto';
import { userMock } from 'src/users/users/dto/user-response.dto';
import { BaseResponseDto } from '../../../__shared__/dto/response.dto';
import { Strike } from '../types/strike.type';

export const strikeMock: Strike = {
  user: userMock,
  status: statusMock,
  createdAt: Date.now(),
  reason: 'strong reason',
};

export class StrikeResponseDto extends BaseResponseDto<Strike> {
  @ApiProperty({ example: strikeMock, required: false })
  data?: Strike;
}
