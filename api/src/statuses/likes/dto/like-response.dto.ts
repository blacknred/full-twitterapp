import { ApiProperty } from '@nestjs/swagger';

import { statusMock } from 'src/statuses/statuses/dto/status-response.dto';
import { userMock } from 'src/users/users/dto/user-response.dto';
import { BaseResponseDto } from 'src/__shared__/dto/response.dto';
import type { Like } from '../types/like.type';

export const likeMock: Like = {
  user: userMock,
  status: statusMock,
};

export class LikeResponseDto extends BaseResponseDto<Like> {
  @ApiProperty({ example: likeMock, required: false })
  data?: Like;
}
