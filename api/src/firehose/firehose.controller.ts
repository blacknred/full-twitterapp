import {
  Controller,
  MessageEvent,
  Query,
  Res,
  Sse,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Observable } from 'rxjs';

import { WithOkApi } from 'src/__shared__/decorators/with-api.decorator';
import { WithAuth } from 'src/__shared__/decorators/with-auth.decorator';
import { AllExceptionFilter } from 'src/__shared__/filters/all-exception.filter';
import { SseFirehoseDto } from './dto/sse-firehose.dto';
import { FirehoseService } from './firehose.service';

@ApiTags('Firehose')
@Controller('firehose')
@UseFilters(AllExceptionFilter)
export class FirehoseController {
  constructor(private readonly firehoseService: FirehoseService) {}

  @Sse()
  @WithAuth()
  @WithOkApi(null, 'Listen firehose')
  sse(
    @Res() res: Response,
    @Query() sseFirehoseDto: SseFirehoseDto,
  ): Observable<MessageEvent> {
    return this.firehoseService.intercept(res, sseFirehoseDto);
  }

  // @Sse('sse')
  // sse1(@Query() sseQuery: SseFirehoseDto): Observable<MessageEvent> {
  //   const subject$ = new Subject();

  //   this.firehoseService.on('status', (data) => {
  //     // if (sseQuery.email !== data.email) return;
  //     subject$.next({ isVerifiedFilter: true });
  //   });

  //   return subject$.pipe(
  //     map((data: MessageEventData): MessageEvent => ({ data })),
  //   );
  // }
}
