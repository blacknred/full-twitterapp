import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from 'src/__shared__/dto/response.dto';
import { User } from '../types/user.type';

export const userMock: User = {
  id: 1,
  username: 'testuser',
  name: 'testname testsecondname',
  img: 'testavatarurl',
  bio: 'testuser info',
  createdAt: new Date().toDateString(),
  statusesCnt: 0,
  followersCnt: 0,
  followingCnt: 0,
};

export class UserResponseDto extends BaseResponseDto<User> {
  @ApiProperty({ example: userMock, required: false })
  data?: User;
}
