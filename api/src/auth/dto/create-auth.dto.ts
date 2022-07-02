import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ example: 'test@email.com', nullable: false })
  @IsString({ message: 'Must be a string' })
  emailOrUsername: string;

  @ApiProperty({ example: 'testpassword', nullable: false })
  @IsString({ message: 'Must be a string' })
  @MinLength(8, { message: 'Must include atleast 6 chars' })
  password: string;
}
