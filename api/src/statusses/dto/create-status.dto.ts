import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateStatusDto {
  @ApiProperty({ type: 'string', example: 'testname testsecondname' })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @MaxLength(140, { message: 'Must include no more than 140 chars' })
  text?: string;

  @ApiProperty({ type: 'string', example: 'test@email.com' })
  @IsEmail(null, { message: 'Must be an valid email' })
  email: string;

  @ApiProperty({ type: 'string', example: 'testpass' })
  @IsString({ message: 'Must be a string' })
  @MinLength(8, { message: 'Must include atleast 8 chars' })
  password: string;
}
