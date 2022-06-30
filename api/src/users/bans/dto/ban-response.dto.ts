import { ApiProperty } from '@nestjs/swagger';

import type { User } from 'src/users/users/types/user.type';
import { userMock } from 'src/users/users/dto/user-response.dto';
import { BaseResponseDto } from '../../../__shared__/dto/response.dto';

export class BanResponseDto extends BaseResponseDto<User> {
  @ApiProperty({ example: userMock, required: false })
  data?: User;
}
