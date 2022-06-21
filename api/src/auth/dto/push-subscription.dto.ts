import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUrl,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PushSubscriptionKeysDto {
  @ApiProperty({ example: 'ertwieportp4352', nullable: false })
  @IsString({ message: 'Must be a string' })
  auth: string;

  @ApiProperty({ example: '980eawe8rq809', nullable: false })
  @IsString({ message: 'Must be a string' })
  p256dh: string;
}

export class PushSubscriptionDto {
  @ApiProperty({ example: 'http://example.com', nullable: false })
  @IsUrl({}, { message: 'Must be a url string' })
  endpoint: string;

  @ApiProperty({ type: PushSubscriptionKeysDto, nullable: false })
  @ValidateNested({ each: true })
  @Type(() => PushSubscriptionKeysDto)
  keys: PushSubscriptionKeysDto;

  @ApiProperty({ example: '1234349084' })
  @IsOptional()
  @IsDateString({}, { message: 'Must be a date string' })
  expirationTime?: string;
}
