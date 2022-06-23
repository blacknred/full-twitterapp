import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { AuthGuard } from './auth.guard';

@Injectable()
export class AdminGuard extends AuthGuard {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    try {
      return (
        super.canActivate(context) &&
        context.switchToHttp().getRequest().user.user.isAdmin
      );
    } catch (_) {
      throw new ForbiddenException('Access restricted');
    }
  }
}
