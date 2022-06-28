import { ApiProperty } from '@nestjs/swagger';

import type { User } from 'src/admin/types/user.type';
import { userMock } from 'src/users/users/dto/user-response.dto';
import { BaseResponseDto } from '../../../__shared__/dto/response.dto';

export class SubscriptionResponseDto extends BaseResponseDto<User> {
  @ApiProperty({ example: userMock, required: false })
  data?: User;
}
