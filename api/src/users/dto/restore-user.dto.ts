import { ApiProperty } from '@nestjs/swagger';

export class RestoreUserDto {
  @ApiProperty({ example: 'erq324q3r4534r234r' })
  emailToken: string;

  @ApiProperty({ minLength: 6, example: 'testpassword' })
  password: string;
}
