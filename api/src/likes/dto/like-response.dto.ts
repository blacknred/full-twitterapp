import { ApiProperty } from '@nestjs/swagger';

import { userMock } from 'src/users/dto/user-response.dto';
import { BaseResponseDto } from 'src/__shared__/dto/response.dto';
import { Like } from '../types/like.type';

export const likeMock: Like = {
  user: userMock,
  status: {},
  createdAt: new Date().toDateString(),
};

export class LikeResponseDto extends BaseResponseDto<Like> {
  @ApiProperty({ example: likeMock, required: false })
  data?: Like;
}
