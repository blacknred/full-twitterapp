import { ApiProperty } from '@nestjs/swagger';

import { statusMock } from 'src/statusses/dto/status-response.dto';
import { userMock } from 'src/users/dto/user-response.dto';
import { BaseResponseDto } from '../../__shared__/dto/response.dto';
import { Strike } from '../types/strike.type';

export const strikeMock: Strike = {
  user: userMock,
  status: statusMock,
  createdAt: new Date().toDateString(),
  reason: 'strong reason',
};

export class StrikeResponseDto extends BaseResponseDto<Strike> {
  @ApiProperty({ example: strikeMock, required: false })
  data?: Strike;
}
