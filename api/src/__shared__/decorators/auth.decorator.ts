import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

import type { IAuth } from 'src/auth/interfaces/auth.interface';

export const Auth = createParamDecorator(
  (prop: keyof IAuth, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();

    return prop ? user?.[prop] : user;
  },
);
