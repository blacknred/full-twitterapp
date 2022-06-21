import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/__shared__/dto/response.dto';
import { IPushSubscription } from '../interfaces/auth.interface';

export const pushSubscriptionMock: IPushSubscription = {
  endpoint: 'http://example.com',
  expirationTime: '1234349084',
  keys: {
    auth: 'ertwieportp4352',
    p256dh: '980eawe8rq809',
  },
};

export class PushSubscriptionResponseDto extends ResponseDto {
  @ApiProperty({ example: pushSubscriptionMock })
  data: IPushSubscription;
}
