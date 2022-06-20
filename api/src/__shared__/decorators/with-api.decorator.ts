import { applyDecorators } from '@nestjs/common';
import type { ApiResponseMetadata } from '@nestjs/swagger';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

export function WithOkApi(type: ApiResponseMetadata['type'], summary: string) {
  return applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type }));
}

export function WithCreatedApi(
  type: ApiResponseMetadata['type'],
  summary: string,
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiCreatedResponse({ type }),
  );
}
