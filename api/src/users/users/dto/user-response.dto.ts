import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from 'src/__shared__/dto/response.dto';
import type { User } from '../types/user.type';

export const userMock: User = {
  id: 1,
  username: 'testuser',
  name: 'testname testsecondname',
  img: 'testavatarurl',
  bio: 'testuser info',
  createdAt: Date.now(),
  totalStatuses: 0,
  totalFollowers: 0,
  totalFollowing: 0,
  relation: {
    blockned: false,
    followed: true,
    totalInterFollowing: 4,
  },
};

export class UserResponseDto extends BaseResponseDto<User> {
  @ApiProperty({ example: userMock, required: false })
  data?: User;
}
