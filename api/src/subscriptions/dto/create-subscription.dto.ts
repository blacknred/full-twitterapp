import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: 'number', example: 1 })
  @IsNumber({}, { message: 'Must be a number' })
  sid: number;
  

  @ApiProperty({ type: 'number', example: 2 })
  @IsEmail(null, { message: 'Must be an valid email' })
  subuid: string;

  @ApiProperty({ type: 'string', example: 'testpass' })
  @IsString({ message: 'Must be a string' })
  @MinLength(8, { message: 'Must include atleast 8 chars' })
  password: string;
}
