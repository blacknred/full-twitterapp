import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/__shared__/dto/response.dto';
import { IUser, Status } from '../types/status.type';

export const userMock: Status = {
  id: 1,
  username: 'testuser',
  name: 'testname testsecondname',
  img: 'testavatarurl',
  bio: 'testuser info',
  createdAt: new Date().toDateString(),
};

export class StatusResponseDto extends BaseResponseDto<Status> {
  @ApiProperty({ example: userMock, required: false })
  data?: Status;
}
