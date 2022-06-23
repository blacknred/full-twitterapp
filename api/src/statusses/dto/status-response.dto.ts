import { ApiProperty } from '@nestjs/swagger';
import { userMock } from 'src/users/dto/user-response.dto';

import { BaseResponseDto } from 'src/__shared__/dto/response.dto';
import { Status } from '../types/status.type';

export const statusMock: Status = {
  id: 1,
  text: 'testtext',
  media: ['urltomediafile'],
  author: userMock,
  createdAt: new Date().toDateString(),
  likesCnt: 0,
  repostsCnt: 0,
  retweetsCnt: 0,
};

export class StatusResponseDto extends BaseResponseDto<Status> {
  @ApiProperty({ example: statusMock, required: false })
  data?: Status;
}
