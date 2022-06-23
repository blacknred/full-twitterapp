import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class StatusDto {
  @ApiProperty({ example: 'testrole' })
  name: string;

  @ApiProperty({
    enum: Privilege,
    example: Privilege.EDIT_WORKSPACE,
    isArray: true,
  })
  privileges: Privilege[];
}

export class CreateStatusDto {
  @ApiProperty({
    type: StatusDto,
    isArray: true
  })
  @IsOptional()
  @IsArray({ message: 'Must be an array' })
  @IsString({ message: 'Must includes a strings', each: true })
  statuses?: string[];


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
