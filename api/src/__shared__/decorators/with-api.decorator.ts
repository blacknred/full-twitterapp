import { applyDecorators } from '@nestjs/common';
import type { ApBaseResponseMetadata } from '@nestjs/swagger';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function WithOkApi(type: ApBaseResponseMetadata['type'], summary: string) {
  return applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type }));
}

export function WithCreatedApi(
  type: ApBaseResponseMetadata['type'],
  summary: string,
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiCreatedResponse({ type }),
  );
}
