import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/__shared__/dto/response.dto';
import { IUser } from '../interfaces/subscription.interface';

export const userMock: IUser = {
  id: 1,
  username: 'testuser',
  name: 'testname testsecondname',
  img: 'testavatarurl',
  bio: 'testuser info',
  createdAt: new Date().toDateString(),
};

export class UserResponseDto extends BaseResponseDto<IUser> {
  @ApiProperty({ example: userMock, required: false })
  data?: IUser;
}
