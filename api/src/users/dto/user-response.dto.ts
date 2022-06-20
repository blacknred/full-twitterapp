import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/__shared__/dto/response.dto';
import { IUser } from '../interfaces/user.interface';

export const userMock: IUser = {
  id: 1,
  name: 'testuser',
  email: 'test@email.com',
  isAdmin: false,
  createdAt: new Date().toDateString(),
  updatedAt: new Date().toDateString(),
};

export class UserResponseDto extends ResponseDto<IUser> {
  @ApiProperty({ example: userMock })
  data?: IUser;
}
