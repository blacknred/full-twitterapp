import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

import type { Auth as IAuth } from 'src/auth/types/auth.type';

export const Auth = createParamDecorator(
  (prop: keyof IAuth, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();

    return prop ? user?.[prop] : user;
  },
);
