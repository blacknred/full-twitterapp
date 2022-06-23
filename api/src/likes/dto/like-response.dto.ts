import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from 'src/__shared__/dto/response.dto';
import { Like } from '../types/like.type';

export const likeMock: Like = {
  user: {},
  status: {},
  createdAt: new Date().toDateString(),
};

export class LikeResponseDto extends BaseResponseDto<Like> {
  @ApiProperty({ example: likeMock, required: false })
  data?: Like;
}
