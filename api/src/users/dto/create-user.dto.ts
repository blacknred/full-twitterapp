import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: 'string', example: 'testname testsecondname' })
  @IsString({ message: 'Must be a string' })
  @MinLength(5, { message: 'Must include atleast 5 chars' })
  @MaxLength(50, { message: 'Must include no more than 50 chars' })
  username: string;

  @ApiProperty({ type: 'string', example: 'test@email.com' })
  @IsEmail(null, { message: 'Must be an valid email' })
  email: string;

  @ApiProperty({ type: 'string', example: 'testpass' })
  @IsString({ message: 'Must be a string' })
  @MinLength(8, { message: 'Must include atleast 6 chars' })
  password: string;
}
