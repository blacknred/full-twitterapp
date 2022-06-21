import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/__shared__/dto/response.dto';
import { IAuth } from '../interfaces/auth.interface';

export const authMock = {
  id: 1,
  name: 'testname',
  email: 'test@email.com',
  vapidPublicKey: 'Bsr56...',
};

export class AuthResponseDto extends ResponseDto {
  @ApiProperty({ example: authMock })
  data: Omit<IAuth, 'pushSubscriptions'> & { vapidPublicKey?: string };
}
