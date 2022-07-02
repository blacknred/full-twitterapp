import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';

export function WithAuth(onlyAdmin?: boolean) {
  return applyDecorators(
    ApiCookieAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    UseGuards(onlyAdmin ? AdminGuard : AuthGuard),
  );
}
// @ApiBasicAuth()
// @ApiBearerAuth()
