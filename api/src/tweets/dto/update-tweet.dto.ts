import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserDto } from './create-tweet.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    type: 'string',
    example: 'testname testsecondname',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @MinLength(5, { message: 'Must include atleast 5 chars' })
  @MaxLength(100, { message: 'Must include no more than 100 chars' })
  name?: string;

  @ApiProperty({ type: 'string', example: 'testuser info', required: false })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @MinLength(5, { message: 'Must include atleast 5 chars' })
  @MaxLength(100, { message: 'Must include no more than 100 chars' })
  bio?: string;

  @ApiProperty({ type: 'string', example: 'testavatarurl', required: false })
  @IsOptional()
  @IsString({ message: 'Must be a string' })
  @MaxLength(500, { message: 'Must include no more than 100 chars' })
  img?: string;
}
