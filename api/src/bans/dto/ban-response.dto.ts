import { ApiProperty } from '@nestjs/swagger';

import { userMock } from 'src/users/dto/user-response.dto';
import { BaseResponseDto } from '../../__shared__/dto/response.dto';
import { Ban } from '../types/ban.type';

export const banMock: Ban = {
  user: userMock,
  createdAt: Date.now(),
};

export class BanResponseDto extends BaseResponseDto<Ban> {
  @ApiProperty({ example: banMock, required: false })
  data?: Ban;
}
