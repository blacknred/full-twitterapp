import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';

export function WithAuth(onlyAdmin?: boolean) {
  return applyDecorators(
    ApiCookieAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    UseGuards(onlyAdmin ? AdminGuard : AuthGuard),
  );
}
// @ApiBasicAuth()
// @ApiBearerAuth()
// @Controller('cats')
