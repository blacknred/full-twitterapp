import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/__shared__/dto/response.dto';
import { Auth } from '../types/auth.type';

export const authMock: Auth = {
  id: 1,
};

export class AuthResponseDto extends BaseResponseDto {
  @ApiProperty({ example: authMock })
  data: Auth;
}
